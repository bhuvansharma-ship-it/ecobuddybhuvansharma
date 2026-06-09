import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
    },
  },
}));

import { createAuthedChatTransport } from "./chat-transport";
import { supabase } from "@/integrations/supabase/client";

const getSession = supabase.auth.getSession as unknown as ReturnType<typeof vi.fn>;

beforeEach(() => {
  getSession.mockReset();
});

async function resolveHeaders(transport: ReturnType<typeof createAuthedChatTransport>) {
  // DefaultChatTransport stores the headers option on the instance.
  const headers = (transport as unknown as { headers: () => Promise<Record<string, string>> }).headers;
  return await headers();
}

describe("createAuthedChatTransport", () => {
  it("attaches Bearer token when a session exists", async () => {
    getSession.mockResolvedValue({ data: { session: { access_token: "abc.def.ghi" } } });
    const t = createAuthedChatTransport("/api/chat");
    const headers = await resolveHeaders(t);
    expect(headers).toEqual({ Authorization: "Bearer abc.def.ghi" });
  });

  it("returns empty headers when no session", async () => {
    getSession.mockResolvedValue({ data: { session: null } });
    const t = createAuthedChatTransport("/api/chat");
    const headers = await resolveHeaders(t);
    expect(headers).toEqual({});
  });
});
