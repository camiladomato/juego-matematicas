import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../context/useGameStore';
import { soundFx } from '../../utils/sound';
import Button3D from './Button3D';

// Catálogo de avatares disponibles en la tienda con su precio
const SHOP_ITEMS = [
  { id: '🐼', name: 'Oso Panda', cost: 30 },
  { id: '🦁', name: 'León Rey', cost: 50 },
  { id: '🚀', name: 'Cohete Espacial', cost: 75 },
  { id: '🤖', name: 'Súper Robot', cost: 100 },
  { id: '🦄', name: 'Unicornio Mágico', cost: 125 },
  { id: '🐲', name: 'Dragón de Fuego', cost: 150 },
  { id: '👑', name: 'Corona Real', cost: 200 },
];

export default function ShopModal({ isOpen, onClose }) {
  const { coins, unlockedAvatars = ['🐱', '🦊'], selectedAvatar, buyAvatar, setAvatar } = useGameStore();

  if (!isOpen) return null;

  const handleBuyOrEquip = (item) => {
    const isUnlocked = unlockedAvatars.includes(item.id);

    if (isUnlocked) {
      soundFx.playClick();
      setAvatar(item.id);
    } else {
      if (coins >= item.cost) {
        soundFx.playSuccess();
        buyAvatar(item.id, item.cost);
      } else {
        soundFx.playError();
      }
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="w-full max-w-md bg-slate-900 border-2 border-amber-500/50 rounded-3xl p-5 shadow-2xl text-white flex flex-col gap-4 relative max-h-[90vh] overflow-hidden"
        >
          {/* CABECERA TIENDA */}
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-3xl">🛒</span>
              <div>
                <h3 className="text-xl font-black text-amber-400">Tienda Mágica</h3>
                <p className="text-xs text-slate-400">¡Canjea tus monedas!</p>
              </div>
            </div>

            {/* Saldo de Monedas */}
            <div className="flex items-center gap-1.5 bg-amber-950/60 border border-amber-500/40 px-3 py-1.5 rounded-2xl text-amber-300 font-black text-sm">
              🪙 <span>{coins}</span>
            </div>
          </div>

          {/* LISTA DE ARTÍCULOS */}
          <div className="grid grid-cols-2 gap-3 overflow-y-auto pr-1 py-1 max-h-[55vh]">
            {SHOP_ITEMS.map((item) => {
              const isUnlocked = unlockedAvatars.includes(item.id);
              const isEquipped = selectedAvatar === item.id;
              const canAfford = coins >= item.cost;

              return (
                <div
                  key={item.id}
                  className={`
                    p-3 rounded-2xl border-2 flex flex-col items-center justify-between gap-2 transition-all relative
                    ${isEquipped 
                      ? 'bg-amber-400/20 border-amber-400' 
                      : isUnlocked 
                        ? 'bg-slate-800/80 border-slate-700' 
                        : 'bg-slate-950/60 border-slate-800'}
                  `}
                >
                  <span className="text-4xl my-1 select-none">{item.id}</span>
                  <span className="text-xs font-bold text-center text-slate-200">{item.name}</span>

                  {isEquipped ? (
                    <span className="text-[10px] font-black bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full uppercase">
                      Equipado
                    </span>
                  ) : isUnlocked ? (
                    <Button3D
                      variant="blue"
                      size="sm"
                      onClick={() => handleBuyOrEquip(item)}
                      className="w-full text-xs !py-1"
                    >
                      Usar
                    </Button3D>
                  ) : (
                    <Button3D
                      variant={canAfford ? 'amber' : 'red'}
                      size="sm"
                      onClick={() => handleBuyOrEquip(item)}
                      disabled={!canAfford}
                      className="w-full text-xs !py-1 flex items-center justify-center gap-1"
                    >
                      🪙 {item.cost}
                    </Button3D>
                  )}
                </div>
              );
            })}
          </div>

          {/* BOTÓN CERRAR */}
          <Button3D variant="purple" size="md" onClick={onClose} className="w-full mt-2">
            Volver a jugar
          </Button3D>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}