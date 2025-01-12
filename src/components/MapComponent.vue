<template>
  <div id="map" ref="map" style="width: 100%; height: 400px;"></div>
</template>

<script>
import L from 'leaflet';

export default {
  name: 'MapComponent',
  props: {
    coordinates: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      map: null,
      marker: null,
    };
  },
  watch: {
    coordinates(newCoords) {
      const [lat, lng] = newCoords.split('/').map(Number);
      if (this.marker) {
        this.marker.setLatLng([lat, lng]);
        this.map.setView([lat, lng], 13);
      }
    },
  },
  mounted() {
    const [lat, lng] = this.coordinates.split('/').map(Number);
    this.map = L.map(this.$refs.map).setView([lat, lng], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);
    this.marker = L.marker([lat, lng]).addTo(this.map);
  },
};
</script>