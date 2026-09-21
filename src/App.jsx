import React, { useState } from 'react';
import Home from './pages/Home';
import WorldMap from './pages/WorldMap';
import Gameplay from './pages/Gameplay';

export default function App() {
  // Manejo del flujo de pantallas: 'home' | 'map' | 'game'
  const [currentScreen, setCurrentScreen] = useState('home');

  // Ir del Menú Principal al Mapa de Mundos
  const handleStartGame = () => {
    setCurrentScreen('map');
  };

  // Seleccionar Nivel desde el Mapa e ir a jugar
  const handleSelectLevel = (worldId, levelNumber) => {
    setCurrentScreen('game');
  };

  // Volver al Mapa de Mundos
  const handleBackToMap = () => {
    setCurrentScreen('map');
  };

  // Volver al Menú Principal
  const handleGoHome = () => {
    setCurrentScreen('home');
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans antialiased text-white selection:bg-amber-400 selection:text-slate-950">
      {currentScreen === 'home' && (
        <Home onStartGame={handleStartGame} />
      )}

      {currentScreen === 'map' && (
        <WorldMap
          onSelectLevel={handleSelectLevel}
          onGoHome={handleGoHome}
        />
      )}

      {currentScreen === 'game' && (
        <Gameplay
          onCompleteLevel={handleBackToMap}
          onBackToMap={handleBackToMap}
        />
      )}
    </div>
  );
}