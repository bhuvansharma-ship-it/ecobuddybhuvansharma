import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createClient } from "@supabase/supabase-js";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { buildSystemPrompt } from "@/lib/ecobot-prompts";
import { userContext } from "@/lib/user-data";

type ChatRequestBody = { messages?: unknown };

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // Require authenticated Supabase user
        const authHeader = request.headers.get("authorization") ?? "";
        if (!authHeader.startsWith("Bearer ")) {
          return new Response("Unauthorized", { status: 401 });
        }
        const token = authHeader.slice("Bearer ".length).trim();
        if (!token) return new Response("Unauthorized", { status: 401 });

        const SUPABASE_URL = process.env.SUPABASE_URL;
        const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY;
        if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
          return new Response("Server auth not configured", { status: 500 });
        }
        const sb = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
          auth: { persistSession: false, autoRefreshToken: false },
        });
        const { data: claimsData, error: claimsError } = await sb.auth.getClaims(token);
        const claims = claimsData?.claims as { sub?: string; email?: string } | undefined;
        if (claimsError || !claims?.sub) {
          return new Response("Unauthorized", { status: 401 });
        }

        // Block the shared demo account from consuming AI credits.
        const DEMO_EMAIL = process.env.DEMO_EMAIL?.toLowerCase();
        if (DEMO_EMAIL && claims.email?.toLowerCase() === DEMO_EMAIL) {
          return new Response("Demo accounts cannot use chat. Please sign up.", { status: 403 });
        }

        let body: ChatRequestBody;
        try {
          body = (await request.json()) as ChatRequestBody;
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }
        const { messages } = body;
        if (!Array.isArray(messages)) {
          return new Response("Messages are required", { status: 400 });
        }

        // Bound payload size to prevent runaway AI token consumption.
        const MAX_MESSAGES = 50;
        const MAX_MSG_CHARS = 4000;
        if (messages.length === 0) {
          return new Response("Messages cannot be empty", { status: 400 });
        }
        if (messages.length > MAX_MESSAGES) {
          return new Response(`Too many messages (max ${MAX_MESSAGES})`, { status: 400 });
        }
        for (const msg of messages as UIMessage[]) {
          const parts = Array.isArray(msg?.parts) ? msg.parts : [];
          let textLen = 0;
          for (const p of parts) {
            if (p && (p as { type?: string }).type === "text") {
              textLen += String((p as { text?: string }).text ?? "").length;
            }
          }
          if (textLen > MAX_MSG_CHARS) {
            return new Response(`Message too long (max ${MAX_MSG_CHARS} chars)`, { status: 400 });
          }
        }

        const key = process.env.LOVABLE_API_KEY;
        if (!key) {
          return new Response("Missing LOVABLE_API_KEY", { status: 500 });
        }

        const gateway = createLovableAiGatewayProvider(key);
        const model = gateway("google/gemini-3-flash-preview");

        const result = streamText({
          model,
          system: buildSystemPrompt(userContext),
          messages: await convertToModelMessages(messages as UIMessage[]),
        });

        return result.toUIMessageStreamResponse({
          originalMessages: messages as UIMessage[],
        });
      },
    },
  },
});
