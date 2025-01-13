<template>
  <!--
    width: 100% y height: 100% hacen que el mapa
    ocupe todo el espacio de su contenedor.
    Asegúrate de que el padre de este div tenga 
    una altura definida (por ejemplo, 400px 
    o 'flex: 1' si usas flexbox).
  -->
  <div id="map" ref="map" style="width: 100%; height: 100%;"></div>
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
    // Cada vez que cambien las coordenadas, movemos el marker y centramos el mapa
    coordinates(newCoords) {
      const [lat, lng] = newCoords.split('/').map(Number);
      if (this.marker) {
        this.marker.setLatLng([lat, lng]);
        this.map.setView([lat, lng], 13);
      }
    },
  },
  mounted() {
    // Parsear coords iniciales
    const [lat, lng] = this.coordinates.split('/').map(Number);

    // Inicializar mapa en las coords
    this.map = L.map(this.$refs.map).setView([lat, lng], 13);

    // Capa base (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    // Agregar marker
    this.marker = L.marker([lat, lng]).addTo(this.map);

    // Ajustar el mapa al cambiar el tamaño de la ventana
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    // Removemos el listener para evitar fugas de memoria
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    handleResize() {
      if (this.map) {
        this.map.invalidateSize();
      }
    },
  },
};
</script>

<style scoped>
/*
  Asegúrate de que el contenedor padre
  tenga una altura definida o sea flexible
  (p. ej. "height: 400px" o "flex: 1;").
*/
</style>
