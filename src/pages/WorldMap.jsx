import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../context/useGameStore';
import HeaderHUD from '../components/layout/HeaderHUD';
import Button3D from '../components/ui/Button3D';

const WORLDS = [
  { id: 'addition', name: 'Mundo Suma', icon: '➕', totalLevels: 5, color: 'from-emerald-500 to-teal-700' },
  { id: 'subtraction', name: 'Mundo Resta', icon: '➖', totalLevels: 5, color: 'from-blue-500 to-indigo-700' },
  { id: 'multiplication', name: 'Mundo Multiplicación', icon: '✖️', totalLevels: 5, color: 'from-purple-500 to-amber-600' },
];

export default function WorldMap({ onSelectLevel, onGoHome }) {
  const { currentWorld, setWorld, setLevel, unlockedLevels , resetLives = { addition: 1 } } = useGameStore();

  const activeWorld = WORLDS.find((w) => w.id === currentWorld) || WORLDS[0];
  const maxUnlockedLevel = unlockedLevels[activeWorld.id] || 1;

  const handleLevelClick = (levelNumber) => {
    if (levelNumber <= maxUnlockedLevel) {
      setLevel(levelNumber);
      resetLives();
      onSelectLevel();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900 text-white flex flex-col justify-between p-4 max-w-2xl mx-auto select-none overflow-hidden">
      {/* HUD SUPERIOR */}
      <HeaderHUD />

      {/* SELECTOR DE MUNDOS */}
      <div className="flex justify-center gap-2 my-3">
        {WORLDS.map((world) => {
          const isActive = world.id === activeWorld.id;
          return (
            <button
              key={world.id}
              onClick={() => setWorld(world.id)}
              className={`
                px-3 py-1.5 rounded-2xl text-xs font-black flex items-center gap-1.5 border-2 transition-all
                ${isActive 
                  ? 'bg-amber-400 text-slate-950 border-amber-300 scale-105 shadow-lg shadow-amber-500/20' 
                  : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:bg-slate-800'}
              `}
            >
              <span>{world.icon}</span>
              <span className="hidden sm:inline">{world.name}</span>
            </button>
          );
        })}
      </div>

      {/* CAMINO DE NIVELES (ESTILO AVENTURA) */}
      <main className="my-auto flex flex-col items-center justify-center relative py-6">
        <div className="text-center mb-6">
          <span className="text-xs font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full uppercase">
            {activeWorld.name}
          </span>
          <h2 className="text-2xl font-black text-amber-400 mt-1">Elige tu Desafío</h2>
        </div>

        {/* LISTA DE NIVELES EN SERPENTINA */}
        <div className="flex flex-col items-center gap-6 relative w-full max-w-xs">
          {Array.from({ length: activeWorld.totalLevels }).map((_, index) => {
            const levelNum = index + 1;
            const isUnlocked = levelNum <= maxUnlockedLevel;
            const isCurrent = levelNum === maxUnlockedLevel;

            // Offset alternado para simular camino en zig-zag
            const offsetX = index % 2 === 0 ? '-translate-x-10 sm:-translate-x-12' : 'translate-x-10 sm:translate-x-12';

            return (
              <div key={levelNum} className={`relative z-10 ${offsetX}`}>
                <motion.div
                  whileHover={isUnlocked ? { scale: 1.1 } : {}}
                  whileTap={isUnlocked ? { scale: 0.95 } : {}}
                >
                  <button
                    onClick={() => handleLevelClick(levelNum)}
                    disabled={!isUnlocked}
                    className={`
                      w-20 h-20 rounded-full font-black text-2xl flex flex-col items-center justify-center border-4 shadow-xl relative transition-all
                      ${isCurrent
                        ? 'bg-gradient-to-b from-amber-300 to-amber-500 border-yellow-200 text-slate-950 ring-4 ring-amber-400/40 animate-bounce'
                        : isUnlocked
                          ? 'bg-gradient-to-b from-emerald-400 to-emerald-600 border-emerald-300 text-white'
                          : 'bg-slate-800/90 border-slate-700 text-slate-500 opacity-80 cursor-not-allowed'}
                    `}
                  >
                    {isUnlocked ? (
                      <>
                        <span className="text-xl font-extrabold">{levelNum}</span>
                        <div className="flex text-[10px] gap-0.5 mt-0.5">
                          ⭐ ⭐ ⭐
                        </div>
                      </>
                    ) : (
                      <span className="text-2xl">🔒</span>
                    )}
                  </button>
                </motion.div>
              </div>
            );
          })}
        </div>
      </main>

      {/* FOOTER - VOLVER A HOME */}
      <footer className="w-full flex justify-center pt-2">
        <Button3D variant="purple" size="md" onClick={onGoHome} className="w-full max-w-xs">
          🏠 Menú Principal
        </Button3D>
      </footer>
    </div>
  );
}