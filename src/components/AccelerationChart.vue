<template>
  <div class="acceleration-chart">
    <h2 class="title">Gráfico de Aceleración X Y Z</h2>
    <div class="axis">
      <p><strong>X:</strong> {{ formattedAcceleration.x }} m/s²</p>
      <div class="bar-container">
        <div
          class="bar"
          :style="{ width: Math.min(Math.abs(latestAcceleration.x) * scale, 100) + '%', backgroundColor: getBarColor(latestAcceleration.x) }"
        ></div>
      </div>
    </div>
    <div class="axis">
      <p><strong>Y:</strong> {{ formattedAcceleration.y }} m/s²</p>
      <div class="bar-container">
        <div
          class="bar"
          :style="{ width: Math.min(Math.abs(latestAcceleration.y) * scale, 100) + '%', backgroundColor: getBarColor(latestAcceleration.y) }"
        ></div>
      </div>
    </div>
    <div class="axis">
      <p><strong>Z:</strong> {{ formattedAcceleration.z }} m/s²</p>
      <div class="bar-container">
        <div
          class="bar"
          :style="{ width: Math.min(Math.abs(latestAcceleration.z) * scale, 100) + '%', backgroundColor: getBarColor(latestAcceleration.z) }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AccelerationChart",
  props: {
    accHistory: {
      type: Array,
      default: () => [],
    },
    maxAcceleration: {
      type: Number,
      default: 200, // Máximo de aceleración esperado (puede ajustarse)
    },
  },
  computed: {
    latestAcceleration() {
      // Retorna el último valor del historial o valores predeterminados
      const last = this.accHistory[this.accHistory.length - 1];
      return last || { x: 0, y: 0, z: 0 };
    },
    formattedAcceleration() {
      return {
        x: this.latestAcceleration.x.toFixed(2),
        y: this.latestAcceleration.y.toFixed(2),
        z: this.latestAcceleration.z ? this.latestAcceleration.z.toFixed(2) : "N/A", // Maneja el caso donde Z está vacío
      };
    },
    scale() {
      // Escala para convertir valores de aceleración a porcentaje
      return 100 / this.maxAcceleration;
    },
  },
  methods: {
    getBarColor(value) {
      // Cambia el color de la barra dependiendo del valor
      if (value > 0) return "green";
      if (value < 0) return "red";
      return "gray";
    },
  },
};
</script>

<style scoped>
.acceleration-chart {
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