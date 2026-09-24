import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../context/useGameStore';
import Button3D from '../ui/Button3D';
import SettingsModal from '../ui/SettingsModal';
import ShopModal from '../ui/ShopModal';

export default function HeaderHUD({ onPause }) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);

  const { 
    lives = 3, 
    maxLives = 3, 
    stars = 0, 
    coins = 0, 
    streak = 0, 
    playerName = 'Jugador', 
    selectedAvatar = '🐱' 
  } = useGameStore();

  return (
    <>
      <header className="w-full max-w-xl mx-auto flex items-center justify-between bg-blue-950/80 backdrop-blur-md p-3 px-4 rounded-3xl border-2 border-blue-700/60 shadow-xl text-white">
        {/* Perfil */}
        <div className="flex items-center gap-2">
          <span className="text-2xl bg-blue-900 p-1.5 rounded-2xl border border-blue-700 shadow-inner">
            {selectedAvatar}
          </span>
          <div className="hidden sm:block text-left">
            <p className="text-xs text-blue-300 font-medium">Jugador</p>
            <p className="text-sm font-black truncate max-w-[90px]">{playerName}</p>
          </div>
        </div>

        {/* Vidas */}
        <div className="flex items-center gap-1 bg-blue-900/60 px-3 py-1.5 rounded-2xl border border-blue-800">
          {Array.from({ length: maxLives }).map((_, index) => (
            <motion.span
              key={index}
              animate={{ opacity: index < lives ? 1 : 0.25 }}
              className="text-xl sm:text-2xl select-none"
            >
              ❤️
            </motion.span>
          ))}
        </div>

        {/* Monedas, Estrellas, Tienda y Ajustes */}
        <div className="flex items-center gap-2 sm:gap-3 font-black text-sm sm:text-base">
          <button 
            onClick={() => setIsShopOpen(true)}
            className="flex items-center gap-1 text-amber-300 bg-amber-950/40 hover:bg-amber-900/60 px-2.5 py-1 rounded-xl border border-amber-600/40 transition cursor-pointer"
          >
            🪙 <span>{coins}</span>
          </button>
          
          <Button3D
            variant="amber"
            size="sm"
            onClick={() => setIsShopOpen(true)}
            className="!p-2"
          >
            🛒
          </Button3D>

          <Button3D
            variant="purple"
            size="sm"
            onClick={() => setIsSettingsOpen(true)}
            className="!p-2"
          >
            ⚙️
          </Button3D>
        </div>
      </header>

      {/* Modales */}
      <ShopModal isOpen={isShopOpen} onClose={() => setIsShopOpen(false)} />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
}