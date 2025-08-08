import { useEffect, useMemo, useState } from 'react';

import { shuffleInPlace, sampleDistinct } from '@utils/game';
import { vocabPairs } from '@data/vocab';
import { GameShell } from '@components/GameShell';

export type Direction = 'ca-en' | 'en-ca';

export default function VocabGame({ direction }: { direction: Direction }) {
  // Use the entire dataset in one session
  const [indices, setIndices] = useState<number[]>(() => {
    const all = Array.from({ length: vocabPairs.length }, (_, i) => i);
    return shuffleInPlace(all);
  });
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [showResult, setShowResult] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => { /* streak removed */ }, []);

  // Restart session when direction changes, but still use full dataset
  useEffect(() => {
    const all = Array.from({ length: vocabPairs.length }, (_, i) => i);
    setIndices(shuffleInPlace(all));
    setQuestionIndex(0);
    setScore(0);
    setWrong(0);
    setSelected(null);
    setShowResult('idle');
  }, [direction]);

  const total = indices.length;
  const currentPair = questionIndex < total ? vocabPairs[indices[questionIndex]] : null;

  const options = useMemo(() => {
    if (!currentPair) return [] as string[];
    const isCaEn = direction === 'ca-en';
    const correct = isCaEn ? currentPair.en : currentPair.ca;
    const others = sampleDistinct(vocabPairs, 3, (p) => (isCaEn ? p.en : p.ca) === correct)
      .map((p) => (isCaEn ? p.en : p.ca));
    const mixed = shuffleInPlace([correct, ...others]);
    return mixed;
  }, [currentPair, direction]);

  function handleChoose(idx: number) {
    if (showResult !== 'idle' || !currentPair) return;
    setSelected(idx);
    const isCaEn = direction === 'ca-en';
    const correct = isCaEn ? currentPair.en : currentPair.ca;
    const chosen = options[idx];
    const ok = chosen === correct;
    setShowResult(ok ? 'correct' : 'wrong');
    if (ok) {
      setScore((s) => s + 1);
      // points removed
    } else {
      setWrong((w) => w + 1);
    }
    setTimeout(() => {
      if (questionIndex + 1 >= total) {
        // Mark finished
        setQuestionIndex(total);
      } else {
        setQuestionIndex((i) => i + 1);
      }
      setShowResult('idle');
      setSelected(null);
    }, 700);
  }

  const progress = total > 0 ? Math.round(((Math.min(questionIndex, total)) / total) * 100) : 0;
  const isDone = questionIndex >= total;

  if (isDone) {
    return (
      <GameShell title={direction === 'ca-en' ? 'Catalan → English' : 'English → Catalan'} subtitle={`Session complete (${total} questions)`} progress={100} onReset={() => {
        const all = Array.from({ length: vocabPairs.length }, (_, i) => i);
        setIndices(shuffleInPlace(all));
        setQuestionIndex(0);
        setScore(0);
        setWrong(0);
        setSelected(null);
        setShowResult('idle');
      }}>
        <div className="glass card" style={{ display: 'grid', gap: 12 }}>
          <h3>Great job!</h3>
          <p>You scored <strong>{score}</strong> / {total} · Wrong: <strong>{total - score}</strong>.</p>
          <button className="btn" onClick={() => {
            const all = Array.from({ length: vocabPairs.length }, (_, i) => i);
            setIndices(shuffleInPlace(all));
            setQuestionIndex(0);
            setScore(0);
            setWrong(0);
            setSelected(null);
            setShowResult('idle');
          }}>Play again</button>
        </div>
      </GameShell>
    );
  }

  const prompt = currentPair ? (direction === 'ca-en' ? currentPair.ca : currentPair.en) : '';

  return (
    <GameShell title={direction === 'ca-en' ? 'Catalan → English' : 'English → Catalan'} subtitle={total > 0 ? `Question ${questionIndex + 1} of ${total}` : 'Loading…'} progress={progress}>
      <div className="glass card">
        <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>{prompt}</div>
        <div className="kpi">Correct: <strong>{score}</strong> · Wrong: <strong>{wrong}</strong></div>
        <div className="options">
          {options.map((opt, idx) => {
            const isSelected = selected === idx; const isCorrect = currentPair && (direction === 'ca-en' ? currentPair.en : currentPair.ca) === opt;
            // isCorrect computed above
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
