// Definición de los Mundos de Juego
export const WORLDS = [
  {
    id: 'addition',
    title: 'Isla de Sumas y Restas',
    description: 'Aprende a sumar y restar con los piratas',
    icon: '➕',
    color: 'from-emerald-500 to-teal-700',
    borderColor: 'border-emerald-400',
    totalLevels: 5,
  },
  {
    id: 'tables',
    title: 'Bosque de las Tablas',
    description: 'Domina las tablas del 1 al 10',
    icon: '🌲',
    color: 'from-amber-500 to-orange-700',
    borderColor: 'border-amber-400',
    totalLevels: 10, 
  },
  {
    id: 'multiplication',
    title: 'Montaña de Multiplicar',
    description: 'Desafíos de multiplicación más avanzados',
    icon: '🚀',
    color: 'from-blue-500 to-indigo-700',
    borderColor: 'border-blue-400',
    totalLevels: 5,
  },
  {
    id: 'division',
    title: 'Cueva de la División',
    description: 'Reparte cristales mágicos de forma equitativa',
    icon: '💎',
    color: 'from-purple-500 to-pink-700',
    borderColor: 'border-purple-400',
    totalLevels: 5,
  },
];


const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateOptions = (correctAnswer) => {
  const options = new Set([correctAnswer]);
  while (options.size < 4) {
    let offset = getRandomInt(-5, 5);
    if (offset === 0) offset = getRandomInt(1, 4);
    const fakeOption = correctAnswer + offset;
    if (fakeOption >= 0) {
      options.add(fakeOption);
    }
  }
  
  return Array.from(options).sort(() => Math.random() - 0.5);
};


export const generateQuestion = (worldId, levelNumber) => {
  let num1 = 0;
  let num2 = 0;
  let operator = '+';
  let answer = 0;

  switch (worldId) {
    case 'addition': {
      const isSubtraction = levelNumber > 2 && Math.random() > 0.5;
      if (isSubtraction) {
        operator = '-';
        num1 = getRandomInt(levelNumber * 2, levelNumber * 5 + 5);
        num2 = getRandomInt(1, num1);
        answer = num1 - num2;
      } else {
        operator = '+';
        num1 = getRandomInt(1, levelNumber * 4);
        num2 = getRandomInt(1, levelNumber * 4);
        answer = num1 + num2;
      }
      break;
    }

    case 'tables': {
      operator = '×';
      num1 = levelNumber; 
      num2 = getRandomInt(1, 10);
      answer = num1 * num2;
      break;
    }

    case 'multiplication': {
      operator = '×';
      num1 = getRandomInt(2, 5 + levelNumber);
      num2 = getRandomInt(2, 10);
      answer = num1 * num2;
      break;
    }

    case 'division': {
      operator = '÷';
      num2 = getRandomInt(2, 5 + levelNumber);
      answer = getRandomInt(1, 10);
      num1 = num2 * answer; 
      break;
    }

    default: {
      num1 = 2;
      num2 = 2;
      operator = '+';
      answer = 4;
    }
  }

  return {
    num1,
    num2,
    operator,
    answer,
    options: generateOptions(answer),
  };
};