# Bolzano Street Food Tour — Project Instructions for Claude Code

## Project

Full rebuild of https://www.bolzanostreetfoodtour.com/ (currently Wix). Replaces the Wix
site entirely: custom-built booking/availability/payments (no third-party booking SaaS),
a custom admin panel, and an AI agent embedded on both the public site and the admin panel.

Discovery inputs (read these before starting any phase):
- `files/bolzanostreetfoodtour-site-analysis.md` — old site structure, components, tech, issues
- `files/bolzanostreetfoodtour-content-inventory.xlsx` — all migratable copy/pricing/content
- `files/photo-library-reference-guide.md` — stock photo sourcing starting points

## Precedence override

This file overrides the global `~/.claude/CLAUDE.md` Python/`uv` tooling defaults for this
project only. This is a **TypeScript project** — use `npm`/`pnpm`, never `uv`/`python3`.
Every other global instruction (simple/incremental work, no overengineering, root-cause
debugging, short files/functions, no emojis, sparse comments) still applies.

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js (App Router) + TypeScript, full-stack (route handlers / server actions, no separate backend) |
| Database | Postgres via **Neon** (managed) |
| ORM | Prisma |
| Hosting | Vercel |
| Auth (admin only) | Clerk |
| Payments | Stripe (Checkout/Payment Intents + refunds) |
| Transactional email | Resend |
| AI agent | OpenRouter (model-agnostic, tool-calling) |
| Error monitoring | Sentry |
| Structured logs | Pino (JSON) → Axiom (free tier) |
| Uptime monitoring | Better Uptime or UptimeRobot |
| Analytics | Vercel Analytics + a cookieless tool (Plausible or Fathom) — no ad pixels |
| Unit/integration tests | Vitest |
| E2E tests | Playwright (incl. multi-viewport mobile emulation) |
| Dependency updates | Dependabot or Renovate |

## Environments

Two environments only: **dev** and **prod**, each with its own Neon Postgres database,
its own Stripe key pair (test vs. live), and its own Clerk instance.

- `main` branch → prod (auto-deploy on merge)
- `dev` branch → dev environment (auto-deploy on push)
- Every PR → its own Vercel preview deployment
- **Release gate:** after CI is green, changes are manually reviewed on the dev
  environment (click through the booking flow + any visual change) before merging to
  `main`. CI passing alone is not sufficient to promote to prod.

Local development runs the Next.js app in Docker, connected over the network to the
**Neon dev branch** — there is no local Postgres container.

### Environment variables (per environment, set in Vercel + mirrored in `.env.example`)

```text
DATABASE_URL
STRIPE_SECRET_KEY
STRIPE_PUBLISHABLE_KEY
STRIPE_WEBHOOK_SECRET
CLERK_SECRET_KEY
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
RESEND_API_KEY
OPENROUTER_API_KEY
SENTRY_DSN
AXIOM_TOKEN
AXIOM_DATASET
NEXT_PUBLIC_SITE_URL
```

Never commit real values. `.env.example` lists names only. Local dev uses `.env.local`
pointed at the Neon **dev** branch's connection string and Stripe/Clerk **test** keys.

**Real secret values are always supplied by the user, never by an agent.** An agent's job
is limited to creating/maintaining `.env.example` (names only) and empty placeholder
files, plus a short note on which dashboard/service each value comes from. If a real key
or connection string is needed to proceed, stop and ask the user to provide or enter it
directly — do not invent, guess, reuse a value from elsewhere, or write a plausible-looking
placeholder into a file that looks like a real secret.

## Architecture / Folder Structure

```text
app/
  (marketing)/          # home, about, contact, legal pages
  (catalog)/             # cooking-classes, wine-tours, winter-tours catalog pages
  tours/[slug]/           # tour detail + booking widget
  private-transfers/
  blog/[slug]/
  admin/                  # Clerk-protected admin panel
  api/                    # route handlers: stripe webhooks, agent endpoints, revalidate
components/
  ui/                     # design-system primitives (Alpine Editorial tokens)
  marketing/
  booking/
  admin/
lib/
  availability/           # seasonal windows, date overrides, blackout dates, capacity holds
  pricing/                # tier pricing + coupon math
  stripe/
  email/
  ai-agent/               # OpenRouter client + tool definitions (client + admin agents)
  logging/                # Pino logger setup
  db.ts                   # Prisma client singleton
prisma/
  schema.prisma
  migrations/
  seed.ts                 # seeds initial content from the content inventory
types/                    # shared TypeScript interfaces/types — reused, never duplicated
tests/
  unit/
  integration/
  e2e/                    # Playwright specs, incl. mobile viewport variants
docker/
  Dockerfile.dev
docs/
  architecture.md
  infrastructure.md
  routes-and-components.md
  superpowers/plans/       # one detailed bite-sized plan per phase (generated just before
                            # that phase starts — see PLAN.md)
.github/workflows/ci.yml
README.md
```

