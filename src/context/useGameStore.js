import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

// Adaptador customizado de almacenamiento para Firestore
const firestoreStorage = {
  getItem: async (name) => {
    const user = auth.currentUser;
    if (!user) return null;

    const docRef = doc(db, 'players', user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return JSON.stringify({ state: docSnap.data() });
    }
    return null;
  },
  setItem: async (name, value) => {
    const user = auth.currentUser;
    if (!user) return;

    const parsed = JSON.parse(value);
    const docRef = doc(db, 'players', user.uid);

    // Guardamos el estado limpio en la colección "players"
    await setDoc(docRef, parsed.state, { merge: true });
  },
  removeItem: async (name) => {
    // Lógica opcional para limpiar
  },
};

export const useGameStore = create(
  persist(
    (set) => ({
      playerName: 'Jugador 1',
      selectedAvatar: '🦊',
      coins: 0,
      stars: 0,
      lives: 3,
      currentWorld: 'addition',
      currentLevel: 1,
      unlockedLevels: { addition: 1, subtraction: 1, multiplication: 1 },
      timeAttackHighScore: 0,
      unlockedAchievements: [],

      setPlayerName: (name) => set({ playerName: name }),
      setSelectedAvatar: (avatar) => set({ selectedAvatar: avatar }),
      addCoins: (amount) => set((state) => ({ coins: state.coins + amount })),
      addStars: (amount) => set((state) => ({ stars: state.stars + amount })),
      loseLife: () => set((state) => ({ lives: Math.max(0, state.lives - 1) })),
      resetLives: () => set({ lives: 3 }),
      setLevel: (level) => set({ currentLevel: level }),
      setWorld: (world) => set({ currentWorld: world }),
      unlockNextLevel: (world, nextLevel) =>
        set((state) => ({
          unlockedLevels: {
            ...state.unlockedLevels,
            [world]: Math.max(state.unlockedLevels[world] || 1, nextLevel),
          },
        })),
      updateTimeAttackHighScore: (score) =>
        set((state) => ({ timeAttackHighScore: Math.max(state.timeAttackHighScore, score) })),
      unlockAchievement: (id) =>
        set((state) => {
          if (state.unlockedAchievements.includes(id)) return state;
          return { unlockedAchievements: [...state.unlockedAchievements, id] };
        }),
    }),
    {
      name: 'mate-aventura-cloud',
      storage: firestoreStorage,
    }
  )
);