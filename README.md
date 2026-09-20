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

1. **Clone the repo and check out `dev`** (the active development branch — `main` only
   ever receives merges from `dev` after a manual release gate, so it will look empty
   of app code until then):

   ```bash
   git clone https://github.com/mariya-kindrat/bolzanostreetfoodtour.git
   cd bolzanostreetfoodtour
   git checkout dev
   ```

2. **Set up environment variables.** Copy `.env.example` to `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

   Fill in `.env.local` with dev/test values — `.env.example` lists which dashboard
   each one comes from (Neon, Stripe, Clerk, Resend, OpenRouter, Sentry, Axiom). At
   minimum you need `DATABASE_URL` (a Neon **dev** branch connection string) to run
   migrations and hit the database; the app will run without the rest, just with those
   integrations disabled/erroring.

3. **Install dependencies** (needed even if you plan to run via Docker, so editors/
   type-checking work and so `prisma generate` produces the client):

   ```bash
   npm install
   ```

4. **Apply database migrations** against your Neon dev branch:

   ```bash
   npx prisma migrate deploy
   ```

   (`migrate dev` also works locally and is what you use when you're adding a new
   migration; `migrate deploy` just applies existing ones without prompting.)

5. **Seed the database** with the real tour, blog and transfer content:

   ```bash
   npm run db:seed
   ```

   This step is required, not optional: without it every catalog, tour and blog page
   renders empty, because `generateStaticParams` returns `[]` against an unseeded
   database. The seed is idempotent, so re-running it is safe.

6. **Start the app**, either with Docker Compose (simplest — builds `docker/Dockerfile.dev`
   and wires up `.env.local`, still connecting to the Neon **dev** branch over the network,
   not a local Postgres container):

   ```bash
   docker compose up
   ```

   or the same thing without Compose:

   ```bash
   docker build -f docker/Dockerfile.dev -t bsft-dev .
   docker run --rm -p 3000:3000 --env-file .env.local bsft-dev
   ```

   or directly with Node:

   ```bash
   npm run dev
   ```

   Then open [http://localhost:3000](http://localhost:3000).

### Blog (admin)

Manage posts at `/admin/blog` (Clerk sign-in). A post has a title, excerpt, tags, an
optional cover photo (with alt text) and a Markdown body; use Add photo in the body to
upload and insert a picture. Unchecked "Published" saves a draft that is not shown on the
site. Deleting a post is permanent. Photo uploads need `BLOB_READ_WRITE_TOKEN` in
`.env.local` (Vercel dashboard > Storage > Blob store).

## Running tests

- Unit: `npm run test`
- Unit + coverage gate: `npm run test:coverage` (this is what CI's `test` job runs). It
  enforces an 80% per-file threshold, currently scoped to `lib/availability/**`,
  `lib/pricing/**`, `lib/content/**` and `lib/seo/**` — minus `lib/availability/hold.ts`
  and the thin Prisma wrappers `lib/content/tours.ts`, `transfers.ts` and `blog.ts`,
  which are covered by integration tests instead. See `docs/architecture.md` for why the
  scope is narrower than the whole codebase.
- Integration (needs `.env.local` with a real `DATABASE_URL`, not run in CI —
  see `vitest.config.ts`): `npm run test:integration`
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
- [`planning/PLAN.md`](planning/PLAN.md) — phase roadmap
- [`planning/project-progress.md`](planning/project-progress.md) — running log of
  what's been built, bugs found and fixed, and open concerns, phase by phase
