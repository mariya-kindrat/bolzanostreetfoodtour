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
- Admin auth is enforced once, centrally, in `middleware.ts` (Clerk) for every route
  matching `/admin(.*)`, rather than per-page — later admin pages need no auth logic
  of their own. See `docs/routes-and-components.md` for the route table.

## Data model (Phase 1)

| Model | Purpose |
|---|---|
| `Tour` | A bookable tour/class; `category` is COOKING_CLASS, WINE_TOUR, or WINTER_TOUR |
| `PriceTier` | Per-tour Adult/Child/Infant price + minimum-person threshold |
| `CustomQuestion` | Per-tour, admin-defined checkout question |
| `SeasonalAvailability` | Per-tour date range + capacity |
| `DateOverride` | Per-tour, per-date block or capacity exception |
| `GlobalBlackout` | Date blocked across every tour |
| `Booking` / `BookingParticipant` | A confirmed or pending booking and its participant counts by tier |
| `BookingHold` | Short-lived (10-15 min) capacity hold placed during checkout |
| `Coupon` | Admin-managed percentage or fixed discount |
| `TransferRoute` / `TransferSupplement` | Private transfer rate table |
| `BlogPost`, `AdminNote` | Content and internal admin notes |

## Availability resolution (`lib/availability/resolve.ts`)

`resolveAvailability` is a pure function: given a date and the tour's seasonal
windows, date overrides, global blackouts, and active (non-expired) holds, it returns
remaining capacity. Precedence: global blackout > blocking override > capacity
override > seasonal window. Holds are filtered by an injectable `now` rather than a
background cleanup job, so an expired hold simply stops counting against capacity the
next time availability is resolved.

## Pricing (`lib/pricing/calculate.ts`)

`calculatePrice` sums `count x priceCents` per tier, enforcing each tier's
`minPersons` threshold against the *total* party size (not just that tier's count),
then applies an optional coupon (percentage or fixed, never discounting below zero).

## Cancellation refunds (`lib/pricing/refund.ts`)

`calculateRefund` buckets by whole days between cancellation and tour date: >=7 days
100%, 3-6 days 50%, <=2 days 0%. The <=2 boundary resolves a gap in the original
"<2 days" wording (see the Phase 1 plan's Global Constraints) — flagged for the
client to confirm this is the intended cutoff.

## Concurrency-safe holds (`lib/availability/hold.ts`)

`createBookingHold` runs inside a Postgres transaction that first takes a
`pg_advisory_xact_lock` keyed by tour+date, then re-checks availability and inserts
the hold — serializing concurrent attempts for the same tour+date without locking
unrelated tour+date pairs. This is what guarantees the last spot is never oversold.
It rejects a request for fewer than one participant up front, and carries the
resolver's `reason` on `CapacityExceededError` so callers can tell "sold out" apart
from "blocked", "blackout", or "out of season".

Its correctness is verified by the integration test suite
(`tests/integration/availability/hold.test.ts`), not the unit-coverage gate, because
real Postgres + `pg_advisory_xact_lock` concurrency can't be meaningfully mocked.

## Coverage gate scope (Phase 1 deviation)

`CLAUDE.md` calls for an 80% coverage gate "across the whole codebase". Phase 1 scopes
it to `lib/availability/**` (minus `hold.ts`, above) and `lib/pricing/**` — the code
this phase actually owns — because Phase 0 shipped untested UI scaffolding that a
truly global gate would fail against immediately, blocking every PR for reasons
unrelated to the change under review. The globs are whole directories, so files added
to those modules later are gated automatically. Widening the gate to the rest of the
codebase is a follow-up for the later phases that ship their own tested code.
