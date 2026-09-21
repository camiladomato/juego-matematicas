import { create } from 'zustand';

export const useGameStore = create((set) => ({
  score: 0,
  lives: 3,
  currentWorld: 'addition',
  currentLevel: 1,

  setWorld: (world) => set({ currentWorld: world }),
  setLevel: (level) => set({ currentLevel: level }),
  addScore: (points) => set((state) => ({ score: state.score + points })),
  loseLife: () => set((state) => ({ lives: Math.max(0, state.lives - 1) })),
  resetLives: () => set({ lives: 3 }),
  resetGame: () => set({ score: 0, lives: 3, currentWorld: 'addition', currentLevel: 1 }),
}));