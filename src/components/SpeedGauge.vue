<template>
  <div ref="chart" style="width: 100%; height: 400px;"></div>
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
  },
  watch: {
    speed(newSpeed) {
      this.updateChart(newSpeed);
    },
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$refs.chart);
      this.chart.setOption(this.getOption(this.speed));
    },
    updateChart(newSpeed) {
      this.chart.setOption({
        series: [{
          data: [{ value: newSpeed }]
        }]
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
            data: [
              {
                value: speed
              }
            ]
          }
        ]
      };
    }
  }
};
</script>

<style>
/* Add any styles you need for your chart component */
</style>