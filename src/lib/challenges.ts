import { useEffect, useState, useCallback } from "react";

const STORAGE_KEY = "ecobot:challenges:v1";

export type ChallengeRecord = {
  // map of YYYY-MM-DD -> challenge id completed that day
  completions: Record<string, string>;
};

export const dailyChallenges = [
  { id: "transit", title: "Swap one car trip for public transport", kg: 2.4 },
  { id: "veg", title: "Eat one fully plant-based meal", kg: 1.6 },
  { id: "unplug", title: "Unplug idle electronics for the day", kg: 0.8 },
  { id: "shower", title: "Take a 5-minute shower", kg: 0.9 },
  { id: "reusable", title: "Use only reusable cups & bottles today", kg: 0.5 },
  { id: "walk", title: "Walk or cycle for one errand", kg: 1.2 },
  { id: "linedry", title: "Air-dry laundry instead of using the dryer", kg: 1.8 },
];

export function todayKey(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

export function getTodaysChallenge() {
  const day = Math.floor(Date.now() / 86_400_000);
  return dailyChallenges[day % dailyChallenges.length];
}

export function read(): ChallengeRecord {
  try {
    const raw = globalThis.localStorage?.getItem(STORAGE_KEY);
    if (!raw) return { completions: {} };
    return JSON.parse(raw) as ChallengeRecord;
  } catch {
    return { completions: {} };
  }
}

function write(rec: ChallengeRecord) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rec));
  window.dispatchEvent(new CustomEvent("ecobot:challenges-changed"));
}

export function computeStreak(completions: Record<string, string>) {
  let streak = 0;
  const d = new Date();
  // If today not complete, streak still counts prior consecutive days
  if (!completions[todayKey(d)]) {
    d.setDate(d.getDate() - 1);
  }
  while (completions[todayKey(d)]) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

export function computeStats(completions: Record<string, string>) {
  const keys = Object.keys(completions);
  const total = keys.length;
  const last7 = (() => {
    let n = 0;
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      if (completions[todayKey(d)]) n++;
    }
    return n;
  })();
  return { total, last7, weeklyRate: Math.round((last7 / 7) * 100) };
}

export function useChallenges() {
  const [record, setRecord] = useState<ChallengeRecord>({ completions: {} });

  useEffect(() => {
    setRecord(read());
    const onChange = () => setRecord(read());
    window.addEventListener("ecobot:challenges-changed", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("ecobot:challenges-changed", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  const today = todayKey();
  const todaysChallenge = getTodaysChallenge();
  const completedToday = record.completions[today] === todaysChallenge.id;

  const complete = useCallback(() => {
    const next = read();
    next.completions[todayKey()] = getTodaysChallenge().id;
    write(next);
  }, []);

  const undo = useCallback(() => {
    const next = read();
    delete next.completions[todayKey()];
    write(next);
  }, []);

  return {
    record,
    todaysChallenge,
    completedToday,
    streak: computeStreak(record.completions),
    stats: computeStats(record.completions),
    complete,
    undo,
  };
}
