# Infrastructure

## Environments

| Environment | Branch | Database | Stripe | Clerk |
|---|---|---|---|---|
| dev | `dev` | Neon dev branch | test keys | dev instance |
| prod | `main` | Neon prod branch | live keys | prod instance |

## Hosting

Vercel. `main` → Production deploy, `dev` → Development deploy, every PR → its own
preview deployment.

## CI/CD

GitHub Actions (`.github/workflows/ci.yml`) runs `lint`, `type-check`, `test` (Vitest),
and `e2e` (Playwright) on every PR against `main` or `dev`. Both branches require all
four checks green plus one approving review before merge (branch protection).

The `test` job runs `tests/unit` only (`vitest.config.ts`). `tests/integration` (e.g.
`tests/integration/db.test.ts`, which round-trips the real Neon dev database) is
excluded from CI because no `DATABASE_URL` secret is configured there yet; run it
on demand locally with `npm run test:integration`. Adding a `DATABASE_URL` GitHub
Actions secret so CI can run database integration tests is a future follow-up.

The `test` job does not yet enforce the 80% coverage threshold from `CLAUDE.md`'s
Testing section — Phase 0's source is scaffolding only (layouts, config, one placeholder
admin page), so a coverage number here wouldn't mean anything yet. Wiring `--coverage`
and the threshold gate into this job is a Phase 1 follow-up, once `lib/availability` and
`lib/pricing` give coverage something real to measure.

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
