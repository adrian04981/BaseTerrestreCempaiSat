<template>
  <div class="compass-container">
    <canvas id="compass" width="196" height="196"></canvas>
  </div>
</template>

<script>
export default {
  name: "Compass",
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
      const canvas = document.getElementById("compass");
      this.ctx = canvas.getContext("2d");
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

      // Limpia el lienzo
      ctx.clearRect(0, 0, width, height);

      // Dibuja el círculo externo
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#666";
      ctx.stroke();

      // Dibuja las marcas principales (N, E, S, W)
      ctx.font = "16px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#333";
      ctx.fillText("N", centerX, centerY - radius + 15);
      ctx.fillText("E", centerX + radius - 15, centerY);
      ctx.fillText("S", centerX, centerY + radius - 15);
      ctx.fillText("W", centerX - radius + 15, centerY);

      // Dibuja las marcas secundarias (pequeñas líneas en el círculo)
      for (let angle = 0; angle < 360; angle += 10) {
        const radian = (angle * Math.PI) / 180;
        const innerRadius = radius - 5;
        const outerRadius = radius;

        const x1 = centerX + innerRadius * Math.cos(radian);
        const y1 = centerY + innerRadius * Math.sin(radian);
        const x2 = centerX + outerRadius * Math.cos(radian);
        const y2 = centerY + outerRadius * Math.sin(radian);

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = "#999";
        ctx.lineWidth = angle % 90 === 0 ? 2 : 1;
        ctx.stroke();
      }

      // Dibuja el indicador de dirección
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate((direction * Math.PI) / 180);
      ctx.beginPath();
      ctx.moveTo(0, -radius + 20); // Punta de la flecha
      ctx.lineTo(-6, -radius + 30); // Izquierda
      ctx.lineTo(6, -radius + 30); // Derecha
      ctx.closePath();
      ctx.fillStyle = "red";
      ctx.fill();
      ctx.restore();

      // Dibuja el centro de la brújula
      ctx.beginPath();
      ctx.arc(centerX, centerY, 5, 0, 2 * Math.PI);
      ctx.fillStyle = "blue";
      ctx.fill();
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
  background-color: #f9f9f9;
}
</style>