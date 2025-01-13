<template>
  <div>
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
    // Cuando el componente esté montado, renderiza el gráfico
    this.renderChart()
  },
  watch: {
    // Cada vez que cambie altitudeHistory, vuelve a renderizar el gráfico
    altitudeHistory: {
      handler() {
        this.renderChart()
      },
      deep: true
    }
  },
  methods: {
    renderChart() {
      // Si ya existe un chart, destrúyelo antes de volverlo a crear
      if (this.chart) {
        this.chart.destroy()
      }
      const ctx = this.$refs.chart.getContext('2d')
      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          // Extraemos las etiquetas desde los timestamps en altitudeHistory
          labels: this.altitudeHistory.map(item => {
            // Convierte el string de fecha a un objeto Date y saca la hora
            const date = new Date(item.time)
            return date.toLocaleTimeString()
          }),
          datasets: [
            {
              label: 'Altitud',
              // Extraemos los valores de altitud
              data: this.altitudeHistory.map(item => item.value),
              backgroundColor: 'rgba(255, 99, 132, 0.2)', // color de fondo
              borderColor: 'rgba(255, 99, 132, 1)',       // color de la línea
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
                text: 'Altitud (m)'
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
/* Ajusta el tamaño del canvas a tu gusto */
canvas {
  max-width: 100%;
  max-height: 400px;
  background-color: #fff;
}
</style>