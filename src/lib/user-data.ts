// Mock user data – the single source of truth EcoBot reads from for
// context-aware answers. Replace with real data when auth is added.

export type CategoryBreakdown = {
  name: string;
  percentage: number;
  kgCo2PerMonth: number;
};

export type UserContext = {
  name: string;
  joinedDays: number;
  sustainabilityScore: number; // 0–100
  scoreLabel: string;
  monthlyGoalKg: number;
  monthlyProgressKg: number; // how much they've already saved this month
  saved: {
    today: number;
    week: number;
    month: number;
    yearToDate: number;
  };
  topCategories: CategoryBreakdown[];
  trend: {
    weekVsLastWeek: number; // % change (negative = better)
    monthVsLastMonth: number;
  };
  recentActions: { label: string; kgCo2: number; whenLabel: string }[];
};

export const userContext: UserContext = {
  name: "Alex",
  joinedDays: 47,
  sustainabilityScore: 72,
  scoreLabel: "On a good streak",
  monthlyGoalKg: 40,
  monthlyProgressKg: 27,
  saved: {
    today: 1.4,
    week: 9.2,
    month: 27,
    yearToDate: 184,
  },
  topCategories: [
    { name: "Transportation", percentage: 42, kgCo2PerMonth: 86 },
    { name: "Food", percentage: 24, kgCo2PerMonth: 49 },
    { name: "Home Energy", percentage: 20, kgCo2PerMonth: 41 },
    { name: "Shopping", percentage: 14, kgCo2PerMonth: 28 },
  ],
  trend: {
    weekVsLastWeek: -12,
    monthVsLastMonth: -8,
  },
  recentActions: [
    { label: "Took the bus to work", kgCo2: 2.1, whenLabel: "today" },
    { label: "Vegetarian dinner", kgCo2: 1.6, whenLabel: "yesterday" },
    { label: "Cycled instead of drove", kgCo2: 3.4, whenLabel: "2 days ago" },
  ],
};

export const dailyFyi = {
  fact: "A single tree absorbs roughly 21 kg of CO₂ per year. Planting native species in your area magnifies the impact.",
  source: "EcoBot Daily FYI",
};

export const proactiveInsight = {
  title: "Transportation is your biggest emitter",
  body: "Switching one weekly commute to public transport could save about 45 kg CO₂ over the next year — a 9% drop in your footprint.",
  cta: "Start the public-transport challenge",
};
