<template>
  <div>
    <h2>Velocidad</h2>
    <BarChart
      v-if="chartData"
      :chart-data="chartData"
      :options="chartOptions"
    />
  </div>
</template>

<script>
import { ref, watch, onMounted } from "vue";
import { BarChart } from "vue-chart-3";

export default {
  name: "SpeedComponent",
  components: {
    BarChart
  },
  props: {
    speed: {
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
            label: "Velocidad (km/h)",
            backgroundColor: "rgba(54,162,235,0.6)",
            data: [props.speed]
          }
        ]
      };
    });

    // Al cambiar la velocidad, actualizamos la gráfica
    watch(
      () => props.speed,
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