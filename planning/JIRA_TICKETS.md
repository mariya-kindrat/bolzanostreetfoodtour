# Jira Ticket Backlog — Bolzano Street Food Tour Rebuild

Source: `PLAN.md`. One **Epic per phase**, one **Story per work item** within that phase.
Copy each block into Jira as-is (title, description, acceptance criteria). Stories within
an epic are listed in a sensible build order but Jira's own backlog ordering can override
this. No estimates included — size these yourselves per your team's process.

**Status: created in Jira**, project key **BSFT** (renamed from the initial `PL` key —
same issue numbers, new prefix): `https://mariyakindratdev.atlassian.net/browse/BSFT`.
This document remains the readable source of truth for ticket content — edit here
first, then propagate changes to Jira, since Jira is not regenerated automatically from
this file.

| Epic | Jira key |
|---|---|
| EPIC-0 Project Setup & Foundations | BSFT-12 (stories BSFT-20–BSFT-31) |
| EPIC-1 Data Model & Core Domain Logic | BSFT-13 (stories BSFT-32–BSFT-40) |
| EPIC-2 Marketing Site & Content | BSFT-14 (stories BSFT-41–BSFT-55) |
| EPIC-3 Booking Engine & Checkout | BSFT-15 (stories BSFT-56–BSFT-64) |
| EPIC-4 Admin Panel | BSFT-16 (stories BSFT-65–BSFT-76) |
| EPIC-5 AI Agent (Client + Admin) | BSFT-17 (stories BSFT-77–BSFT-83) |
| EPIC-6 Compliance, Performance & Hardening | BSFT-18 (stories BSFT-84–BSFT-90) |
| EPIC-7 Deployment, Monitoring & Launch Cutover | BSFT-19 (stories BSFT-91–BSFT-97) |

Suggested labels: apply the phase name (e.g. `phase-0`) to every issue in that epic, plus
a cross-cutting label where relevant: `booking-critical`, `admin`, `ai-agent`, `docs`,
`accessibility`, `security`.

---

## EPIC-0: Project Setup & Foundations

**Epic goal:** an empty but fully deployable, monitored skeleton app.

### 0.1 — Initialize Next.js + TypeScript project scaffold
**Description:** Set up the Next.js (App Router) + TypeScript repository with the folder
structure defined in `CLAUDE.md`, plus ESLint/Prettier configuration.
**Acceptance criteria:**
- Repo builds and runs locally (`next dev`) with no errors
- Folder structure matches `CLAUDE.md`'s Architecture section
- ESLint + Prettier run clean on a fresh checkout

### 0.2 — Docker local development setup
**Description:** Create `docker/Dockerfile.dev` so the Next.js app runs in a container
locally, connecting over the network to the Neon **dev** branch (no local Postgres
container).
**Acceptance criteria:**
- `docker build` + `docker run` serves the app locally
- App successfully queries the Neon dev database from inside the container

### 0.3 — Provision Neon databases and initialize Prisma
**Description:** Create separate Neon Postgres databases for **dev** and **prod**;
initialize Prisma in the repo pointed at them.
**Acceptance criteria:**
- Two distinct Neon databases exist (dev, prod)
- `npx prisma migrate dev` runs successfully against the dev database
- Prod database has no dev-only test data

### 0.4 — Environment configuration files
**Description:** Create `.env.example` (variable names only, committed) and a
gitignored `.env.local` for local dev. Configure matching environment variables in
Vercel for both the Development and Production environments. **Real secret values are
entered by a human, never invented or guessed by an agent** — this ticket's automated
work stops at variable names and empty placeholders plus a short setup note per
`PLAN.md` Phase 0.
**Acceptance criteria:**
- `.env.example` lists every variable from `CLAUDE.md`'s env var table
- `.env.local` is in `.gitignore` and never committed
- Vercel Development and Production environments each have their own variable set
- A short note exists (in `.env.example` comments or `docs/infrastructure.md`) saying
  which dashboard each secret comes from

