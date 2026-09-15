# Bolzano Street Food Tour

Full rebuild of bolzanostreetfoodtour.com: custom booking/availability/payments, a
custom admin panel, and an AI agent — replacing the previous Wix site entirely.

## Prerequisites

- Node.js 22+
- Docker (for local dev)
- A Neon Postgres connection string (dev branch)
- Test-mode API keys for Stripe, Clerk, Resend, OpenRouter, Sentry, Axiom (see
  `.env.example` for the full list and where each comes from)

## Local setup

1. Copy `.env.example` to `.env.local` and fill in dev/test values.
2. Run with Docker:

   ```bash
   docker build -f docker/Dockerfile.dev -t bsft-dev .
   docker run --rm -p 3000:3000 --env-file .env.local bsft-dev
   ```

   Or without Docker:

   ```bash
   npm install
   npm run dev
   ```

3. Apply database migrations: `npx prisma migrate dev`

## Running tests

- Unit/integration: `npm run test`
- End-to-end: `npm run test:e2e`
- Lint: `npm run lint`
- Type-check: `npm run type-check`

## Documentation

- [`docs/architecture.md`](docs/architecture.md) — system architecture, data flow, key
  design decisions
- [`docs/infrastructure.md`](docs/infrastructure.md) — environments, hosting, CI/CD,
  monitoring, deploy/rollback
- [`docs/routes-and-components.md`](docs/routes-and-components.md) — route map and
  component inventory
- [`CLAUDE.md`](CLAUDE.md) — full project instructions and standards
- [`PLAN.md`](PLAN.md) — phase roadmap
