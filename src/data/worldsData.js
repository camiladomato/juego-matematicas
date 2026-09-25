const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

const OBJECT_EMOJIS = ['🍎', '⭐️', '🚗', '🎈', '🐱', '🍪', '⚽️', '🧸'];

export const generateQuestion = (world = 'addition', level = 1) => {
  let num1 = 0;
  let num2 = 0;
  let answer = 0;
  let symbol = '+';
  const maxRange = level * 4 + 4;

  const isVisual = level === 1; // Nivel 1 siempre incluye apoyo con emojis
  const visualEmoji = OBJECT_EMOJIS[getRandomInt(0, OBJECT_EMOJIS.length - 1)];

  switch (world) {
    case 'subtraction':
      symbol = '-';
      num1 = getRandomInt(2, maxRange);
      num2 = getRandomInt(1, num1);
      answer = num1 - num2;
      break;

    case 'multiplication':
      symbol = '×';
      num1 = getRandomInt(1, Math.min(level + 2, 10));
      num2 = getRandomInt(1, Math.min(level + 2, 10));
      answer = num1 * num2;
      break;

    case 'addition':
    default:
      symbol = '+';
      num1 = getRandomInt(1, maxRange);
      num2 = getRandomInt(1, maxRange);
      answer = num1 + num2;
      break;
  }

  const optionsSet = new Set([answer]);
  while (optionsSet.size < 4) {
    const wrong = answer + getRandomInt(-4, 4);
    if (wrong >= 0 && wrong !== answer) optionsSet.add(wrong);
  }

  return {
    num1,
    num2,
    symbol,
    text: `${num1} ${symbol} ${num2}`,
    answer,
    isVisual,
    visualEmoji,
    options: shuffleArray(Array.from(optionsSet)),
  };
};