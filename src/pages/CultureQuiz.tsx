import { useEffect, useMemo, useState } from 'react';
import { cultureQuestions } from '@data/culture';

import { GameShell } from '@components/GameShell';
import { shuffleInPlace } from '@utils/game';

export default function CultureQuiz() {
  // Use the entire dataset in one session
  const [indices, setIndices] = useState<number[]>(() => {
    const all = Array.from({ length: cultureQuestions.length }, (_, i) => i);
    return shuffleInPlace(all);
  });
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState<'idle' | 'correct' | 'wrong'>('idle');

  useEffect(() => { /* streak removed */ }, []);

  const total = indices.length;
  const current = questionIndex < total ? cultureQuestions[indices[questionIndex]] : null;

  // Shuffle answer options per question to randomize correct position
  const presented = useMemo(() => {
    if (!current) return null;
    const optionIndices = Array.from({ length: current.options.length }, (_, i) => i);
    shuffleInPlace(optionIndices);
    const shuffledOptions = optionIndices.map((i) => current.options[i]);
    const shuffledAnswerIndex = optionIndices.indexOf(current.answerIndex);
    return { ...current, options: shuffledOptions, answerIndex: shuffledAnswerIndex };
  }, [current?.question]);

  function startOver() {
    const all = Array.from({ length: cultureQuestions.length }, (_, i) => i);
    setIndices(shuffleInPlace(all));
    setQuestionIndex(0);
    setScore(0);
    setWrong(0);
    setSelected(null);
    setShowResult('idle');
  }

  function handleChoose(idx: number) {
    if (showResult !== 'idle' || !presented) return;
    setSelected(idx);
    const ok = idx === presented.answerIndex;
    setShowResult(ok ? 'correct' : 'wrong');
    if (ok) { setScore((s) => s + 1); } else { setWrong((w) => w + 1); }
    setTimeout(() => {
      if (questionIndex + 1 >= total) {
        setQuestionIndex(total);
      } else {
        setQuestionIndex((i) => i + 1);
      }
      setSelected(null);
      setShowResult('idle');
    }, 700);
  }

  const progress = total > 0 ? Math.round(((Math.min(questionIndex, total)) / total) * 100) : 0;
  const isDone = questionIndex >= total;
  if (isDone) {
    return (
      <GameShell title="Culture, History, Cuisine & Geography" subtitle={`Session complete (${total} questions)`} progress={100} onReset={startOver}>
        <div className="glass card" style={{ display: 'grid', gap: 12 }}>
          <h3>Great job!</h3>
          <p>You scored <strong>{score}</strong> / {total}. Wrong: <strong>{total - score}</strong>.</p>
          <button className="btn" onClick={startOver}>Play again</button>
        </div>
      </GameShell>
    );
  }

  return (
    <GameShell title="Culture, History, Cuisine & Geography" subtitle={total > 0 ? `Question ${questionIndex + 1} of ${total}` : 'Loading…'} progress={progress}>
      <div className="glass card">
        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>{presented?.question}</div>
        <div className="kpi">Correct: <strong>{score}</strong> · Wrong: <strong>{wrong}</strong></div>
        <div className="options">
          {presented?.options.map((opt, idx) => {
            const isSelected = selected === idx;
            const isCorrect = idx === presented.answerIndex;
            const className = [
              'option',
              showResult !== 'idle' && isCorrect ? 'correct' : '',
              showResult !== 'idle' && isSelected && !isCorrect ? 'wrong' : '',
            ].filter(Boolean).join(' ');
            return (
              <button key={idx} className={className} onClick={() => handleChoose(idx)}>
                {opt}
              </button>
            );
          })}
        </div>
      </div>
    </GameShell>
  );
}
