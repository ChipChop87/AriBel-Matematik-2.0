import type { LevelConfig, Question } from './types';

export const generateQuestion = (level: LevelConfig): Question => {
  const operation = level.operations[Math.floor(Math.random() * level.operations.length)];
  let num1 = Math.floor(Math.random() * (level.maxNum - level.minNum + 1)) + level.minNum;
  let num2 = Math.floor(Math.random() * (level.maxNum - level.minNum + 1)) + level.minNum;

  // Ensure positive results for subtraction
  if (operation === '-' && num1 < num2) {
    [num1, num2] = [num2, num1];
  }

  // Ensure division is clean (integer results)
  if (operation === '/') {
    if (num2 === 0) num2 = 1;
    const product = num1 * num2;
    // Swap to make it product / num2 = num1
    return createQuestion(product, num2, '/', num1);
  }

  let answer = 0;
  switch (operation) {
    case '+': answer = num1 + num2; break;
    case '-': answer = num1 - num2; break;
    case '*': answer = num1 * num2; break;
  }

  return createQuestion(num1, num2, operation, answer);
};

const createQuestion = (num1: number, num2: number, operation: string, answer: number): Question => {
  const options = generateOptions(answer);
  return {
    id: Math.random().toString(36).substr(2, 9),
    num1,
    num2,
    operation: operation as any,
    answer,
    options
  };
};

const generateOptions = (answer: number): number[] => {
  const options = new Set<number>([answer]);
  while (options.size < 4) {
    const offset = Math.floor(Math.random() * 5) + 1;
    const distractor = Math.random() > 0.5 ? answer + offset : answer - offset;
    if (distractor >= 0) options.add(distractor);
  }
  return Array.from(options).sort(() => Math.random() - 0.5);
};

export const speakQuestion = (q: Question) => {
  const opMap: any = { '+': 'plus', '-': 'minus', '*': 'gånger', '/': 'delat med' };
  const text = `${q.num1} ${opMap[q.operation]} ${q.num2}`;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'sv-SE';
  window.speechSynthesis.speak(utterance);
};
