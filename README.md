# Automated Invoice Generator

Single-page invoice tool built with Next.js, Tailwind CSS, and shadcn/ui. Gated by
HTTP Basic Auth (see `src/proxy.ts`) — the app refuses all traffic until
`BASIC_AUTH_USER`/`BASIC_AUTH_PASSWORD` are configured.

## Features

- Interactive form for client details, line items (qty × unit price), and tax %
- Live side-by-side invoice preview
- Client-side PDF export via `@react-pdf/renderer` (no server rendering)
- Stripe Checkout link generation per invoice (test or live mode, by which key you use)

## Getting Started

```bash
cp .env.local.example .env.local   # fill in the required values, see below
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and log in with the
`BASIC_AUTH_USER` / `BASIC_AUTH_PASSWORD` you set.

> This app was scaffolded with Next.js 16, which is a Turbopack-first release with
> some breaking changes from earlier versions — see `AGENTS.md` for pointers into
> the bundled docs before making structural changes.

## Environment Variables

See `.env.local.example` for full details. Summary:

- `BASIC_AUTH_USER` / `BASIC_AUTH_PASSWORD` — required, gates the whole app
- `STRIPE_SECRET_KEY` / `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — used by
  `/api/create-checkout-session`
- `SITE_URL` — canonical URL used for Stripe redirect URLs; never derived from
  request headers
