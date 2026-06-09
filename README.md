<div align="center">

# 🌱 EcoBot

**Your AI-powered sustainability coach**

Track your carbon footprint, get personalized eco-friendly tips, and chat with EcoBot — all in a beautiful, mobile-first web app.

[Live Preview](https://id-preview--fae454d2-81d8-4c79-82b0-cba16959c688.lovable.app)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Development](#-development)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Security](#-security)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)

---

## 🌍 Overview

EcoBot is a full-stack web application that helps users understand and reduce their environmental impact. It combines a rich carbon-tracking dashboard with an AI chat assistant (powered by Google's Gemini via the Lovable AI Gateway) that provides personalized sustainability advice based on the user's actual data.

The app is built with modern web technologies, emphasizing performance, accessibility, and security.

---

## ✨ Features

### 🏠 Dashboard
- **Carbon Summary** — At-a-glance view of your sustainability score and monthly progress
- **Interactive Charts** — Visualize emission trends and category breakdowns
- **Daily FYI Cards** — Bite-sized sustainability facts and tips
- **Quick Actions** — Log eco-friendly actions (e.g., walked instead of drove)
- **Challenge Tracker** — Gamified weekly sustainability challenges
- **Insight Cards** — Personalized recommendations based on your data

### 🤖 AI Chat (EcoBot)
- **Streaming Responses** — Real-time AI replies with typing indicators
- **Context-Aware** — EcoBot knows your footprint, goals, and recent actions
- **Suggested Prompts** — One-tap starters like "How can I reduce my footprint today?"
- **Persistent History** — Chat history saved in `localStorage`
- **Clear Conversation** — Reset chat anytime

### 🔐 Authentication
- **Email / Password** — Secure sign-up and sign-in via Supabase Auth
- **Session Persistence** — Automatic token refresh
- **Demo Account** — Quick try-before-you-sign-up experience
- **HIBP Protection** — Have I Been Pwned password breach checking enabled

### 🎨 Design & UX
- **Mobile-First** — Optimized for phones with safe-area insets and touch targets
- **Glassmorphism UI** — Frosted glass cards with backdrop blur
- **Eco Theme** — Emerald/leaf color palette with dark-mode ready tokens
- **Smooth Animations** — Floating EcoBot avatar, shimmer loading states
- **Accessible** — Semantic HTML, ARIA labels, keyboard-navigable

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | [TanStack Start](https://tanstack.com/start) v1 — Full-stack React with SSR/SSG |
| **UI Library** | React 19 |
| **Language** | TypeScript 5 (strict mode) |
| **Styling** | Tailwind CSS v4 + `tw-animate-css` |
| **Components** | [shadcn/ui](https://ui.shadcn.com) (Radix UI primitives) |
| **Routing** | TanStack Router (file-based) |
| **State / Data** | TanStack Query v5 |
| **Auth & DB** | Supabase (PostgreSQL + Row Level Security) |
| **AI** | [AI SDK](https://sdk.vercel.ai) + Lovable AI Gateway (Google Gemini) |
| **Build Tool** | Vite 7 |
| **Package Manager** | Bun |
| **Testing** | Vitest + React Testing Library + jsdom |
| **Linting** | ESLint 9 + Prettier |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Browser (Client)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  React 19 UI │  │ TanStack     │  │   Supabase Client    │  │
│  │  (Tailwind)  │  │   Query      │  │  (Auth + Realtime)   │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Cloudflare Worker (Edge)                    │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │              TanStack Start Server / SSR                 │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌────────────────┐  │  │
│  │  │ File Routes │  │ Server Fns  │  │  API Routes      │  │  │
│  │  │  (pages)    │  │  (RPC)      │  │ /api/chat      │  │  │
│  │  └─────────────┘  └─────────────┘  │ /api/public/*  │  │  │
│  │                                     └────────────────┘  │  │
│  └─────────────────────────────────────────────────────────┘  │
│                              │
│                    ┌─────────┴─────────┐                     │
│                    ▼                   ▼                       │
│           ┌─────────────┐      ┌──────────────┐               │
│           │  Supabase   │      │ Lovable AI   │               │
│           │  (DB/Auth)  │      │   Gateway    │               │
│           └─────────────┘      └──────────────┘               │
└─────────────────────────────────────────────────────────────────┘
```

### Key Architectural Decisions

- **File-Based Routing** — All routes under `src/routes/` are automatically registered by the TanStack Router Vite plugin.
- **Server Routes for APIs** — HTTP endpoints live in `src/routes/api/*` and return raw `Response` objects.
- **Server Functions for App Logic** — `createServerFn` from `@tanstack/react-start` is used for internal RPC calls (e.g., auth-protected data fetching).
- **Edge-First** — Runs on Cloudflare Workers. No `child_process`, `fs.watch`, or native binary dependencies.

---

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh) (recommended) or Node.js 20+
- A [Supabase](https://supabase.com) project
- A [Lovable](https://lovable.dev) account (for AI Gateway access)

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/your-org/ecobot.git
cd ecobot

# 2. Install dependencies
bun install

# 3. Set up environment variables (see below)
cp .env .env.local

# 4. Run the dev server
bun run dev
```

The app will be available at `http://localhost:3000`.

### Environment Variables

Create a `.env.local` file with the following variables:

```bash
# Supabase (required)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_PUBLISHABLE_KEY=your-anon-key
SUPABASE_PROJECT_ID=your-project-id
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
VITE_SUPABASE_PROJECT_ID=your-project-id

# AI Gateway (required for chat)
LOVABLE_API_KEY=your-lovable-api-key

# Optional: block demo account from chat
DEMO_EMAIL=demo@example.com
```

> **Note:** Never commit `.env.local` or any file containing secrets to Git.

---

## 💻 Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start the Vite development server with HMR |
| `bun run build` | Production build (SSR + static assets) |
| `bun run build:dev` | Development build |
| `bun run preview` | Preview the production build locally |
| `bun run lint` | Run ESLint across the codebase |
| `bun run format` | Auto-format with Prettier |
| `bun run test` | Run all Vitest tests once |
| `bun run test:watch` | Run Vitest in watch mode |

### Adding a New Route

TanStack Router uses file-based routing. Simply create a file:

```
src/routes/about.tsx    →  /about
src/routes/settings.tsx →  /settings
```

The plugin auto-registers the route in `routeTree.gen.ts` — **do not edit that file manually**.

### Adding a Server API Endpoint

Create a file under `src/routes/api/` with a `server` block:

```ts
// src/routes/api/my-endpoint.ts
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/my-endpoint")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        return Response.json({ hello: "world" });
      },
    },
  },
});
```

---

## 🧪 Testing

Tests are written with **Vitest** and **React Testing Library**.

```bash
# Run all tests
bun run test

# Watch mode
bun run test:watch
```

Current test coverage includes:
- **API Auth Gate** — Verifies `/api/chat` rejects unauthorized and malformed requests with 401.

To add new tests, create `*.test.ts` or `*.test.tsx` files alongside the code they test.

---

## 🚢 Deployment

This project is configured for **Cloudflare Workers** (the default target for TanStack Start via the Lovable Vite plugin).

### Build

```bash
bun run build
```

### Publish

```bash
# If using Wrangler
npx wrangler deploy
```

Or deploy via your preferred platform that supports Vite + Edge runtimes (e.g., Vercel, Netlify, Lovable Cloud).

---

## 🔒 Security

| Feature | Implementation |
|---------|----------------|
| **Auth** | Supabase JWT with Bearer token validation on every AI chat request |
| **RLS** | Row Level Security enabled on all user-facing tables |
| **Input Validation** | Zod schemas on auth forms; payload bounds on chat API (max 50 messages, 4000 chars each) |
| **Password Security** | HIBP breach checking enabled; minimum 6 characters |
| **Demo Isolation** | Demo accounts are blocked from consuming AI credits server-side |
| **XSS Prevention** | No `dangerouslySetInnerHTML` on user input; sanitized markdown rendering |
| **CSRF** | Same-origin policy on server functions; no CORS needed for internal RPC |

---

## 📁 Project Structure

```
ecobot/
├── public/                    # Static assets (icons, manifest, PWA)
├── src/
│   ├── components/
│   │   ├── ai-elements/       # Reusable AI chat UI components
│   │   ├── auth/              # Login, signup, user menu
│   │   ├── ecobot/            # EcoBot widget, avatar, animations
│   │   ├── home/              # Dashboard cards and sections
│   │   ├── layout/            # Device frame, root wrappers
│   │   └── ui/                # shadcn/ui primitives (Button, Input, etc.)
│   ├── hooks/                 # Custom React hooks
│   ├── integrations/
│   │   └── supabase/          # Supabase clients (browser + server + auth middleware)
│   ├── lib/
│   │   ├── ai-gateway.server.ts   # Lovable AI Gateway provider setup
│   │   ├── chat-transport.ts      # Authenticated AI SDK transport
│   │   ├── ecobot-prompts.ts      # System prompt builder + suggested prompts
│   │   ├── error-capture.ts       # SSR error tracking
│   │   ├── error-page.ts          # Friendly 500 error page
│   │   ├── lovable-error-reporting.ts
│   │   └── user-data.ts           # Mock user context for AI personalization
│   ├── routes/                # File-based routes (pages + API endpoints)
│   │   ├── api/
│   │   │   ├── chat.ts        # AI chat streaming endpoint
│   │   │   └── public/
│   │   │       └── demo-session.ts  # Demo account token generation
│   │   ├── __root.tsx         # Root layout (HTML shell, providers, meta tags)
│   │   ├── index.tsx          # Home / Dashboard
│   │   ├── auth.tsx           # Sign in / Sign up
│   │   └── chat.tsx           # AI chat page
│   ├── styles.css             # Global styles, Tailwind theme tokens
│   ├── router.tsx             # TanStack Router bootstrap
│   ├── server.ts              # Custom SSR entry (error handling wrapper)
│   ├── start.ts               # TanStack Start instance config
│   └── test/
│       └── setup.ts           # Vitest + jest-dom setup
├── supabase/
│   └── migrations/            # Database migrations (SQL)
├── .env                       # Public env vars (committed — only safe ones)
├── .env.local                 # Private secrets (gitignored)
├── components.json            # shadcn/ui configuration
├── eslint.config.js           # ESLint flat config
├── package.json
├── tsconfig.json
├── vite.config.ts             # Vite + TanStack Start config
└── vitest.config.ts           # Test configuration
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards

- **TypeScript strict mode** — all code must be fully typed.
- **ESLint + Prettier** — run `bun run lint` and `bun run format` before committing.
- **No `console.log`** in production code — use the error reporting utilities instead.
- **Server-side safety** — do not use Node-only modules (`child_process`, `fs.watch`, native binaries) in server functions.
- **Accessibility** — include `aria-label` on icon buttons, ensure color contrast meets WCAG AA.

---

<div align="center">

Made with 💚 for the planet.

</div>
