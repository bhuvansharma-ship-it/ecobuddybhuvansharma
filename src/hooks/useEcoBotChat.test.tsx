import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

const sendMessage = vi.fn();
const setMessages = vi.fn();
let mockStatus: "ready" | "submitted" | "streaming" = "ready";
let capturedOnError: ((err: unknown) => void) | undefined;

vi.mock("@ai-sdk/react", () => ({
  useChat: (cfg: { onError: (e: unknown) => void }) => {
    capturedOnError = cfg.onError;
    return {
      messages: [],
      sendMessage,
      setMessages,
      status: mockStatus,
    };
  },
}));

vi.mock("@/lib/chat-transport", () => ({
  createAuthedChatTransport: vi.fn(() => ({ kind: "mock-transport" })),
}));

const errorToast = vi.fn();
vi.mock("sonner", () => ({
  toast: { error: (m: string) => errorToast(m) },
}));

import { useEcoBotChat, renderMessageText } from "./useEcoBotChat";

beforeEach(() => {
  localStorage.clear();
  sendMessage.mockClear();
  setMessages.mockClear();
  errorToast.mockClear();
  mockStatus = "ready";
});
afterEach(() => localStorage.clear());

describe("renderMessageText", () => {
  it("joins text parts and ignores non-text parts", () => {
    const text = renderMessageText({
      id: "1",
      role: "assistant",
      parts: [
        { type: "text", text: "Hello " },
        { type: "step-start" },
        { type: "text", text: "world" },
      ],
    } as never);
    expect(text).toBe("Hello world");
  });
});

describe("useEcoBotChat", () => {
  it("send() trims and forwards text", () => {
    const { result } = renderHook(() => useEcoBotChat());
    act(() => result.current.send("  hi  "));
    expect(sendMessage).toHaveBeenCalledWith({ text: "hi" });
  });

  it("send() is a no-op for empty input", () => {
    const { result } = renderHook(() => useEcoBotChat());
    act(() => result.current.send("   "));
    expect(sendMessage).not.toHaveBeenCalled();
  });

  it("send() is a no-op while loading", () => {
    mockStatus = "streaming";
    const { result } = renderHook(() => useEcoBotChat());
    expect(result.current.isLoading).toBe(true);
    act(() => result.current.send("hi"));
    expect(sendMessage).not.toHaveBeenCalled();
  });

  it("clear() resets messages and removes storage", () => {
    localStorage.setItem("ecobot:messages:v1", "[]");
    const { result } = renderHook(() => useEcoBotChat());
    act(() => result.current.clear());
    expect(setMessages).toHaveBeenCalledWith([]);
    expect(localStorage.getItem("ecobot:messages:v1")).toBeNull();
  });

  it("onError toast maps 429 to a rate-limit message", () => {
    renderHook(() => useEcoBotChat());
    capturedOnError?.(new Error("status 429 too many"));
    expect(errorToast).toHaveBeenCalledWith("EcoBot is busy — try again in a moment.");
  });

  it("onError toast maps 402 to credit exhaustion", () => {
    renderHook(() => useEcoBotChat());
    capturedOnError?.(new Error("402 payment required"));
    expect(errorToast).toHaveBeenCalledWith(
      "AI credits exhausted. Add credits in Workspace settings.",
    );
  });

  it("onError toast falls back to a generic message", () => {
    renderHook(() => useEcoBotChat());
    capturedOnError?.(new Error("boom"));
    expect(errorToast).toHaveBeenCalledWith("EcoBot hit a snag. Please try again.");
  });

  it("onError toast handles non-Error values", () => {
    renderHook(() => useEcoBotChat());
    capturedOnError?.("plain string error");
    expect(errorToast).toHaveBeenCalledWith("EcoBot hit a snag. Please try again.");
  });

  it("loadStoredMessages returns [] when localStorage item is null", () => {
    localStorage.removeItem("ecobot:messages:v1");
    const { result } = renderHook(() => useEcoBotChat());
    expect(result.current.messages).toEqual([]);
  });

  it("loadStoredMessages returns [] when stored value is not an array", () => {
    localStorage.setItem("ecobot:messages:v1", JSON.stringify("not-array"));
    const { result } = renderHook(() => useEcoBotChat());
    expect(result.current.messages).toEqual([]);
  });

  it("loadStoredMessages returns [] when localStorage has invalid JSON", () => {
    localStorage.setItem("ecobot:messages:v1", "{broken");
    const { result } = renderHook(() => useEcoBotChat());
    expect(result.current.messages).toEqual([]);
  });
});