### 0.5 — GitHub repo, branching, and branch protection
**Description:** Set up the GitHub repository with `main` and `dev` branches; configure
branch protection so `main` requires passing CI checks and at least one review.
**Acceptance criteria:**
- `main` cannot be pushed to directly
- A PR against `main` or `dev` cannot merge with failing CI

### 0.6 — GitHub Actions CI pipeline
**Description:** Configure GitHub Actions to run lint, type-check, Vitest, and
Playwright on every pull request as required checks.
**Acceptance criteria:**
- Opening a PR triggers the workflow automatically
- A failing lint/type/test step blocks merge
- All four checks pass on a clean scaffold PR

### 0.7 — Vercel project and environment configuration
**Description:** Link the repo to Vercel; configure `dev` branch → Development
environment auto-deploy, `main` → Production, and PR preview deployments.
**Acceptance criteria:**
- Pushing to `dev` deploys to the dev environment automatically
- Merging to `main` deploys to production automatically
- Every open PR gets its own preview URL

### 0.8 — Clerk authentication for admin area
**Description:** Integrate Clerk (separate dev and prod instances) and gate the
`/admin` route tree behind authentication with a single admin role.
**Acceptance criteria:**
- Visiting `/admin` while logged out redirects to Clerk sign-in
- A logged-in admin user reaches the admin area
- Dev and prod use separate Clerk instances/keys

### 0.9 — Sentry error monitoring
**Description:** Wire Sentry into both dev and prod environments for unhandled
exceptions and failed API routes.
**Acceptance criteria:**
- A deliberately thrown test error appears in the Sentry dashboard
- Dev and prod errors are distinguishable (separate environments/tags in Sentry)

### 0.10 — Structured logging via Pino + Axiom
**Description:** Add Pino for structured JSON logging throughout the app, shipping logs
to Axiom (free tier).
**Acceptance criteria:**
- A log line emitted from a route handler is visible and searchable in Axiom
- Log lines include request context (timestamp, request id)

### 0.11 — Dependabot/Renovate configuration
**Description:** Configure automated dependency-update PRs, gated by the CI pipeline
from ticket 0.6.
**Acceptance criteria:**
- A dependency-update PR is opened automatically on schedule
- That PR runs the full CI suite before it can merge

### 0.12 — Initial README and docs skeleton
**Description:** Write `README.md` (what this is, prerequisites, local setup incl.
Docker, how to run tests, links to `docs/`) and create the initial
`docs/architecture.md` and `docs/infrastructure.md` files.
**Acceptance criteria:**
- A new developer can follow `README.md` alone to get the app running locally
- `docs/infrastructure.md` describes the environments, hosting, and CI/CD set up in this epic

---

## EPIC-1: Data Model & Core Domain Logic

**Epic goal:** every booking/availability/pricing rule implemented and unit-tested, no UI yet.

### 1.1 — Prisma schema for tours, pricing, and content
**Description:** Model `Tour`, `PriceTier` (Adult/Child/Infant with admin-configurable
price and minimum-person threshold per tour), and `CustomQuestion` (per-tour,
admin-defined) in Prisma.
**Acceptance criteria:**
- Migration applies cleanly to the dev database
- A tour can be created with multiple price tiers and custom questions in a test

### 1.2 — Prisma schema for availability
**Description:** Model `SeasonalAvailability` (recurring window per tour),
`DateOverride` (per-tour, per-date block/capacity exception), and `GlobalBlackout`
(date blocked across all tours).
**Acceptance criteria:**
- Migration applies cleanly
- A seasonal window, a per-tour override, and a global blackout can each be created and queried independently

### 1.3 — Prisma schema for bookings and coupons
**Description:** Model `Booking`, `BookingParticipant`, `BookingHold` (short-lived
capacity hold during checkout), and `Coupon` (percentage/fixed, admin-managed).
**Acceptance criteria:**
- Migration applies cleanly
- A booking with participants and an applied coupon can be created in a test

