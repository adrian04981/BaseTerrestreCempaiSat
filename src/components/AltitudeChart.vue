<template>
  <div class="altitude-text">
    <p><strong>Altitud Actual:</strong> {{ altitude }} m</p>
  </div>
</template>

<script>
export default {
  name: 'AltitudeText',
  props: {
    altitude: {
      type: Number,
      default: 0
    },
    isReceiving: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style scoped>
.altitude-text {
  font-size: 1.2rem;
  color: #333;
  text-align: center;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: #f9f9f9;
}
</style>