## Documentation (living, not a one-time task)

Documentation is a deliverable of every phase, not a final write-up at the end. Keep
these current as the project grows:

```text
README.md                        # quick start: what this is, prerequisites, how to run
                                  # locally (incl. Docker), how to run tests, links below
docs/
  architecture.md                 # system architecture: how the pieces fit together,
                                   # data flow (request -> route -> lib -> Prisma -> Neon),
                                   # key design decisions and why (booking concurrency
                                   # model, ISR strategy, AI agent confirm-before-apply)
  infrastructure.md               # environments, hosting (Vercel), database (Neon),
                                   # Docker local setup, CI/CD pipeline, monitoring/alerting
                                   # (Sentry/Axiom/uptime), how to deploy, how to roll back
  routes-and-components.md        # full route map (every app/ page + api/ route, what it
                                   # does, auth requirements) and component inventory
                                   # (component name, location, purpose, used by which
                                   # routes) - kept current as routes/components are added
  superpowers/plans/               # per-phase detailed implementation plans (see PLAN.md)
```

**Rule:** a phase is not done until its README/docs updates are part of the same PR as
the code — e.g. Phase 3 (Booking Engine) is not complete until `routes-and-components.md`
lists the new booking routes and `architecture.md` describes the concurrency-hold design.
This is exactly the kind of documentation drift the code-review gate below should catch.

## Coding Standards

- TypeScript `strict` mode. No `any` unless justified with a comment explaining why.
- Define shared types/interfaces once in `types/` (or colocated if only used within one
  module) and import them — never redeclare the same shape in two places.
- No overengineering: don't build abstractions, config layers, or flexibility the current
  requirement doesn't need. Three similar lines beat a premature helper.
- Short, focused files and functions. One clear responsibility per file.
- Sparse comments — only for non-obvious *why* (a workaround, a business rule, a subtle
  invariant), never for *what* the code does.
- No emojis anywhere in code, commit messages, or UI copy.

## Testing (mandatory, every step)

- Every implementation step ships with tests before being considered done — write the
  failing test first (TDD), then the implementation, per `superpowers:test-driven-development`.
- **80% coverage threshold, enforced uniformly in CI** across the whole codebase (not just
  booking/payment code) — a PR that drops coverage below 80% fails CI.
- Vitest for unit/integration tests (domain logic — availability, pricing, coupons — gets
  explicit edge-case tests: capacity exactly at max, concurrent booking attempts, refund
  tier boundaries at exactly 7/3/2 days).
- Playwright for e2e: golden-path booking flow, admin CRUD flows, and **multi-viewport**
  runs (mobile/tablet/desktop) in CI, since the old site's #1 defect was a completely
  broken mobile layout. Manual real-device (iOS + Android) spot checks before every prod
  release, in addition to automated coverage.
- CI (GitHub Actions) required checks on every PR: lint, type-check, Vitest, Playwright.

## Mandatory Code Review Workflow

**After every implementation step**, before moving to the next one: invoke the
`code-review` skill (or dispatch a code-reviewer subagent) against that step's diff. The
reviewer reports findings back to the main agent, which addresses them (fix, or explicitly
justify why not) before the step is marked done and before starting the next step. Do not
batch multiple steps' worth of changes before review.

## Logging

Structured JSON logging via Pino throughout the app — every booking-flow step, every
availability check, every AI-agent action (both proposed and confirmed), and every admin
mutation gets a log line with enough context (request id, tour id, booking id where
relevant) to reconstruct what happened without re-running the code. Shipped to Axiom.
Sentry is for exceptions only — routine flow logging goes through Pino/Axiom, not Sentry.

