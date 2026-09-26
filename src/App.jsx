import React, { useState, useEffect } from 'react';
import { initAuth } from './config/firebase';
import { useGameStore } from './context/useGameStore';

import Home from './pages/Home';
import WorldMap from './pages/WorldMap';
import Gameplay from './pages/Gameplay';
import TimeAttack from './pages/TimeAttack';
import ShopModal from './components/ui/ShopModal';
import AchievementsModal from './components/ui/AchievementsModal';
import AchievementToast from './components/ui/AchievementToast';
import WelcomeModal from './components/ui/WelcomeModal';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadFromCloud = useGameStore((state) => state.loadFromCloud);
  // Solo se pide el nombre cuando ya se leyó la nube, para no pedírselo a quien ya lo tiene guardado
  const needsWelcome = useGameStore((state) => state.cloudLoaded && !state.hasSetName);

  useEffect(() => {
    let isMounted = true;

    const timeoutFallback = setTimeout(() => {
      if (isMounted) {
        console.warn('Carga de Firebase en fallback local.');
        setLoading(false);
      }
    }, 3000);

    const unsubscribe = initAuth(async (user) => {
      if (user) {
        // Cargar los datos guardados en Firestore
        await loadFromCloud();
      }
      if (isMounted) {
        clearTimeout(timeoutFallback);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      clearTimeout(timeoutFallback);
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [loadFromCloud]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-slate-900 text-white flex flex-col items-center justify-center font-bold gap-4 select-none">
        <div className="text-6xl animate-spin">🧩</div>
        <p className="text-amber-400 text-lg tracking-wide">Cargando datos de la nube... ☁️</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-amber-400 selection:text-slate-900 font-sans">
      <AchievementToast />
      {needsWelcome && <WelcomeModal />}

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
          onGoHome={() => setCurrentScreen('home')}
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