// src/main.js

import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'

const app = createApp(App)

// Crea una instancia de Pinia
const pinia = createPinia()

// Usa Pinia en la aplicación
app.use(pinia)

app.mount('#app')