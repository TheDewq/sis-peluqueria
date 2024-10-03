// src/services/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';


// Configuración de Firebase proporcionada
const firebaseConfig = {
  apiKey: "AIzaSyCRiBGjgzytn5WNFdtrKqW62C7EZnkJ9L8",
  authDomain: "peluqueria-c4068.firebaseapp.com",
  projectId: "peluqueria-c4068",
  storageBucket: "peluqueria-c4068.appspot.com",
  messagingSenderId: "797758646033",
  appId: "1:797758646033:web:16a9933e65a4761dbdceb0",
  measurementId: "G-26ZKSHWYNJ"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore (Base de datos)
const db = getFirestore(app);
const auth = getAuth(app);


// Inicializar Analytics (opcional, si es necesario)
const analytics = getAnalytics(app);

export { db, analytics, auth };
