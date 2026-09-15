# Architecture

## Stack

Next.js (App Router) + TypeScript, full-stack — route handlers and server actions, no
separate backend service. Prisma ORM against Neon Postgres. Deployed on Vercel.

## Data flow

Request → Next.js route handler / server action → `lib/*` domain module → `lib/db.ts`
(Prisma client singleton) → Neon Postgres.

## Environments

Two environments: **dev** and **prod**, each with its own Neon database, Stripe key
pair, and Clerk instance. `main` branch deploys to prod, `dev` branch deploys to dev.

## Logging and monitoring

Structured JSON logs via Pino (`lib/logging/logger.ts`), shipped to Axiom. Sentry
captures unhandled exceptions only — routine flow logging goes through Pino/Axiom.

## Design decisions (Phase 0)

- No local Postgres container — Docker dev points at the Neon dev branch over the
  network, since Neon's branching model makes a throwaway local DB redundant.
- Prisma client is a global singleton (`lib/db.ts`) to avoid exhausting Neon's
  connection limit across Next.js hot-reloads in dev.

*(Phase 1 adds the Prisma schema and the availability/pricing/hold algorithms to this
document.)*