### 1.4 — Prisma schema for transfers and blog
**Description:** Model `TransferRoute` (origin/destination, price, max pax, max
luggage), `TransferSupplement`, `BlogPost`, and `AdminNote`.
**Acceptance criteria:**
- Migration applies cleanly
- Each model round-trips through a create/read test

### 1.5 — Availability resolution engine
**Description:** Implement `lib/availability` — given a tour and a date, combine
seasonal window + date overrides + global blackout + current holds/bookings into an
available-capacity number.
**Acceptance criteria:**
- Unit tests cover: date inside/outside seasonal window, date with an override, a
  globally blacked-out date, capacity exactly at max (0 remaining), capacity with active
  holds subtracted

### 1.6 — Pricing calculation engine
**Description:** Implement `lib/pricing` — participant counts × tier prices, with an
optional coupon applied.
**Acceptance criteria:**
- Unit tests cover: adult-only, mixed adult/child/infant, a percentage coupon, a
  fixed-amount coupon, and minimum-person-threshold enforcement

### 1.7 — Cancellation refund calculation
**Description:** Implement the tiered refund calculation: 100% at ≥7 days, 50% at 3–6
days, 0% at <2 days before the tour date.
**Acceptance criteria:**
- Unit tests cover the exact boundary values (7 days, 6 days, 3 days, 2 days) with no
  off-by-one errors

### 1.8 — Concurrency-safe booking hold logic
**Description:** Implement atomic capacity check + short-lived hold (10–15 min) placed
when a customer starts Stripe checkout, releasing automatically if payment isn't
completed within the window.
**Acceptance criteria:**
- A test simulating two simultaneous booking attempts for the last available spot
  results in exactly one success and one capacity-exceeded rejection
- An expired, unpaid hold releases its capacity back automatically (test with a
  time-travel/mock clock)

### 1.9 — Document schema and domain logic
**Description:** Add the Prisma schema (as an ER diagram or table list) and the
availability/pricing/hold algorithms to `docs/architecture.md`.
**Acceptance criteria:**
- `docs/architecture.md` accurately describes every model from tickets 1.1–1.4 and the
  three algorithms from 1.5–1.8

---

## EPIC-2: Marketing Site & Content

**Epic goal:** every public page live, navigable, fast, accessible, and SEO-correct.

> **Reopened 2026-09-18:** all of 2.1–2.15 below previously shipped (see
> `planning/project-progress.md`) but are reopened for a redesign pass toward a new
> "Wanderlust Editorial"-inspired direction (see `planning/REDESIGN.md`'s 2026-09-18
> update). Work proceeds element-by-element with explicit approval at each step, starting
> with 2.2 (Home page). On 2026-09-18 EPIC-2 (BSFT-14) and stories BSFT-41 to BSFT-55 were
> transitioned from Done back to To Do in real Jira, and the Phase 2 git history was
> rewritten into one commit per story (see `planning/project-progress.md`).
>
> **2026-09-20:** BSFT-42 (2.2 Home page) and EPIC-2 (BSFT-14) moved To Do -> In Progress in
> real Jira as the element-by-element redesign resumed (hero, header, Discover our tours, Why
> Bolzano and the wine feature done; Gateway, Where is it, trust block and newsletter remain).
> All other EPIC-2 stories stay To Do until their own redesign is approved.
>
> **2026-09-20 (later):** BSFT-42 (2.2 Home page) moved In Progress -> Done in real Jira once
> every Home element and the site footer were redesigned, approved and code-reviewed. EPIC-2
> (BSFT-14) stays In Progress; BSFT-41 and BSFT-43 to BSFT-55 stay To Do.

### 2.1 — Alpine Editorial design system
**Description:** Build the reusable design-system components (typography, color
tokens, spacing) implementing the Alpine Editorial direction: muted forest greens, warm
terracotta, cream backgrounds, serif headlines, generous whitespace.
**Acceptance criteria:**
- A component style-guide page renders all tokens/components
- Color contrast meets WCAG 2.1 AA at this stage (verify early, not just in Phase 6)

