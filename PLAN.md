# Bolzano Street Food Tour Rebuild — Phase Roadmap

> This is a **roadmap**, not a bite-sized task plan. The project is too large for one
> flat task list (custom booking + payments, a custom admin panel, and an AI agent, on
> top of a full marketing site). Each phase below gets its own detailed, bite-sized
> implementation plan — written with `superpowers:writing-plans` and saved to
> `docs/superpowers/plans/YYYY-MM-DD-<phase-name>.md` — immediately before that phase
> starts, then executed via `superpowers:subagent-driven-development` with the mandatory
> code-review gate defined in `CLAUDE.md`. Do not start a phase's detailed plan until the
> previous phase's deliverable is working and reviewed.
>
> **Documentation is part of every phase's deliverable**, not a final step — see
> `CLAUDE.md`'s Documentation section. Each phase below lists the specific doc updates it
> owes, in addition to code.

**Full requirements, architecture decisions, and rationale:** `CLAUDE.md` (this roadmap
assumes it as context) and the discovery docs in `files/`.

**Source of truth for content to migrate:** `files/bolzanostreetfoodtour-content-inventory.xlsx`

---

## Phase 0 — Project Setup & Foundations

**Goal:** an empty but fully deployable, monitored skeleton app.

- Initialize Next.js + TypeScript repo (App Router), ESLint/Prettier, folder structure per `CLAUDE.md`
- `docker/Dockerfile.dev` — containerized app pointed at the Neon **dev** branch connection string
- Create Neon **dev** and **prod** databases; initialize Prisma
- Create environment configuration files for every environment (see below); populate
  real secret values manually — never generated or filled in by an agent
- GitHub repo with `main`/`dev` branches; branch protection requiring CI checks
- GitHub Actions CI: lint, type-check (Vitest + Playwright wired in but trivially passing)
- Vercel project linked to both environments (dev branch → dev env, main → prod env), PR previews on
- Clerk project (dev + prod instances); `/admin` route gated behind Clerk auth, single admin role
- Sentry wired into both environments
- Pino structured logging + Axiom shipping wired in (free tier)
- Dependabot/Renovate configured
- Create `README.md` (what this is, prerequisites, local setup incl. Docker, how to run
  tests, links to `docs/`) and the initial `docs/architecture.md` and
  `docs/infrastructure.md` (environments, hosting, DB, CI/CD, monitoring — filled in with
  what exists after this phase, expanded in later phases)

### Environment configuration files

Create these files as part of this phase, with variable **names** only where the value
is a secret:

| File | Committed to git? | Contents |
|---|---|---|
| `.env.example` | Yes | Every variable name from `CLAUDE.md`'s env var list, with placeholder/empty values — the checked-in template |
| `.env.local` | No (gitignored) | Local dev values — Neon **dev** branch connection string, Stripe/Clerk/etc. **test** keys |
| Vercel "Development" env vars | N/A (set in Vercel dashboard/CLI) | Same as `.env.local`, for the `dev` branch deployment |
| Vercel "Production" env vars | N/A (set in Vercel dashboard/CLI) | Neon **prod** connection string, Stripe/Clerk/etc. **live** keys |

**Real secret values are supplied by the user, not by an agent.** An implementing agent's
job is to create `.env.example` with correct variable names and to create empty/placeholder
`.env.local` plus a short setup note (which service/dashboard each value comes from) —
never to invent, guess, or paste real API keys/secrets into any file or Vercel config.
When a real value is needed to proceed (e.g. to test a Stripe webhook locally), stop and
ask the user to provide or enter it themselves.

**Deliverable:** pushing to `dev` deploys a blank Next.js app to the dev environment;
`/admin` requires login; a thrown error shows up in Sentry; a log line shows up in Axiom.

---

## Phase 1 — Data Model & Core Domain Logic

**Goal:** every booking/availability/pricing rule implemented and unit-tested, no UI yet.

