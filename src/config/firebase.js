import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuración con tus claves reales de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDWSzSHwbwGh0tUzf4uJlQgfrUyP7hi-to",
  authDomain: "mate-aventura-f3547.firebaseapp.com",
  projectId: "mate-aventura-f3547",
  storageBucket: "mate-aventura-f3547.firebasestorage.app",
  messagingSenderId: "450863974192",
  appId: "1:450863974192:web:58b17cffa2c6c58fad2af5",
  measurementId: "G-3GRQ0T2Z4G"
};

// Inicialización de Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

// Manejador de Autenticación
export const initAuth = (onUserReady) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      onUserReady(user);
    } else {
      try {
        const cred = await signInAnonymously(auth);
        onUserReady(cred.user);
      } catch (error) {
        console.error("Error al iniciar sesión anónima en Firebase:", error);
        onUserReady(null);
      }
    }
  });
};