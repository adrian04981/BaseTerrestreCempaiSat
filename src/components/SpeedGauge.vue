<template>
  <div ref="chart" class="speed-gauge"></div>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "SpeedGauge",
  props: {
    speed: {
      type: Number,
      required: true,
    },
  },
  mounted() {
    this.initChart();
    window.addEventListener("resize", this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.handleResize);
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
        series: [
          {
            data: [{ value: newSpeed }],
          },
        ],
      });
    },
    getOption(speed) {
      return {
        series: [
          {
            type: "gauge",
            progress: {
              show: true,
              width: 18,
            },
            axisLine: {
              lineStyle: {
                width: 18,
              },
            },
            axisTick: {
              show: true,
              splitNumber: 10,
              length: 10,
              lineStyle: {
                color: "#999",
                width: 2,
              },
            },
            splitLine: {
              length: 15,
              lineStyle: {
                width: 2,
                color: "#999",
              },
            },
            axisLabel: {
              formatter: (value) => {
                return value % 50 === 0 ? `${value} m/s` : `${value}`;
              },
              distance: 25,
              color: "#666",
              fontSize: 14,
            },
            anchor: {
              show: true,
              showAbove: true,
              size: 20,
              itemStyle: {
                color: "#1f78b4",
                borderWidth: 5,
                borderColor: "#fff",
              },
            },
            title: {
              show: true,
              offsetCenter: [0, "-25%"],
              fontSize: 20,
              color: "#333",
              text: "Velocidad",
            },
            detail: {
              valueAnimation: true,
              fontSize: 24,
              fontWeight: "bold",
              formatter: "{value} m/s",
              color: "#333",
              offsetCenter: [0, "70%"],
            },
            data: [{ value: speed }],
          },
        ],
      };
    },
    handleResize() {
      if (this.chart) {
        this.chart.resize();
      }
    },
  },
};
</script>

<style scoped>
.speed-gauge {
  width: 400px;
  height: 400px;

  margin: flex;
}
</style>
