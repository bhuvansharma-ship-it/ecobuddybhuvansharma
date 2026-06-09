import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

type PostHandler = () => Promise<Response>;

const signInWithPassword = vi.fn();
const createUser = vi.fn();
vi.mock("@/integrations/supabase/client.server", () => ({
  supabaseAdmin: {
    auth: {
      signInWithPassword: (...a: unknown[]) => signInWithPassword(...a),
      admin: { createUser: (...a: unknown[]) => createUser(...a) },
    },
  },
}));

async function getHandler(): Promise<PostHandler> {
  const mod = await import("./demo-session");
  const handlers = (
    mod.Route as unknown as {
      options: { server: { handlers: { POST: PostHandler } } };
    }
  ).options.server.handlers;
  return handlers.POST;
}

const origEnv = { ...process.env };

beforeEach(() => {
  signInWithPassword.mockReset();
  createUser.mockReset();
  process.env.DEMO_EMAIL = "demo@example.com";
  process.env.DEMO_PASSWORD = "demo-pw";
});
afterEach(() => {
  process.env = { ...origEnv };
});

describe("/api/public/demo-session POST", () => {
  it("returns 503 when env vars are missing", async () => {
    delete process.env.DEMO_EMAIL;
    delete process.env.DEMO_PASSWORD;
    const handler = await getHandler();
    const res = await handler();
    expect(res.status).toBe(503);
  });

  it("returns tokens on successful sign-in", async () => {
    signInWithPassword.mockResolvedValueOnce({
      data: { session: { access_token: "a", refresh_token: "r" } },
    });
    const handler = await getHandler();
    const res = await handler();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ access_token: "a", refresh_token: "r" });
  });

  it("creates the demo user when first sign-in fails, then returns tokens", async () => {
    signInWithPassword.mockResolvedValueOnce({ data: { session: null } }).mockResolvedValueOnce({
      data: { session: { access_token: "a2", refresh_token: "r2" } },
    });
    createUser.mockResolvedValueOnce({});
    const handler = await getHandler();
    const res = await handler();
    expect(createUser).toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ access_token: "a2", refresh_token: "r2" });
  });

  it("returns 500 when sign-in keeps failing", async () => {
    signInWithPassword
      .mockResolvedValueOnce({ data: { session: null } })
      .mockResolvedValueOnce({ data: { session: null } });
    createUser.mockResolvedValueOnce({});
    const handler = await getHandler();
    const res = await handler();
    expect(res.status).toBe(500);
  });

  it("returns 500 when supabase throws", async () => {
    signInWithPassword.mockRejectedValueOnce(new Error("boom"));
    const handler = await getHandler();
    const res = await handler();
    expect(res.status).toBe(500);
  });
});
