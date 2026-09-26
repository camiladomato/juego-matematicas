import { create } from 'zustand';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebase';

export const ACHIEVEMENTS_LIST = [
  {
    id: 'first_win',
    title: 'Primer Paso',
    description: 'Responde tu primera pregunta correctamente.',
    icon: '🐣',
    reward: 10,
    check: (state) => state.score >= 15,
  },
  {
    id: 'streak_5',
    title: 'En Racha',
    description: 'Consigue una racha de 5 respuestas seguidas.',
    icon: '🔥',
    reward: 25,
    check: (state) => state.streak >= 5,
  },
  {
    id: 'coin_collector',
    title: 'Tesorero',
    description: 'Acumula 100 monedas en total.',
    icon: '💰',
    reward: 50,
    check: (state) => state.coins >= 100,
  },
  {
    id: 'time_master',
    title: 'Relámpago',
    description: 'Alcanza 10 puntos en el Modo Contra Reloj.',
    icon: '⚡',
    reward: 30,
    check: (state) => state.timeAttackHighScore >= 10,
  },
  {
    id: 'fashionist',
    title: 'Coleccionista',
    description: 'Desbloquea al menos 3 avatares en la tienda.',
    icon: '👑',
    reward: 40,
    check: (state) => state.unlockedAvatars.length >= 3,
  },
];

// Progreso que se guarda en Firestore (todo lo demás es estado de sesión)
const INITIAL_PROGRESS = {
  playerName: 'Aventurero',
  selectedAvatar: '🐱',
  unlockedAvatars: ['🐱', '🦊'],
  unlockedAchievements: [],
  coins: 0,
  stars: 0,
  score: 0,
  lives: 3,
  maxLives: 3,
  streak: 0,
  currentWorld: 'addition',
  currentLevel: 1,
  unlockedLevels: { addition: 1, subtraction: 1, multiplication: 1 },
  timeAttackHighScore: 0,
};

const PROGRESS_KEYS = Object.keys(INITIAL_PROGRESS);

// Toma solo los campos conocidos de un documento de Firestore y corrige formatos viejos
const sanitizeProgress = (data) => {
  const progress = {};
  PROGRESS_KEYS.forEach((key) => {
    if (data[key] !== undefined) progress[key] = data[key];
  });

  // Una versión anterior guardaba unlockedLevels como array; se vuelve al formato por mundo
  if (progress.unlockedLevels && Array.isArray(progress.unlockedLevels)) {
    progress.unlockedLevels = { ...INITIAL_PROGRESS.unlockedLevels };
  }

  return progress;
};

export const useGameStore = create((set, get) => ({
  ...INITIAL_PROGRESS,
  recentlyUnlockedAchievement: null, // Para mostrar la notificación del logro

  // --- PERSISTENCIA EN LA NUBE ---

  // Guardar estado en Firestore para el usuario actual
  saveToCloud: async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const state = get();
      const playerData = { updatedAt: new Date() };
      PROGRESS_KEYS.forEach((key) => {
        playerData[key] = state[key];
      });

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
      const docSnap = await getDoc(doc(db, 'players', user.uid));

      if (docSnap.exists()) {
        set(sanitizeProgress(docSnap.data()));
      } else {
        // Si el usuario es nuevo, creamos su documento inicial
        await get().saveToCloud();
      }
    } catch (error) {
      console.error('Error al cargar de Firestore:', error);
    }
  },

  // --- LOGROS ---

  // Revisa los logros pendientes; devuelve true si desbloqueó alguno
  checkAchievements: () => {
    let unlockedAny = false;

    ACHIEVEMENTS_LIST.forEach((achievement) => {
      const state = get();
      if (!state.unlockedAchievements.includes(achievement.id) && achievement.check(state)) {
        set((prev) => ({
          unlockedAchievements: [...prev.unlockedAchievements, achievement.id],
          coins: prev.coins + achievement.reward,
          recentlyUnlockedAchievement: achievement,
        }));
        unlockedAny = true;
      }
    });

    return unlockedAny;
  },

  clearRecentAchievement: () => set({ recentlyUnlockedAchievement: null }),

  // --- ACCIONES DEL JUEGO (todas guardan en la nube al ejecutarse) ---

  setPlayerName: (name) => {
    set({ playerName: name });
    get().saveToCloud();
  },

  setAvatar: (avatar) => {
    set({ selectedAvatar: avatar });
    get().saveToCloud();
  },

  buyAvatar: (avatar, cost) => {
    const { coins, unlockedAvatars } = get();
    if (coins < cost || unlockedAvatars.includes(avatar)) return false;

    set({
      coins: coins - cost,
      unlockedAvatars: [...unlockedAvatars, avatar],
      selectedAvatar: avatar,
    });
    get().checkAchievements();
    get().saveToCloud();
    return true;
  },

  setWorld: (world) => {
    set({ currentWorld: world });
    get().saveToCloud();
  },

  setLevel: (level) => {
    set({ currentLevel: level });
    get().saveToCloud();
  },

  addCoins: (amount) => {
    set((state) => ({ coins: state.coins + amount }));
    get().checkAchievements();
    get().saveToCloud();
  },

  addStars: (amount) => {
    set((state) => ({ stars: state.stars + amount }));
    get().saveToCloud();
  },

  loseLife: () => {
    set((state) => ({ lives: Math.max(0, state.lives - 1), streak: 0 }));
    get().saveToCloud();
  },

  resetLives: () => {
    set((state) => ({ lives: state.maxLives }));
    get().saveToCloud();
  },

  unlockNextLevel: (worldId, levelNumber) => {
    const currentUnlocked = get().unlockedLevels[worldId] || 1;
    if (levelNumber <= currentUnlocked) return;

    set((state) => ({
      unlockedLevels: { ...state.unlockedLevels, [worldId]: levelNumber },
    }));
    get().saveToCloud();
  },

  updateTimeAttackHighScore: (newScore) => {
    set((state) => ({
      timeAttackHighScore: Math.max(state.timeAttackHighScore, newScore),
    }));
    get().checkAchievements();
    get().saveToCloud();
  },

  // Reinicio general del progreso (conserva el nombre del jugador)
  resetGame: () => {
    set({
      ...INITIAL_PROGRESS,
      playerName: get().playerName,
      recentlyUnlockedAchievement: null,
    });
    get().saveToCloud();
  },
}));
