# Plan: EcoBot Sustainability App

A green-themed home screen with a persistent floating EcoBot AI chatbot powered by Lovable AI (Gemini), with conversation history persisted in browser localStorage.

## Scope (MVP)

1. **Design system** — warm, friendly green/cream palette in `src/styles.css` (oklch tokens). Rounded, soft shadows, subtle motion. Generate an EcoBot mascot/logo via image generation.

2. **Home screen** (`src/routes/index.tsx`) with sections in order:
   - Welcome (greets user with mock name, current date)
   - Carbon Saved Summary — Day / Week / Month tiles (mock data)
   - Daily FYI Carbon Fact card
   - EcoBot inline preview card (CTA → opens chat panel)
   - Quick Actions grid (Log trip, Log meal, Set goal, View history)
   - AI Recommendation / Insight card (proactive "EcoBot Insight" with Learn More / Start Challenge / Ask EcoBot actions)

3. **Mock user data** in `src/lib/user-data.ts` — footprint by category, weekly/monthly savings, score, goal progress. This is the source of truth EcoBot reads from for context-aware answers. (No auth/database — user chose localStorage.)

4. **EcoBot floating chat**
   - Floating action button bottom-right, visible on every route (mounted in `__root.tsx`).
   - Expandable panel with header (EcoBot avatar, name, minimize/close), suggested-prompts row above input, message list, composer.
   - Built on AI Elements: `conversation`, `message`, `prompt-input`, `shimmer`.
   - Suggested prompts (tap to send): reduce footprint today, explain score, biggest emitter, daily challenge, savings this month.
   - One ongoing conversation persisted to `localStorage` (`ecobot:messages` UIMessage array). "Clear conversation" button in header.
   - Friendly, encouraging, concise personality via system prompt; mock user data injected each request.

5. **AI backend** — `src/routes/api/chat.ts` TanStack Start server route, streams via AI SDK + Lovable AI Gateway (`google/gemini-3-flash-preview`). Receives messages + a `userContext` snapshot from the client, builds system prompt, streams response via `toUIMessageStreamResponse`.

6. **Client** — `useChat` with `DefaultChatTransport` pointed at `/api/chat`, `id: "ecobot-main"`, messages bootstrapped from localStorage, persisted on each update. Render `message.parts` with markdown. Optimistic user message + "Thinking…" shimmer while `status === 'submitted'`.

## Out of scope (future)
Voice input, image/receipt scanning, location, smart-home, weekly reports, real auth/database, real carbon API. Mock data is clearly labeled.

## Technical details

- **Stack**: TanStack Start (already scaffolded), AI SDK (`ai`, `@ai-sdk/react`, `@ai-sdk/openai-compatible`), AI Elements components, Lovable AI Gateway via shared provider helper in `src/lib/ai-gateway.server.ts`.
- **Files added**:
  - `src/styles.css` (update tokens)
  - `src/lib/ai-gateway.server.ts` (gateway helper)
  - `src/lib/user-data.ts` (mock user context)
  - `src/lib/ecobot-prompts.ts` (system prompt + suggested prompts)
  - `src/routes/api/chat.ts` (streaming server route)
  - `src/components/ecobot/EcoBotWidget.tsx` (FAB + panel)
  - `src/components/ecobot/EcoBotInlineCard.tsx` (home preview)
  - `src/components/home/*` (Welcome, CarbonSummary, DailyFyi, QuickActions, InsightCard)
  - `src/routes/__root.tsx` (mount EcoBotWidget globally)
  - `src/routes/index.tsx` (compose home)
  - `src/assets/ecobot-avatar.png` (generated)
- **AI Elements install**: `bunx ai-elements@latest add conversation message prompt-input shimmer`.
- **Persistence**: localStorage key `ecobot:messages`, schema = AI SDK `UIMessage[]`. Guarded by `typeof window !== 'undefined'`.
- **Security**: `LOVABLE_API_KEY` read only inside the server route handler. No secrets in client.
- **Error handling**: 429 → toast "EcoBot is busy, try again in a moment"; 402 → toast "AI credits exhausted — add credits in Workspace settings".

Approve and I'll build.