import { useEffect, useState } from "react";

export type LoggedItem = {
  id: string;
  kind: "trip" | "meal" | "goal";
  title: string;
  detail: string;
  at: number;
  kg?: number;
};

export const ACTIVITY_KEY = "ecobot:quick-actions:v1";
export const ACTIVITY_EVENT = "ecobot:history-updated";

export function loadActivity(): LoggedItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = JSON.parse(localStorage.getItem(ACTIVITY_KEY) ?? "[]") as LoggedItem[];
    return raw.map((i) => ({ ...i, kg: i.kg ?? parseKg(i.detail) }));
  } catch {
    return [];
  }
}

export function saveActivity(items: LoggedItem[]) {
  localStorage.setItem(ACTIVITY_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(ACTIVITY_EVENT));
}

function parseKg(detail: string): number {
  const m = detail.match(/([\d.]+)\s*kg/i);
  return m ? parseFloat(m[1]) : 0;
}

export function useActivityTotals() {
  const [items, setItems] = useState<LoggedItem[]>([]);
  useEffect(() => {
    setItems(loadActivity());
    const handler = () => setItems(loadActivity());
    window.addEventListener(ACTIVITY_EVENT, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(ACTIVITY_EVENT, handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  const now = new Date();
  const startOfDay = new Date(now); startOfDay.setHours(0, 0, 0, 0);
  const startOfWeek = new Date(startOfDay);
  startOfWeek.setDate(startOfDay.getDate() - ((startOfDay.getDay() + 6) % 7)); // Monday
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const sum = (since: number) =>
    items
      .filter((i) => i.kind !== "goal" && i.at >= since)
      .reduce((acc, i) => acc + (i.kg ?? 0), 0);

  return {
    items,
    today: sum(startOfDay.getTime()),
    week: sum(startOfWeek.getTime()),
    month: sum(startOfMonth.getTime()),
    count: items.filter((i) => i.kind !== "goal").length,
  };
}
