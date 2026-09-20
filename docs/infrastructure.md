# Infrastructure

## Environments

| Environment | Branch | Database         | Stripe    | Clerk         |
| ----------- | ------ | ---------------- | --------- | ------------- |
| dev         | `dev`  | Neon dev branch  | test keys | dev instance  |
| prod        | `main` | Neon prod branch | live keys | prod instance |

## Hosting

Vercel. `main` → Production deploy, `dev` → Development deploy, every PR → its own
preview deployment.

## CI/CD

GitHub Actions (`.github/workflows/ci.yml`) runs `lint`, `type-check`, `test` (Vitest),
and `e2e` (Playwright) on every PR against `main` or `dev`. Both branches require all
four checks green before merge (branch protection); there is no required-approving-review
count, since GitHub can't satisfy that for a solo developer's own PRs (self-approval isn't
allowed) — `enforce_admins` is also off so the repo owner can merge once checks are green.

(The "workflow must already exist on the base branch" restriction only applies to
`pull_request` runs from forked repositories, for security reasons — this repo has no
forks, so a same-repo PR runs its checks normally the first time a workflow file is
added, confirmed by PR #1's `lint`/`type-check`/`test`/`e2e` runs, which executed and
gated the merge before `dev` had `ci.yml` in its own tree. The only real first-time
wrinkle: GitHub took roughly a minute to register and start the very first workflow run
in this repo — after that, runs start immediately.)

The `test` job runs `tests/unit` only (`vitest.config.ts`). `tests/integration` (e.g.
`tests/integration/db.test.ts`, which round-trips the real Neon dev database) is
excluded from CI because the `test` job is given no `DATABASE_URL`; run it on demand
locally with `npm run test:integration`. Pointing the `test` job at the same
`DATABASE_URL_CI` secret the `e2e` job uses (below), so CI runs the database integration
tests too, is a future follow-up.

The `test` job runs `npm run test:coverage` and enforces the 80% per-file threshold over
the scoped globs described in `docs/architecture.md` ("Coverage gate scope").

### The `e2e` job's database (Phase 2)

Phase 2's pages render real database content, so `generateStaticParams` returns `[]` and
every catalog/tour/blog page builds empty against an unseeded database — the Playwright
suite would fail on a technicality rather than on a regression. The `e2e` job therefore
runs `npx prisma migrate deploy` and `npm run db:seed` against a dedicated database
before `npm run test:e2e` (whose `webServer` does the Next.js build).

> **Pending human action — not yet provisioned.** That job reads
> `DATABASE_URL` from a `DATABASE_URL_CI` GitHub Actions repository secret, which does
> **not** exist yet. Create a dedicated Neon branch (e.g. `ci`, branched off `dev`) so CI
> seeding never collides with local development, and add its connection string as
> `DATABASE_URL_CI` under Settings → Secrets and variables → Actions. Until that secret
> exists, the `e2e` job runs against an empty `DATABASE_URL` and fails.

### `REVALIDATE_SECRET`

Unlike every other entry in `.env.example`, `REVALIDATE_SECRET` is not issued by an
external dashboard — it is self-generated (`openssl rand -hex 32`) and set independently
per environment in Vercel, because dev and prod must not be able to bust each other's
cache. It is the sole credential on `POST /api/revalidate` (see `docs/architecture.md`).

**Release gate:** CI passing alone does not promote to prod. After CI is green on a PR
into `dev`, the change is manually reviewed on the dev environment (click through the
booking flow + any visual change) before a separate PR merges `dev` into `main`.

## Local development

Docker (`docker/Dockerfile.dev`), no local Postgres — connects over the network to the
Neon dev branch. See `README.md` for setup steps.

## Monitoring

- **Sentry** — unhandled exceptions, both environments. Wired via `@sentry/nextjs`
  (`instrumentation-client.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`,
  `instrumentation.ts`), DSN from `SENTRY_DSN`.
- **Axiom** — structured JSON logs via Pino, both environments. Wired via
  `lib/logging/logger.ts` (`pino` + `@axiomhq/pino` transport), `AXIOM_TOKEN` and
  `AXIOM_DATASET` from env.
- **Uptime monitoring** — configured in Phase 7, once there's a real deployed URL worth
  monitoring continuously.

## Dependency updates

Dependabot (`.github/dependabot.yml`), weekly, grouped dev-dependency PRs, gated by the
same CI checks as any other PR.

## Deploy / rollback

Deploys are automatic on push (`dev`) or merge (`main`) via Vercel's Git integration. To
roll back, use Vercel's dashboard "Instant Rollback" to the previous deployment, or
revert the merge commit on `main` and let CI/CD redeploy.

## Vercel Blob (blog photos)

Admin blog photo uploads are stored in Vercel Blob, one store per environment (dev and
prod). The store issues `BLOB_READ_WRITE_TOKEN`: set it in Vercel and in `.env.local`;
only the name is mirrored in `.env.example`, never the value. Get it from the Vercel
dashboard > Storage > the Blob store. The project owner enters it, not an agent. Uploads
are public and served from the `*.public.blob.vercel-storage.com` host (allowed in
`next.config.ts` `images.remotePatterns`). Posts deleted in the admin leave their photos
in the store.
