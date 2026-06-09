import { describe, it, expect, vi } from "vitest";
import { subscribeEcoBot, openEcoBot, sendToEcoBot } from "./ecobot-bus";

describe("ecobot-bus", () => {
  it("notifies subscribers on openEcoBot with no prompt", () => {
    const listener = vi.fn();
    const unsub = subscribeEcoBot(listener);
    openEcoBot();
    expect(listener).toHaveBeenCalledWith(undefined);
    unsub();
  });

  it("notifies subscribers on sendToEcoBot with prompt", () => {
    const listener = vi.fn();
    const unsub = subscribeEcoBot(listener);
    sendToEcoBot("hello");
    expect(listener).toHaveBeenCalledWith("hello");
    unsub();
  });

  it("unsubscribe stops further notifications", () => {
    const listener = vi.fn();
    const unsub = subscribeEcoBot(listener);
    unsub();
    openEcoBot();
    sendToEcoBot("x");
    expect(listener).not.toHaveBeenCalled();
  });

  it("supports multiple subscribers", () => {
    const a = vi.fn();
    const b = vi.fn();
    const ua = subscribeEcoBot(a);
    const ub = subscribeEcoBot(b);
    sendToEcoBot("ping");
    expect(a).toHaveBeenCalledWith("ping");
    expect(b).toHaveBeenCalledWith("ping");
    ua();
    ub();
  });
});
