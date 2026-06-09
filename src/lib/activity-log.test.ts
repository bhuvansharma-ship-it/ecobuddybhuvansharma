import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import {
  ACTIVITY_KEY,
  ACTIVITY_EVENT,
  loadActivity,
  saveActivity,
  useActivityTotals,
  type LoggedItem,
} from "./activity-log";

beforeEach(() => {
  localStorage.clear();
});

const make = (overrides: Partial<LoggedItem> = {}): LoggedItem => ({
  id: Math.random().toString(36),
  kind: "trip",
  title: "t",
  detail: "2.5 kg saved",
  at: Date.now(),
  ...overrides,
});

describe("loadActivity", () => {
  it("returns [] when empty", () => {
    expect(loadActivity()).toEqual([]);
  });

  it("returns [] on malformed JSON", () => {
    localStorage.setItem(ACTIVITY_KEY, "not-json");
    expect(loadActivity()).toEqual([]);
  });

  it("parses kg from detail when missing", () => {
    const item = { ...make(), kg: undefined } as LoggedItem;
    localStorage.setItem(ACTIVITY_KEY, JSON.stringify([item]));
    expect(loadActivity()[0].kg).toBe(2.5);
  });

  it("preserves explicit kg", () => {
    localStorage.setItem(ACTIVITY_KEY, JSON.stringify([make({ kg: 9 })]));
    expect(loadActivity()[0].kg).toBe(9);
  });

  it("returns [] when window is undefined (SSR)", () => {
    const originalWindow = globalThis.window;
    // @ts-expect-error
    globalThis.window = undefined;
    expect(loadActivity()).toEqual([]);
    globalThis.window = originalWindow;
  });

  it("returns 0 kg when detail has no kg match", () => {
    const item = { ...make(), detail: "no weight here", kg: undefined } as LoggedItem;
    localStorage.setItem(ACTIVITY_KEY, JSON.stringify([item]));
    expect(loadActivity()[0].kg).toBe(0);
  });
});

describe("saveActivity", () => {
  it("persists and dispatches event", () => {
    let fired = false;
    window.addEventListener(ACTIVITY_EVENT, () => (fired = true));
    saveActivity([make({ kg: 1 })]);
    expect(JSON.parse(localStorage.getItem(ACTIVITY_KEY)!)).toHaveLength(1);
    expect(fired).toBe(true);
  });

  it("no-ops when window is undefined (SSR)", () => {
    const originalWindow = globalThis.window;
    // @ts-expect-error
    globalThis.window = undefined;
    expect(() => saveActivity([make({ kg: 1 })])).not.toThrow();
    globalThis.window = originalWindow;
  });
});

describe("useActivityTotals", () => {
  it("sums today/week/month, excludes goals, and updates on event", () => {
    const now = Date.now();
    const items: LoggedItem[] = [
      make({ kg: 1, at: now }),
      make({ kg: 2, at: now, kind: "goal" }), // excluded
    ];
    saveActivity(items);
    const { result } = renderHook(() => useActivityTotals());
    expect(result.current.today).toBe(1);
    expect(result.current.week).toBe(1);
    expect(result.current.month).toBe(1);
    expect(result.current.count).toBe(1);

    act(() => {
      saveActivity([...items, make({ kg: 3, at: now })]);
    });
    expect(result.current.today).toBe(4);
  });
});
