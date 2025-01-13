<template>
  <div class="sensor-card">
    <!-- Sección de texto "Temperatura" y el valor grande (ej. 24°C) -->
    <div class="temp-section">
      <p class="temp-label">Temperatura</p>
      <p class="temp-value">
        {{ temperature }}
        <span class="temp-unit">°C</span>
      </p>
    </div>

    <!-- Sección de iconos e info de presión y humedad -->
    <div class="right-section">
      <div class="info-block">
        <!-- Ícono de presión (puede ser imagen o FontAwesome) -->
        <div class="info-icon">
          <i class="fas fa-tachometer-alt"></i>
        </div>
        <!-- Valor y etiqueta -->
        <p class="info-text">{{ pressure }}hPa</p>
        <p class="info-label">Presion</p>
      </div>

      <div class="info-block">
        <!-- Ícono de humedad (puede ser imagen o FontAwesome) -->
        <div class="info-icon">
          <i class="fas fa-water"></i>
        </div>
        <!-- Valor y etiqueta -->
        <p class="info-text">{{ humidity }}%</p>
        <p class="info-label">Humedad</p>
      </div>
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

<style scoped>
.sensor-card {
  /* Color de fondo claro, similar al de tu ejemplo */
  background-color: #d1d1d1;
  /* Bordes redondeados */
  border-radius: 16px;
  /* Espacio interno */
  padding: 20px 25px;
  /* Sombra suave (efecto "card") */
  box-shadow: 4px 4px 8px rgba(0,0,0,0.25),
              -2px -2px 6px rgba(255,255,255,0.5);
  /* Ancho adaptable, pero si deseas algo fijo, puedes poner width: 400px; */
  display: flex;
  /* Justificamos el contenido en horizontal */
  justify-content: space-between;
  /* Alinear verticalmente al centro */
  align-items: center;
  /* Fuente y color de texto */
  font-family: 'Arial', sans-serif;
  color: #444; 
}

/* Sección izquierda (Temperatura) */
.temp-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* Etiqueta de "Temperatura" */
.temp-label {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
}

/* Valor grande (ej. "24°C") */
.temp-value {
  margin: 0;
  font-size: 48px;
  font-weight: 700;
  line-height: 1.1;
  color: #333;
}

/* Unidad (°C) un poco más clara/pequeña */
.temp-unit {
  font-size: 30px;
  font-weight: 400;
  margin-left: 4px;
  color: #666;
}

/* Sección derecha (iconos Presión y Humedad) */
.right-section {
  display: flex;
  gap: 30px; /* Espacio entre presión y humedad */
}

/* Cada bloque (presión o humedad) */
.info-block {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Ícono (puede ser un <img> con tu propio icono) */
.info-icon {
  font-size: 32px; 
  color: #444;
  margin-bottom: 6px;
}

/* Valor principal (ej. "997hPa") o ("41%") */
.info-text {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

/* Etiqueta (Presion / Humedad) */
.info-label {
  margin: 0;
  font-size: 12px;
  color: #666;
  margin-top: 2px;
}

/* Ejemplo responsivo: en pantallas muy pequeñas, ajusta el layout */
@media (max-width: 480px) {
  .sensor-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }
  .right-section {
    width: 100%;
    justify-content: space-evenly;
  }
  .temp-value {
    font-size: 36px;
  }
  .temp-unit {
    font-size: 20px;
  }
}
</style>
