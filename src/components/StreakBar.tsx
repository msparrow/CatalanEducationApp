import { getDailyStreak, getTotalPoints } from '@utils/storage';

export function StreakBar() {
  const { currentStreak, longestStreak } = getDailyStreak();
  const points = getTotalPoints();
  return (
    <div className="glass card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
      <div className="kpi"><span>🔥</span> <span>Streak: <strong>{currentStreak}d</strong> (best {longestStreak}d)</span></div>
      <div className="kpi"><span>⭐</span> <span>Total points: <strong>{points}</strong></span></div>
    </div>
  );
}
