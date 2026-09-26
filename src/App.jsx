import React, { useState, useEffect } from 'react';
import { initAuth } from './config/firebase';
import { useGameStore } from './context/useGameStore';

// PÁGINAS Y MÓDULOS
import Home from './pages/Home';
import WorldMap from './pages/WorldMap';
import Gameplay from './pages/Gameplay';
import TimeAttack from './pages/TimeAttack';
import ShopModal from './components/ui/ShopModal';
import AchievementsModal from './components/ui/AchievementsModal';
import AchievementToast from './components/ui/AchievementToast';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home'); // 'home' | 'worldMap' | 'gameplay' | 'timeAttack'
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Inicializar Firebase Auth y rehidratar estado desde la nube
  useEffect(() => {
    const unsubscribe = initAuth(async (user) => {
      try {
        if (useGameStore.persist && typeof useGameStore.persist.rehydrate === 'function') {
          await useGameStore.persist.rehydrate();
        }
      } catch (error) {
        console.error('Error al rehidratar el estado:', error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-slate-900 text-white flex flex-col items-center justify-center font-bold gap-4 select-none">
        <div className="text-6xl animate-spin">🧩</div>
        <p className="text-amber-400 text-lg tracking-wide">Cargando aventura desde la nube... ☁️</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-amber-400 selection:text-slate-900 font-sans">
      {/* NOTIFICADOR DE LOGROS FLOTANTE */}
      <AchievementToast />

      {/* ENRUTADO DE PANTALLAS PRINCIPALES */}
      {currentScreen === 'home' && (
        <Home
          onStartGame={() => setCurrentScreen('worldMap')}
          onStartTimeAttack={() => setCurrentScreen('timeAttack')}
          onOpenShop={() => setIsShopOpen(true)}
          onOpenAchievements={() => setIsAchievementsOpen(true)}
        />
      )}

      {currentScreen === 'worldMap' && (
        <WorldMap
          onSelectLevel={() => setCurrentScreen('gameplay')}
          onBackToMenu={() => setCurrentScreen('home')}
        />
      )}

      {currentScreen === 'gameplay' && (
        <Gameplay
          onBackToMap={() => setCurrentScreen('worldMap')}
        />
      )}

      {currentScreen === 'timeAttack' && (
        <TimeAttack
          onBackToMenu={() => setCurrentScreen('home')}
        />
      )}

      {/* MODALES GLOBALES */}
      <ShopModal
        isOpen={isShopOpen}
        onClose={() => setIsShopOpen(false)}
      />

      <AchievementsModal
        isOpen={isAchievementsOpen}
        onClose={() => setIsAchievementsOpen(false)}
      />
    </div>
  );
}