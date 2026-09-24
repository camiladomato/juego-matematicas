import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../context/useGameStore';
import HeaderHUD from '../components/layout/HeaderHUD';
import Button3D from '../components/ui/Button3D';

const AVATARS = ['🐱', '🦊', '🐼', '🦁', '🚀', '🤖', '🦄', '🐲'];

export default function Home({ onStartGame }) {
  const { playerName, setPlayerName, selectedAvatar, setAvatar } = useGameStore();
  const [localName, setLocalName] = useState(playerName || '');
  const [activeAvatar, setActiveAvatar] = useState(selectedAvatar || '🐱');

  const handleNameChange = (e) => {
    const newName = e.target.value;
    setLocalName(newName);
    if (setPlayerName) {
      setPlayerName(newName.trim() || 'Jugador');
    }
  };

  const handleSelectAvatar = (avatar) => {
    setActiveAvatar(avatar);
    if (setAvatar) {
      setAvatar(avatar);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-blue-900 to-slate-900 text-white flex flex-col justify-between items-center p-4 max-w-2xl mx-auto select-none overflow-hidden">
      {/* 1. BARRA SUPERIOR (HEADER HUD) */}
      <HeaderHUD />

      {/* 2. LOGO Y TÍTULO PRINCIPAL */}
      <header className="flex flex-col items-center text-center mt-2">
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 120 }}
          className="relative inline-block mb-1"
        >
          <span className="text-xs font-black bg-amber-400 text-slate-950 px-4 py-1 rounded-full uppercase tracking-widest shadow-md">
            ¡Aventura Numérica!
          </span>
        </motion.div>

        <motion.h1
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: 'spring' }}
          className="text-4xl sm:text-5xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-400 drop-shadow-lg"
        >
          MATE AVENTURA
        </motion.h1>

        <p className="text-blue-200 text-xs sm:text-sm font-semibold mt-1">
          ¡Aprende, juega y domina las matemáticas! 🚀
        </p>
      </header>

      {/* 3. AVATAR GRANDE, NOMBRE Y SELECTOR */}
      <main className="w-full flex flex-col items-center my-auto gap-4">
        {/* AVATAR ACTIVO ANIMADO (GRANDE) */}
        <motion.div
          key={activeAvatar}
          initial={{ scale: 0.8, rotate: -10 }}
          animate={{ scale: 1, rotate: 0, y: [0, -8, 0] }}
          transition={{ 
            y: { repeat: Infinity, duration: 3, ease: 'easeInOut' },
            scale: { type: 'spring', stiffness: 300 }
          }}
          className="bg-gradient-to-b from-blue-600 to-indigo-800 p-5 rounded-full border-4 border-amber-400 shadow-2xl relative"
        >
          <span className="text-6xl sm:text-7xl select-none">{activeAvatar}</span>
          <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 font-black text-[10px] px-3 py-0.5 rounded-full shadow whitespace-nowrap uppercase tracking-wider">
            Tu Avatar
          </div>
        </motion.div>

        {/* INPUT NOMBRE DEL JUGADOR */}
        <div className="w-full max-w-xs bg-blue-950/80 p-3 rounded-2xl border-2 border-blue-600/50 shadow-lg text-center mt-1">
          <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-1">
            ¿Cómo te llamas?
          </label>
          <input
            type="text"
            value={localName}
            onChange={handleNameChange}
            placeholder="Escribe tu nombre..."
            maxLength={12}
            className="w-full bg-slate-900/90 text-amber-300 font-black text-center text-base py-1.5 px-3 rounded-xl border border-blue-700 focus:outline-none focus:border-amber-400 transition placeholder:text-slate-500"
          />
        </div>

        {/* SELECTOR DE AVATARES */}
        <div className="w-full bg-blue-900/40 border border-blue-600/30 p-3 rounded-3xl backdrop-blur-sm text-center">
          <p className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-2">
            Elige tu personaje:
          </p>

          <div className="flex justify-center flex-wrap gap-2">
            {AVATARS.map((avatar) => {
              const isSelected = activeAvatar === avatar;
              return (
                <button
                  key={avatar}
                  onClick={() => handleSelectAvatar(avatar)}
                  className={`
                    text-2xl p-2 rounded-2xl transition-all border-2
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

      {/* 4. BOTÓN DE JUGAR */}
      <footer className="w-full flex justify-center mb-2">
        <Button3D
          variant="green"
          size="lg"
          onClick={onStartGame}
          className="w-full text-xl py-4"
        >
          🎮 ¡JUGAR AHORA!
        </Button3D>
      </footer>
    </div>
  );
}