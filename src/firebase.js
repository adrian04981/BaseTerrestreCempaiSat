// src/firebase.js

// Importa las funciones necesarias de Firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC7EaUZVwZINmjqTsZ9VYhIyS3QGp2Y_P4",
  authDomain: "cempai-sat.firebaseapp.com",
  projectId: "cempai-sat",
  storageBucket: "cempai-sat.firebasestorage.app",
  messagingSenderId: "988335960507",
  appId: "1:988335960507:web:208d534f57066afbb4d49e"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Inicializa Firestore
const db = getFirestore(app);

// Exporta la instancia de Firestore para usarla en otros lugares
export { db };