### 2.2 — Home page
**Description:** Build the homepage: hero (placeholder for the 3D accent from ticket
2.9), testimonials, real tour category tiles (no dead links), trust block, newsletter
signup.
**Acceptance criteria:**
- Every tile on the homepage links to a real, working page
- Newsletter signup captures an email (wired to Resend/storage per `CLAUDE.md`)

### 2.3 — Tour Detail page template
**Description:** Build the reusable Tour Detail template (quick facts, highlights,
meeting point/map, important info, what-to-expect, cancellation policy text) used by
every bookable product.
**Acceptance criteria:**
- Template renders correctly for at least one flagship tour, one cooking class, and
  one wine tour using seeded content
- A "coming soon" placeholder occupies the booking-widget slot (booking itself is Phase 3)

### 2.4 — Catalog pages (Cooking Classes, Wine Tours, Winter Tours)
**Description:** Build the three catalog/grid pages, each listing its real sub-tours
with working links — no orphaned pages, including the Tramin wine tour with placeholder content.
**Acceptance criteria:**
- Every catalog page lists all of its real products
- Every product card links to a working Tour Detail page
- Winter Tours remains its own top-level nav category

### 2.5 — Private Transfers info page
**Description:** Build the Transfers page with rate/supplement tables (static content
at this stage; booking comes in Phase 3) and service description sections.
**Acceptance criteria:**
- Rate and supplement tables render all rows from the content inventory
- Page is fully responsive at mobile width

### 2.6 — About and Contact pages
**Description:** Build the About page (migrated narrative content) and Contact page
(contact form, no booking-adjacent logic).
**Acceptance criteria:**
- Contact form submission is captured and triggers a notification per `CLAUDE.md`
- About page content matches the content inventory

### 2.7 — Blog list and post pages
**Description:** Build the blog list and individual post pages; migrate the 8 existing
posts from the content inventory.
**Acceptance criteria:**
- All 8 migrated posts render correctly with their original publish dates
- Blog list page paginates or lists all posts without layout breakage

