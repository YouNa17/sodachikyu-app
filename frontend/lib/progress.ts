// frontend/lib/progress.ts
const KEY = 'sodachikyu:progress';

function todayKey() {
  const now = new Date();
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return jst.toISOString().slice(0, 10);
}

type Progress = {
  date: string;
  cleared: number;
};

export function getTodayProgress(): Progress {
  const raw = localStorage.getItem(KEY);
  const t = todayKey();
  if (!raw) return { date: t, cleared: 0 };

  try {
    const p = JSON.parse(raw) as Progress;
    if (p.date !== t) return { date: t, cleared: 0 };
    return p;
  } catch {
    return { date: t, cleared: 0 };
  }
}

export function setTodayCleared(cleared: number) {
  const t = todayKey();
  const p: Progress = { date: t, cleared };
  localStorage.setItem(KEY, JSON.stringify(p));
}

export function addClear() {
  const p = getTodayProgress();
  setTodayCleared(p.cleared + 1);
  return p.cleared + 1;
}
