import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useGameStore } from '../context/useGameStore';
import { generateQuestion } from '../data/worldsData';
import { soundFx } from '../utils/sound';
import HeaderHUD from '../components/layout/HeaderHUD';
import Button3D from '../components/ui/Button3D';
import ResultModal from '../components/ui/ResultModal';

const TOTAL_QUESTIONS_PER_LEVEL = 5;

export default function Gameplay({ onCompleteLevel, onBackToMap }) {
  const { currentWorld, currentLevel, setLevel, addCoins, addStars, unlockNextLevel, loseLife } = useGameStore();
  const [question, setQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [questionsCount, setQuestionsCount] = useState(1);
  const [showResultModal, setShowResultModal] = useState(false);

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
    if (selectedOption !== null) return;
    setSelectedOption(option);

    if (option === question.answer) {
      setIsCorrect(true);
      soundFx.playSuccess();
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } else {
      setIsCorrect(false);
      soundFx.playError();
      loseLife();
    }
  };

  const handleNextStep = () => {
    if (questionsCount >= TOTAL_QUESTIONS_PER_LEVEL) {
      // Completó el nivel
      addCoins(15);
      addStars(3);
      unlockNextLevel(currentWorld, currentLevel + 1);
      setShowResultModal(true);
    } else {
      setQuestionsCount((prev) => prev + 1);
      loadNextQuestion();
    }
  };

  const handleNextLevel = () => {
    setShowResultModal(false);
    setQuestionsCount(1);
    setLevel(currentLevel + 1);
  };

  const handleRetry = () => {
    setShowResultModal(false);
    setQuestionsCount(1);
    loadNextQuestion();
  };

  if (!question) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-blue-950 to-slate-900 text-white flex flex-col justify-between p-4 max-w-2xl mx-auto select-none">
      <HeaderHUD />

      <main className="my-auto flex flex-col items-center w-full my-4">
        {/* INDICADOR DE PROGRESO */}
        <div className="w-full flex justify-between items-center text-xs font-bold text-blue-300 mb-2 px-2">
          <span>Pregunta {questionsCount} de {TOTAL_QUESTIONS_PER_LEVEL}</span>
          <div className="w-32 bg-slate-800 h-2 rounded-full overflow-hidden border border-blue-800">
            <div 
              className="bg-amber-400 h-full transition-all duration-300"
              style={{ width: `${(questionsCount / TOTAL_QUESTIONS_PER_LEVEL) * 100}%` }}
            />
          </div>
        </div>

        {/* TARJETA DE PREGUNTA */}
        <motion.div
          key={question.text}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full bg-blue-900/40 border-2 border-blue-500/30 rounded-3xl p-8 text-center backdrop-blur-sm shadow-xl"
        >
          <h2 className="text-5xl sm:text-6xl font-black tracking-wider text-white drop-shadow-lg">
            {question.text} = ?
          </h2>
        </motion.div>

        {/* OPCIONES */}
        <div className="grid grid-cols-2 gap-4 w-full mt-6">
          {question.options.map((option) => {
            const isSelected = selectedOption === option;
            let variant = 'blue';
            if (isSelected) variant = isCorrect ? 'green' : 'red';

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

        {/* SIGUIENTE / REINTENTAR */}
        <AnimatePresence>
          {selectedOption !== null && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="mt-6 w-full flex flex-col items-center gap-3"
            >
              <Button3D
                variant={isCorrect ? 'green' : 'amber'}
                size="md"
                onClick={handleNextStep}
                className="w-full max-w-xs"
              >
                {isCorrect ? 'Continuar ➡️' : 'Siguiente 🔄'}
              </Button3D>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* MODAL DE RESULTADO FINAL */}
      <ResultModal
        isOpen={showResultModal}
        stars={3}
        coinsEarned={15}
        onNextLevel={handleNextLevel}
        onRetry={handleRetry}
        onBackToMap={onBackToMap}
      />
    </div>
  );
}