import { describe, it, expect, vi } from "vitest";

vi.mock("@ai-sdk/openai-compatible", () => ({
  createOpenAICompatible: vi.fn((config) => ({ __config: config, marker: "provider" })),
}));

import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

describe("createLovableAiGatewayProvider", () => {
  it("configures the gateway base URL and auth headers", () => {
    const provider = createLovableAiGatewayProvider("test-key");
    expect(createOpenAICompatible).toHaveBeenCalledWith({
      name: "lovable",
      baseURL: "https://ai.gateway.lovable.dev/v1",
      headers: {
        "Lovable-API-Key": "test-key",
        "X-Lovable-AIG-SDK": "vercel-ai-sdk",
      },
    });
    expect((provider as { marker: string }).marker).toBe("provider");
  });
});
