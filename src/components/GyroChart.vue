<template>
  <div>
    <canvas ref="chart"></canvas>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

export default {
  name: 'GyroChart',
  props: {
    gyroHistory: {
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
    this.renderChart()
  },
  watch: {
    gyroHistory: {
      handler() {
        this.renderChart()
      },
      deep: true
    }
  },
  methods: {
    renderChart() {
      // Destruir el gráfico previo si existe
      if (this.chart) {
        this.chart.destroy()
      }

      const ctx = this.$refs.chart.getContext('2d')

      // Construimos las etiquetas (tiempo) a partir de gyroHistory
      const labels = this.gyroHistory.map(item => {
        const date = new Date(item.time)
        return date.toLocaleTimeString()
      })

      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'GYX',
              data: this.gyroHistory.map(item => item.x),
              backgroundColor: 'rgba(255, 99, 132, 0.2)', 
              borderColor: 'rgba(255, 99, 132, 1)',       
              borderWidth: 2,
              fill: false,
              tension: 0.1
            },
            {
              label: 'GYY',
              data: this.gyroHistory.map(item => item.y),
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 2,
              fill: false,
              tension: 0.1
            },
            {
              label: 'GYZ',
              data: this.gyroHistory.map(item => item.z),
              backgroundColor: 'rgba(255, 206, 86, 0.2)',
              borderColor: 'rgba(255, 206, 86, 1)',
              borderWidth: 2,
              fill: false,
              tension: 0.1
            }
          ]
        },
        options: {
          responsive: true,
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
                text: 'Giroscopio (°/s)'
              },
              beginAtZero: true
            }
          }
        }
      })
    }
  }
}
</script>

<style scoped>
canvas {
  max-width: 100%;
  max-height: 400px;
  background-color: #fff;
}
</style>