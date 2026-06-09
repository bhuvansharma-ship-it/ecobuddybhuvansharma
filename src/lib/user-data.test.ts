import { describe, it, expect } from "vitest";
import { userContext, dailyFyi, proactiveInsight } from "./user-data";

describe("user-data fixtures", () => {
  it("exposes a coherent userContext shape", () => {
    expect(userContext.name).toBeTypeOf("string");
    expect(userContext.sustainabilityScore).toBeGreaterThanOrEqual(0);
    expect(userContext.sustainabilityScore).toBeLessThanOrEqual(100);
    expect(userContext.monthlyProgressKg).toBeLessThanOrEqual(userContext.monthlyGoalKg);
    expect(userContext.topCategories.length).toBeGreaterThan(0);
  });

  it("topCategories percentages sum to ~100", () => {
    const sum = userContext.topCategories.reduce((a, c) => a + c.percentage, 0);
    expect(sum).toBeGreaterThanOrEqual(99);
    expect(sum).toBeLessThanOrEqual(101);
  });

  it("recentActions all have non-empty labels and positive kgCo2", () => {
    for (const a of userContext.recentActions) {
      expect(a.label.length).toBeGreaterThan(0);
      expect(a.kgCo2).toBeGreaterThan(0);
    }
  });

  it("trend values are numeric", () => {
    expect(typeof userContext.trend.weekVsLastWeek).toBe("number");
    expect(typeof userContext.trend.monthVsLastMonth).toBe("number");
  });

  it("dailyFyi and proactiveInsight expose required fields", () => {
    expect(dailyFyi.fact.length).toBeGreaterThan(10);
    expect(dailyFyi.source).toBeTruthy();
    expect(proactiveInsight.title).toBeTruthy();
    expect(proactiveInsight.body).toBeTruthy();
    expect(proactiveInsight.cta).toBeTruthy();
  });
});
