<template>
  <!-- 
    Ajusta estos estilos para que el contenedor
    crezca o se reduzca a tu gusto. Aquí, le damos
    height: 100% para que herede la altura del padre.
  -->
  <div ref="chart" style="width: 100%; height: 100%;"></div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'SpeedGauge',
  props: {
    speed: {
      type: Number,
      required: true,
    },
  },
  mounted() {
    this.initChart();
    // Detectar cambios de tamaño en la ventana
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    // Quitar el listener al desmontar
    window.removeEventListener('resize', this.handleResize);
  },
  watch: {
    speed(newSpeed) {
      this.updateChart(newSpeed);
    },
  },
  methods: {
    initChart() {
      // Inicializa el chart sobre el contenedor
      this.chart = echarts.init(this.$refs.chart);
      // Aplica las opciones iniciales
      this.chart.setOption(this.getOption(this.speed));
    },
    updateChart(newSpeed) {
      // Actualiza solo el valor
      this.chart.setOption({
        series: [
          {
            data: [{ value: newSpeed }]
          }
        ]
      });
    },
    getOption(speed) {
      return {
        series: [
          {
            type: 'gauge',
            progress: {
              show: true,
              width: 18
            },
            axisLine: {
              lineStyle: {
                width: 18
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              length: 15,
              lineStyle: {
                width: 2,
                color: '#999'
              }
            },
            axisLabel: {
              distance: 25,
              color: '#999',
              fontSize: 20
            },
            anchor: {
              show: true,
              showAbove: true,
              size: 25,
              itemStyle: {
                borderWidth: 10
              }
            },
            title: {
              show: false
            },
            detail: {
              valueAnimation: true,
              fontSize: 80,
              offsetCenter: [0, '70%']
            },
            data: [{ value: speed }]
          }
        ]
      };
    },
    handleResize() {
      // Cada vez que la ventana cambie de tamaño, avisa al chart
      if (this.chart) {
        this.chart.resize();
      }
    }
  }
};
</script>

<style scoped>
/* 
  Asegúrate de que el padre de este componente tenga
  una altura definida o un layout flexible (ej: flex),
  de lo contrario height: 100% no sabrá cuánto medir.
*/
</style>
