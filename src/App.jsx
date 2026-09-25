import React, { useState } from 'react';
import Home from './pages/Home';
import WorldMap from './pages/WorldMap';
import Gameplay from './pages/Gameplay';
import TimeAttack from './pages/TimeAttack';
import Shop from './pages/Shop';
import Achievements from './pages/Achievements';
import AchievementToast from './components/ui/AchievementToast';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home');

  return (
    <div className="bg-slate-950 min-h-screen text-white font-sans selection:bg-amber-400 selection:text-slate-950 relative">
      {/* Toast emergente visible en cualquier pantalla */}
      <AchievementToast />

      {currentScreen === 'home' && (
        <Home
          onStartGame={() => setCurrentScreen('map')}
          onStartTimeAttack={() => setCurrentScreen('timeAttack')}
          onOpenShop={() => setCurrentScreen('shop')}
          onOpenAchievements={() => setCurrentScreen('achievements')}
        />
      )}

      {currentScreen === 'map' && (
        <WorldMap
          onSelectLevel={() => setCurrentScreen('gameplay')}
          onBackToMenu={() => setCurrentScreen('home')}
        />
      )}

      {currentScreen === 'gameplay' && (
        <Gameplay onBackToMap={() => setCurrentScreen('map')} />
      )}

      {currentScreen === 'timeAttack' && (
        <TimeAttack onBackToMenu={() => setCurrentScreen('home')} />
      )}

      {currentScreen === 'shop' && (
        <Shop onBackToMenu={() => setCurrentScreen('home')} />
      )}

      {currentScreen === 'achievements' && (
        <Achievements onBackToMenu={() => setCurrentScreen('home')} />
      )}
    </div>
  );
}