Prisma schema covering (exact field lists to be finalized in this phase's detailed plan):
- `Tour` (content sections, category, slug), `PriceTier` (Adult/Child/Infant, admin-editable
  price + minimum-person threshold per tour), `CustomQuestion` (per-tour, admin-defined)
- `SeasonalAvailability` (recurring window per tour), `DateOverride` (per-tour, per-date
  block/capacity exception), `GlobalBlackout` (date blocked across all tours)
- `Booking`, `BookingParticipant`, `BookingHold` (short-lived capacity hold during checkout)
- `Coupon` (percentage/fixed, admin-managed)
- `TransferRoute` (origin/destination, price, max pax, max luggage), `TransferSupplement`
- `BlogPost`, `AdminNote`

Domain logic (pure functions, heavily unit-tested):
- Availability resolution: given a tour + date, combine seasonal window + overrides +
  blackout + current holds/bookings → available capacity
- Pricing calculation: participant counts × tier prices, coupon applied
- Cancellation refund calculation: tiered % by days-before-tour
- Concurrency-safe hold acquisition/release (DB transaction), with a test that simulates
  two simultaneous bookings for the last spot

**Deliverable:** `lib/availability` and `lib/pricing` pass a full unit test suite,
including edge cases (capacity exactly at max, refund boundary at exactly 7/3/2 days,
concurrent hold contention). No pages depend on this yet — verified via tests only.

**Docs:** add the Prisma schema (as an ER diagram or table list) and the availability/
pricing/hold algorithms to `docs/architecture.md`.

---

## Phase 2 — Marketing Site & Content

**Goal:** every public page live, navigable, fast, accessible, and SEO-correct — using
seeded content from the inventory spreadsheet (not yet admin-editable; that's Phase 4).

- Design system: Alpine Editorial tokens (color, type, spacing) as reusable components
- Pages: Home, Tour Detail template (flagship tours, cooking classes, wine tours incl.
  Tramin placeholder, winter tours), Cooking Classes / Wine Tours / Winter Tours catalogs,
  Private Transfers info, About, Contact (form only — no booking yet), Blog (list + post,
  content migrated from the 8 old posts), Privacy Policy, Terms & Booking Conditions
- Navigation: no dead tiles, every real product reachable in ≤2 clicks, Winter Tours kept
  as its own top-level category
- Signature 3D hero accent (react-three-fiber), lazy-loaded, with `prefers-reduced-motion`
  and low-end-device fallback to a static image
- Scroll-reveal + micro-interaction motion system used consistently across pages
- `prisma/seed.ts` populates initial tour/page content from the content inventory
- SEO: per-page metadata, `sitemap.xml`, `robots.txt`, schema.org structured data
  (TouristTrip/LocalBusiness), `next/image` everywhere
- Static generation (ISR) for all content pages

**Deliverable:** the full site is browsable end-to-end with real (migrated) copy, passes
Lighthouse Core Web Vitals and an automated WCAG 2.1 AA check, and renders correctly at
mobile/tablet/desktop viewports in Playwright. No live booking or payment yet — tour pages
show a "coming soon" placeholder where the booking widget will go.

**Docs:** create `docs/routes-and-components.md` and populate it with every route and
component added in this phase (page path, purpose, auth requirement; component name,
location, used-by-routes).

---

## Phase 3 — Booking Engine & Checkout

**Goal:** a customer can browse, book, and pay for any tour or transfer end-to-end.

- Booking widget on Tour Detail pages: calendar (using Phase 1 availability logic),
  participant selectors respecting per-tour minimums, per-tour custom questions
- Availability API route, concurrency-safe (uses the Phase 1 hold logic)
- Stripe integration: Checkout session creation, webhook handler (payment success/failure),
  Stripe test-mode wiring for dev
- Booking confirmation email via Resend
- Coupon redemption at checkout
- Cancellation flow (customer-facing link) → automated tiered refund via Stripe
- Private Transfers booking using the same engine, rates from `TransferRoute`
- Playwright e2e: full golden-path booking (each product category), a coupon-applied
  booking, a cancellation/refund, and the two-simultaneous-customers race-condition case

**Deliverable:** a real (test-mode) Stripe payment completes a real booking row, a
confirmation email sends, availability correctly decrements, and the old site's
inconsistent "some tours quote-only" problem is gone — every product is instant-bookable.

**Docs:** update `docs/routes-and-components.md` with the new booking/checkout/webhook
routes and widget components; update `docs/architecture.md` with the checkout sequence
and the Stripe webhook contract.

---

## Phase 4 — Admin Panel

**Goal:** the business can run entirely from the admin panel, no developer required for
day-to-day operations.

- Dashboard: calendar view + upcoming-bookings list needing attention
- Tour CRUD: content sections, price tiers, minimum persons, capacity, custom questions
- Availability management UI: seasonal windows, per-date overrides, global blackout dates
- Bookings management: search/filter, free-text notes, manual booking creation (phone/email
  inquiries — mark paid outside Stripe or send a Stripe payment link), cancel/refund
- Coupon management (create/edit/deactivate)
- Transfers rate/supplement table management
- Marketing copy editing (homepage sections, About, Contact, trust block) — single source
  of truth, with on-demand revalidation of the affected page on save
- Blog CRUD (create/edit/delete/publish)
- Reporting: bookings/revenue stats covering both past and upcoming tours
- Business notification emails (new booking, cancellation, contact/quote submission) via Resend

**Deliverable:** every admin workflow above is covered by a Playwright test; an admin can,
without touching code, block a date, change a price, publish a blog post, and see the
change reflected live on the public site.

**Docs:** update `docs/routes-and-components.md` with every `/admin` route/component;
add an "Admin Guide" section to `README.md` (or a linked `docs/admin-guide.md`) walking
through each admin workflow above in plain language for the business owner, not developers.

---

## Phase 5 — AI Agent (Client + Admin)

**Goal:** both agent widgets live, scoped exactly as defined in `CLAUDE.md`.

- OpenRouter client + tool-calling framework in `lib/ai-agent`
- Client widget (public site): tour recommendation from stated needs, live availability
  check, tour summary, draft-and-send inquiry to the admin inbox for custom/private
  requests. No booking/payment capability.
- Admin widget: natural-language instructions (block dates, edit a tour, adjust pricing)
  and document upload (PDF/DOCX/plain text) mapped into a structured draft for a new tour
  or blog post. **Every action surfaces a diff/summary and requires explicit admin
  confirmation before writing to the database** — no direct/silent writes.
- Every agent action (proposed and confirmed) logged via Pino/Axiom per `CLAUDE.md`

**Deliverable:** a customer can ask the client widget "what's a good tour for a family
with young kids in October" and get a real, availability-checked recommendation; an admin
can type "block next Monday for all tours" or upload a draft tour document and see a
correct proposed change before confirming it.

**Docs:** update `docs/routes-and-components.md` with the agent's routes/components;
add the agent's tool definitions (what each tool can read/write) and the
confirm-before-apply flow to `docs/architecture.md`.

---

## Phase 6 — Compliance, Performance & Hardening

**Goal:** production-readiness checklist fully green before real traffic.

- Full WCAG 2.1 AA audit and fixes (not just automated checks — keyboard-only and
  screen-reader pass)
- Privacy Policy + Terms & Booking Conditions final copy (flagged for client/legal review)
- Core Web Vitals budget verified in production-like conditions, including with the 3D
  accent disabled (reduced-motion path) and enabled
- Full mobile real-device QA pass (iOS + Android), the specific failure mode of the old
  site
- Coverage check: 80% enforced and verified across the full codebase, not just new code
- Security review of the Stripe webhook endpoint, admin auth boundaries, and AI-agent
  write-confirmation gate (confirm it cannot be bypassed)

**Deliverable:** a signed-off checklist; no known WCAG, performance, or security gaps.

**Docs:** do a full pass over `README.md`, `docs/architecture.md`,
`docs/infrastructure.md`, and `docs/routes-and-components.md` for accuracy — this is the
last phase before launch, so these must reflect the actual shipped system, not an earlier
snapshot.

---

## Phase 7 — Deployment, Monitoring & Launch Cutover

**Goal:** live on the real domain, monitored, with the old site's SEO equity preserved.

- Uptime monitor configured against the live site and the Stripe webhook endpoint
- Verify Sentry + uptime alerts actually reach email
- Build the old-URL → new-URL 301 redirect map from `files/bolzanostreetfoodtour-site-analysis.md`
  §1 (site map) and §6 (issues)
- Client review/approval of the finished site on the dev/staging environment
- DNS cutover: point `bolzanostreetfoodtour.com` at the new production deployment
- Post-cutover verification: redirects work, Stripe is in live mode, all env vars are prod
  values, analytics is recording real traffic

**Deliverable:** the new site is live at `bolzanostreetfoodtour.com`, old indexed URLs
redirect correctly, and monitoring confirms it's healthy.

**Docs:** record the redirect map itself in `docs/infrastructure.md`, and the DNS
cutover steps taken (for reference if it ever needs to be repeated or rolled back).

---

## Explicitly Deferred / Out of Scope for v1

- Multi-language UI (English-only for v1)
- Multi-item cart (single-booking checkout only)
- Deposit/partial-payment booking (full payment upfront only)
- Role-based admin permissions (single admin role for v1)
- Ad-conversion tracking (Google Ads / Meta Pixel)
- Swagger/OpenAPI API reference (Zod + zod-to-openapi + Swagger UI) — not needed since
  there's no external API consumer beyond Stripe/Clerk/etc. (which have their own docs);
  the manual `docs/routes-and-components.md` covers documentation needs instead
