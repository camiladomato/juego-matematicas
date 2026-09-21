import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../context/useGameStore';
import { generateQuestion } from '../data/worldsData';
import HeaderHUD from '../components/layout/HeaderHUD';
import Button3D from '../components/ui/Button3D';
import VisualHint from '../components/game/VisualHint';
import ResultModal from '../components/game/ResultModal';

export default function Gameplay({ onCompleteLevel, onBackToMap }) {
  // Estado global de Zustand
  const {
    currentWorld,
    currentLevel,
    addSuccess,
    addError,
    lives,
    isGameOver,
    resetGame,
  } = useGameStore();

  // Estados locales del juego
  const [question, setQuestion] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong'
  const [questionCount, setQuestionCount] = useState(0);
  const [showResultModal, setShowResultModal] = useState(false);
  const [isLevelSuccess, setIsLevelSuccess] = useState(false);

  const totalQuestionsInLevel = 5;

  // Cargar una nueva pregunta
  const loadNextQuestion = () => {
    const newQuestion = generateQuestion(currentWorld || 'addition', currentLevel || 1);
    setQuestion(newQuestion);
    setShowHint(false);
    setSelectedAnswer(null);
    setFeedback(null);
  };

  // Cargar primera pregunta al iniciar o al reiniciar nivel
  useEffect(() => {
    loadNextQuestion();
  }, [currentWorld, currentLevel]);

  // Manejar si el niño se queda sin vidas
  useEffect(() => {
    if (isGameOver) {
      setIsLevelSuccess(false);
      setShowResultModal(true);
    }
  }, [isGameOver]);

  // Manejar respuesta elegida
  const handleSelectOption = (option) => {
    if (feedback !== null || showResultModal) return;

    setSelectedAnswer(option);

    if (option === question.answer) {
      setFeedback('correct');
      addSuccess(10);

      setTimeout(() => {
        if (questionCount + 1 >= totalQuestionsInLevel) {
          // Completó todas las preguntas del nivel con éxito
          setIsLevelSuccess(true);
          setShowResultModal(true);
        } else {
          setQuestionCount((prev) => prev + 1);
          loadNextQuestion();
        }
      }, 1200);
    } else {
      setFeedback('wrong');
      addError();

      setTimeout(() => {
        setSelectedAnswer(null);
        setFeedback(null);
      }, 1000);
    }
  };

  // Acciones del ResultModal
  const handleNextLevel = () => {
    setShowResultModal(false);
    setQuestionCount(0);
    if (onCompleteLevel) {
      onCompleteLevel();
    } else {
      loadNextQuestion();
    }
  };

  const handleRetry = () => {
    resetGame();
    setShowResultModal(false);
    setQuestionCount(0);
    loadNextQuestion();
  };

  if (!question) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 via-blue-900 to-slate-900 text-white flex flex-col justify-between p-4 max-w-2xl mx-auto select-none relative">
      {/* 1. BARRA SUPERIOR (HUD) */}
      <HeaderHUD />

      {/* 2. ÁREA CENTRAL DE JUEGO */}
      <main className="my-auto flex flex-col items-center w-full">
        {/* Barra de Progreso del Nivel */}
        <div className="w-full bg-blue-950/80 rounded-full h-3 border border-blue-700/60 mb-6 overflow-hidden">
          <div
            className="bg-gradient-to-r from-amber-400 to-green-400 h-full transition-all duration-500 rounded-full"
            style={{ width: `${(questionCount / totalQuestionsInLevel) * 100}%` }}
          />
        </div>

        {/* Tarjeta de la Pregunta */}
        <motion.div
          key={questionCount}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`
            w-full bg-white text-slate-800 rounded-3xl p-6 sm:p-8 text-center shadow-2xl border-b-8 transition-colors duration-300 relative
            ${feedback === 'correct' ? 'border-emerald-500 bg-emerald-50' : ''}
            ${feedback === 'wrong' ? 'border-rose-500 bg-rose-50 animate-shake' : 'border-slate-300'}
          `}
        >
          <span className="text-xs sm:text-sm font-black text-blue-600 tracking-wider uppercase">
            Pregunta {questionCount + 1} de {totalQuestionsInLevel}
          </span>

          <h1 className="text-5xl sm:text-7xl font-black my-4 text-slate-900 tracking-wide">
            {question.num1} {question.operator} {question.num2}
          </h1>

          <p className="text-slate-500 text-sm font-bold">
            ¿Cuál es el resultado correcto?
          </p>

          {/* Feedback Visual Inmediato */}
          <AnimatePresence>
            {feedback === 'correct' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-6 right-6 bg-emerald-500 text-white font-black px-4 py-2 rounded-2xl shadow-lg border-2 border-white flex items-center gap-1 text-lg"
              >
                🎉 ¡Excelente!
              </motion.div>
            )}
            {feedback === 'wrong' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-6 right-6 bg-rose-500 text-white font-black px-4 py-2 rounded-2xl shadow-lg border-2 border-white flex items-center gap-1 text-lg"
              >
                💪 ¡Inténtalo de nuevo!
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Pista Visual Opcional */}
        {showHint && (
          <VisualHint
            num1={question.num1}
            num2={question.num2}
            operator={question.operator}
          />
        )}

        {/* Botonera de Respuesta Múltiple */}
        <div className="grid grid-cols-2 gap-4 w-full mt-6">
          {question.options.map((option, index) => {
            let variant = 'yellow';
            if (selectedAnswer === option) {
              variant = feedback === 'correct' ? 'green' : 'red';
            }

            return (
              <Button3D
                key={index}
                variant={variant}
                size="lg"
                onClick={() => handleSelectOption(option)}
                disabled={feedback !== null || showResultModal}
                className="text-3xl py-6"
              >
                {option}
              </Button3D>
            );
          })}
        </div>
      </main>

      {/* 3. PIE DE PÁGINA */}
      <footer className="w-full flex justify-between items-center pt-4">
        <Button3D
          variant="purple"
          size="sm"
          onClick={() => setShowHint(!showHint)}
        >
          {showHint ? '🙈 Ocultar Pista' : '💡 Ver Pista Visual'}
        </Button3D>

        <Button3D
          variant="blue"
          size="sm"
          onClick={onBackToMap}
        >
          🗺️ Volver al Mapa
        </Button3D>
      </footer>

      {/* MODAL DE RESULTADOS (VICTORIA O DERROTA) */}
      <ResultModal
        isOpen={showResultModal}
        isSuccess={isLevelSuccess}
        stars={lives >= 3 ? 3 : lives === 2 ? 2 : 1}
        score={50}
        onNextLevel={handleNextLevel}
        onRetry={handleRetry}
        onHome={onBackToMap}
      />
    </div>
  );
}