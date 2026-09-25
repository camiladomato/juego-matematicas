import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore, ACHIEVEMENTS_LIST } from '../context/useGameStore';
import HeaderHUD from '../components/layout/HeaderHUD';
import Button3D from '../components/ui/Button3D';

export default function Achievements({ onBackToMenu }) {
  const unlockedAchievements = useGameStore((state) => state.unlockedAchievements);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-slate-900 text-white flex flex-col justify-between items-center p-4 max-w-2xl mx-auto select-none">
      <HeaderHUD />

      <header className="text-center mt-2 mb-3">
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-3xl sm:text-4xl font-black text-amber-400 tracking-wider flex items-center justify-center gap-2"
        >
          🏆 TROFEOS Y LOGROS
        </motion.h1>
        <p className="text-xs sm:text-sm text-blue-200 font-semibold mt-1">
          Desbloqueados: {unlockedAchievements.length} / {ACHIEVEMENTS_LIST.length}
        </p>
      </header>

      <main className="w-full bg-slate-900/60 border border-slate-700/50 rounded-3xl p-4 backdrop-blur-sm flex flex-col gap-3 my-auto overflow-y-auto max-h-[60vh]">
        {ACHIEVEMENTS_LIST.map((item) => {
          const isUnlocked = unlockedAchievements.includes(item.id);

          return (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.02 }}
              className={`flex items-center gap-4 p-3.5 rounded-2xl border-2 transition-all ${
                isUnlocked
                  ? 'bg-gradient-to-r from-amber-500/20 to-slate-900/80 border-amber-400/80 shadow-lg'
                  : 'bg-slate-950/80 border-slate-800/80 opacity-60'
              }`}
            >
              <div
                className={`text-4xl p-3 rounded-2xl border ${
                  isUnlocked
                    ? 'bg-amber-400 border-amber-300'
                    : 'bg-slate-800 border-slate-700 grayscale'
                }`}
              >
                {item.icon}
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h3 className="font-black text-sm text-amber-300">{item.title}</h3>
                  <span className="text-xs font-extrabold text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                    🪙 +{item.reward}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5 font-medium">
                  {item.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </main>

      <footer className="w-full mt-3">
        <Button3D variant="purple" size="md" onClick={onBackToMenu} className="w-full">
          🏠 Volver al Menú
        </Button3D>
      </footer>
    </div>
  );
}