import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../context/useGameStore';
import { generateQuestion } from '../data/worldsData';
import { soundFx } from '../utils/sound';
import HeaderHUD from '../components/layout/HeaderHUD';
import Button3D from '../components/ui/Button3D';

export default function Gameplay({ onCompleteLevel, onBackToMap }) {
  const { currentWorld, currentLevel, addScore, loseLife, lives } = useGameStore();
  const [question, setQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  useEffect(() => {
    loadNextQuestion();
  }, [currentWorld, currentLevel]);

  const loadNextQuestion = () => {
    const q = generateQuestion(currentWorld || 'addition', currentLevel || 1);
    setQuestion(q);
    setSelectedOption(null);
    setIsCorrect(null);
  };

  const handleSelectAnswer = (option) => {
    if (selectedOption !== null) return; // Evitar múltiples clics
    setSelectedOption(option);

    if (option === question.answer) {
      setIsCorrect(true);
      soundFx.playSuccess();
      addScore(10);
    } else {
      setIsCorrect(false);
      soundFx.playError();
      loseLife();
    }
  };

  if (!question) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-blue-950 to-slate-900 text-white flex flex-col justify-between p-4 max-w-2xl mx-auto select-none">
      <HeaderHUD />

      <main className="my-auto flex flex-col items-center w-full my-4">
        {/* TARJETA DE LA PREGUNTA */}
        <motion.div
          key={question.text}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full bg-blue-900/40 border-2 border-blue-500/30 rounded-3xl p-8 text-center backdrop-blur-sm shadow-xl"
        >
          <span className="text-xs font-black text-amber-400 tracking-widest uppercase bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/30">
            Resuelve el problema
          </span>

          <h2 className="text-5xl sm:text-6xl font-black mt-6 tracking-wider text-white drop-shadow-lg">
            {question.text} = ?
          </h2>
        </motion.div>

        {/* OPCIONES DE RESPUESTA */}
        <div className="grid grid-cols-2 gap-4 w-full mt-6">
          {question.options.map((option) => {
            const isSelected = selectedOption === option;
            let variant = 'blue';

            if (isSelected) {
              variant = isCorrect ? 'green' : 'red';
            }

            return (
              <Button3D
                key={option}
                variant={variant}
                size="lg"
                onClick={() => handleSelectAnswer(option)}
                disabled={selectedOption !== null}
                className="text-3xl sm:text-4xl py-6"
              >
                {option}
              </Button3D>
            );
          })}
        </div>

        {/* FEEDBACK Y BOTÓN DE SIGUIENTE */}
        <AnimatePresence>
          {selectedOption !== null && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="mt-6 w-full flex flex-col items-center gap-3"
            >
              <p className={`text-xl font-black ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isCorrect ? '🎉 ¡Excelente trabajo!' : '❌ ¡Casi! Inténtalo de nuevo.'}
              </p>

              <Button3D
                variant={isCorrect ? 'green' : 'amber'}
                size="md"
                onClick={loadNextQuestion}
                className="w-full max-w-xs"
              >
                {isCorrect ? 'Siguiente Pregunta ➡️' : 'Reintentar 🔄'}
              </Button3D>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="w-full flex justify-center pt-2">
        <Button3D variant="purple" size="sm" onClick={onBackToMap}>
          🗺️ Volver al Mapa
        </Button3D>
      </footer>
    </div>
  );
}