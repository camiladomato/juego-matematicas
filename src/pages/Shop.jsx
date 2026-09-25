import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useGameStore } from '../context/useGameStore';
import Button3D from '../components/ui/Button3D';
import HeaderHUD from '../components/layout/HeaderHUD';
import { soundFx } from '../utils/sound';

const STORE_AVATARS = [
  { id: '🐱', name: 'Gatito', price: 0 },
  { id: '🦊', name: 'Zorrito', price: 0 },
  { id: '🐼', name: 'Panda', price: 15 },
  { id: '🦁', name: 'León', price: 30 },
  { id: '🚀', name: 'Cohete', price: 50 },
  { id: '🤖', name: 'Robot', price: 75 },
  { id: '🦄', name: 'Unicornio', price: 100 },
  { id: '🐲', name: 'Dragón', price: 150 },
];

export default function Shop({ onBackToMenu }) {
  const { coins, selectedAvatar, unlockedAvatars, setAvatar, buyAvatar } = useGameStore();
  const [message, setMessage] = useState('');
  const [lastBought, setLastBought] = useState(null);

  const handleSelectOrBuy = (item) => {
    const isUnlocked = unlockedAvatars.includes(item.id);

    if (isUnlocked) {
      setAvatar(item.id);
      soundFx.playSuccess();
      setMessage(`¡Equipaste a ${item.name}! ${item.id}`);
    } else {
      if (coins >= item.price) {
        const success = buyAvatar(item.id, item.price);
        if (success) {
          // Sonido de monedas + Confeti
          soundFx.playCoin();
          confetti({
            particleCount: 70,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#fbbf24', '#f59e0b', '#3b82f6', '#10b981'],
          });

          setLastBought(item.id);
          setMessage(`¡NUEVO PERSONAJE DESBLOQUEADO! 🎉`);

          setTimeout(() => setLastBought(null), 1000);
        }
      } else {
        soundFx.playError();
        setMessage(`Te faltan 🪙 ${item.price - coins} monedas.`);
      }
    }

    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-slate-900 text-white flex flex-col justify-between items-center p-4 max-w-2xl mx-auto select-none">
      {/* HUD SUPERIOR */}
      <HeaderHUD />

      {/* ENCABEZADO TIENDA */}
      <header className="text-center mt-2 mb-2">
        <motion.h1 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-3xl sm:text-4xl font-black text-amber-400 tracking-wider flex items-center justify-center gap-2 drop-shadow-md"
        >
          🛒 TIENDA DE SKINS
        </motion.h1>
        <p className="text-xs sm:text-sm text-blue-200 font-semibold mt-1">
          ¡Usa tus monedas para desbloquear nuevos personajes!
        </p>
      </header>

      {/* NOTIFICACIÓN CON ANIMACIÓN */}
      <div className="h-10 flex items-center justify-center my-1">
        <AnimatePresence mode="wait">
          {message && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: -10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.5, opacity: 0, y: 10 }}
              className="bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-xs sm:text-sm px-5 py-1.5 rounded-full shadow-lg border border-amber-200 text-center flex items-center gap-2"
            >
              <span>{message}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* GRILLA DE AVATARES */}
      <main className="w-full bg-slate-900/60 border border-slate-700/50 rounded-3xl p-4 backdrop-blur-sm grid grid-cols-2 sm:grid-cols-4 gap-3 my-auto overflow-y-auto max-h-[58vh]">
        {STORE_AVATARS.map((item) => {
          const isUnlocked = unlockedAvatars.includes(item.id);
          const isSelected = selectedAvatar === item.id;
          const canAfford = coins >= item.price;
          const isJustBought = lastBought === item.id;

          return (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              animate={
                isJustBought 
                  ? { scale: [1, 1.25, 1], rotate: [0, 10, -10, 0] } 
                  : isSelected 
                  ? { y: [0, -4, 0] } 
                  : {}
              }
              transition={
                isSelected && !isJustBought 
                  ? { repeat: Infinity, duration: 2.5, ease: 'easeInOut' } 
                  : { duration: 0.3 }
              }
              onClick={() => handleSelectOrBuy(item)}
              className={`
                flex flex-col items-center justify-between p-3 rounded-2xl border-2 cursor-pointer transition-all relative overflow-hidden
                ${isSelected 
                  ? 'bg-gradient-to-b from-amber-500/20 to-indigo-900/40 border-amber-400 shadow-xl shadow-amber-500/20' 
                  : isUnlocked 
                    ? 'bg-slate-800/80 border-slate-600 hover:border-slate-400' 
                    : 'bg-slate-950/80 border-slate-800/80 opacity-90'}
              `}
            >
              {/* DESTELLO DE FONDO PARA EL SELECCIONADO */}
              {isSelected && (
                <div className="absolute inset-0 bg-amber-400/10 blur-xl rounded-full pointer-events-none" />
              )}

              {/* BADGE EQUIPADO */}
              {isSelected && (
                <span className="absolute -top-1 bg-amber-400 text-slate-950 text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-md z-10">
                  Usando
                </span>
              )}

              {/* EMOJI DE AVATAR */}
              <span 
                className={`text-5xl my-2 select-none transition-all duration-300 ${
                  !isUnlocked ? 'filter grayscale opacity-50 contrast-125' : ''
                }`}
              >
                {item.id}
              </span>

              {/* NOMBRE */}
              <span className="text-xs font-bold text-slate-200 mb-2 relative z-10">
                {item.name}
              </span>

              {/* BOTÓN O PRECIO */}
              {isUnlocked ? (
                <span 
                  className={`text-[11px] font-black px-3 py-1 rounded-xl w-full text-center transition-colors relative z-10 ${
                    isSelected 
                      ? 'bg-amber-400 text-slate-950 shadow' 
                      : 'bg-slate-700/80 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {isSelected ? 'EQUIPADO' : 'USAR'}
                </span>
              ) : (
                <span 
                  className={`text-[11px] font-black px-3 py-1 rounded-xl w-full text-center flex items-center justify-center gap-1 transition-all relative z-10 ${
                    canAfford 
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black shadow-md animate-pulse' 
                      : 'bg-slate-800 text-slate-500 border border-slate-700'
                  }`}
                >
                  🪙 {item.price}
                </span>
              )}
            </motion.div>
          );
        })}
      </main>

      {/* BOTÓN VOLVER */}
      <footer className="w-full mt-3">
        <Button3D variant="purple" size="md" onClick={onBackToMenu} className="w-full">
          🏠 Volver al Menú
        </Button3D>
      </footer>
    </div>
  );
}