import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import {
  todayKey,
  getTodaysChallenge,
  computeStreak,
  computeStats,
  dailyChallenges,
  useChallenges,
} from "./challenges";

beforeEach(() => {
  localStorage.clear();
});

describe("todayKey", () => {
  it("formats YYYY-MM-DD", () => {
    expect(todayKey(new Date("2025-06-09T12:34:56Z"))).toBe("2025-06-09");
  });
});

describe("getTodaysChallenge", () => {
  it("returns a challenge from the rotation", () => {
    const c = getTodaysChallenge();
    expect(dailyChallenges).toContainEqual(c);
  });
});

describe("computeStreak", () => {
  it("returns 0 with no completions", () => {
    expect(computeStreak({})).toBe(0);
  });

  it("counts today plus prior consecutive days", () => {
    const completions: Record<string, string> = {};
    for (let i = 0; i < 3; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      completions[todayKey(d)] = "x";
    }
    expect(computeStreak(completions)).toBe(3);
  });

  it("still counts prior streak when today is not done", () => {
    const completions: Record<string, string> = {};
    for (let i = 1; i <= 2; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      completions[todayKey(d)] = "x";
    }
    expect(computeStreak(completions)).toBe(2);
  });

  it("breaks on a gap", () => {
    const completions: Record<string, string> = {};
    const today = new Date();
    completions[todayKey(today)] = "x";
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    completions[todayKey(threeDaysAgo)] = "x";
    expect(computeStreak(completions)).toBe(1);
  });
});

describe("computeStats", () => {
  it("zeros when empty", () => {
    expect(computeStats({})).toEqual({ total: 0, last7: 0, weeklyRate: 0 });
  });

  it("counts total and last7 window", () => {
    const completions: Record<string, string> = {};
    for (let i = 0; i < 5; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      completions[todayKey(d)] = "x";
    }
    // also one outside the 7-day window
    const old = new Date();
    old.setDate(old.getDate() - 30);
    completions[todayKey(old)] = "x";
    const s = computeStats(completions);
    expect(s.total).toBe(6);
    expect(s.last7).toBe(5);
    expect(s.weeklyRate).toBe(Math.round((5 / 7) * 100));
  });
});

describe("useChallenges hook", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("starts uncompleted and toggles via complete/undo", () => {
    const { result } = renderHook(() => useChallenges());
    expect(result.current.completedToday).toBe(false);
    expect(result.current.streak).toBe(0);

    act(() => result.current.complete());
    expect(result.current.completedToday).toBe(true);
    expect(result.current.streak).toBe(1);

    act(() => result.current.undo());
    expect(result.current.completedToday).toBe(false);
  });

  it("loads pre-existing completions from storage", () => {
    const today = todayKey();
    const id = getTodaysChallenge().id;
    localStorage.setItem(
      "ecobot:challenges:v1",
      JSON.stringify({ completions: { [today]: id } }),
    );
    const { result } = renderHook(() => useChallenges());
    expect(result.current.completedToday).toBe(true);
  });
});
