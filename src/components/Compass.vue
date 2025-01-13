<template>
  <div class="compass-container">
    <canvas id="compass" width="196" height="196"></canvas> <!-- 70% de 280px -->
  </div>
</template>

<script>
export default {
  name: 'Compass',
  props: {
    orientationMag: {
      type: Number,
      required: true,
    },
  },
  mounted() {
    this.initCompass();
  },
  watch: {
    orientationMag(newVal) {
      this.updateCompass(newVal);
    },
  },
  methods: {
    initCompass() {
      const canvas = document.getElementById('compass');
      this.ctx = canvas.getContext('2d');
      this.drawCompass(this.orientationMag);
    },
    updateCompass(direction) {
      this.drawCompass(direction);
    },
    drawCompass(direction) {
      const ctx = this.ctx;
      const width = ctx.canvas.width;
      const height = ctx.canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(centerX, centerY) - 10;

      ctx.clearRect(0, 0, width, height);

      // Draw outer circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.stroke();

      // Draw direction indicator
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate((direction * Math.PI) / 180);
      ctx.beginPath();
      ctx.moveTo(0, -radius);
      ctx.lineTo(0, radius);
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      // Draw N, E, S, W
      ctx.font = '10px Arial'; // Reduce font size
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('N', centerX, centerY - radius + 10); // Adjust position
      ctx.fillText('E', centerX + radius - 10, centerY); // Adjust position
      ctx.fillText('S', centerX, centerY + radius - 10); // Adjust position
      ctx.fillText('W', centerX - radius + 10, centerY); // Adjust position
    },
  },
};
</script>

<style>
.compass-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>