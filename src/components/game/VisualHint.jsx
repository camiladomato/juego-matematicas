import React from 'react';
import { motion } from 'framer-motion';

// Iconos/Emojis amigables para representar las cantidades
const HINT_ICONS = ['⭐', '🍎', '🍪', '🚀', '🎨', '🐱'];

export default function VisualHint({ num1, num2, operator }) {
  // Seleccionar un icono constante o basado en los números
  const icon = HINT_ICONS[(num1 + num2) % HINT_ICONS.length];

  // Caso: Multiplicación (ej: 3 x 4 -> 3 grupos de 4 objetos)
  if (operator === '×') {
    return (
      <div className="w-full bg-blue-900/80 p-4 rounded-3xl border-2 border-blue-600/60 my-4 text-center">
        <p className="text-xs font-bold text-blue-200 mb-3 uppercase tracking-wider">
          💡 Pista: {num1} {num1 === 1 ? 'grupo' : 'grupos'} de {num2}
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          {Array.from({ length: num1 }).map((_, groupIndex) => (
            <motion.div
              key={groupIndex}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: groupIndex * 0.1, type: 'spring' }}
              className="bg-blue-950/70 p-2.5 rounded-2xl border border-blue-500/40 flex gap-1.5 justify-center shadow-inner"
            >
              {Array.from({ length: num2 }).map((_, itemIndex) => (
                <span key={itemIndex} className="text-2xl sm:text-3xl select-none animate-pulse">
                  {icon}
                </span>
              ))}
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // Caso: Suma (ej: 3 + 4 -> 3 objetos + 4 objetos)
  if (operator === '+') {
    return (
      <div className="w-full bg-blue-900/80 p-4 rounded-3xl border-2 border-blue-600/60 my-4 text-center">
        <p className="text-xs font-bold text-blue-200 mb-3 uppercase tracking-wider">
          💡 Pista: Junta todos los elementos
        </p>

        <div className="flex items-center justify-center gap-2 flex-wrap">
          {/* Primer grupo */}
          <div className="bg-blue-950/70 p-2 rounded-2xl border border-blue-500/40 flex gap-1">
            {Array.from({ length: num1 }).map((_, i) => (
              <span key={i} className="text-2xl select-none">{icon}</span>
            ))}
          </div>

          <span className="text-2xl font-black text-amber-400">+</span>

          {/* Segundo grupo */}
          <div className="bg-blue-950/70 p-2 rounded-2xl border border-blue-500/40 flex gap-1">
            {Array.from({ length: num2 }).map((_, i) => (
              <span key={i} className="text-2xl select-none">{icon}</span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Por defecto (si es resta o división)
  return (
    <div className="w-full bg-blue-900/80 p-3 rounded-2xl border border-blue-600/60 my-4 text-center text-sm text-blue-200">
      💡 Piensa en repartir o quitar cantidades en partes iguales.
    </div>
  );
}