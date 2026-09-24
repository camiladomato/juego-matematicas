import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useGameStore = create(
  persist(
    (set, get) => ({
      // --- ESTADO INICIAL ---
      playerName: 'Jugador',
      selectedAvatar: '🐱',
      unlockedAvatars: ['🐱', '🦊'], // Avatares desbloqueados por defecto
      coins: 0,
      stars: 0,
      score: 0,
      lives: 3,
      maxLives: 3,
      streak: 0,
      currentWorld: 'addition',
      currentLevel: 1,

      // Progreso por mundos y niveles desbloqueados
      unlockedLevels: {
        addition: 1,
        subtraction: 1,
        multiplication: 1,
      },

      // --- ACCIONES Y MÉTODOS ---

      // Configuración del jugador
      setPlayerName: (name) => set({ playerName: name }),
      setAvatar: (avatar) => set({ selectedAvatar: avatar }),

      // Comprar avatar en la tienda
      buyAvatar: (avatar, cost) =>
        set((state) => {
          if (state.coins >= cost && !state.unlockedAvatars.includes(avatar)) {
            return {
              coins: state.coins - cost,
              unlockedAvatars: [...state.unlockedAvatars, avatar],
              selectedAvatar: avatar, // Equipar automáticamente tras la compra
            };
          }
          return {};
        }),

      // Gestión de Navegación / Mundos
      setWorld: (world) => set({ currentWorld: world }),
      setLevel: (level) => set({ currentLevel: level }),

      // Lógica de Puntuación y Recompensas
      addScore: (points) => set((state) => ({ score: state.score + points })),
      
      addCoins: (amount) => set((state) => ({ coins: state.coins + amount })),
      
      addStars: (amount) => set((state) => ({ stars: state.stars + amount })),

      incrementStreak: () =>
        set((state) => {
          const newStreak = state.streak + 1;
          // Recompensa extra de monedas por racha de respuestas correctas
          const extraCoins = newStreak % 3 === 0 ? 5 : 0;
          return {
            streak: newStreak,
            coins: state.coins + 10 + extraCoins,
            score: state.score + 15,
          };
        }),

      resetStreak: () => set({ streak: 0 }),

      // Gestión de Vidas
      loseLife: () =>
        set((state) => {
          const newLives = Math.max(0, state.lives - 1);
          return {
            lives: newLives,
            streak: 0, // Reinicia racha al cometer un error
          };
        }),

      resetLives: () => set((state) => ({ lives: state.maxLives })),

      // Desbloqueo de Niveles
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

      // Reinicio General del Juego (Reset de fábrica)
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
          unlockedLevels: {
            addition: 1,
            subtraction: 1,
            multiplication: 1,
          },
        }),
    }),
    {
      name: 'mate-aventura-storage', // Nombre de la clave en localStorage
      storage: createJSONStorage(() => localStorage), // Persistencia web
    }
  )
);