import React, { useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { soundFx } from '../../utils/sound';
import {
  useGameStore,
  isValidPlayerName,
  PLAYER_NAME_MIN,
  PLAYER_NAME_MAX,
} from '../../context/useGameStore';
import Button3D from './Button3D';

// Modal obligatorio para jugadores nuevos: no se puede cerrar sin elegir un nombre
export default function WelcomeModal() {
  const selectedAvatar = useGameStore((state) => state.selectedAvatar);
  const confirmPlayerName = useGameStore((state) => state.confirmPlayerName);
  const [name, setName] = useState('');

  const isValid = isValidPlayerName(name);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!confirmPlayerName(name)) {
      soundFx.playError();
      return;
    }

    soundFx.playSuccess();
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-title"
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
        className="w-full max-w-sm bg-gradient-to-b from-indigo-900 via-purple-900 to-slate-900 border-2 border-amber-400 rounded-3xl p-6 shadow-2xl text-white flex flex-col items-center text-center gap-5 select-none"
      >
        {/* AVATAR */}
        <motion.span
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
          className="text-7xl drop-shadow-2xl"
        >
          {selectedAvatar}
        </motion.span>

        {/* TÍTULO */}
        <div>
          <h2 id="welcome-title" className="text-2xl sm:text-3xl font-black text-amber-400 tracking-wide">
            ¡Bienvenido a Mate Aventura!
          </h2>
          <p className="text-sm text-blue-200 font-bold mt-1">
            ¿Cómo te llamas, aventurero?
          </p>
        </div>

        {/* FORMULARIO */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={PLAYER_NAME_MAX}
            placeholder="Escribe tu nombre"
            aria-label="Tu nombre"
            autoFocus
            autoComplete="off"
            className="w-full text-center bg-slate-900/80 border-2 border-slate-700 focus:border-amber-400 rounded-2xl py-3 px-4 font-black text-amber-300 placeholder-slate-500 outline-none transition-all shadow-inner text-xl select-text"
          />
          <p className={`text-xs font-bold ${isValid || name === '' ? 'text-slate-400' : 'text-rose-400'}`}>
            Entre {PLAYER_NAME_MIN} y {PLAYER_NAME_MAX} letras
          </p>

          <Button3D type="submit" variant="green" size="lg" disabled={!isValid} className="w-full">
            ¡Empezar aventura! 🚀
          </Button3D>
        </form>
      </motion.div>
    </div>
  );
}
