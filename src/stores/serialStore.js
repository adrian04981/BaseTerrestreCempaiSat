// src/stores/serialStore.js

import { defineStore } from 'pinia'

export const useSerialStore = defineStore('serial', {
  state: () => ({
    port: null,             // Puerto serial
    reader: null,           // Reader para leer datos
    isConnected: false,     // Estado de la conexión
    isReceiving: false,     // Estado de la recepción
    receivedData: '',       // Datos recibidos
  }),
  actions: {
    // Función para conectar al puerto serial
    async connectSerial() {
      try {
        // Solicita al usuario que seleccione un puerto serial
        this.port = await navigator.serial.requestPort()
        // Abre el puerto con la configuración adecuada
        await this.port.open({ baudRate: 9600 })
        this.isConnected = true
        console.log('Conectado al puerto serial')
      } catch (error) {
        console.error('Error al conectar al puerto serial:', error)
      }
    },
    // Función para iniciar la recepción de datos
    async startReceiving() {
      if (this.port && this.port.readable && !this.isReceiving) {
        this.isReceiving = true
        const textDecoder = new TextDecoderStream()
        const readableStreamClosed = this.port.readable.pipeTo(textDecoder.writable)
        this.reader = textDecoder.readable.getReader()
        try {
          while (this.isReceiving) {
            const { value, done } = await this.reader.read()
            if (done) {
              // La transmisión ha finalizado
              break
            }
            if (value) {
              // Actualiza los datos recibidos
              this.receivedData += value
            }
          }
        } catch (error) {
          console.error('Error durante la recepción de datos:', error)
        } finally {
          this.reader.releaseLock()
        }
      }
    },
    // Función para detener la recepción de datos
    stopReceiving() {
      this.isReceiving = false
      if (this.reader) {
        this.reader.cancel()
        this.reader = null
      }
      console.log('Recepción de datos detenida')
    },
    // Función para desconectar del puerto serial
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
    }
  }
})
