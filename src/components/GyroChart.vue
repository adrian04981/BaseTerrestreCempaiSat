<template>
  <div class="gyro-chart">
    <h2 class="title">Gráfico de Giroscopio</h2>
    <div class="axis">
      <p><strong>X:</strong> {{ formattedGyro.x }} °/s</p>
      <div class="bar-container">
        <div
          class="bar"
          :style="{ width: Math.min(Math.abs(latestGyro.x) * scale, 100) + '%', backgroundColor: getBarColor(latestGyro.x) }"
        ></div>
      </div>
    </div>
    <div class="axis">
      <p><strong>Y:</strong> {{ formattedGyro.y }} °/s</p>
      <div class="bar-container">
        <div
          class="bar"
          :style="{ width: Math.min(Math.abs(latestGyro.y) * scale, 100) + '%', backgroundColor: getBarColor(latestGyro.y) }"
        ></div>
      </div>
    </div>
    <div class="axis">
      <p><strong>Z:</strong> {{ formattedGyro.z }} °/s</p>
      <div class="bar-container">
        <div
          class="bar"
          :style="{ width: Math.min(Math.abs(latestGyro.z) * scale, 100) + '%', backgroundColor: getBarColor(latestGyro.z) }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "GyroChart",
  props: {
    gyroHistory: {
      type: Array,
      default: () => [],
    },
    maxGyro: {
      type: Number,
      default: 360, // Máximo de velocidad angular esperada en °/s
    },
  },
  computed: {
    latestGyro() {
      // Retorna el último valor del historial o valores predeterminados
      const last = this.gyroHistory[this.gyroHistory.length - 1];
      return last || { x: 0, y: 0, z: 0 };
    },
    formattedGyro() {
      return {
        x: this.latestGyro.x.toFixed(2),
        y: this.latestGyro.y.toFixed(2),
        z: this.latestGyro.z ? this.latestGyro.z.toFixed(2) : "N/A", // Maneja el caso donde Z está vacío
      };
    },
    scale() {
      // Escala para convertir valores de velocidad angular a porcentaje
      return 100 / this.maxGyro;
    },
  },
  methods: {
    getBarColor(value) {
      // Cambia el color de la barra dependiendo del valor
      if (value > 0) return "blue";
      if (value < 0) return "purple";
      return "gray";
    },
  },
};
</script>

<style scoped>
.gyro-chart {
  font-family: Arial, sans-serif;
  padding: 10px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 6px;
  width: 350px;
  margin: auto;
  text-align: center;
}
.title {
  font-size: 1.5rem;
  margin-bottom: 15px;
  color: #333;
}
.axis {
  margin-bottom: 20px;
}
p {
  margin: 0 0 5px;
  font-size: 1rem;
}
.bar-container {
  position: relative;
  width: 100%;
  height: 20px;
  background-color: #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
}
.bar {
  height: 100%;
  transition: width 0.3s ease, background-color 0.3s ease;
}
</style>
