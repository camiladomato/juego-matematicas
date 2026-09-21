import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../context/useGameStore';
import { WORLDS } from '../data/worldsData';
import HeaderHUD from '../components/layout/HeaderHUD';
import Button3D from '../components/ui/Button3D';

export default function WorldMap({ onSelectLevel, onGoHome }) {
  const { currentWorld, setWorld, setLevel, score } = useGameStore();
  const [selectedWorldId, setSelectedWorldId] = useState(currentWorld || 'addition');

  const selectedWorld = WORLDS.find((w) => w.id === selectedWorldId) || WORLDS[0];

  const handleLevelClick = (levelNumber, isUnlocked) => {
    if (!isUnlocked) return;
    setWorld(selectedWorldId);
    setLevel(levelNumber);
    if (onSelectLevel) onSelectLevel(selectedWorldId, levelNumber);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-blue-950 to-slate-900 text-white flex flex-col justify-between p-4 max-w-2xl mx-auto select-none">
      {/* 1. CABECERA HUD */}
      <HeaderHUD />

      <main className="my-auto flex flex-col items-center w-full my-4">
        {/* TÍTULO PRINCIPAL */}
        <div className="text-center mb-6">
          <span className="text-xs font-black text-amber-400 tracking-widest uppercase bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/30">
            Mapa de Aventura
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white mt-2 tracking-wide drop-shadow-md">
            Elige tu Desafío
          </h1>
        </div>

        {/* 2. SELECCIÓN DE MUNDOS (PESTAÑAS) */}
        <div className="flex gap-2 overflow-x-auto w-full pb-2 scrollbar-none justify-center">
          {WORLDS.map((world) => {
            const isActive = world.id === selectedWorldId;
            return (
              <button
                key={world.id}
                onClick={() => setSelectedWorldId(world.id)}
                className={`
                  flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black text-sm transition-all duration-200 border-2 whitespace-nowrap
                  ${isActive 
                    ? 'bg-amber-400 text-slate-950 border-amber-300 scale-105 shadow-lg shadow-amber-500/20' 
                    : 'bg-blue-900/60 text-blue-200 border-blue-700/50 hover:bg-blue-800/80'}
                `}
              >
                <span className="text-xl">{world.icon}</span>
                <span>{world.name}</span>
              </button>
            );
          })}
        </div>

        {/* 3. TARJETA DEL MUNDO SELECCIONADO */}
        <motion.div
          key={selectedWorld.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full bg-blue-900/40 border-2 border-blue-500/30 rounded-3xl p-6 mt-4 backdrop-blur-sm"
        >
          <div className="flex items-center gap-3 mb-4 border-b border-blue-700/40 pb-3">
            <span className="text-4xl">{selectedWorld.icon}</span>
            <div>
              <h2 className="text-2xl font-black text-amber-400">{selectedWorld.name}</h2>
              <p className="text-xs text-blue-200 font-medium">{selectedWorld.description}</p>
            </div>
          </div>

          {/* GRID DE NIVELES */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mt-6">
            {selectedWorld.levels.map((lvl) => {
              // Lógica básica de desbloqueo según puntaje acumulado
              const isUnlocked = lvl.number === 1 || score >= (lvl.number - 1) * 30;

              return (
                <motion.button
                  key={lvl.number}
                  whileHover={isUnlocked ? { scale: 1.05 } : {}}
                  whileTap={isUnlocked ? { scale: 0.95 } : {}}
                  onClick={() => handleLevelClick(lvl.number, isUnlocked)}
                  className={`
                    relative aspect-square rounded-2xl flex flex-col items-center justify-center p-2 font-black border-b-4 transition-all
                    ${isUnlocked 
                      ? 'bg-gradient-to-b from-blue-500 to-blue-700 border-blue-900 text-white shadow-lg cursor-pointer' 
                      : 'bg-slate-800/80 border-slate-950 text-slate-500 cursor-not-allowed opacity-75'}
                  `}
                >
                  {isUnlocked ? (
                    <>
                      <span className="text-xs uppercase font-extrabold text-blue-200">Nivel</span>
                      <span className="text-3xl font-black">{lvl.number}</span>
                      
                      {/* Estrellas mock/ejemplo */}
                      <div className="flex gap-0.5 text-xs mt-1">
                        <span>⭐</span>
                        <span>⭐</span>
                        <span className="opacity-40 grayscale">⭐</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="text-2xl mb-1">🔒</span>
                      <span className="text-[10px] uppercase font-bold tracking-tighter text-slate-400">Bloqueado</span>
                    </>
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </main>

      {/* 4. BOTÓN DE REGRESO */}
      <footer className="w-full flex justify-center pt-4">
        <Button3D
          variant="purple"
          size="md"
          onClick={onGoHome}
          className="w-full max-w-xs"
        >
          🏠 Menú Principal
        </Button3D>
      </footer>
    </div>
  );
}