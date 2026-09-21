import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../context/useGameStore';

export default function HeaderHUD({ onPause }) {
  // Extraemos datos del estado global de Zustand
  const { lives, maxLives, stars, coins, streak, playerName, selectedAvatar } = useGameStore();

  return (
    <header className="w-full max-w-xl mx-auto flex items-center justify-between bg-blue-950/80 backdrop-blur-md p-3 px-4 rounded-3xl border-2 border-blue-700/60 shadow-xl text-white">
      {/* Perfil del Niño */}
      <div className="flex items-center gap-2">
        <span className="text-2xl bg-blue-900 p-1.5 rounded-2xl border border-blue-700 shadow-inner">
          {selectedAvatar}
        </span>
        <div className="hidden sm:block text-left">
          <p className="text-xs text-blue-300 font-medium">Jugador</p>
          <p className="text-sm font-black truncate max-w-[90px]">{playerName}</p>
        </div>
      </div>

      {/* Vidas con Animación */}
      <div className="flex items-center gap-1 bg-blue-900/60 px-3 py-1.5 rounded-2xl border border-blue-800">
        {Array.from({ length: maxLives }).map((_, index) => {
          const isAlive = index < lives;
          return (
            <motion.span
              key={index}
              initial={{ scale: 1 }}
              animate={{
                scale: isAlive ? [1, 1.2, 1] : 0.8,
                opacity: isAlive ? 1 : 0.25,
              }}
              transition={{ duration: 0.3 }}
              className="text-xl sm:text-2xl select-none"
            >
              ❤️
            </motion.span>
          );
        })}
      </div>

      {/* Racha (Solo aparece si la racha es >= 3) */}
      <AnimatePresence>
        {streak >= 3 && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="flex items-center gap-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-xs sm:text-sm px-3 py-1 rounded-full shadow-md animate-pulse"
          >
            🔥 {streak}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Monedas y Estrellas */}
      <div className="flex items-center gap-3 font-black text-sm sm:text-base">
        <div className="flex items-center gap-1 text-amber-300 bg-amber-950/40 px-2.5 py-1 rounded-xl border border-amber-600/40">
          🪙 <span>{coins}</span>
        </div>
        <div className="flex items-center gap-1 text-yellow-400 bg-yellow-950/40 px-2.5 py-1 rounded-xl border border-yellow-600/40">
          ⭐ <span>{stars}</span>
        </div>
      </div>
    </header>
  );
}