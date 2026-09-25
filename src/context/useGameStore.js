import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

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

export const useGameStore = create(
  persist(
    (set, get) => ({
      // --- ESTADO INICIAL ---
      playerName: 'Jugador',
      selectedAvatar: '🐱',
      unlockedAvatars: ['🐱', '🦊'],
      unlockedAchievements: [], // IDs de logros completados
      recentlyUnlockedAchievement: null, // Para mostrar la notificación modal
      coins: 0,
      stars: 0,
      score: 0,
      lives: 3,
      maxLives: 3,
      streak: 0,
      currentWorld: 'addition',
      currentLevel: 1,

      unlockedLevels: {
        addition: 1,
        subtraction: 1,
        multiplication: 1,
      },
      timeAttackHighScore: 0,

      // --- MÉTODOS Y ACCIONES ---

      setPlayerName: (name) => set({ playerName: name }),
      setAvatar: (avatar) => set({ selectedAvatar: avatar }),

      clearRecentAchievement: () => set({ recentlyUnlockedAchievement: null }),

      // Chequeador automático de logros
      checkAchievements: () => {
        const state = get();
        ACHIEVEMENTS_LIST.forEach((achievement) => {
          if (!state.unlockedAchievements.includes(achievement.id)) {
            if (achievement.check(state)) {
              set((prev) => ({
                unlockedAchievements: [...prev.unlockedAchievements, achievement.id],
                coins: prev.coins + achievement.reward,
                recentlyUnlockedAchievement: achievement,
              }));
            }
          }
        });
      },

      buyAvatar: (avatar, cost) => {
        const { coins, unlockedAvatars, checkAchievements } = get();
        if (coins >= cost && !unlockedAvatars.includes(avatar)) {
          set({
            coins: coins - cost,
            unlockedAvatars: [...unlockedAvatars, avatar],
            selectedAvatar: avatar,
          });
          checkAchievements();
          return true;
        }
        return false;
      },

      setWorld: (world) => set({ currentWorld: world }),
      setLevel: (level) => set({ currentLevel: level }),

      addScore: (points) => {
        set((state) => ({ score: state.score + points }));
        get().checkAchievements();
      },

      addCoins: (amount) => {
        set((state) => ({ coins: state.coins + amount }));
        get().checkAchievements();
      },

      incrementStreak: () => {
        set((state) => {
          const newStreak = state.streak + 1;
          const extraCoins = newStreak % 3 === 0 ? 5 : 0;
          return {
            streak: newStreak,
            coins: state.coins + 10 + extraCoins,
            score: state.score + 15,
          };
        });
        get().checkAchievements();
      },

      resetStreak: () => set({ streak: 0 }),

      loseLife: () =>
        set((state) => ({
          lives: Math.max(0, state.lives - 1),
          streak: 0,
        })),

      resetLives: () => set((state) => ({ lives: state.maxLives })),

      unlockNextLevel: (worldId, levelNumber) =>
        set((state) => {
          const currentUnlocked = state.unlockedLevels[worldId] || 1;
          if (levelNumber > currentUnlocked) {
            return {
              unlockedLevels: {
                ...state.unlockedLevels,
                [worldId]: levelNumber,
              },
            };
          }
          return {};
        }),

      updateTimeAttackHighScore: (newScore) => {
        set((state) => ({
          timeAttackHighScore: Math.max(state.timeAttackHighScore, newScore),
        }));
        get().checkAchievements();
      },

      resetGame: () =>
        set({
          score: 0,
          coins: 0,
          stars: 0,
          lives: 3,
          streak: 0,
          currentWorld: 'addition',
          currentLevel: 1,
          selectedAvatar: '🐱',
          unlockedAvatars: ['🐱', '🦊'],
          unlockedAchievements: [],
          recentlyUnlockedAchievement: null,
          unlockedLevels: {
            addition: 1,
            subtraction: 1,
            multiplication: 1,
          },
          timeAttackHighScore: 0,
        }),
    }),
    {
      name: 'mate-aventura-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);