## Design Direction

**Alpine Editorial**: muted forest greens, warm terracotta, cream backgrounds; serif
headlines; generous whitespace; large full-bleed photography. Reads like a premium travel
magazine, not a template booking site — avoid generic stock tour-operator UI patterns
(carousel-of-cards homepage, default Bootstrap-ish component shapes).

**Motion**: moderate. Scroll-triggered reveals and hover micro-interactions throughout,
plus **one** signature 3D accent (react-three-fiber) in the homepage hero — not 3D
everywhere. The 3D accent must:
- Lazy-load after critical content is interactive (never block LCP/INP)
- Be skipped under `prefers-reduced-motion` and on detected low-end/low-memory devices,
  falling back to a static hero image
- Never be a hard requirement for Core Web Vitals — CWV (LCP/INP/CLS) pass is mandatory
  with or without the 3D accent rendering

**Accessibility**: WCAG 2.1 AA is a real, testable requirement — keyboard navigation,
screen-reader labels, color contrast, and the reduced-motion fallback above.

## Booking Domain Rules (see PLAN.md Phase 1 for the full data model)

- Single-booking checkout — no multi-item cart.
- Full payment upfront via Stripe (no deposits).
- Availability = per-tour seasonal window + per-date overrides/blocks + capacity cap
  (auto-closes at max) + global blackout dates (block a date across every tour at once).
  All of this is admin-editable.
- Pricing = Adult/Child/Infant tiers, with **both price and minimum-person threshold**
  admin-configurable per tour (not hardcoded to "2 adults").
- Race-condition safety: capacity is atomically checked and put on a short-lived hold
  (10–15 min) when a customer starts Stripe checkout; the hold releases automatically if
  payment isn't completed. Never oversell the last spot.
- Cancellations: automated tiered refund via Stripe's refund API — 100% at ≥7 days, 50%
  at 3–6 days, 0% at <2 days before the tour date.
- Coupons: admin-managed (percentage or fixed), applied at checkout via Stripe promotion
  codes.
- Custom per-tour checkout questions (e.g. dietary restrictions) are admin-configurable,
  not hardcoded.
- Private Transfers use the exact same booking engine (rate table by route/pax/luggage is
  admin-editable, not code-fixed).

## AI Agent Rules

- **Client-facing widget**: advisory only. Can recommend a tour, check live availability,
  summarize a tour, and draft/send an inquiry message to the admin inbox for
  custom/private requests. **Never** completes a booking or touches payment — always
  hands off to the real checkout flow.
- **Admin-facing widget**: can accept typed instructions or an uploaded document
  (PDF/DOCX/plain text) to propose changes (block dates, edit a tour, draft a new
  tour/blog post from document content). **Every proposed change must be shown to the
  admin as an explicit diff/summary and confirmed before it is written to the database.**
  No silent/direct writes from the agent, ever.

## Legal/Compliance

- No cookie-consent banner (analytics is cookieless, no ad-tracking cookies; the only
  cookies in use — Stripe checkout, Clerk admin session — are strictly necessary and
  exempt from consent under GDPR/ePrivacy).
- Two legal pages only: **Privacy Policy** (naming Stripe, Clerk, Resend, and OpenRouter
  as data processors, plus GDPR data-subject rights) and **Terms & Booking Conditions**
  (replaces the old site's duplicate Privacy Policy / Data Privacy Policy pages).
- Legal copy drafted here is a starting point, not legal advice — flag for the client's
  own legal review before launch.

## Known Open Items (do not silently resolve — surface these when reached)

- The Tramin wine tour's full page copy is unrecoverable from the old site (only the
  catalog teaser survived). Ship it with clearly-marked placeholder content and flag it
  for the client to supply real copy.
- Old-URL → new-URL 301 redirect map is deferred to the launch/domain-cutover step (the
  site is not pointed at the real domain during the build).
- Domain cutover to `bolzanostreetfoodtour.com` happens only after explicit client
  approval of the finished site.

## Plan Execution

See `PLAN.md` for the phase roadmap. Each phase gets its own detailed, bite-sized
implementation plan (written with `superpowers:writing-plans`, saved to
`docs/superpowers/plans/`) immediately before that phase starts, then executed via
`superpowers:subagent-driven-development` with the mandatory code-review gate above.
