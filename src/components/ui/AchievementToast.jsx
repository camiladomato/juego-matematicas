import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useGameStore } from '../../context/useGameStore';
import { soundFx } from '../../utils/sound';

export default function AchievementToast() {
  const recentlyUnlocked = useGameStore((state) => state.recentlyUnlockedAchievement);
  const clearRecentAchievement = useGameStore((state) => state.clearRecentAchievement);

  useEffect(() => {
    if (recentlyUnlocked) {
      soundFx.playSuccess();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.2 },
      });

      const timer = setTimeout(() => {
        clearRecentAchievement();
      }, 3500);

      return () => clearTimeout(timer);
    }
  }, [recentlyUnlocked, clearRecentAchievement]);

  return (
    <AnimatePresence>
      {recentlyUnlocked && (
        <motion.div
          initial={{ y: -100, opacity: 0, scale: 0.8 }}
          animate={{ y: 20, opacity: 1, scale: 1 }}
          exit={{ y: -100, opacity: 0, scale: 0.8 }}
          className="fixed top-0 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 text-slate-950 px-5 py-3 rounded-3xl shadow-2xl border-4 border-white flex items-center gap-3 select-none max-w-sm w-[90%]"
        >
          <div className="text-4xl bg-white/40 p-2 rounded-2xl shadow-inner">
            {recentlyUnlocked.icon}
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-800 block">
              🏆 ¡LOGRO DESBLOQUEADO!
            </span>
            <h4 className="font-black text-base text-slate-950 leading-tight">
              {recentlyUnlocked.title}
            </h4>
            <p className="text-xs font-bold text-slate-800">
              +{recentlyUnlocked.reward} Monedas
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}