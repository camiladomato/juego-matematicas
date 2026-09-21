import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../context/useGameStore';
import Button3D from '../components/ui/Button3D';

// Avatares disponibles para elegir
const AVATARS = ['🐱', '🦊', '🐼', '🦁', '🚀', '🤖', '🦄', '🐲'];

export default function Home({ onStartGame }) {
  const { score, currentWorld } = useGameStore();
  const [selectedAvatar, setSelectedAvatar] = useState('🐱');

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-blue-900 to-slate-900 text-white flex flex-col justify-between items-center p-6 max-w-2xl mx-auto select-none overflow-hidden">
      {/* 1. LOGO / TÍTULO ANIMADO */}
      <header className="flex flex-col items-center text-center mt-8">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 120 }}
          className="relative inline-block mb-2"
        >
          <span className="text-xs font-black bg-amber-400 text-slate-950 px-4 py-1 rounded-full uppercase tracking-widest shadow-md">
            ¡Aventura Numérica!
          </span>
        </motion.div>

        <motion.h1
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="text-5xl sm:text-6xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-400 drop-shadow-lg"
        >
          MATE AVENTURA
        </motion.h1>

        <p className="text-blue-200 text-sm font-semibold mt-2">
          ¡Aprende, juega y domina las matemáticas! 🚀
        </p>
      </header>

      {/* 2. SELECCIÓN DE AVATAR & MONEDAS */}
      <main className="w-full flex flex-col items-center my-auto">
        {/* Monedas acumuladas */}
        <div className="bg-blue-950/80 px-5 py-2 rounded-2xl border border-blue-500/40 flex items-center gap-2 mb-6 shadow-inner">
          <span className="text-2xl">🪙</span>
          <span className="text-amber-400 font-black text-xl">{score}</span>
          <span className="text-xs text-blue-300 font-bold uppercase tracking-wider">Monedas</span>
        </div>

        {/* Avatar Activo Animado */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          className="bg-gradient-to-b from-blue-600 to-indigo-800 p-6 rounded-full border-4 border-amber-400 shadow-2xl mb-6 relative"
        >
          <span className="text-7xl sm:text-8xl select-none">{selectedAvatar}</span>
          <div className="absolute -bottom-2 bg-amber-400 text-slate-950 font-black text-xs px-3 py-0.5 rounded-full shadow">
            Tu Avatar
          </div>
        </motion.div>

        {/* Selector de Avatares */}
        <div className="w-full bg-blue-900/40 border border-blue-600/30 p-4 rounded-3xl backdrop-blur-sm">
          <p className="text-xs font-bold text-center text-blue-200 uppercase tracking-wider mb-3">
            Elige tu personaje favorito:
          </p>

          <div className="flex justify-center flex-wrap gap-2 sm:gap-3">
            {AVATARS.map((avatar) => {
              const isSelected = selectedAvatar === avatar;
              return (
                <button
                  key={avatar}
                  onClick={() => setSelectedAvatar(avatar)}
                  className={`
                    text-3xl p-2.5 rounded-2xl transition-all duration-200 border-2
                    ${isSelected
                      ? 'bg-amber-400 border-amber-300 scale-110 shadow-lg shadow-amber-500/30'
                      : 'bg-blue-950/60 border-blue-700/50 hover:bg-blue-800/60'}
                  `}
                >
                  {avatar}
                </button>
              );
            })}
          </div>
        </div>
      </main>

      {/* 3. BOTÓN PRINCIPAL DE INICIO */}
      <footer className="w-full flex flex-col items-center gap-3 mb-4">
        <Button3D
          variant="green"
          size="lg"
          onClick={onStartGame}
          className="w-full text-2xl py-5 shadow-emerald-950"
        >
          🎮 ¡JUGAR AHORA!
        </Button3D>
      </footer>
    </div>
  );
}