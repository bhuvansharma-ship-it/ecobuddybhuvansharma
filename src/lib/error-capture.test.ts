import { describe, it, expect, vi, afterEach } from "vitest";
import { consumeLastCapturedError } from "./error-capture";

afterEach(() => {
  vi.useRealTimers();
  consumeLastCapturedError();
});

describe("consumeLastCapturedError", () => {
  it("returns undefined when nothing captured", () => {
    expect(consumeLastCapturedError()).toBeUndefined();
  });

  it("captures window error events and clears after read", () => {
    const err = new Error("boom");
    window.dispatchEvent(new ErrorEvent("error", { error: err }));
    expect(consumeLastCapturedError()).toBe(err);
    expect(consumeLastCapturedError()).toBeUndefined();
  });

  it("captures unhandledrejection reason", () => {
    const reason = new Error("rej");
    const ev = new Event("unhandledrejection") as PromiseRejectionEvent;
    Object.defineProperty(ev, "reason", { value: reason });
    window.dispatchEvent(ev);
    expect(consumeLastCapturedError()).toBe(reason);
  });

  it("expires after TTL", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(0));
    window.dispatchEvent(new ErrorEvent("error", { error: new Error("x") }));
    vi.setSystemTime(new Date(10_000));
    expect(consumeLastCapturedError()).toBeUndefined();
  });
});
