import { describe, it, expect, vi, afterEach } from "vitest";

afterEach(() => {
  vi.useRealTimers();
  // Reset the module cache so we can re-test module-level branches
  vi.resetModules();
});

describe("consumeLastCapturedError", () => {
  it("returns undefined when nothing captured", async () => {
    const { consumeLastCapturedError } = await import("./error-capture");
    expect(consumeLastCapturedError()).toBeUndefined();
  });

  it("captures window error events and clears after read", async () => {
    const { consumeLastCapturedError } = await import("./error-capture");
    const err = new Error("boom");
    window.dispatchEvent(new ErrorEvent("error", { error: err }));
    expect(consumeLastCapturedError()).toBe(err);
    expect(consumeLastCapturedError()).toBeUndefined();
  });

  it("captures error event itself when error property is missing", async () => {
    const { consumeLastCapturedError } = await import("./error-capture");
    const ev = new ErrorEvent("error", { message: "fallback" });
    window.dispatchEvent(ev);
    expect(consumeLastCapturedError()).toBe(ev);
  });

  it("captures unhandledrejection reason", async () => {
    const { consumeLastCapturedError } = await import("./error-capture");
    const reason = new Error("rej");
    const ev = new Event("unhandledrejection") as PromiseRejectionEvent;
    Object.defineProperty(ev, "reason", { value: reason });
    window.dispatchEvent(ev);
    expect(consumeLastCapturedError()).toBe(reason);
  });

  it("expires after TTL", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(0));
    const { consumeLastCapturedError } = await import("./error-capture");
    window.dispatchEvent(new ErrorEvent("error", { error: new Error("x") }));
    vi.setSystemTime(new Date(10_000));
    expect(consumeLastCapturedError()).toBeUndefined();
  });

  it("does not attach listeners when addEventListener is missing", async () => {
    const originalAddEventListener = globalThis.addEventListener;
    try {
      // @ts-expect-error -- intentionally invalid for test
      globalThis.addEventListener = undefined;
      // Re-importing with no addEventListener should not throw
      const { consumeLastCapturedError } = await import("./error-capture");
      expect(consumeLastCapturedError()).toBeUndefined();
    } finally {
      globalThis.addEventListener = originalAddEventListener;
    }
  });
});
