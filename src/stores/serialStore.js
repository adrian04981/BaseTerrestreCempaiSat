// src/stores/serialStore.js

import { defineStore } from 'pinia'
import { realtimeDB } from '../firebase'
import { ref as dbRef, set, push, update } from 'firebase/database'

export const useSerialStore = defineStore('serial', {
  state: () => ({
    port: null,
    reader: null,
    isConnected: false,
    isReceiving: false,
    receivedData: '',
    logToFirebase: false,
    currentMissionId: null,
    buffer: '',
    gpsCoordinates: '0/0', // Coordenadas GPS iniciales
    speed: 0, // Velocidad inicial
    temperature: 0, // Temperatura inicial
    humidity: 0, // Humedad inicial
    pressure: 0, // Presión inicial
    altitude: 0, // Altitud inicial
    altitudeHistory: [], // Histórico de altitud
    orientationMag: 0, // Orientación magnética inicial
  }),
  actions: {
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
    async startReceiving() {
      if (this.port && this.port.readable && !this.isReceiving) {
        this.isReceiving = true
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
              this.buffer += value
              let delimiterIndex
              while ((delimiterIndex = this.buffer.indexOf('//')) !== -1) {
                const line = this.buffer.slice(0, delimiterIndex)
                this.buffer = this.buffer.slice(delimiterIndex + 2)
                const trimmedLine = line.trim()
                if (trimmedLine) {
                  this.receivedData += trimmedLine + '\n'
                  const parts = trimmedLine.split('/')
                  const [lat, lng] = parts.slice(0, 2).map(Number)
                  this.gpsCoordinates = `${lat}/${lng}`
                  this.speed = Number(parts[6]) // Extraer la velocidad
                  this.temperature = Number(parts[8]) // Extraer la temperatura
                  this.humidity = Number(parts[9]) // Extraer la humedad
                  this.pressure = Number(parts[11]) // Extraer la presión
                  this.altitude = Number(parts[7]) // Extraer la altitud
                  this.orientationMag = Number(parts[19]) // Extraer la orientación magnética
                  this.altitudeHistory.push({
                    time: new Date().toISOString(),
                    value: this.altitude
                  })
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
    stopReceiving() {
      this.isReceiving = false
      if (this.reader) {
        this.reader.cancel()
        this.reader = null
      }
      console.log('Recepción de datos detenida')
      if (this.logToFirebase && this.currentMissionId) {
        this.closeCurrentMission()
      }
    },
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
    toggleFirebaseLogging(status) {
      this.logToFirebase = status
    },
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
  persist: true,
})