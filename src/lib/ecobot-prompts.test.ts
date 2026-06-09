import { describe, it, expect } from "vitest";
import { buildSystemPrompt, suggestedPrompts } from "./ecobot-prompts";
import type { UserContext } from "./user-data";

const fixture: UserContext = {
  name: "Ada",
  joinedDays: 10,
  sustainabilityScore: 80,
  scoreLabel: "Great",
  monthlyGoalKg: 50,
  monthlyProgressKg: 25,
  saved: { today: 1, week: 5, month: 25, yearToDate: 200 },
  topCategories: [
    { name: "Transport", percentage: 40, kgCo2PerMonth: 100 },
    { name: "Food", percentage: 30, kgCo2PerMonth: 75 },
  ],
  trend: { weekVsLastWeek: -5, monthVsLastMonth: -10 },
  recentActions: [{ label: "Biked to work", kgCo2: 2.4, whenLabel: "today" }],
};

describe("buildSystemPrompt", () => {
  it("embeds user profile data", () => {
    const out = buildSystemPrompt(fixture);
    expect(out).toContain("Ada");
    expect(out).toContain("80/100");
    expect(out).toContain("Great");
    expect(out).toContain("50 kg");
  });

  it("lists every top category and recent action", () => {
    const out = buildSystemPrompt(fixture);
    expect(out).toContain("Transport: 40%");
    expect(out).toContain("Food: 30%");
    expect(out).toContain("Biked to work");
  });

  it("includes trend numbers", () => {
    const out = buildSystemPrompt(fixture);
    expect(out).toContain("-5%");
    expect(out).toContain("-10%");
  });

  it("handles empty arrays without crashing", () => {
    const out = buildSystemPrompt({ ...fixture, topCategories: [], recentActions: [] });
    expect(out).toContain("EMISSION CATEGORIES");
    expect(out).toContain("RECENT ACTIONS");
  });
});

describe("suggestedPrompts", () => {
  it("exposes a non-empty list of unique strings", () => {
    expect(suggestedPrompts.length).toBeGreaterThan(0);
    expect(new Set(suggestedPrompts).size).toBe(suggestedPrompts.length);
    for (const p of suggestedPrompts) expect(p.length).toBeGreaterThan(0);
  });
});
