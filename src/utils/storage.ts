type StreakState = { currentStreak: number; longestStreak: number; lastPlayedISO: string | null };

const STORAGE_KEYS = {
  streak: 'ceapp.streak',
  points: 'ceapp.points',
};

function todayISO(): string {
  const d = new Date();
  d.setHours(0,0,0,0);
  return d.toISOString();
}

export function getDailyStreak(): StreakState {
  const raw = localStorage.getItem(STORAGE_KEYS.streak);
  if (!raw) return { currentStreak: 0, longestStreak: 0, lastPlayedISO: null };
  try {
    return JSON.parse(raw) as StreakState;
  } catch {
    return { currentStreak: 0, longestStreak: 0, lastPlayedISO: null };
  }
}

export function touchDailyStreak(): StreakState {
  const prev = getDailyStreak();
  const last = prev.lastPlayedISO ? new Date(prev.lastPlayedISO) : null;
  const now = new Date();
  const startOfToday = new Date(todayISO());
  const startOfYesterday = new Date(startOfToday); startOfYesterday.setDate(startOfYesterday.getDate() - 1);

  let currentStreak = prev.currentStreak;
  if (!last) {
    currentStreak = 1;
  } else if (last >= startOfToday) {
    // already counted today
  } else if (last >= startOfYesterday) {
    currentStreak = prev.currentStreak + 1;
  } else {
    currentStreak = 1;
  }

  const longestStreak = Math.max(prev.longestStreak, currentStreak);
  const next: StreakState = { currentStreak, longestStreak, lastPlayedISO: todayISO() };
  localStorage.setItem(STORAGE_KEYS.streak, JSON.stringify(next));
  return next;
}

export function addPoints(pointsDelta: number): number {
  const current = getTotalPoints();
  const next = Math.max(0, current + pointsDelta);
  localStorage.setItem(STORAGE_KEYS.points, String(next));
  return next;
}

export function getTotalPoints(): number {
  const raw = localStorage.getItem(STORAGE_KEYS.points);
  return raw ? Number(raw) : 0;
}
