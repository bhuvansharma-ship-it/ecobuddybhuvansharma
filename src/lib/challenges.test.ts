import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import {
  computeStreak,
  computeStats,
  todayKey,
  getTodaysChallenge,
  dailyChallenges,
  read,
  useChallenges,
} from "./challenges";

beforeEach(() => localStorage.clear());

describe("challenges pure helpers", () => {
  it("todayKey returns YYYY-MM-DD", () => {
    expect(todayKey(new Date("2025-01-02T10:00:00Z"))).toBe("2025-01-02");
  });

  it("getTodaysChallenge returns one of the daily challenges", () => {
    expect(dailyChallenges).toContain(getTodaysChallenge());
  });

  it("computeStreak returns 0 with no completions", () => {
    expect(computeStreak({})).toBe(0);
  });

  it("computeStreak counts consecutive prior days when today incomplete", () => {
    const completions: Record<string, string> = {};
    const d = new Date();
    d.setDate(d.getDate() - 1);
    completions[todayKey(d)] = "x";
    d.setDate(d.getDate() - 1);
    completions[todayKey(d)] = "x";
    expect(computeStreak(completions)).toBe(2);
  });

  it("computeStreak includes today when complete", () => {
    const completions = { [todayKey()]: "x" };
    expect(computeStreak(completions)).toBe(1);
  });

  it("computeStats returns totals and weekly rate", () => {
    const completions = { [todayKey()]: "x" };
    const s = computeStats(completions);
    expect(s.total).toBe(1);
    expect(s.last7).toBe(1);
    expect(s.weeklyRate).toBe(14);
  });

  it("read returns empty when storage missing", () => {
    expect(read()).toEqual({ completions: {} });
  });

  it("read returns empty on malformed JSON", () => {
    localStorage.setItem("ecobot:challenges:v1", "{bad");
    expect(read()).toEqual({ completions: {} });
  });

  it("read parses stored record", () => {
    localStorage.setItem(
      "ecobot:challenges:v1",
      JSON.stringify({ completions: { "2025-01-01": "transit" } }),
    );
    expect(read().completions["2025-01-01"]).toBe("transit");
  });
});

describe("useChallenges", () => {
  it("complete + undo round-trip", () => {
    const { result } = renderHook(() => useChallenges());
    expect(result.current.completedToday).toBe(false);
    act(() => result.current.complete());
    expect(result.current.completedToday).toBe(true);
    expect(result.current.streak).toBeGreaterThanOrEqual(1);
    act(() => result.current.undo());
    expect(result.current.completedToday).toBe(false);
  });
});
