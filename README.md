# Automated Invoice Generator

Single-page invoice tool built with Next.js, Tailwind CSS, and shadcn/ui.

## Features

- Interactive form for client details, line items (qty × unit price), and tax %
- Live side-by-side invoice preview
- Client-side PDF export via `@react-pdf/renderer` (no server rendering)
- Email delivery of the generated PDF via [Resend](https://resend.com)
- Stripe test-mode Checkout link generation per invoice

## Getting Started

```bash
cp .env.local.example .env.local   # fill in RESEND_API_KEY / STRIPE_SECRET_KEY
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> This app was scaffolded with Next.js 16, which is a Turbopack-first release with
> some breaking changes from earlier versions — see `AGENTS.md` for pointers into
> the bundled docs before making structural changes.

## Environment Variables

See `.env.local.example`:

- `RESEND_API_KEY` / `INVOICE_FROM_EMAIL` — used by `/api/send-invoice`
- `STRIPE_SECRET_KEY` / `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — used by `/api/create-checkout-session`
