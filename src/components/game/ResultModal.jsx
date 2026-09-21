import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import Button3D from '../ui/Button3D';

export default function ResultModal({ isOpen, isSuccess, stars = 3, score = 0, onNextLevel, onRetry, onHome }) {
  // Disparar confeti cuando el niño completa con éxito el nivel
  useEffect(() => {
    if (isOpen && isSuccess) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#facc15', '#4ade80', '#60a5fa', '#f472b6', '#a78bfa']
      });
    }
  }, [isOpen, isSuccess]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm select-none">
        <motion.div
          initial={{ scale: 0.7, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.7, opacity: 0 }}
          className={`
            w-full max-w-md rounded-3xl p-6 sm:p-8 text-center shadow-2xl border-b-8 relative overflow-hidden
            ${isSuccess 
              ? 'bg-gradient-to-b from-blue-900 via-indigo-900 to-slate-900 border-amber-400 text-white' 
              : 'bg-gradient-to-b from-slate-900 via-rose-950 to-slate-900 border-rose-500 text-white'}
          `}
        >
          {/* Banner superior */}
          <div className="text-6xl mb-2">
            {isSuccess ? '🏆' : '💔'}
          </div>

          <h2 className="text-3xl sm:text-4xl font-black mb-1 tracking-wide">
            {isSuccess ? '¡Nivel Completado!' : '¡Agotaste las vidas!'}
          </h2>

          <p className="text-sm font-semibold text-slate-300 mb-6">
            {isSuccess 
              ? '¡Lo hiciste genial! Sigue así para ser un maestro de los números.' 
              : '¡No te rindas! Practicar te volverá cada vez más rápido y fuerte.'}
          </p>

          {/* Mostrar Estrellas si tuvo éxito */}
          {isSuccess && (
            <div className="flex justify-center gap-3 my-6">
              {[1, 2, 3].map((starIndex) => (
                <motion.span
                  key={starIndex}
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: starIndex <= stars ? 1 : 0.8, rotate: 0 }}
                  transition={{ delay: 0.2 + starIndex * 0.15, type: 'spring' }}
                  className={`text-5xl sm:text-6xl filter drop-shadow-md ${
                    starIndex <= stars ? 'opacity-100 grayscale-0' : 'opacity-30 grayscale'
                  }`}
                >
                  ⭐
                </motion.span>
              ))}
            </div>
          )}

          {/* Resumen de Puntos */}
          {isSuccess && (
            <div className="bg-blue-950/70 p-3 rounded-2xl border border-blue-600/40 mb-6 flex justify-around items-center">
              <div>
                <span className="text-xs uppercase text-blue-300 font-bold block">Puntos</span>
                <span className="text-2xl font-black text-amber-400">+{score}</span>
              </div>
              <div className="h-8 w-px bg-blue-700/50" />
              <div>
                <span className="text-xs uppercase text-blue-300 font-bold block">Estrellas</span>
                <span className="text-2xl font-black text-amber-400">{stars} / 3</span>
              </div>
            </div>
          )}

          {/* Botones de Acción */}
          <div className="flex flex-col gap-3 mt-4">
            {isSuccess ? (
              <Button3D
                variant="green"
                size="lg"
                onClick={onNextLevel}
                className="w-full text-xl py-4"
              >
                🚀 Siguiente Nivel
              </Button3D>
            ) : (
              <Button3D
                variant="red"
                size="lg"
                onClick={onRetry}
                className="w-full text-xl py-4"
              >
                🔄 Intentar de nuevo
              </Button3D>
            )}

            <Button3D
              variant="blue"
              size="sm"
              onClick={onHome}
              className="w-full mt-1"
            >
              🗺️ Volver al Mapa de Mundos
            </Button3D>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}