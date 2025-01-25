<template>
  <!-- Contenedor que ocupará el 100% de su padre -->
  <div class="chart-container">
    <canvas ref="chart"></canvas>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

export default {
  name: 'AltitudeChart',
  props: {
    altitudeHistory: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.initChart()
    // Redimensionar el chart si la ventana cambia de tamaño
    window.addEventListener('resize', this.handleResize)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize)
  },
  watch: {
    altitudeHistory: {
      handler() {
        this.updateChart()
      },
      deep: true
    }
  },
  methods: {
    initChart() {
      const ctx = this.$refs.chart.getContext('2d')
      this.chart = new Chart(ctx, {
        type: 'line',
        data: this.getData(),
        options: this.getOptions()
      })
    },
    updateChart() {
      if (!this.chart) return
      this.chart.data = this.getData()
      this.chart.update()
    },
    getData() {
      return {
        labels: this.altitudeHistory.map(item => {
          const date = new Date(item.time)
          return date.toLocaleTimeString()
        }),
        datasets: [
          {
            label: 'Altitud',
            data: this.altitudeHistory.map(item => item.value),
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 2,
            fill: false,
            tension: 0.1
          }
        ]
      }
    },
    getOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false, // ¡Clave para usar 100% del contenedor!
        scales: {
          x: {
            title: {
              display: true,
              text: 'Tiempo'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Altitud (m)'
            },
            beginAtZero: true
          }
        }
      }
    },
    handleResize() {
      if (this.chart) {
        this.chart.resize()
      }
    }
  }
}
</script>

<style scoped>
/* Contenedor que ocupa todo el espacio de su padre */
.chart-container {
  width: 100%;
  height: 100%;
  position: relative;
}

/* Hacemos que el canvas ocupe el 100% */
canvas {
  width: 100% !important;
  height: 100% !important;
  /* Evitamos que Chart.js aplique un tamaño automático */
}
</style>
