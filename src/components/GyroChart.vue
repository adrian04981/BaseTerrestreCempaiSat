<template>
  <div class="gyro-text">
    <p><strong>Giroscopio en X:</strong> {{ latestGyro.x }} °/s</p>
    <p><strong>Giroscopio en Y:</strong> {{ latestGyro.y }} °/s</p>
    <p><strong>Giroscopio en Z:</strong> {{ latestGyro.z }} °/s</p>
  </div>
</template>

<script>
export default {
  name: 'GyroChart',
  props: {
    gyroHistory: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    latestGyro() {
      // Retorna el último elemento del historial o valores por defecto
      const last = this.gyroHistory[this.gyroHistory.length - 1];
      return last || { x: 0, y: 0, z: 0 };
    }
  }
};
</script>

<style scoped>
.gyro-text {
  font-size: 1.2rem;
  color: #333;
  text-align: center;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: #f9f9f9;
}
</style>