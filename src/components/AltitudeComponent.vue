<template>
  <div>
    <h2>Altitud</h2>
    <LineChart
      v-if="chartData"
      :chart-data="chartData"
      :options="chartOptions"
    />
  </div>
</template>

<script>
import { ref, onMounted, watch } from "vue";
import { LineChart } from "vue-chart-3";

export default {
  name: "AltitudeComponent",
  components: {
    LineChart
  },
  props: {
    altitude: {
      type: Number,
      default: 0
    }
  },
  setup(props) {
    const chartData = ref(null);
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false
    };

    onMounted(() => {
      chartData.value = {
        labels: ["Actual"],
        datasets: [
          {
            label: "Altitud (m)",
            borderColor: "rgba(255,99,132,1)",
            backgroundColor: "rgba(255,99,132,0.2)",
            data: [props.altitude]
          }
        ]
      };
    });

    // Al cambiar la altitud, actualizamos la gráfica
    watch(
      () => props.altitude,
      (newVal) => {
        if (chartData.value) {
          chartData.value.datasets[0].data[0] = newVal;
        }
      }
    );

    return { chartData, chartOptions };
  }
};
</script>

<style scoped>
h2 {
  margin-bottom: 8px;
}
</style>