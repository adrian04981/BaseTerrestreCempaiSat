<template>
  <div class="app">
    <h1>Conexión Serial con Arduino</h1>
    <div class="buttons">
      <button @click="connect" :disabled="serialStore.isConnected" class="btn-primary">
        <i class="fas fa-plug"></i> Conectar
      </button>
      <button @click="startReceiving" :disabled="!serialStore.isConnected || serialStore.isReceiving" class="btn-secondary">
        <i class="fas fa-play"></i> Iniciar Recepción
      </button>
      <button @click="stopReceiving" :disabled="!serialStore.isReceiving" class="btn-secondary">
        <i class="fas fa-stop"></i> Detener Recepción
      </button>
      <button @click="disconnect" :disabled="!serialStore.isConnected" class="btn-danger">
        <i class="fas fa-times-circle"></i> Desconectar
      </button>
    </div>

    <div class="firebase-option">
      <input type="checkbox" id="firebaseLogging" v-model="firebaseLogging" @change="toggleFirebaseLogging">
      <label for="firebaseLogging"><i class="fas fa-database"></i> Registrar datos en Firebase</label>
    </div>

    <div class="status">
      <p><strong>Estado de la Conexión:</strong> <span :class="serialStore.isConnected ? 'status-connected' : 'status-disconnected'">{{ serialStore.isConnected ? 'Conectado' : 'Desconectado' }}</span></p>
      <p><strong>Recepción de Datos:</strong> <span :class="serialStore.isReceiving ? 'status-receiving' : 'status-stopped'">{{ serialStore.isReceiving ? 'En curso' : 'Detenida' }}</span></p>
      <p><strong>Registro en Firebase:</strong> {{ serialStore.logToFirebase ? 'Activado' : 'Desactivado' }}</p>
      <p v-if="serialStore.logToFirebase && serialStore.currentMissionId"><strong>ID de Misión:</strong> {{ serialStore.currentMissionId }}</p>
    </div>

    <!-- Sección para mostrar los datos recibidos -->
    <!--<div class="data-display">
      <h2><i class="fas fa-stream"></i> Datos Recibidos:</h2>
      <textarea readonly v-model="serialStore.receivedData" rows="15" cols="80"></textarea>
    </div>-->

    <div class="grupo">
      <div class="grupo-item">
        <SensorData :temperature="serialStore.temperature" :humidity="serialStore.humidity" :pressure="serialStore.pressure" />
      </div>
      <div class="grupo-item">
        <SpeedGauge :speed="serialStore.speed" />
      </div>
      <div class="grupo-item">
        <MapComponent :coordinates="serialStore.gpsCoordinates" />
      </div>
    </div>

    <div class="grupo">
      <div class="grupo-item">
        <AltitudeChart :altitudeHistory="serialStore.altitudeHistory" />
      </div>
      <div class="grupo-item">
        <Compass :orientationMag="serialStore.orientationMag" />
      </div>
      <div class="grupo-item">
        <!-- Aquí puedes agregar otro componente -->
      </div>
    </div>
  </div>
</template>

<script>
import { useSerialStore } from './stores/serialStore.js'
import { computed, onBeforeUnmount } from 'vue'
import MapComponent from './components/MapComponent.vue'
import SpeedGauge from './components/SpeedGauge.vue'
import SensorData from './components/SensorData.vue'
import AltitudeChart from './components/AltitudeChart.vue'
import Compass from './components/Compass.vue'

export default {
  name: 'App',
  components: {
    MapComponent,
    SpeedGauge,
    SensorData,
    AltitudeChart,
    Compass
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
/* Fondo y estilo general */
.app {
  background-color: #343131;
  color: #EEDF7A;
  font-family: 'Arial', sans-serif;
  padding: 20px;
  min-height: 100vh;
  box-sizing: border-box;
}

/* Encabezado */
h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #D8A25E;
}

/* Botones */
.buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

button {
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

button i {
  margin-right: 8px;
}

.btn-primary {
  background-color: #A04747;
  color: #FFF;
}

.btn-primary:hover {
  background-color: #E05C5C;
}

.btn-secondary {
  background-color: #D8A25E;
  color: #343131;
}

.btn-secondary:hover {
  background-color: #EEDF7A;
}

.btn-danger {
  background-color: #A04747;
  color: #FFF;
}

.btn-danger:hover {
  background-color: #E05C5C;
}

/* Firebase opción */
.firebase-option {
  margin-bottom: 20px;
  color: #D8A25E;
}

/* Estado */
.status {
  margin-bottom: 20px;
  text-align: left;
}

.status p {
  margin: 5px 0;
}

.status-connected {
  color: #D8A25E;
}

.status-disconnected {
  color: #A04747;
}

.status-receiving {
  color: #EEDF7A;
}

.status-stopped {
  color: #D8A25E;
}

/* Visualización de datos */
.data-display textarea {
  width: 100%;
  padding: 12px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  resize: none;
  border: 1px solid #D8A25E;
  border-radius: 8px;
  background-color: #343131;
  color: #EEDF7A;
}

/* Grupo de componentes */
.grupo {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 20px;
}

.grupo-item {
  flex: 1 1 calc(33.333% - 20px);
  padding: 15px;
  border: 1px solid #D8A25E;
  border-radius: 8px;
  background-color: #A04747;
  color: #FFF;
  text-align: center;
}
</style>
