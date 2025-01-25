<template>
  <div class="acceleration-text">
    <p><strong>Aceleración en X:</strong> {{ latestAcceleration.x }} m/s²</p>
    <p><strong>Aceleración en Y:</strong> {{ latestAcceleration.y }} m/s²</p>
    <p><strong>Aceleración en Z:</strong> {{ latestAcceleration.z }} m/s²</p>
  </div>
</template>

<script>
export default {
  name: 'AccelerationChart',
  props: {
    accHistory: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    latestAcceleration() {
      // Retorna el último elemento del historial o valores por defecto
      const last = this.accHistory[this.accHistory.length - 1];
      return last || { x: 0, y: 0, z: 0 };
    }
  }
};
</script>

<style scoped>
.acceleration-text {
  font-size: 1.2rem;
  color: #333;
  text-align: center;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: #f9f9f9;
}
</style>