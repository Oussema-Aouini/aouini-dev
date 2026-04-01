This is a personal portfolio built with Next.js, React, Tailwind CSS, Framer Motion, and React Three Fiber.

## Getting Started

First, install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open `http://localhost:3000` with your browser to see the result.

## Chat Setup

The chat zone uses Anthropic via `app/api/chat/route.ts`.

### Quick Start Without Paying Credits

Set mock mode in `.env.local`:

```bash
CHAT_MODE=mock
```

In mock mode, the API streams simulated answers so you can finish and deploy the chat UX without provider billing.

### Chat Modes

`CHAT_MODE` supports:

1. `mock`
Always uses local simulated responses (no API credits needed).
1. `gemini`
Uses Google Gemini API (free tier available, hosted-friendly).
1. `anthropic`
Always uses Anthropic API (requires funded credits).
1. `auto`
Uses Anthropic when `ANTHROPIC_API_KEY` exists, otherwise Gemini when `GEMINI_API_KEY` exists, otherwise falls back to mock mode.

1. Create a `.env.local` file in the project root.
1. Add your key:

```bash
ANTHROPIC_API_KEY=your_key_here
```

Optional (recommended for now):

```bash
CHAT_MODE=mock
```

Hosted free-tier setup option (recommended if you cannot fund Anthropic yet):

```bash
CHAT_MODE=gemini
GEMINI_API_KEY=your_google_ai_key
# Optional
GEMINI_MODEL=gemini-2.0-flash
```

### Deployment Health Check

After deployment, verify chat provider wiring with:

`/api/chat/health`

It returns the configured `CHAT_MODE`, resolved runtime mode, provider key presence booleans, and non-sensitive warnings.

1. Make sure your Anthropic account has active credits/billing.

Without credits, the API returns `invalid_request_error` and chat is intentionally blocked with a user-friendly message.

## Chat Troubleshooting

If chat is failing, check the cases below:

1. `MISSING_API_KEY`
Set `ANTHROPIC_API_KEY` in `.env.local` and restart `npm run dev`.
1. `ANTHROPIC_AUTH`
Your key is invalid or unauthorized. Regenerate the key and update `.env.local`.
1. `ANTHROPIC_BILLING`
Your credits are exhausted or billing is inactive. Top up credits in Anthropic billing.
1. `ANTHROPIC_RATE_LIMIT`
Too many requests in a short time. Wait briefly and retry.

Server-side diagnostics are logged in the Next.js terminal with minimal metadata and request IDs (when provided by Anthropic).

## Scripts

```bash
npm run dev
npm run lint
npm run build
npm run start
```

## Notes

This repository includes custom agent instructions in `AGENTS.md`.
Because this project uses a newer Next.js version, verify behavior against docs under `node_modules/next/dist/docs/` when adopting new patterns.
