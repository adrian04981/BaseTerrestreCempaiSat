<template>
  <div class="sensor-data">
    <h2><i class="fas fa-microchip"></i> Datos del Sensor</h2>
    <div class="data-item">
      <i class="fas fa-thermometer-half"></i>
      <p><strong>Temperatura:</strong> {{ temperature }} °C</p>
    </div>
    <div class="data-item">
      <i class="fas fa-tint"></i>
      <p><strong>Humedad:</strong> {{ humidity }} %</p>
    </div>
    <div class="data-item">
      <i class="fas fa-tachometer-alt"></i>
      <p><strong>Presión:</strong> {{ pressure }} hPa</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SensorData',
  props: {
    temperature: {
      type: Number,
      required: true,
    },
    humidity: {
      type: Number,
      required: true,
    },
    pressure: {
      type: Number,
      required: true,
    },
  },
};
</script>

<style>
/* Estilo general del componente */
.sensor-data {
  margin-top: 20px;
  padding: 15px;
  border: 2px solid #D8A25E;
  border-radius: 12px;
  background-color: #343131; /* Fondo oscuro */
  color: #EEDF7A; /* Texto amarillo */
  font-family: 'Arial', sans-serif;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

/* Título con icono */
.sensor-data h2 {
  font-size: 20px;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #D8A25E; /* Dorado */
}

/* Elementos individuales de datos */
.data-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 10px 0;
}

.data-item i {
  font-size: 20px;
  color: #D8A25E; /* Iconos dorados */
}

.data-item p {
  margin: 0;
  font-size: 16px;
}

/* Responsive: Adaptar fuente en pantallas pequeñas */
@media (max-width: 768px) {
  .sensor-data h2 {
    font-size: 18px;
  }

  .data-item i {
    font-size: 18px;
  }

  .data-item p {
    font-size: 14px;
  }
}
</style>