### 2.8 — Legal pages
**Description:** Build the Privacy Policy and Terms & Booking Conditions pages
(consolidating the old site's duplicate Privacy Policy / Data Privacy Policy).
**Acceptance criteria:**
- Both pages are reachable from the footer
- Privacy Policy names Stripe, Clerk, Resend, and OpenRouter as data processors

### 2.9 — Signature 3D hero accent
**Description:** Build the homepage's 3D accent (react-three-fiber), lazy-loaded after
critical content, with a static-image fallback under `prefers-reduced-motion` or on
detected low-end/low-memory devices.
**Acceptance criteria:**
- 3D accent does not block LCP/INP in a Lighthouse run
- Setting `prefers-reduced-motion: reduce` in browser devtools shows the static fallback
- Core Web Vitals pass whether or not the 3D accent renders

### 2.10 — Site-wide motion system
**Description:** Implement the scroll-reveal and hover micro-interaction system used
consistently across all pages built in this epic.
**Acceptance criteria:**
- Motion is visibly consistent across at least 3 different page types
- Motion respects `prefers-reduced-motion` globally, not just on the 3D accent

### 2.11 — Content seed script
**Description:** Write `prisma/seed.ts` to populate the dev database with initial tour
and page content from `files/bolzanostreetfoodtour-content-inventory.xlsx`.
**Acceptance criteria:**
- Running the seed script against a fresh dev database populates every tour, catalog,
  and page with real (not lorem-ipsum) content

### 2.12 — SEO fundamentals
**Description:** Add per-page metadata, `sitemap.xml`, `robots.txt`, and schema.org
structured data (TouristTrip/LocalBusiness) across all pages built in this epic.
**Acceptance criteria:**
- Every page has a unique title/description
- `sitemap.xml` lists every real page
- Structured data validates in Google's Rich Results Test

### 2.13 — Static generation and ISR
**Description:** Configure static generation with on-demand revalidation for all
content pages built in this epic.
**Acceptance criteria:**
- Pages are served statically (verify via response headers/build output)
- A manual revalidation call updates a live page without a full redeploy

### 2.14 — Accessibility and mobile QA pass
**Description:** Run an automated WCAG 2.1 AA check and Playwright multi-viewport
(mobile/tablet/desktop) tests across every page built in this epic.
**Acceptance criteria:**
- Automated accessibility scan reports no critical/serious violations
- Playwright confirms no horizontal overflow or broken layout at 390px width — the
  specific defect that broke the old site

### 2.15 — Routes and components documentation
**Description:** Create `docs/routes-and-components.md` and populate it with every
route and component added in this epic.
**Acceptance criteria:**
- Every page route from this epic is listed with its purpose and auth requirement
- Every reusable component is listed with its location and which routes use it

---

## EPIC-3: Booking Engine & Checkout

**Epic goal:** a customer can browse, book, and pay for any tour or transfer end-to-end.

### 3.1 — Booking widget UI
**Description:** Build the booking widget for Tour Detail pages: calendar (using the
Phase 1 availability engine), participant selectors respecting per-tour minimums, and
per-tour custom questions.
**Acceptance criteria:**
- Calendar correctly shows unavailable dates (blackout, override, or fully booked) as non-selectable
- Participant selector enforces the tour's configured minimum

### 3.2 — Availability API route
**Description:** Build the API route the booking widget calls, wrapping the Phase 1
availability engine with the concurrency-safe hold logic.
**Acceptance criteria:**
- Route returns correct available capacity for a given tour/date
- Route rejects a booking attempt that exceeds remaining capacity

### 3.3 — Stripe Checkout integration
**Description:** Integrate Stripe Checkout session creation and the webhook handler for
payment success/failure, wired to Stripe test-mode keys in dev.
**Acceptance criteria:**
- A completed test-mode Stripe payment creates a `Booking` row
- A failed/abandoned payment does not create a confirmed booking and releases its hold

### 3.4 — Booking confirmation emails
**Description:** Send a booking confirmation email via Resend on successful payment.
**Acceptance criteria:**
- A test booking triggers a confirmation email with correct tour/date/participant details

### 3.5 — Coupon redemption at checkout
**Description:** Allow a coupon code to be applied at checkout via Stripe promotion codes.
**Acceptance criteria:**
- A valid coupon reduces the checkout total correctly
- An invalid/expired coupon is rejected with a clear error

### 3.6 — Cancellation and automated refund flow
**Description:** Build the customer-facing cancellation flow (from a link in the
confirmation email) that calculates and processes the tiered refund via Stripe's refund API.
**Acceptance criteria:**
- Cancelling ≥7 days before the tour issues a 100% refund
- Cancelling 3–6 days before issues a 50% refund
- Cancelling <2 days before issues a 0% refund
- Refund appears correctly in Stripe's dashboard for a test transaction

### 3.7 — Private Transfers booking
**Description:** Wire Private Transfers into the same booking engine, using
`TransferRoute` rates instead of tour pricing.
**Acceptance criteria:**
- A transfer can be booked and paid for end-to-end using the fixed rate table

### 3.8 — Booking flow e2e tests
**Description:** Write Playwright e2e tests covering the full golden-path booking for
each product category, a coupon-applied booking, a cancellation/refund, and the
two-simultaneous-customers race-condition case.
**Acceptance criteria:**
- All listed scenarios pass in CI
- The race-condition test explicitly asserts exactly one success and one rejection

### 3.9 — Booking engine documentation
**Description:** Update `docs/routes-and-components.md` with the new
booking/checkout/webhook routes and widget components; update `docs/architecture.md`
with the checkout sequence and the Stripe webhook contract.
**Acceptance criteria:**
- Docs accurately describe the routes/components and sequence built in this epic

---

## EPIC-4: Admin Panel

**Epic goal:** the business can run entirely from the admin panel, no developer required
for day-to-day operations.

> **2026-09-18:** Category CRUD (`/admin/categories`) shipped early, as part of the
> homepage redesign — the `Category` model replaced the old fixed `TourCategory` enum so
> the hero rotation and catalog pages could be admin-driven. See `docs/architecture.md`'s
> "Category model (2026-09-18)" section. Story 4.2 (Tour CRUD) below will need a
> category-picker field once it's built — `Category` already exists and is queryable via
> `lib/content/categories.ts`, no new schema work needed for that part.

### 4.1 — Admin dashboard
**Description:** Build the dashboard: calendar view of tour dates/capacity plus a list
of upcoming bookings needing attention.
**Acceptance criteria:**
- Calendar reflects real booking/capacity data
- Upcoming-bookings list highlights new/unpaid/cancellation-requested items

### 4.2 — Tour CRUD
**Description:** Build admin UI to create/edit/delete tours: content sections, price
tiers, minimum persons, capacity, and custom questions.
**Acceptance criteria:**
- An admin can create a new tour end-to-end and see it live on the public site
- Editing a price or minimum-person threshold takes effect immediately for new bookings

### 4.3 — Availability management UI
**Description:** Build admin UI for seasonal availability windows, per-date overrides,
and global blackout dates.
**Acceptance criteria:**
- Admin can block a single date for one tour and confirm it's unbookable
- Admin can block a date globally and confirm it's unbookable across every tour

### 4.4 — Bookings management UI
**Description:** Build admin UI to search/filter bookings, add free-text notes, create
a manual booking on a customer's behalf (marking it paid outside Stripe or sending a
payment link), and cancel/refund a booking.
**Acceptance criteria:**
- Admin can find a specific booking by customer name/email/date
- Admin can create a manual booking that correctly reserves capacity
- Admin-initiated cancellation processes the correct tiered refund

