import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the AI gateway + supabase so we can exercise validation paths
// without making any network calls.
vi.mock("@/lib/ai-gateway.server", () => ({
  createLovableAiGatewayProvider: () => () => ({ id: "mock-model" }),
}));

vi.mock("ai", async () => {
  return {
    convertToModelMessages: async (m: unknown) => m,
    streamText: () => ({
      toUIMessageStreamResponse: () => new Response("ok", { status: 200 }),
    }),
  };
});

const getClaims = vi.fn();
vi.mock("@supabase/supabase-js", () => ({
  createClient: () => ({ auth: { getClaims } }),
}));

type PostHandler = (args: { request: Request }) => Promise<Response>;
async function getHandler(): Promise<PostHandler> {
  const mod = (await import("@/routes/api/chat")) as unknown as {
    Route: { options: { server: { handlers: { POST: PostHandler } } } };
  };
  return mod.Route.options.server.handlers.POST;
}

function authedReq(body: unknown) {
  return new Request("http://localhost/api/chat", {
    method: "POST",
    headers: { authorization: "Bearer good-token", "content-type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

beforeEach(() => {
  getClaims.mockReset();
  process.env.SUPABASE_URL = "http://localhost";
  process.env.SUPABASE_PUBLISHABLE_KEY = "anon";
  process.env.LOVABLE_API_KEY = "test-key";
  delete process.env.DEMO_EMAIL;
});

describe("api/chat auth gate", () => {
  it("rejects requests without Authorization header", async () => {
    const handler = await getHandler();
    const res = await handler({
      request: new Request("http://localhost/api/chat", { method: "POST" }),
    });
    expect(res.status).toBe(401);
  });

  it("rejects malformed Authorization header", async () => {
    const handler = await getHandler();
    const res = await handler({
      request: new Request("http://localhost/api/chat", {
        method: "POST",
        headers: { authorization: "Basic abc" },
      }),
    });
    expect(res.status).toBe(401);
  });

  it("rejects when claims lookup fails", async () => {
    getClaims.mockResolvedValue({ data: null, error: new Error("bad token") });
    const handler = await getHandler();
    const res = await handler({ request: authedReq({ messages: [] }) });
    expect(res.status).toBe(401);
  });
});

describe("api/chat input validation", () => {
  beforeEach(() => {
    getClaims.mockResolvedValue({
      data: { claims: { sub: "user-1", email: "u@example.com" } },
      error: null,
    });
  });

  it("returns 400 for invalid JSON", async () => {
    const handler = await getHandler();
    const res = await handler({
      request: new Request("http://localhost/api/chat", {
        method: "POST",
        headers: { authorization: "Bearer good-token", "content-type": "application/json" },
        body: "{not json",
      }),
    });
    expect(res.status).toBe(400);
  });

  it("returns 400 when messages is not an array", async () => {
    const handler = await getHandler();
    const res = await handler({ request: authedReq({ messages: "hello" }) });
    expect(res.status).toBe(400);
  });

  it("returns 400 for empty messages array", async () => {
    const handler = await getHandler();
    const res = await handler({ request: authedReq({ messages: [] }) });
    expect(res.status).toBe(400);
  });

  it("rejects when there are too many messages", async () => {
    const handler = await getHandler();
    const messages = Array.from({ length: 51 }, (_, i) => ({
      id: String(i),
      role: "user",
      parts: [{ type: "text", text: "hi" }],
    }));
    const res = await handler({ request: authedReq({ messages }) });
    expect(res.status).toBe(400);
  });

  it("rejects oversized single message", async () => {
    const handler = await getHandler();
    const big = "x".repeat(4001);
    const res = await handler({
      request: authedReq({
        messages: [{ id: "1", role: "user", parts: [{ type: "text", text: big }] }],
      }),
    });
    expect(res.status).toBe(400);
    expect(await res.text()).toMatch(/Message too long/);
  });

  it("returns 200 with a valid payload", async () => {
    const handler = await getHandler();
    const res = await handler({
      request: authedReq({
        messages: [{ id: "1", role: "user", parts: [{ type: "text", text: "hello" }] }],
      }),
    });
    expect(res.status).toBe(200);
  });
});

describe("api/chat demo account guard", () => {
  it("returns 403 when DEMO_EMAIL matches", async () => {
    process.env.DEMO_EMAIL = "demo@example.com";
    getClaims.mockResolvedValue({
      data: { claims: { sub: "demo", email: "Demo@Example.com" } },
      error: null,
    });
    const handler = await getHandler();
    const res = await handler({
      request: authedReq({
        messages: [{ id: "1", role: "user", parts: [{ type: "text", text: "hi" }] }],
      }),
    });
    expect(res.status).toBe(403);
  });
});

describe("api/chat env var branches", () => {
  beforeEach(() => {
    getClaims.mockResolvedValue({
      data: { claims: { sub: "user-1", email: "u@example.com" } },
      error: null,
    });
  });

  it("returns 500 when SUPABASE_URL is missing", async () => {
    delete process.env.SUPABASE_URL;
    process.env.SUPABASE_PUBLISHABLE_KEY = "anon";
    const handler = await getHandler();
    const res = await handler({
      request: authedReq({
        messages: [{ id: "1", role: "user", parts: [{ type: "text", text: "hi" }] }],
      }),
    });
    expect(res.status).toBe(500);
  });

  it("returns 500 when SUPABASE_PUBLISHABLE_KEY is missing", async () => {
    process.env.SUPABASE_URL = "http://localhost";
    delete process.env.SUPABASE_PUBLISHABLE_KEY;
    const handler = await getHandler();
    const res = await handler({
      request: authedReq({
        messages: [{ id: "1", role: "user", parts: [{ type: "text", text: "hi" }] }],
      }),
    });
    expect(res.status).toBe(500);
  });

  it("returns 500 when LOVABLE_API_KEY is missing", async () => {
    process.env.SUPABASE_URL = "http://localhost";
    process.env.SUPABASE_PUBLISHABLE_KEY = "anon";
    delete process.env.LOVABLE_API_KEY;
    const handler = await getHandler();
    const res = await handler({
      request: authedReq({
        messages: [{ id: "1", role: "user", parts: [{ type: "text", text: "hi" }] }],
      }),
    });
    expect(res.status).toBe(500);
  });
});
