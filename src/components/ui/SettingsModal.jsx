import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundFx } from '../../utils/sound';
import { useGameStore } from '../../context/useGameStore';
import Button3D from './Button3D';

export default function SettingsModal({ isOpen, onClose }) {
  const { resetGame } = useGameStore();
  const [isMuted, setIsMuted] = useState(soundFx.muted);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  if (!isOpen) return null;

  const handleToggleMute = () => {
    const mutedState = soundFx.toggleMute();
    setIsMuted(mutedState);
  };

  const handleResetProgress = () => {
    resetGame();
    setShowConfirmReset(false);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="w-full max-w-sm bg-slate-900 border-2 border-indigo-500/40 rounded-3xl p-6 shadow-2xl text-white flex flex-col gap-6 relative"
        >
          {/* Cabecera */}
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="text-2xl font-black text-amber-400 flex items-center gap-2">
              ⚙️ Ajustes
            </h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white font-bold text-xl px-2 py-1 rounded-lg hover:bg-slate-800 transition"
            >
              ✕
            </button>
          </div>

          {/* Opciones de Configuración */}
          <div className="flex flex-col gap-4">
            {/* Opción Sonido */}
            <div className="flex items-center justify-between bg-slate-800/60 p-4 rounded-2xl border border-slate-700/50">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{isMuted ? '🔇' : '🔊'}</span>
                <div>
                  <p className="font-bold text-sm">Efectos de sonido</p>
                  <p className="text-xs text-slate-400">
                    {isMuted ? 'Audio desactivado' : 'Audio activado'}
                  </p>
                </div>
              </div>

              <Button3D
                variant={isMuted ? 'red' : 'green'}
                size="sm"
                onClick={handleToggleMute}
              >
                {isMuted ? 'Activar' : 'Silenciar'}
              </Button3D>
            </div>

            {/* Opción Reiniciar Progreso */}
            <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/50 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🔄</span>
                <div>
                  <p className="font-bold text-sm">Reiniciar progreso</p>
                  <p className="text-xs text-slate-400">
                    Restablece puntos, vidas y niveles.
                  </p>
                </div>
              </div>

              {!showConfirmReset ? (
                <Button3D
                  variant="amber"
                  size="sm"
                  onClick={() => setShowConfirmReset(true)}
                  className="w-full"
                >
                  Reiniciar partida
                </Button3D>
              ) : (
                <div className="flex flex-col gap-2 pt-2 border-t border-slate-700">
                  <p className="text-xs font-semibold text-rose-400 text-center">
                    ¿Estás seguro/a de borrar el progreso?
                  </p>
                  <div className="flex gap-2">
                    <Button3D
                      variant="red"
                      size="sm"
                      onClick={handleResetProgress}
                      className="flex-1"
                    >
                      Sí, borrar
                    </Button3D>
                    <Button3D
                      variant="purple"
                      size="sm"
                      onClick={() => setShowConfirmReset(false)}
                      className="flex-1"
                    >
                      Cancelar
                    </Button3D>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Botón Cerrar */}
          <Button3D variant="purple" size="md" onClick={onClose} className="w-full">
            Listo
          </Button3D>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}