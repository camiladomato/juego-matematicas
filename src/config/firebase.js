import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

// Reemplazá con los datos de tu consola de Firebase
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "tu-app.firebaseapp.com",
  projectId: "tu-app-id",
  storageBucket: "tu-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Iniciar sesión anónima si el jugador no tiene cuenta iniciada
export const initAuth = (onUserReady) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      onUserReady(user);
    } else {
      const cred = await signInAnonymously(auth);
      onUserReady(cred.user);
    }
  });
};