import React from 'react';

export default function AchievementsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border-2 border-amber-500/40 rounded-3xl p-6 w-full max-w-md text-center text-white shadow-2xl">
        <h2 className="text-2xl font-black text-amber-400 mb-4">🏆 Logros</h2>
        <p className="text-sm text-slate-300 mb-6">¡Completá los desafíos para desbloquear trofeos!</p>
        <button
          onClick={onClose}
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-2 rounded-xl transition"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}