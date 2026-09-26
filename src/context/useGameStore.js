import { create } from 'zustand';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebase';

const INITIAL_STATE = {
  playerName: 'Aventurero',
  coins: 0,
  stars: 0,
  lives: 3,
  currentLevel: 1,
  unlockedLevels: [1],
  inventory: [],
  selectedAvatar: '🧒',
};

export const useGameStore = create((set, get) => ({
  ...INITIAL_STATE,

  // Guardar estado en Firestore para el usuario actual
  saveToCloud: async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const state = get();
      const playerData = {
        playerName: state.playerName,
        coins: state.coins,
        stars: state.stars,
        lives: state.lives,
        currentLevel: state.currentLevel,
        unlockedLevels: state.unlockedLevels,
        inventory: state.inventory,
        selectedAvatar: state.selectedAvatar,
        updatedAt: new Date(),
      };

      await setDoc(doc(db, 'players', user.uid), playerData, { merge: true });
    } catch (error) {
      console.error('Error al guardar en Firestore:', error);
    }
  },

  // Cargar estado desde Firestore al iniciar sesión
  loadFromCloud: async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const userDocRef = doc(db, 'players', user.uid);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        set({ ...data });
      } else {
        // Si el usuario es nuevo, creamos su documento inicial
        await get().saveToCloud();
      }
    } catch (error) {
      console.error('Error al cargar de Firestore:', error);
    }
  },

  // Acciones del juego (todas guardan en la nube al ejecutarse)
  addCoins: (amount) => {
    set((state) => ({ coins: state.coins + amount }));
    get().saveToCloud();
  },

  addStars: (amount) => {
    set((state) => ({ stars: state.stars + amount }));
    get().saveToCloud();
  },

  unlockNextLevel: (levelId) => {
    set((state) => ({
      unlockedLevels: state.unlockedLevels.includes(levelId)
        ? state.unlockedLevels
        : [...state.unlockedLevels, levelId],
    }));
    get().saveToCloud();
  },

  resetLives: () => {
    set({ lives: 3 });
    get().saveToCloud();
  },
}));