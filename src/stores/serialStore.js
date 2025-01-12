// src/stores/serialStore.js

import { defineStore } from 'pinia'
import { realtimeDB } from '../firebase'
import { ref as dbRef, set, push, update } from 'firebase/database'

export const useSerialStore = defineStore('serial', {
  state: () => ({
    port: null,               // Puerto serial conectado
    reader: null,             // Reader para leer datos
    isConnected: false,       // Estado de conexión serial
    isReceiving: false,       // Estado de recepción de datos
    receivedData: '',         // Datos recibidos para mostrar en UI
    logToFirebase: false,     // Opción para registrar en Firebase
    currentMissionId: null,   // ID de la misión actual en Firebase
    buffer: '',               // Buffer para almacenar datos incompletos
  }),
  actions: {
    /**
     * Conecta al puerto serial seleccionado por el usuario
     */
    async connectSerial() {
      try {
        // Solicita al usuario que seleccione un puerto serial
        this.port = await navigator.serial.requestPort()
        // Abre el puerto con una velocidad de baudios de 9600
        await this.port.open({ baudRate: 9600 })
        this.isConnected = true
        console.log('Conectado al puerto serial')
      } catch (error) {
        console.error('Error al conectar al puerto serial:', error)
      }
    },

    /**
     * Inicia la recepción de datos desde el puerto serial
     */
    async startReceiving() {
      if (this.port && this.port.readable && !this.isReceiving) {
        this.isReceiving = true

        // Si está habilitado el registro en Firebase, crea una nueva misión
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

        // Configura el decodificador de texto para leer datos como cadenas
        const textDecoder = new TextDecoderStream()
        const readableStreamClosed = this.port.readable.pipeTo(textDecoder.writable)
        this.reader = textDecoder.readable.getReader()

        try {
          while (this.isReceiving) {
            const { value, done } = await this.reader.read()
            if (done) {
              break
            }
            if (value) {
              // Añade los nuevos datos al buffer
              this.buffer += value

              // Procesa todas las líneas completas que terminan con '//'
              let delimiterIndex
              while ((delimiterIndex = this.buffer.indexOf('//')) !== -1) {
                // Extrae la línea completa
                const line = this.buffer.slice(0, delimiterIndex)
                // Actualiza el buffer eliminando la línea procesada y el delimitador
                this.buffer = this.buffer.slice(delimiterIndex + 2)

                const trimmedLine = line.trim()
                if (trimmedLine) {
                  // Actualiza la UI con la línea recibida
                  this.receivedData += trimmedLine + '\n'

                  // Envía la línea completa a Firebase si está habilitado
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

    /**
     * Detiene la recepción de datos desde el puerto serial
     */
    stopReceiving() {
      this.isReceiving = false
      if (this.reader) {
        this.reader.cancel()
        this.reader = null
      }
      console.log('Recepción de datos detenida')

      // Si está habilitado el registro en Firebase, cierra la misión activa
      if (this.logToFirebase && this.currentMissionId) {
        this.closeCurrentMission()
      }
    },

    /**
     * Desconecta del puerto serial
     */
    async disconnectSerial() {
      if (this.port) {
        if (this.isReceiving) {
          this.stopReceiving()
        }
        await this.port.close()
        this.port = null
        this.isConnected = false
        console.log('Desconectado del puerto serial')
      }
    },

    /**
     * Alterna la opción de registrar datos en Firebase
     * @param {Boolean} status - Estado de la casilla de verificación
     */
    toggleFirebaseLogging(status) {
      this.logToFirebase = status
    },

    /**
     * Registrar datos en Firebase Realtime Database
     * @param {String} dataString - Cadena de datos recibida
     */
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
        console.log("Dato registrado en Realtime Database:", dataString)
      } catch (e) {
        console.error("Error añadiendo dato a Realtime Database: ", e)
      }
    },

    /**
     * Crear una nueva misión en Firebase Realtime Database
     */
    async createNewMission() {
      try {
        const missionsRef = dbRef(realtimeDB, 'missions')
        const newMissionRef = push(missionsRef)
        await set(newMissionRef, {
          startTime: new Date().toISOString(),
          isActive: true
        })
        this.currentMissionId = newMissionRef.key
        console.log("Nueva misión creada con ID: ", this.currentMissionId)
      } catch (e) {
        console.error("Error creando misión: ", e)
      }
    },

    /**
     * Cerrar la misión actual en Firebase Realtime Database
     */
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
        console.log("Misión cerrada con ID: ", this.currentMissionId)
        this.currentMissionId = null
      } catch (e) {
        console.error("Error cerrando misión: ", e)
      }
    },
  },
  persist: true, // Si usas Pinia Persist, de lo contrario, elimina esta línea
})