### 4.5 — Coupon management UI
**Description:** Build admin UI to create, edit, and deactivate coupons.
**Acceptance criteria:**
- A newly created coupon works at checkout immediately
- A deactivated coupon is rejected at checkout

### 4.6 — Transfers rate management UI
**Description:** Build admin UI to edit the Transfers rate and supplement tables.
**Acceptance criteria:**
- Editing a rate updates the price shown on the public Transfers booking flow

### 4.7 — Marketing copy editing UI
**Description:** Build admin UI to edit homepage sections, About, Contact, and the
trust-block text, with on-demand revalidation of the affected page on save.
**Acceptance criteria:**
- Editing the trust block updates it everywhere it's displayed (single source of truth)
- A saved edit is live on the public site within the ISR revalidation window

### 4.8 — Blog CRUD UI
**Description:** Build admin UI to create, edit, delete, and publish/unpublish blog posts.
**Acceptance criteria:**
- A new post created in admin appears on the public blog list once published
- An unpublished post is not publicly reachable

### 4.9 — Reporting view
**Description:** Build a reporting view showing bookings/revenue stats covering both
past and upcoming tours.
**Acceptance criteria:**
- Stats correctly total a known set of test bookings across a past and a future date range

### 4.10 — Business notification emails
**Description:** Send an email via Resend to the business inbox on every new booking,
cancellation, and contact/quote-form submission.
**Acceptance criteria:**
- Each of the three event types triggers a distinct, correctly-populated email

### 4.11 — Admin workflow e2e tests
**Description:** Write Playwright tests covering every admin workflow built in this epic.
**Acceptance criteria:**
- All admin workflows in this epic have a passing e2e test in CI

