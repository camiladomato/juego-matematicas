import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useGameStore } from '../context/useGameStore';
import { generateQuestion } from '../data/worldsData';
import { soundFx } from '../utils/sound';
import Button3D from '../components/ui/Button3D';

const GAME_DURATION = 60; // 60 segundos

export default function TimeAttack({ onBackToMenu }) {
  const timeAttackHighScore = useGameStore((state) => state.timeAttackHighScore || 0);
  const updateTimeAttackHighScore = useGameStore((state) => state.updateTimeAttackHighScore);
  const addCoins = useGameStore((state) => state.addCoins);

  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState('idle'); // 'idle' | 'playing' | 'gameover'
  const [question, setQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);

  const timerRef = useRef(null);

  // Generar nueva pregunta
  const loadQuestion = () => {
    const worlds = ['addition', 'subtraction', 'multiplication'];
    const randomWorld = worlds[Math.floor(Math.random() * worlds.length)];
    const randomLevel = Math.floor(Math.random() * 3) + 1;

    const q = generateQuestion(randomWorld, randomLevel);
    setQuestion(q);
    setSelectedOption(null);
  };

  // Iniciar juego
  const startGame = () => {
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setGameState('playing');
    loadQuestion();
  };

  // Finalizar juego
  const finishGame = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setGameState('gameover');
  };

  // Efecto para manejar el contador de tiempo
  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState]);

  // Al llegar a 0 segundos, procesar final del juego
  useEffect(() => {
    if (timeLeft === 0 && gameState === 'playing') {
      finishGame();
    }
  }, [timeLeft, gameState]);

  // Procesar recompensas cuando termina el juego
  useEffect(() => {
    if (gameState === 'gameover') {
      soundFx.playSuccess();

      const coinsEarned = score * 2;
      if (coinsEarned > 0 && typeof addCoins === 'function') {
        addCoins(coinsEarned);
      }

      if (score > timeAttackHighScore && typeof updateTimeAttackHighScore === 'function') {
        updateTimeAttackHighScore(score);
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
      }
    }
  }, [gameState]);

  const handleSelectAnswer = (option) => {
    if (selectedOption !== null) return;
    setSelectedOption(option);

    if (question && option === question.answer) {
      soundFx.playSuccess();
      setScore((prev) => prev + 1);
    } else {
      soundFx.playError();
    }

    setTimeout(() => {
      if (gameState === 'playing') {
        loadQuestion();
      }
    }, 300);
  };

  // 1. PANTALLA INICIAL (IDLE)
  if (gameState === 'idle') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-slate-900 text-white flex flex-col items-center justify-center p-6 text-center select-none">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-md w-full bg-slate-900/80 border-2 border-amber-400/50 rounded-3xl p-6 shadow-2xl flex flex-col items-center gap-5">
          <div className="text-6xl animate-bounce">⚡️</div>
          <h1 className="text-3xl font-black text-amber-400">Modo Contra Reloj</h1>
          <p className="text-sm text-slate-300">
            Responde la mayor cantidad de operaciones en <span className="font-bold text-amber-300">60 segundos</span>. ¡Gana 2 monedas por cada acierto!
          </p>

          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 w-full flex justify-between items-center">
            <span className="text-slate-400 font-bold text-sm">🏆 Récord Personal:</span>
            <span className="text-2xl font-black text-amber-400">{timeAttackHighScore} pts</span>
          </div>

          <Button3D variant="green" size="lg" onClick={startGame} className="w-full">
            ¡Empezar Desafío! 🚀
          </Button3D>

          <Button3D variant="purple" size="md" onClick={onBackToMenu} className="w-full">
            Volver al Menú
          </Button3D>
        </motion.div>
      </div>
    );
  }

  // 2. PANTALLA DE RESULTADOS (GAME OVER)
  if (gameState === 'gameover') {
    const isNewRecord = score > 0 && score >= timeAttackHighScore;

    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-slate-900 text-white flex flex-col items-center justify-center p-6 text-center select-none">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-md w-full bg-slate-900/80 border-2 border-amber-400/50 rounded-3xl p-6 shadow-2xl flex flex-col items-center gap-5">
          <div className="text-6xl">{isNewRecord ? '👑' : '⏰'}</div>
          <h2 className="text-3xl font-black text-amber-400">
            {isNewRecord ? '¡Nuevo Récord!' : '¡Tiempo Agotado!'}
          </h2>

          <div className="flex flex-col gap-2 w-full">
            <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400 font-bold text-sm">Aciertos:</span>
              <span className="text-2xl font-black text-amber-300">{score} pts</span>
            </div>
            <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400 font-bold text-sm">Monedas ganadas:</span>
              <span className="text-2xl font-black text-amber-400">🪙 +{score * 2}</span>
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full mt-2">
            <Button3D variant="green" size="lg" onClick={startGame} className="w-full">
              Jugar de Nuevo 🔄
            </Button3D>
            <Button3D variant="purple" size="md" onClick={onBackToMenu} className="w-full">
              Volver al Menú 🏠
            </Button3D>
          </div>
        </motion.div>
      </div>
    );
  }

  // 3. PANTALLA DE JUEGO (PLAYING)
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-slate-900 text-white flex flex-col justify-between p-4 max-w-2xl mx-auto select-none">
      {/* HUD SUPERIOR */}
      <div className="flex justify-between items-center bg-slate-900/80 p-4 rounded-3xl border border-slate-700 shadow-lg">
        <div className="flex items-center gap-2">
          <span className="text-2xl">⏳</span>
          <span className={`text-2xl font-black ${timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-amber-400'}`}>
            {timeLeft}s
          </span>
        </div>

        <div className="flex items-center gap-2 bg-slate-950/60 px-4 py-1.5 rounded-2xl border border-slate-800">
          <span className="text-slate-400 font-bold text-xs">PUNTOS</span>
          <span className="text-2xl font-black text-amber-300">{score}</span>
        </div>
      </div>

      {/* PREGUNTA */}
      {question && (
        <main className="my-auto flex flex-col items-center w-full my-4">
          <motion.div
            key={question.text}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full bg-purple-900/40 border-2 border-purple-500/30 rounded-3xl p-8 text-center backdrop-blur-sm shadow-xl"
          >
            <h2 className="text-5xl sm:text-6xl font-black tracking-wider text-white drop-shadow-lg">
              {question.text} = ?
            </h2>
          </motion.div>

          {/* OPCIONES */}
          <div className="grid grid-cols-2 gap-4 w-full mt-6">
            {question.options.map((option) => (
              <Button3D
                key={option}
                variant="blue"
                size="lg"
                onClick={() => handleSelectAnswer(option)}
                disabled={selectedOption !== null}
                className="text-3xl sm:text-4xl py-6"
              >
                {option}
              </Button3D>
            ))}
          </div>
        </main>
      )}
    </div>
  );
}