import React, { useState } from 'react';
import { Trophy, Flame, Play, ArrowLeft, Volume2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { LEVELS } from './types';
import type { GameState, LevelConfig } from './types';
import { generateQuestion, speakQuestion } from './mathUtils';
import './index.css';

const App: React.FC = () => {
  const [state, setState] = useState<GameState>({
    level: null,
    score: 0,
    streak: 0,
    currentQuestion: null,
    status: 'user_selection',
    lastAnswerCorrect: null,
    activeUser: null
  });

  const selectUser = (user: 'Ariel' | 'Belle') => {
    setState({ ...state, activeUser: user, status: 'menu' });
  };

  const startLevel = (level: LevelConfig) => {
    const firstQ = generateQuestion(level);
    setState({
      ...state,
      level,
      score: 0,
      streak: 0,
      currentQuestion: firstQ,
      status: 'playing',
      lastAnswerCorrect: null
    });
    speakQuestion(firstQ);
  };

  const handleAnswer = (selected: number) => {
    if (!state.currentQuestion || state.status !== 'playing') return;

    const isCorrect = selected === state.currentQuestion.answer;
    const newStreak = isCorrect ? state.streak + 1 : 0;
    
    if (isCorrect && newStreak % 5 === 0) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    setState({
      ...state,
      score: isCorrect ? state.score + 10 : state.score,
      streak: newStreak,
      status: 'feedback',
      lastAnswerCorrect: isCorrect
    });

    setTimeout(() => {
      if (state.level) {
        const nextQ = generateQuestion(state.level);
        setState(prev => ({
          ...prev,
          currentQuestion: nextQ,
          status: 'playing',
          lastAnswerCorrect: null
        }));
        speakQuestion(nextQ);
      }
    }, 1500);
  };

  const goBack = () => {
    if (state.status === 'playing' || state.status === 'feedback') {
      setState({ ...state, status: 'menu', level: null });
    } else if (state.status === 'menu') {
      setState({ ...state, status: 'user_selection', activeUser: null });
    }
  };

  if (state.status === 'user_selection') {
    return (
      <div className="card">
        <h1>AriBel-Matematik 2.0</h1>
        <p style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>Vem ska spela idag?</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <button 
            className="level-card" 
            style={{ backgroundColor: '#FFB6C1', textAlign: 'center' }}
            onClick={() => selectUser('Ariel')}
          >
            <h3 style={{ margin: 0 }}>Ariel ✨</h3>
          </button>
          <button 
            className="level-card" 
            style={{ backgroundColor: '#B2EBF2', textAlign: 'center' }}
            onClick={() => selectUser('Belle')}
          >
            <h3 style={{ margin: 0 }}>Belle 🌸</h3>
          </button>
        </div>
      </div>
    );
  }

  if (state.status === 'menu') {
    return (
      <div className="card">
        <button onClick={goBack} style={{ position: 'absolute', left: '2rem', top: '2rem', background: 'none', color: 'var(--text-muted)' }}>
          <ArrowLeft size={24} />
        </button>
        <h1>AriBel-Matematik 2.0</h1>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <div className="score-badge" style={{ 
            backgroundColor: state.activeUser === 'Ariel' ? '#FFB6C1' : '#B2EBF2',
            color: state.activeUser === 'Ariel' ? '#880E4F' : '#006064',
            fontSize: '1.2rem',
            padding: '0.8rem 1.5rem'
          }}>
            {state.activeUser === 'Ariel' ? 'Ariel ✨' : 'Belle 🌸'}
          </div>
        </div>
        <p style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>Välkommen {state.activeUser}! Välj en nivå:</p>
        <div className="level-grid">
          {LEVELS.map(level => (
            <button
              key={level.id}
              className="level-card"
              style={{ backgroundColor: level.color }}
              onClick={() => startLevel(level)}
            >
              <h3>{level.title}</h3>
              <p>{level.description}</p>
              <Play size={24} style={{ position: 'absolute', right: '1.5rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <button onClick={goBack} style={{ background: 'none', color: 'var(--text-muted)' }}>
          <ArrowLeft size={24} />
        </button>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className="score-badge">
            <Trophy size={18} color="#f59e0b" />
            {state.score}
          </div>
          {state.streak > 2 && (
            <div className="score-badge" style={{ color: '#ef4444' }}>
              <Flame size={18} className="animate-bounce" />
              {state.streak}
            </div>
          )}
        </div>
      </div>

      {state.currentQuestion && (
        <>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <button 
              onClick={() => state.currentQuestion && speakQuestion(state.currentQuestion)}
              style={{ background: '#e2e8f0', padding: '0.5rem', borderRadius: '50%' }}
            >
              <Volume2 size={24} color="var(--accent-blue)" />
            </button>
          </div>
          
          <div className="question-text">
            <span>{state.currentQuestion.num1}</span>
            <span style={{ color: 'var(--accent-blue)' }}>{state.currentQuestion.operation === '*' ? '×' : state.currentQuestion.operation}</span>
            <span>{state.currentQuestion.num2}</span>
            <span>=</span>
            <span style={{ color: 'var(--accent-blue)' }}>?</span>
          </div>

          <div className="options-grid">
            {state.currentQuestion.options.map((opt, i) => {
              let className = "option-btn";
              if (state.status === 'feedback') {
                if (opt === state.currentQuestion?.answer) className += " correct";
                else if (opt !== state.currentQuestion?.answer && state.lastAnswerCorrect === false) className += " wrong";
              }
              
              return (
                <button
                  key={i}
                  className={className}
                  onClick={() => handleAnswer(opt)}
                  disabled={state.status === 'feedback'}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default App;