### 4.12 — Admin documentation and guide
**Description:** Update `docs/routes-and-components.md` with every `/admin` route and
component; write an admin guide (in `README.md` or a linked `docs/admin-guide.md`)
walking through each workflow in plain language for the business owner.
**Acceptance criteria:**
- A non-technical reader can follow the guide to block a date, change a price, and
  publish a blog post without developer help

---

## EPIC-5: AI Agent (Client + Admin)

**Epic goal:** both agent widgets live, scoped exactly as defined in `CLAUDE.md`.

### 5.1 — OpenRouter client and tool-calling framework
**Description:** Build `lib/ai-agent` with an OpenRouter client and a tool-calling
framework shared by both the client and admin widgets.
**Acceptance criteria:**
- A basic tool call round-trips correctly (model requests a tool, framework executes
  it, result returned to the model)

### 5.2 — Client-facing AI widget
**Description:** Build the public-site widget: tour recommendation from stated needs,
live availability check, tour summary, and draft-and-send inquiry to the admin inbox for
custom/private requests. No booking/payment capability.
**Acceptance criteria:**
- Asking for a tour recommendation returns a real, availability-checked suggestion
- The widget cannot create a booking or process payment under any prompt (adversarial
  test included)
- A custom-request inquiry is actually delivered to the admin inbox

### 5.3 — Admin-facing AI widget: instructions and proposals
**Description:** Build the admin widget's ability to accept typed natural-language
instructions (block dates, edit a tour, adjust pricing) and produce a proposed change.
**Acceptance criteria:**
- "Block next Monday for all tours" produces a correct, human-readable proposed change
- No instruction results in a direct database write without the confirm step (ticket 5.5)

### 5.4 — Admin-facing AI widget: document upload
**Description:** Build document upload (PDF, DOCX, plain text) and mapping into a
structured draft for a new tour or blog post.
**Acceptance criteria:**
- Uploading a sample tour description document (each of the 3 formats) produces a
  correctly-populated draft tour form

### 5.5 — Propose-then-confirm safety gate
**Description:** Implement the confirmation UI shown for every admin-agent action
before it is written to the database, and the enforcement that no agent action bypasses it.
**Acceptance criteria:**
- Every admin-agent action (5.3 and 5.4) shows a diff/summary requiring explicit confirm
- A security-review test confirms there is no code path where an agent action writes to
  the database without going through this gate

### 5.6 — Agent action logging
**Description:** Log every agent action (both proposed and confirmed) via Pino/Axiom
per `CLAUDE.md`.
**Acceptance criteria:**
- A proposed-but-not-confirmed action and a confirmed action are both visible and
  distinguishable in Axiom

### 5.7 — AI agent documentation
**Description:** Update `docs/routes-and-components.md` with the agent's routes/
components; document the agent's tool definitions (what each tool can read/write) and
the confirm-before-apply flow in `docs/architecture.md`.
**Acceptance criteria:**
- Every tool available to either agent is listed with its read/write scope

---

## EPIC-6: Compliance, Performance & Hardening

**Epic goal:** production-readiness checklist fully green before real traffic.

### 6.1 — WCAG 2.1 AA audit and fixes
**Description:** Manual keyboard-only and screen-reader pass across the whole site,
fixing anything an automated scan missed.
**Acceptance criteria:**
- Every interactive element is reachable and operable via keyboard alone
- Screen-reader testing (e.g. VoiceOver/NVDA) confirms sensible reading order and labels

### 6.2 — Legal pages final copy
**Description:** Finalize Privacy Policy and Terms & Booking Conditions copy, flagged
for the client's own legal review before launch.
**Acceptance criteria:**
- Both pages are complete and internally consistent (no placeholder text remaining)
- Client/legal sign-off is explicitly recorded (comment or ticket note)

### 6.3 — Core Web Vitals verification
**Description:** Verify LCP/INP/CLS budgets in production-like conditions, both with
the 3D accent enabled and with it disabled (reduced-motion path).
**Acceptance criteria:**
- Both configurations pass Core Web Vitals "Good" thresholds on a throttled mobile profile

