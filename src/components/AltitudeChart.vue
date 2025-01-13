<template>
  <div>
    <ul>
      <li v-for="(item, index) in altitudeHistory" :key="index">
        {{ item.time }}: {{ item.value }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'AltitudeChart',
  props: {
    altitudeHistory: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style>
/* Add any styles you need for your chart component */
</style>
