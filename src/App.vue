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

    <div class="firebase-option">
      <input type="checkbox" id="firebaseLogging" v-model="firebaseLogging" @change="toggleFirebaseLogging">
      <label for="firebaseLogging">Registrar datos en Firebase</label>
    </div>

    <div class="status">
      <p><strong>Estado de la Conexión:</strong> {{ serialStore.isConnected ? 'Conectado' : 'Desconectado' }}</p>
      <p><strong>Recepción de Datos:</strong> {{ serialStore.isReceiving ? 'En curso' : 'Detenida' }}</p>
      <p><strong>Registro en Firebase:</strong> {{ serialStore.logToFirebase ? 'Activado' : 'Desactivado' }}</p>
      <p v-if="serialStore.logToFirebase && serialStore.currentMissionId"><strong>ID de Misión:</strong> {{ serialStore.currentMissionId }}</p>
    </div>

    <div class="data-display">
      <h2>Datos Recibidos:</h2>
      <textarea readonly v-model="serialStore.receivedData" rows="15" cols="80"></textarea>
    </div>
    <MapComponent :coordinates="serialStore.gpsCoordinates" />
  </div>
</template>

<script>
import { useSerialStore } from './stores/serialStore.js'
import { computed, onBeforeUnmount } from 'vue'
import MapComponent from './components/MapComponent.vue'

export default {
  name: 'App',
  components: {
    MapComponent
  },
  setup() {
    const serialStore = useSerialStore()

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

    const firebaseLogging = computed({
      get: () => serialStore.logToFirebase,
      set: (value) => serialStore.toggleFirebaseLogging(value)
    })

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
      disconnect,
      firebaseLogging,
      toggleFirebaseLogging: serialStore.toggleFirebaseLogging,
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
  font-family: Arial, sans-serif;
}

.buttons {
  margin-bottom: 20px;
}

.buttons button {
  margin: 0 10px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}

.firebase-option {
  margin-bottom: 20px;
}

.status {
  margin-bottom: 20px;
  text-align: left;
}

.status p {
  margin: 5px 0;
  font-size: 14px;
}

.data-display textarea {
  width: 100%;
  padding: 10px;
  font-family: monospace;
  font-size: 14px;
  resize: none;
}
</style>