# 🌱 EcoBot — AI Sustainability Coach

**Your AI-powered sustainability coach**

Track your carbon footprint, get personalized eco-friendly tips, and chat with EcoBot — all in a beautiful, mobile-first web app.

[Live Preview](https://id-preview--fae454d2-81d8-4c79-82b0-cba16959c688.lovable.app)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Development](#-development)
- [Testing](#-testing)
- [Security](#-security)
- [Project Structure](#-project-structure)

---

## 🌍 Overview

EcoBot is a full-stack web application that helps users understand and reduce their environmental impact. It combines a rich carbon-tracking dashboard with an AI chat assistant that provides personalized sustainability advice grounded in the user's actual data.

---

## ✨ Features

- **Dashboard** — Carbon summary, interactive charts, daily tips, quick actions, challenge tracker, insights
- **AI Chat** — Streaming responses from EcoBot with context-aware advice based on your footprint data
- **Authentication** — Email/password auth via Supabase with session persistence and demo account support
- **Mobile-First Design** — Glassmorphism UI, eco theme, smooth animations, accessible

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | TanStack Start v1 (full-stack React with SSR/SSG) |
| **UI** | React 19, Tailwind CSS v4, shadcn/ui |
| **Language** | TypeScript 5 (strict mode) |
| **Routing** | TanStack Router (file-based) |
| **Data** | TanStack Query v5 |
| **Auth & DB** | Supabase (PostgreSQL + RLS) |
| **AI** | AI SDK + Lovable AI Gateway (Google Gemini) |
| **Build** | Vite 7, Bun |
| **Testing** | Vitest + React Testing Library |

---

## 🏗️ Architecture

```
┌─────────────┐     ┌─────────────────────────────┐     ┌──────────────┐
│   Browser   │────▶│  TanStack Start (Edge/SSR)  │────▶│  Supabase    │
│  React + TS │◀────│  • File Routes (pages)      │◀────│  Auth + DB   │
└─────────────┘     │  • Server Functions (RPC)     │     └──────────────┘
                    │  • API Routes (/api/*)        │
                    └─────────────────────────────┘     ┌──────────────┐
                                                        │ Lovable AI   │
                                                        │   Gateway    │
                                                        └──────────────┘
```

- **File-based routing** — routes under `src/routes/` auto-register
- **Server Routes** — HTTP endpoints in `src/routes/api/*` return raw `Response`
- **Server Functions** — `createServerFn` for internal auth-protected RPC
- **Edge runtime** — Cloudflare Workers; no Node-only modules

---

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh) (or Node.js 20+)
- Supabase project
- Lovable account (for AI Gateway)

### Installation

```bash
git clone <repo-url>
cd ecobot
bun install
```

### Environment Variables

Create `.env.local`:

```bash
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_PUBLISHABLE_KEY=your-anon-key
SUPABASE_PROJECT_ID=your-project-id
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
VITE_SUPABASE_PROJECT_ID=your-project-id

# AI Gateway
LOVABLE_API_KEY=your-lovable-api-key

# Optional: block demo from chat
DEMO_EMAIL=demo@example.com
```

### Run

```bash
bun run dev   # http://localhost:3000
```

---

## 💻 Development

| Command | Description |
|---------|-------------|
| `bun run dev` | Dev server with HMR |
| `bun run build` | Production build |
| `bun run preview` | Preview production build |
| `bun run lint` | ESLint |
| `bun run format` | Prettier |
| `bun run test` | Run tests |
| `bun run test:watch` | Watch mode |

### Add a Route

Create a file in `src/routes/`:

```
src/routes/about.tsx    →  /about
```

The TanStack Router Vite plugin auto-registers it. Do not edit `routeTree.gen.ts` manually.

---

## 🧪 Testing

```bash
bun run test        # once
bun run test:watch  # watch mode
```

Current coverage: API auth gate tests for `/api/chat`.

Add tests by creating `*.test.ts` or `*.test.tsx` files.

---

## 🔒 Security

| Feature | Implementation |
|---------|----------------|
| **Auth** | Supabase JWT; Bearer token validation on every AI request |
| **RLS** | Row Level Security on all user tables |
| **Input Validation** | Zod on forms; payload bounds (max 50 msgs, 4000 chars) |
| **Passwords** | HIBP breach checking; min 6 chars |
| **Demo Isolation** | Server-side block on demo accounts consuming AI credits |
| **XSS** | No `dangerouslySetInnerHTML` on user input |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── ai-elements/      # Chat UI primitives (conversation, message, prompt-input, shimmer)
│   ├── auth/             # Auth forms, user menu, demo auto-login
│   ├── ecobot/           # EcoBot widget, avatar, animations
│   ├── home/             # Dashboard sections (charts, summary, cards, tracker)
│   ├── layout/             # Device frame, root layout wrappers
│   └── ui/               # shadcn/ui primitives
├── hooks/                # Custom React hooks
├── integrations/
│   └── supabase/         # Browser + server clients, auth middleware
├── lib/
│   ├── ai-gateway.server.ts   # AI Gateway provider
│   ├── chat-transport.ts        # Authenticated AI SDK transport
│   ├── ecobot-prompts.ts        # System prompt + suggested prompts
│   ├── error-capture.ts         # SSR error tracking
│   └── user-data.ts             # Mock user context for AI
├── routes/
│   ├── api/
│   │   ├── chat.ts            # Streaming AI chat endpoint
│   │   └── public/
│   │       └── demo-session.ts  # Demo token generation
│   ├── __root.tsx             # Root layout, meta tags, providers
│   ├── index.tsx              # Home / Dashboard
│   ├── auth.tsx               # Sign in / Sign up
│   └── chat.tsx               # AI chat page
├── styles.css             # Global styles, Tailwind theme tokens
├── router.tsx             # TanStack Router bootstrap
├── server.ts              # Custom SSR entry (error wrapper)
├── start.ts               # TanStack Start config
└── test/
    └── setup.ts           # Vitest setup
```

---

<div align="center">

Made with 💚 for the planet.

</div>
