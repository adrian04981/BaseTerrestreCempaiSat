<!-- src/App.vue -->

<template>
  <div class="container">
    <h1>Conexión Serial con Arduino</h1>
    
    <div class="buttons">
      <button @click="connect" :disabled="serialStore.isConnected">Conectar</button>
      <button @click="startReceiving" :disabled="!serialStore.isConnected || serialStore.isReceiving">Iniciar Recepción</button>
      <button @click="stopReceiving" :disabled="!serialStore.isReceiving">Detener Recepción</button>
      <button @click="disconnect" :disabled="!serialStore.isConnected">Desconectar</button>
    </div>

    <div class="status">
      <p><strong>Estado de la Conexión:</strong> {{ serialStore.isConnected ? 'Conectado' : 'Desconectado' }}</p>
      <p><strong>Recepción de Datos:</strong> {{ serialStore.isReceiving ? 'En curso' : 'Detenida' }}</p>
    </div>

    <div class="data-display">
      <h2>Datos Recibidos:</h2>
      <textarea readonly v-model="serialStore.receivedData" rows="15" cols="80"></textarea>
    </div>
  </div>
</template>

<script>
import { useSerialStore } from './stores/serialStore'
import { storeToRefs } from 'pinia'
import { onBeforeUnmount } from 'vue'

export default {
  name: 'App',
  setup() {
    const serialStore = useSerialStore()

    // Funciones para los botones
    const connect = async () => {
      await serialStore.connectSerial()
    }

    const startReceiving = async () => {
      await serialStore.startReceiving()
    }

    const stopReceiving = () => {
      serialStore.stopReceiving()
    }

    const disconnect = async () => {
      await serialStore.disconnectSerial()
    }

    // Asegura que la conexión se cierre al cerrar la aplicación
    onBeforeUnmount(() => {
      if (serialStore.isConnected) {
        serialStore.disconnectSerial()
      }
    })

    return {
      serialStore,
      connect,
      startReceiving,
      stopReceiving,
      disconnect
    }
  }
}
</script>

<style>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

.buttons {
  margin-bottom: 20px;
}

.buttons button {
  margin: 0 10px;
  padding: 10px 20px;
}

.status {
  margin-bottom: 20px;
}

.data-display textarea {
  width: 100%;
  padding: 10px;
  font-family: monospace;
  font-size: 14px;
}
</style>