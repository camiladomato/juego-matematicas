import React, { useState } from 'react';
import Home from './pages/Home';
import WorldMap from './pages/WorldMap';
import Gameplay from './pages/Gameplay';
import TimeAttack from './pages/TimeAttack';

export default function App() {
  // Posibles vistas: 'home' | 'map' | 'gameplay' | 'timeAttack'
  const [currentScreen, setCurrentScreen] = useState('home');

  return (
    <div className="bg-slate-950 min-h-screen text-white font-sans selection:bg-amber-400 selection:text-slate-950">
      {/* MENÚ PRINCIPAL */}
      {currentScreen === 'home' && (
        <Home
          onStartGame={() => setCurrentScreen('map')}
          onStartTimeAttack={() => setCurrentScreen('timeAttack')}
        />
      )}

      {/* MAPA DE MUNDOS Y NIVELES */}
      {currentScreen === 'map' && (
        <WorldMap
          onSelectLevel={() => setCurrentScreen('gameplay')}
          onBackToMenu={() => setCurrentScreen('home')}
        />
      )}

      {/* MODO AVENTURA (GAMEPLAY) */}
      {currentScreen === 'gameplay' && (
        <Gameplay
          onBackToMap={() => setCurrentScreen('map')}
        />
      )}

      {/* MODO DESAFÍO CONTRA RELOJ */}
      {currentScreen === 'timeAttack' && (
        <TimeAttack
          onBackToMenu={() => setCurrentScreen('home')}
        />
      )}
    </div>
  );
}