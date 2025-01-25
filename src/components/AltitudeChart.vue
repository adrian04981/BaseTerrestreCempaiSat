<template>
  <div class="altitude-indicator">
    <div class="altitude-text">
      <p><strong>Altitud Actual:</strong></p>
      <p class="altitude-value">{{ formattedAltitude }} m</p>
    </div>
    <div class="altitude-bar-container">
      <div class="altitude-labels">
        <span>{{ maxAltitude.toFixed(2) }} m</span>
      </div>
      <div class="altitude-bar">
        <div
          class="altitude-fill"
          :style="{ height: fillHeight + '%', backgroundColor: fillColor }"
        ></div>
      </div>
      <div class="altitude-labels">
        <span>0 m</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AltitudeBar",
  props: {
    altitude: {
      type: Number,
      default: 0,
    },
    maxAltitude: {
      type: Number,
      default: 200.0, // Cambiado a 200 metros
    },
  },
  computed: {
    // Formatea la altitud actual con dos decimales
    formattedAltitude() {
      return this.altitude.toFixed(2);
    },
    // Calcula el porcentaje de la barra basada en la altitud actual
    fillHeight() {
      return Math.min((this.altitude / this.maxAltitude) * 100, 100);
    },
    // Cambia el color de la barra basado en la altitud
    fillColor() {
      if (this.fillHeight > 75) return "red";
      if (this.fillHeight > 50) return "orange";
      return "green";
    },
  },
};
</script>

<style scoped>
.altitude-indicator {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 20px;
  font-family: Arial, sans-serif;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 300px;
  margin: auto;
}

.altitude-text {
  text-align: center;
}

.altitude-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin-top: 5px;
}

.altitude-bar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.altitude-bar {
  position: relative;
  width: 50px;
  height: 200px; /* Ajustado para una mejor proporción */
  border: 2px solid #333;
  border-radius: 15px;
  background: #e0e0e0;
  overflow: hidden;
}

.altitude-fill {
  position: absolute;
  bottom: 0;
  width: 100%;
  transition: height 0.3s ease, background-color 0.3s ease;
}

.altitude-labels {
  display: flex;
  justify-content: center;
  width: 100%;
  font-size: 0.9rem;
  color: #555;
  margin: 5px 0;
}
</style>
