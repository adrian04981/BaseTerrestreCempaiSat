<template>
  <div class="app">
    <!-- Sección Superior (top-container) -->
    <div class="top-container">
      <!-- Panel Izquierdo -->
      <div class="left-panel">
        <div class="status">
          <p>
            <strong>Estado de la Conexión:</strong>
            <span :class="serialStore.isConnected ? 'status-connected' : 'status-disconnected'">
              {{ serialStore.isConnected ? 'Conectado' : 'Desconectado' }}
            </span>
          </p>
          <p>
            <strong>Recepción de Datos:</strong>
            <span :class="serialStore.isReceiving ? 'status-receiving' : 'status-stopped'">
              {{ serialStore.isReceiving ? 'En curso' : 'Detenida' }}
            </span>
          </p>
          <p>
            <strong>Registro en Firebase:</strong>
            {{ serialStore.logToFirebase ? 'Activado' : 'Desactivado' }}
          </p>
        </div>
        <div class="firebase-switch">
          <label class="switch">
            <input
              type="checkbox"
              class="checkbox"
              :checked="firebaseLogging"
              @change="toggleFirebaseLogging($event.target.checked)"
            />
            <div class="slider"></div>
          </label>
          <span class="switch-label">Registrar datos en Firebase</span>
        </div>
      </div>

      <!-- Panel Derecho -->
      <div class="right-panel">
        <h1>CEMPAI - SAT BASE TERRESTRE</h1>
        <div class="buttons">
          <button @click="connect" :disabled="serialStore.isConnected" class="btn-primary">
            Conectar
          </button>
          <button
            @click="startReceiving"
            :disabled="!serialStore.isConnected || serialStore.isReceiving"
            class="btn-secondary"
          >
            Iniciar Recepción
          </button>
          <button
            @click="stopReceiving"
            :disabled="!serialStore.isReceiving"
            class="btn-secondary"
          >
            Detener Recepción
          </button>
          <button
            @click="disconnect"
            :disabled="!serialStore.isConnected"
            class="btn-danger"
          >
            Desconectar
          </button>
        </div>
      </div>
    </div>

    <!-- Sección Inferior: Grilla principal -->
    <div class="main-grid">
      <!-- Tarjeta de sensor (Temperatura, Presión, Humedad) -->
      <div class="grid-item sensor-card">
        <SensorData
          :temperature="serialStore.temperature"
          :pressure="serialStore.pressure"
          :humidity="serialStore.humidity"
        />
      </div>

      <!-- Gráfico de Altitud -->
      <div class="grid-item chart">
        <AltitudeChart :altitudeHistory="serialStore.altitudeHistory" />
      </div>

      <!-- Mapa -->
      <div class="grid-item">
        <MapComponent :coordinates="serialStore.gpsCoordinates" />
      </div>

      <!-- Velocidad -->
      <div class="grid-item">
        <SpeedGauge :speed="serialStore.speed" />
      </div>

      <!-- Giroscopio -->
      <div class="grid-item">
        <GyroChart :gyroHistory="serialStore.gyroHistory" />
      </div>

      <!-- Aceleración -->
      <div class="grid-item">
        <AccelerationChart :accHistory="serialStore.accHistory" />
      </div>

      <!-- Brújula -->
      <div class="grid-item">
        <Compass :orientationMag="serialStore.orientationMag" />
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useSerialStore } from './stores/serialStore.js'

import SensorData from './components/SensorData.vue'
import AltitudeChart from './components/AltitudeChart.vue'
import SpeedGauge from './components/SpeedGauge.vue'
import Compass from './components/Compass.vue'
import MapComponent from './components/MapComponent.vue'
import AccelerationChart from './components/AccelerationChart.vue'
import GyroChart from './components/GyroChart.vue'

export default {
  name: 'App',
  components: {
    SensorData,
    AltitudeChart,
    SpeedGauge,
    Compass,
    MapComponent,
    AccelerationChart,
    GyroChart
  },
  setup() {
    const serialStore = useSerialStore()

    const firebaseLogging = computed({
      get: () => serialStore.logToFirebase,
      set: (val) => serialStore.toggleFirebaseLogging(val)
    })

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
    const toggleFirebaseLogging = (checked) => {
      firebaseLogging.value = checked
    }

    return {
      serialStore,
      firebaseLogging,
      toggleFirebaseLogging,
      connect,
      startReceiving,
      stopReceiving,
      disconnect
    }
  }
}
</script>

<style scoped>
/* El mismo CSS que ya tienes, solamente ten cuidado
   en la parte inferior al meter los grid-items. */
.app {
  background-color: #eaecef;
  color: #333;
  font-family: 'Arial', sans-serif;
  min-height: 100vh;
  box-sizing: border-box;
  padding: 20px;
}

.top-container {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.left-panel {
  background-color: #2b2b2b;
  color: #EEDF7A;
  padding: 15px;
  border-radius: 6px;
  min-width: 220px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.status p {
  margin: 6px 0;
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

.firebase-switch {
  margin-top: 15px;
  display: flex;
  align-items: center;
}
.switch-label {
  margin-left: 8px;
}

.checkbox {
  display: none;
}
.slider {
  width: 60px;
  height: 30px;
  background-color: lightgray;
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  align-items: center;
  border: 4px solid transparent;
  transition: 0.3s;
  box-shadow: 0 0 10px 0 rgb(0,0,0,0.25) inset;
  cursor: pointer;
}
.slider::before {
  content: '';
  display: block;
  width: 100%;
  height: 100%;
  background-color: #fff;
  transform: translateX(-30px);
  border-radius: 20px;
  transition: 0.3s;
  box-shadow: 0 0 10px 3px rgba(0,0,0,0.25);
}
.checkbox:checked ~ .slider::before {
  transform: translateX(30px);
}
.checkbox:checked ~ .slider {
  background-color: #2196F3;
}
.checkbox:active ~ .slider::before {
  transform: translate(0);
}

.right-panel {
  background-color: #343131;
  color: #EEDF7A;
  padding: 15px;
  border-radius: 6px;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.right-panel h1 {
  margin: 0 0 20px;
  font-size: 24px;
  color: #D8A25E;
}

.buttons {
  display: flex;
  gap: 10px;
}
button {
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
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

.main-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 260px;
  gap: 20px;
}

/* Cada "grid-item" es una celda */
.grid-item {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 3px 6px rgba(0,0,0,0.2);
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

@media (max-width: 1024px) {
  .main-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 600px) {
  .main-grid {
    grid-template-columns: 1fr;
  }
}
</style>