### 6.4 — Mobile real-device QA pass
**Description:** Manually test the full site and booking flow on real iOS and Android devices.
**Acceptance criteria:**
- No layout, touch-target, or safe-area issues found on at least one iOS and one
  Android device

### 6.5 — Coverage verification
**Description:** Verify the 80% coverage threshold holds across the entire codebase,
not just code added in earlier epics.
**Acceptance criteria:**
- CI coverage report shows ≥80% across the full codebase

### 6.6 — Security review
**Description:** Review the Stripe webhook endpoint, admin auth boundaries, and the
AI-agent write-confirmation gate for bypasses.
**Acceptance criteria:**
- Webhook signature verification is confirmed correct (rejects a tampered payload in a test)
- No route under `/admin` is reachable without Clerk auth (tested directly, not just via UI)
- The confirm-before-apply gate from ticket 5.5 has no bypass path

### 6.7 — Documentation accuracy pass
**Description:** Review `README.md`, `docs/architecture.md`, `docs/infrastructure.md`,
and `docs/routes-and-components.md` against the actual shipped system.
**Acceptance criteria:**
- Every route/component in the codebase has a corresponding, accurate doc entry
- No doc references a route, tool, or service no longer in use

---

## EPIC-7: Deployment, Monitoring & Launch Cutover

**Epic goal:** live on the real domain, monitored, with the old site's SEO equity preserved.

### 7.1 — Uptime monitoring configuration
**Description:** Configure an uptime monitor (Better Uptime or UptimeRobot) against the
live site and the Stripe webhook endpoint.
**Acceptance criteria:**
- Simulating downtime (or the monitor's own test-alert feature) triggers a notification

### 7.2 — Alerting verification
**Description:** Verify Sentry and the uptime monitor both deliver alerts to the
correct email address end-to-end.
**Acceptance criteria:**
- A deliberate test error/downtime event results in a received email for each channel

### 7.3 — Old-URL redirect map
**Description:** Build the 301 redirect map from every old Wix URL (per
`files/bolzanostreetfoodtour-site-analysis.md` §1 and §6) to its new-site equivalent.
**Acceptance criteria:**
- Every URL listed in the site analysis document has a corresponding redirect rule
- Spot-checking 5 old URLs post-deploy returns a 301 to the correct new page

### 7.4 — Client review and UAT sign-off
**Description:** Client reviews the finished site on the dev/staging environment and
signs off before DNS cutover.
**Acceptance criteria:**
- Explicit, recorded client approval exists before ticket 7.5 proceeds

### 7.5 — DNS cutover to production domain
**Description:** Point `bolzanostreetfoodtour.com` at the new production deployment.
**Acceptance criteria:**
- The domain resolves to the new site with valid HTTPS
- The old Wix site is no longer reachable at the domain

### 7.6 — Post-cutover verification
**Description:** Verify redirects work, Stripe is in live mode, all environment
variables are production values, and analytics is recording real traffic.
**Acceptance criteria:**
- A real (or controlled test) booking completes successfully in live mode
- Analytics dashboard shows incoming production traffic

### 7.7 — Infrastructure documentation finalization
**Description:** Record the redirect map and the DNS cutover steps taken in
`docs/infrastructure.md` for future reference.
**Acceptance criteria:**
- `docs/infrastructure.md` contains enough detail to repeat or roll back the cutover if needed

---

## Ticket count summary

| Epic | Tickets |
|---|---|
| EPIC-0 Project Setup & Foundations | 12 |
| EPIC-1 Data Model & Core Domain Logic | 9 |
| EPIC-2 Marketing Site & Content | 15 |
| EPIC-3 Booking Engine & Checkout | 9 |
| EPIC-4 Admin Panel | 12 |
| EPIC-5 AI Agent | 7 |
| EPIC-6 Compliance, Performance & Hardening | 7 |
| EPIC-7 Deployment, Monitoring & Launch Cutover | 7 |
| **Total** | **78** |
