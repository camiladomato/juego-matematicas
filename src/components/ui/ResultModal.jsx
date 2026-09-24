import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { soundFx } from '../../utils/sound';
import Button3D from './Button3D';

export default function ResultModal({ isOpen, stars = 3, coinsEarned = 15, onNextLevel, onRetry, onBackToMap }) {
  useEffect(() => {
    if (isOpen) {
      soundFx.playSuccess();
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#fbbf24', '#34d399', '#60a5fa', '#a855f7'],
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.7, opacity: 0 }}
          className="w-full max-w-sm bg-slate-900 border-2 border-amber-400 rounded-3xl p-6 shadow-2xl text-white flex flex-col items-center text-center gap-5 relative overflow-hidden"
        >
          {/* TÍTULO FESTIVO */}
          <div>
            <span className="text-xs font-black bg-amber-400/20 text-amber-300 border border-amber-400/40 px-3 py-1 rounded-full uppercase tracking-widest">
              ¡Nivel Completado!
            </span>
            <h2 className="text-3xl font-black text-amber-400 mt-2">¡EXCELENTE!</h2>
          </div>

          {/* ESTRELLAS ANIMADAS */}
          <div className="flex gap-2 my-1">
            {[1, 2, 3].map((starIndex) => {
              const isEarned = starIndex <= stars;
              return (
                <motion.span
                  key={starIndex}
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: isEarned ? 1 : 0.7, rotate: 0 }}
                  transition={{ delay: starIndex * 0.2, type: 'spring' }}
                  className={`text-5xl ${isEarned ? 'opacity-100 drop-shadow-[0_0_15px_rgba(251,191,36,0.6)]' : 'opacity-20 grayscale'}`}
                >
                  ⭐
                </motion.span>
              );
            })}
          </div>

          {/* RECOMPENSAS */}
          <div className="bg-slate-800/80 border border-slate-700 w-full p-3 rounded-2xl flex justify-around items-center">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🪙</span>
              <div className="text-left">
                <p className="text-[10px] text-slate-400 uppercase font-bold">Monedas</p>
                <p className="text-lg font-black text-amber-300">+{coinsEarned}</p>
              </div>
            </div>

            <div className="h-8 w-px bg-slate-700" />

            <div className="flex items-center gap-2">
              <span className="text-2xl">⭐</span>
              <div className="text-left">
                <p className="text-[10px] text-slate-400 uppercase font-bold">Estrellas</p>
                <p className="text-lg font-black text-yellow-400">+{stars}</p>
              </div>
            </div>
          </div>

          {/* BOTONES DE ACCIÓN */}
          <div className="flex flex-col gap-2.5 w-full mt-2">
            <Button3D variant="green" size="md" onClick={onNextLevel} className="w-full">
              🚀 Siguiente Nivel
            </Button3D>

            <div className="flex gap-2 w-full">
              <Button3D variant="amber" size="sm" onClick={onRetry} className="flex-1">
                🔄 Reintentar
              </Button3D>

              <Button3D variant="purple" size="sm" onClick={onBackToMap} className="flex-1">
                🗺️ Mapa
              </Button3D>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}