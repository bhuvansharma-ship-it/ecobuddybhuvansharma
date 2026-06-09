import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";

const unsubscribe = vi.fn();
let authChangeCb: ((event: string, session: unknown) => void) | undefined;
let resolveSession: (v: { data: { session: unknown } }) => void = () => {};
const signOut = vi.fn().mockResolvedValue({ error: null });

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      onAuthStateChange: (cb: (e: string, s: unknown) => void) => {
        authChangeCb = cb;
        return { data: { subscription: { unsubscribe } } };
      },
      getSession: () =>
        new Promise<{ data: { session: unknown } }>((r) => {
          resolveSession = r;
        }),
      signOut,
    },
  },
}));

beforeEach(() => {
  unsubscribe.mockClear();
  signOut.mockClear();
});

describe("useAuth", () => {
  it("initializes loading, loads session, listens for changes, and unsubscribes", async () => {
    const { useAuth } = await import("./useAuth");
    const { result, unmount } = renderHook(() => useAuth());
    expect(result.current.loading).toBe(true);
    expect(result.current.user).toBeNull();

    const session = { user: { id: "u1" } };
    await act(async () => {
      resolveSession({ data: { session } });
      await Promise.resolve();
    });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.user).toEqual({ id: "u1" });

    act(() => authChangeCb?.("SIGNED_OUT", null));
    expect(result.current.user).toBeNull();

    await act(async () => {
      await result.current.signOut();
    });
    expect(signOut).toHaveBeenCalled();

    unmount();
    expect(unsubscribe).toHaveBeenCalled();
  });

  it("handles null session from getSession", async () => {
    const { useAuth } = await import("./useAuth");
    const { result } = renderHook(() => useAuth());
    await act(async () => {
      resolveSession({ data: { session: null } });
      await Promise.resolve();
    });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.user).toBeNull();
  });
});
