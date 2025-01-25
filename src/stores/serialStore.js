import { defineStore } from 'pinia'
import { realtimeDB } from '../firebase'
import { ref as dbRef, set, push, update } from 'firebase/database'

export const useSerialStore = defineStore('serial', {
  state: () => ({
    // Serial/puerto
    port: null,
    reader: null,
    isConnected: false,
    isReceiving: false,
    buffer: '',
    receivedData: '',

    // Firebase
    logToFirebase: false,
    currentMissionId: null,

    // Datos GPS
    gpsCoordinates: '0/0', // lat/lng inicial
    speed: 0,              // Velocidad inicial

    // Sensores
    temperature: 0,      // Temperatura inicial
    humidity: 0,         // Humedad inicial
    pressure: 0,         // Presión inicial
    altitude: 0,         // Altitud inicial
    orientationMag: 0,   // Orientación magnética inicial

    // Historial de altitud
    altitudeHistory: [],

    // Historial de aceleraciones (ACCX, ACCY, ACCZ)
    accHistory: [],

    // Historial de giroscopio (GYX, GYY, GYZ)
    gyroHistory: [],
  }),
  actions: {
    // Conectar al puerto serial
    async connectSerial() {
      try {
        this.port = await navigator.serial.requestPort()
        await this.port.open({ baudRate: 9600 })
        this.isConnected = true
        console.log('Conectado al puerto serial')
      } catch (error) {
        console.error('Error al conectar al puerto serial:', error)
      }
    },

    // Comenzar la recepción de datos
    async startReceiving() {
      if (this.port && this.port.readable && !this.isReceiving) {
        this.isReceiving = true

        // Si estamos registrando en Firebase, creamos una nueva misión
        if (this.logToFirebase) {
          try {
            await this.createNewMission()
            if (!this.currentMissionId) {
              throw new Error('No se pudo crear una misión en Firebase.')
            }
          } catch (e) {
            console.error('Error al crear misión en Firebase:', e)
            this.isReceiving = false
            return
          }
        }

        // Configurar la lectura del puerto
        const textDecoder = new TextDecoderStream()
        const readableStreamClosed = this.port.readable.pipeTo(textDecoder.writable)
        this.reader = textDecoder.readable.getReader()

        try {
          while (this.isReceiving) {
            const { value, done } = await this.reader.read()
            if (done) break

            if (value) {
              this.buffer += value
              let delimiterIndex

              // Buscamos el delimitador "//"
              while ((delimiterIndex = this.buffer.indexOf('//')) !== -1) {
                const line = this.buffer.slice(0, delimiterIndex)
                this.buffer = this.buffer.slice(delimiterIndex + 2)
                const trimmedLine = line.trim()

                if (trimmedLine) {
                  // Guardamos la línea completa en receivedData (opcional)
                  this.receivedData += trimmedLine + '\n'

                  // Separar cada dato por "/"
                  const parts = trimmedLine.split('/')

                  // Extraer coordenadas GPS
                  const [lat, lng] = parts.slice(0, 2).map(Number)
                  this.gpsCoordinates = `${lat}/${lng}`

                  // Velocidad y altitud
                  this.speed = Number(parts[6])    // Speed
                  this.altitude = Number(parts[7]) // Altitud

                  // Sensores
                  this.temperature = Number(parts[8])   // Temperatura
                  this.humidity = Number(parts[9])      // Humedad
                  this.pressure = Number(parts[11])     // Presión
                  this.orientationMag = Number(parts[19]) // Orientación magnética

                  // Aceleración (ACCX/ACCY/ACCZ -> parts[13], [14], [15])
                  const accX = Number(parts[13])
                  const accY = Number(parts[14])
                  const accZ = Number(parts[15])

                  // Giroscopio (GYX/GYY/GYZ -> parts[16], [17], [18])
                  const gyroX = Number(parts[16]) || 0;
                  const gyroY = Number(parts[17]) || 0;
                  const gyroZ = Number(parts[18]) || 0;


                  // Historial de altitud
                  this.altitudeHistory = [...this.altitudeHistory, { value: this.altitude, time: new Date().toISOString() }];


                  // Historial de aceleración
                  this.accHistory.push({

                    x: accX,
                    y: accY,
                    z: accZ
                  })

                  // Historial de giroscopio
                  this.gyroHistory.push({

                    x: gyroX,
                    y: gyroY,
                    z: gyroZ
                  })

                  // Si se está usando Firebase, almacenar allí la línea completa
                  if (this.logToFirebase && this.currentMissionId) {
                    await this.logDataToRealtimeDatabase(trimmedLine)
                  }
                }
              }
            }
          }
        } catch (error) {
          console.error('Error durante la recepción de datos:', error)
        } finally {
          if (this.reader) {
            this.reader.releaseLock()
            this.reader = null
          }
        }
      }
    },

    // Detener la recepción de datos
    stopReceiving() {
      this.isReceiving = false;
      if (this.reader) {
        this.reader.cancel();
        this.reader = null;
      }
      console.log('Recepción de datos detenida');
    
      // Cerrar misión en Firebase si estaba activa
      if (this.logToFirebase && this.currentMissionId) {
        this.closeCurrentMission();
      }
    
      // Resetear todos los datos a 0
      this.resetData();
    },

    resetData() {
      // Reiniciar los valores de sensores
      this.gpsCoordinates = '0/0';
      this.speed = 0;
      this.temperature = 0;
      this.humidity = 0;
      this.pressure = 0;
      this.altitude = 0;
      this.orientationMag = 0;
    
      // Vaciar los historiales
      this.altitudeHistory = [];
      this.accHistory = [];
      this.gyroHistory = [];
    
      console.log('Datos reseteados a 0');
    },

    // Desconectar serial
    async disconnectSerial() {
      if (this.port) {
        // Detener si aún está recibiendo
        if (this.isReceiving) {
          this.stopReceiving()
        }
        await this.port.close()
        this.port = null
        this.isConnected = false
        console.log('Desconectado del puerto serial')
      }
    },

    // Activar/desactivar log en Firebase
    toggleFirebaseLogging(status) {
      this.logToFirebase = status
    },

    // Guardar datos en Firebase
    async logDataToRealtimeDatabase(dataString) {
      if (!this.currentMissionId) {
        console.warn('No hay una misión activa para registrar datos.')
        return
      }
      try {
        const missionDataRef = dbRef(realtimeDB, `missions/${this.currentMissionId}/data`)
        const newDataRef = push(missionDataRef)
        await set(newDataRef, {
          timestamp: new Date().toISOString(),
          data: dataString
        })
        console.log('Dato registrado en Realtime Database:', dataString)
      } catch (e) {
        console.error('Error añadiendo dato a Realtime Database: ', e)
      }
    },

    // Crear nueva misión en Firebase
    async createNewMission() {
      try {
        const missionsRef = dbRef(realtimeDB, 'missions')
        const newMissionRef = push(missionsRef)
        await set(newMissionRef, {
          startTime: new Date().toISOString(),
          isActive: true
        })
        this.currentMissionId = newMissionRef.key
        console.log('Nueva misión creada con ID: ', this.currentMissionId)
      } catch (e) {
        console.error('Error creando misión: ', e)
      }
    },

    // Cerrar misión en Firebase
    async closeCurrentMission() {
      if (!this.currentMissionId) {
        console.warn('No hay una misión activa para cerrar.')
        return
      }
      try {
        const missionRef = dbRef(realtimeDB, `missions/${this.currentMissionId}`)
        await update(missionRef, {
          endTime: new Date().toISOString(),
          isActive: false
        })
        console.log('Misión cerrada con ID: ', this.currentMissionId)
        this.currentMissionId = null
      } catch (e) {
        console.error('Error cerrando misión: ', e)
      }
    },
  },
  // Permite persistir el estado (si tienes configurado pinia-plugin-persist)
  persist: true,
})