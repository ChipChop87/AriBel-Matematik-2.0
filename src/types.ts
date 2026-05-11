export type LevelType = 'brons' | 'silver' | 'guld' | 'diamant';

export interface LevelConfig {
  id: LevelType;
  title: string;
  description: string;
  minNum: number;
  maxNum: number;
  operations: ('+' | '-' | '*' | '/')[];
  color: string;
}

export const LEVELS: LevelConfig[] = [
  {
    id: 'brons',
    title: 'Brons (Åk F-1)',
    description: 'Tal 0-10. Enkel plus och minus.',
    minNum: 0,
    maxNum: 10,
    operations: ['+', '-'],
    color: '#CD7F32'
  },
  {
    id: 'silver',
    title: 'Silver (Åk 1-2)',
    description: 'Tal 0-20. Plus och minus med lite större tal.',
    minNum: 0,
    maxNum: 20,
    operations: ['+', '-'],
    color: '#C0C0C0'
  },
  {
    id: 'guld',
    title: 'Guld (Åk 2-3)',
    description: 'Tal 0-100. Multiplikation börjar här!',
    minNum: 0,
    maxNum: 100,
    operations: ['+', '-', '*'],
    color: '#FFD700'
  },
  {
    id: 'diamant',
    title: 'Diamant (Åk 3+)',
    description: 'Alla räknesätt upp till 100.',
    minNum: 0,
    maxNum: 100,
    operations: ['+', '-', '*', '/'],
    color: '#B9F2FF'
  }
];

export interface Question {
  id: string;
  num1: number;
  num2: number;
  operation: '+' | '-' | '*' | '/';
  answer: number;
  options: number[];
}

export interface GameState {
  level: LevelConfig | null;
  score: number;
  streak: number;
  currentQuestion: Question | null;
  status: 'user_selection' | 'menu' | 'playing' | 'feedback' | 'finished';
  lastAnswerCorrect: boolean | null;
  activeUser: 'Ariel' | 'Belle' | null;
}
