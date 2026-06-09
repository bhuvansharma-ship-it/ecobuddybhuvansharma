import { describe, it, expect } from "vitest";

// Smoke test: the /api/chat handler must reject requests without an Authorization bearer token.
describe("api/chat auth gate", () => {
  it("rejects requests without Authorization header", async () => {
    const mod = await import("@/routes/api/chat");
    const handler = (mod as any).Route.options.server.handlers.POST;
    const req = new Request("http://localhost/api/chat", { method: "POST" });
    const res = await handler({ request: req });
    expect(res.status).toBe(401);
  });

  it("rejects requests with malformed Authorization header", async () => {
    const mod = await import("@/routes/api/chat");
    const handler = (mod as any).Route.options.server.handlers.POST;
    const req = new Request("http://localhost/api/chat", {
      method: "POST",
      headers: { authorization: "Basic abc" },
    });
    const res = await handler({ request: req });
    expect(res.status).toBe(401);
  });
});
