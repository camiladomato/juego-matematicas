import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore, PLAYER_NAME_MAX } from '../context/useGameStore';
import Button3D from '../components/ui/Button3D';
import HeaderHUD from '../components/layout/HeaderHUD';

export default function Home({
  onStartGame,
  onStartTimeAttack,
  onOpenShop,
  onOpenAchievements,
}) {
  const { selectedAvatar, playerName, confirmPlayerName } = useGameStore();

  // Guarda al salir del campo; si el nombre no es válido, vuelve al anterior
  const handleNameBlur = (e) => {
    const trimmed = e.target.value.trim();
    if (trimmed === playerName || !confirmPlayerName(trimmed)) e.target.value = playerName;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-slate-900 text-white flex flex-col justify-between items-center p-4 max-w-2xl mx-auto select-none">
      {/* HUD SUPERIOR */}
      <HeaderHUD />

      {/* TÍTULO Y LOGO */}
      <header className="text-center mt-4">
        <motion.h1
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="text-4xl sm:text-5xl font-black text-amber-400 tracking-wider drop-shadow-lg"
        >
          MATE AVENTURA
        </motion.h1>
        <p className="text-xs sm:text-sm text-blue-200 font-bold mt-1">
          ¡Aprende matemáticas jugando y divirtiéndote!
        </p>
      </header>

      {/* CONTENEDOR CENTRAL / AVATAR */}
      <main className="flex flex-col items-center justify-center my-auto w-full gap-4">
        {/* AVATAR PRINCIPAL CON ANIMACIÓN */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          className="relative flex items-center justify-center"
        >
          <div className="absolute w-36 h-36 bg-amber-400/20 rounded-full blur-xl pointer-events-none" />
          <span className="text-8xl sm:text-9xl relative z-10 drop-shadow-2xl">
            {selectedAvatar}
          </span>
        </motion.div>

        {/* NOMBRE DEL JUGADOR */}
        <div className="flex flex-col items-center gap-1 w-full max-w-xs">
          <input
            key={playerName}
            type="text"
            defaultValue={playerName}
            onBlur={handleNameBlur}
            onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
            maxLength={PLAYER_NAME_MAX}
            placeholder="Tu nombre"
            className="w-full text-center bg-slate-900/80 border-2 border-slate-700 focus:border-amber-400 rounded-2xl py-2 px-4 font-black text-amber-300 placeholder-slate-500 outline-none transition-all shadow-inner text-lg"
          />
        </div>
      </main>

      {/* BOTONES DE MENÚ */}
      <footer className="w-full flex flex-col gap-3 mb-2">
        <Button3D variant="green" size="lg" onClick={onStartGame} className="w-full">
          🗺️ JUGAR MUNDOS
        </Button3D>

        <Button3D
          variant="amber"
          size="md"
          onClick={onStartTimeAttack}
          className="w-full"
        >
          ⚡ CONTRA RELOJ
        </Button3D>

        <div className="grid grid-cols-2 gap-3">
          <Button3D variant="blue" size="md" onClick={onOpenShop}>
            🛒 TIENDA
          </Button3D>

          <Button3D variant="purple" size="md" onClick={onOpenAchievements}>
            🏆 TROFEOS
          </Button3D>
        </div>
      </footer>
    </div>
  );
}