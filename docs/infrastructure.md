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

**Release gate:** CI passing alone does not promote to prod. After CI is green on a PR
into `dev`, the change is manually reviewed on the dev environment (click through the
booking flow + any visual change) before a separate PR merges `dev` into `main`.

## Local development

Docker (`docker/Dockerfile.dev`), no local Postgres — connects over the network to the
Neon dev branch. See `README.md` for setup steps.

## Monitoring

- **Sentry** — unhandled exceptions, both environments.
- **Axiom** — structured JSON logs via Pino, both environments.
- **Uptime monitoring** — configured in Phase 7, once there's a real deployed URL worth
  monitoring continuously.

## Dependency updates

Dependabot (`.github/dependabot.yml`), weekly, grouped dev-dependency PRs, gated by the
same CI checks as any other PR.

## Deploy / rollback

Deploys are automatic on push (`dev`) or merge (`main`) via Vercel's Git integration. To
roll back, use Vercel's dashboard "Instant Rollback" to the previous deployment, or
revert the merge commit on `main` and let CI/CD redeploy.
