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

| Model                                  | Purpose                                                                       |
| -------------------------------------- | ----------------------------------------------------------------------------- |
| `Category`                             | Admin-manageable tour category (Street Food Tours, Cooking Classes, Wine Tours, Winter Tours, or any category an admin adds) — name/description/photo/slug/`sortOrder`/`isActive`/`isBookable`; see "Category model" below |
| `Tour`                                 | A bookable tour/class; `categoryId` relates it to a `Category`               |
| `PriceTier`                            | Per-tour Adult/Child/Infant price + minimum-person threshold                  |
| `CustomQuestion`                       | Per-tour, admin-defined checkout question                                     |
| `SeasonalAvailability`                 | Per-tour date range + capacity                                                |
| `DateOverride`                         | Per-tour, per-date block or capacity exception                                |
| `GlobalBlackout`                       | Date blocked across every tour                                                |
| `Booking` / `BookingParticipant`       | A confirmed or pending booking and its participant counts by tier             |
| `BookingHold`                          | Short-lived (10-15 min) capacity hold placed during checkout                  |
| `Coupon`                               | Admin-managed percentage or fixed discount                                    |
| `TransferRoute` / `TransferSupplement` | Private transfer rate table                                                   |
| `BlogPost`, `AdminNote`                | Content and internal admin notes                                              |

## Availability resolution (`lib/availability/resolve.ts`)

`resolveAvailability` is a pure function: given a date and the tour's seasonal
windows, date overrides, global blackouts, and active (non-expired) holds, it returns
remaining capacity. Precedence: global blackout > blocking override > capacity
override > seasonal window. Holds are filtered by an injectable `now` rather than a
background cleanup job, so an expired hold simply stops counting against capacity the
next time availability is resolved.

## Pricing (`lib/pricing/calculate.ts`)

`calculatePrice` sums `count x priceCents` per tier, enforcing each tier's
`minPersons` threshold against the _total_ party size (not just that tier's count),
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

## Schema extensions (Phase 2)

Phase 2 added the columns the marketing pages actually render, rather than inventing a
generic content model:

- `TourCategory` gained `STREET_FOOD_TOUR` — the flagship tours are their own category,
  not a cooking class or a wine tour. (This enum was later replaced by the `Category`
  model — see "Category model (2026-09-18)" below.)
- `Tour` gained the detail-page fields the content inventory supplies: `tourType`,
  `groupSizeLabel`, `language`, `daysOffered`, `startingTime`, `durationLabel`,
  `meetingPoint`, `highlights` (`String[]`), `whatsIncluded`, `whatsNotIncluded`,
  `whatToWear`, `weatherPolicy`, `dietaryInfo`, `whatToExpectFood`,
  `whatToExpectHistory`, `whoShouldTakeIt`, `validityLabel`, plus the two price-display
  flags `priceIsFrom` and `priceOnRequest` (a quote-only winter excursion has no
  headline price, and "from EUR X" is a different claim than "EUR X").
- `NewsletterSubscriber` (unique `email`) and `ContactSubmission` back the two public
  forms. Neither is admin-readable yet; Phase 4's admin panel surfaces them.
- `TransferRoute` gained `durationLabel` and `@@unique([origin, destination])`. The
  unique constraint is what makes the seed idempotent: `upsert` keys on the real
  compound constraint, so re-seeding can no longer create duplicate routes (and the
  earlier in-memory deduplication pass in `prisma/seed.ts` became unreachable and was
  deleted).

## Category model (2026-09-18)

`TourCategory` (a fixed 4-value enum: `STREET_FOOD_TOUR`, `COOKING_CLASS`, `WINE_TOUR`,
`WINTER_TOUR`) was replaced by a real `Category` table so an admin can add, edit, or
retire a category without a code deploy — this is the first piece of the Phase 4 admin
panel, built ahead of the rest of it. `Tour.category` (enum) became `Tour.categoryId`
(FK, `onDelete: Restrict` — a category with tours still assigned to it can't be deleted).

Migration `20260918140000_add_category_model` is hand-written SQL, not
`prisma migrate dev`'s auto-diff: the target schema has no auto-computed mapping from an
enum value to a freshly-created row's id, and existing `Tour` rows can't take a `NOT NULL`
column with no default. The migration creates `Category`, seeds the 4 rows the old enum
values become (fixed ids so the next step can reference them), adds `Tour.categoryId` as
nullable, backfills it from the old `category` column, then enforces `NOT NULL` and drops
`category`/`TourCategory` — all as one transaction, so it's atomic even though it's
conceptually a multi-step migration. `prisma/seed.ts`'s `CATEGORIES` array is the
reseedable source of truth for the same 4 rows (the migration's `INSERT` only ran once,
historically); `Tour` seed entries reference a category by `categorySlug` string, resolved
to a real id through a slug->id map built from the upserted `Category` rows.

`Category` fields: `slug` (its catalog page's URL, e.g. `wine-tours` -> `/wine-tours`),
`name`, `description`, `photoUrl` + `altText` (used both by its catalog page and the
homepage hero rotation), `sortOrder` (hero rotation order), `isActive` (hidden from the
site entirely when false — no catalog page, not in the hero), `isBookable` (replaces the
old hardcoded `tour.category === WINTER_TOUR` quote-only check — the Tour Detail page now
reads `!tour.category.isBookable` to decide whether to render `CancellationPolicy` and
which sidebar widget, `QuoteOnlyNotice` or `BookingWidgetComingSoon`, to show).

**Consumers:**
- `app/(marketing)/(catalog)/[categorySlug]/page.tsx` replaces the 3 previously hand-built
  catalog pages (`cooking-classes`, `wine-tours`, `winter-tours`) with one route driven by
  the table — `generateStaticParams` returns every active category's slug, so a new
  admin-added category gets a working, statically-generated catalog page automatically.
  Existing URLs are unchanged since the seeded slugs match them; `street-food-tours` is a
  genuinely new page (that category previously had no catalog listing, only direct links
  to its 3 individual tours).
- `Hero` (see "Homepage 3D accent" below) rotates through `getActiveCategories()` instead
  of a static photo manifest.
- `app/admin/categories/` (list/new/`[id]/edit`) and `app/api/admin/categories/` (POST,
  PATCH, DELETE) are the first real admin CRUD screens — `middleware.ts`'s matcher now
  also covers `/api/admin/(.*)`, not just `/admin/(.*)`, so the mutation routes get the
  same Clerk protection as the pages. A delete that violates the FK restrict (tours still
  assigned) and a create/update that violates the slug's unique constraint both surface as
  a friendly message, not a raw 500 — see `Prisma.PrismaClientKnownRequestError` codes
  `P2003`/`P2002` in `app/api/admin/categories/[id]/route.ts` /
  `app/api/admin/categories/route.ts`.

## Rendering model (Phase 2)

Every public page is a Server Component rendered at build time. Pages backed by
database content (`/`, the three catalogs, `/tours/[slug]`, `/blog`, `/blog/[slug]`,
`/private-transfers`) export `revalidate = 3600`: content changes rarely, an hour-stale
catalog is harmless, and a one-hour window keeps regeneration traffic negligible while
still not requiring a redeploy to publish an edit. `/tours/[slug]` and `/blog/[slug]`
enumerate their paths with `generateStaticParams`, so every tour and post is prerendered
rather than rendered on first hit.

`POST /api/revalidate` is the escape hatch for "publish this now". It authenticates on a
single `x-revalidate-secret` header compared against `REVALIDATE_SECRET` (a shared
secret, not Clerk: the caller is Phase 4's admin panel and, later, a CMS-style webhook —
neither carries a user session) and calls `revalidatePath` on the one path in the body.
Path-level rather than tag-level invalidation keeps the contract trivial while the
content model is small; tags are worth introducing when one edit has to fan out to many
pages.

## Content data flow (Phase 2)

Server Component → `lib/content/*` → `lib/db.ts` (Prisma) → Neon. Pages never touch
Prisma directly; `lib/content/tours.ts`, `blog.ts` and `transfers.ts` own every query, so
filters like "only active tours" and "only published posts" are defined once. `getTourBySlug`
and `getBlogPostBySlug` apply the same `isActive` / `publishedAt` filters as their
list-query siblings, so an unpublished row cannot be reached by guessing its URL once
Phase 4 can toggle those flags.

### Why some content is in Postgres and some is a typed constant

Tour, blog and transfer data live in Postgres because the admin panel will edit them in
Phase 4 and because they are inherently per-row (a tour is a record with a price, a
slug, availability). Homepage, about, contact, photo-credit and legal copy live as typed
constants in `lib/content/*.ts` because it is prose belonging to exactly one page, it
changes about as often as the code around it, and putting it in the database in Phase 2
would have meant building an editing UI for it before anything could render. The split is
deliberate and temporary in one direction only: copy can migrate into the database when
an admin genuinely needs to edit it, and until then a constant is type-checked, diffable
and reviewable in the PR that changes it.

## Styling approach

> **2026-09-18:** the Phase 2 homepage/marketing components are being revisited under a
> new direction (see `planning/REDESIGN.md`'s 2026-09-18 update) — inspired by the Lovable
> "Wanderlust Editorial" travel-blog template's photography-forward, category/filter-driven
> structure. The token layer and CSS Modules approach below are unchanged; it's the
> component-level layout/structure patterns being redone, one page/section at a time.

CSS Modules (`*.module.css`, colocated next to the component) is the styling approach
for new UI, starting with the homepage design-system rebuild: `Button`, `Input`,
`Kicker`, `LabelChip`, `Section`, `TourCard` and `TourCarousel` each own a module. Inline
`style={{}}` remains only where a value is truly dynamic or computed per element —
e.g. `Heading`/`Text`'s `onDark` prop switching between the cream and ink color tokens
at render time — not as a substitute for a class. `Header` now owns a module
(`Header.module.css`) for its three-zone nav layout and dropdown, as of the 2026-09-18
redesign pass; its scroll-driven tint/blur/shadow stay inline since those values are
computed per scroll frame, the same truly-dynamic case as `Heading`/`Text`'s `onDark`.
`ProductGrid`, `QuickFacts`, and most of `Hero`'s structural layers still use
inline style throughout; converting them remains deferred to the sub-project 2 rollout.

The token layer backing both CSS Modules and any remaining inline style lives in two
places that must stay in sync: CSS custom properties in `app/globals.css` (`--color-*`,
`--type-*`, `--radius-*`, `--shadow-*`) and their typed re-export,
`components/ui/tokens.ts` (`COLORS`, `TYPE_SCALE`, `RADIUS`, `SHADOW`), which lets
TypeScript code (e.g. `/style-guide`) reference the same values without hardcoding a
`var(--...)` string. `/style-guide` (`app/style-guide/page.tsx`) is the living reference
for every token and primitive — Colors, Type scale, Typography (incl. `Kicker`), Shape &
shadow, Buttons, and Label chip.

## Homepage 3D accent

The react-three-fiber hero accent (`components/three/`) is deliberately non-essential. As
of the 2026-09-18 Wanderlust-inspired redesign pass, it is an auto-advancing crossfade
carousel (full-bleed textured planes, not the earlier many-tile photo mosaic): each slide
holds for ~6s with a slow Ken Burns zoom, crossfades into the next over ~1.2s, and loops.
The timing/opacity math lives in `lib/hero/heroCarouselLayout.ts` as pure, unit-tested
functions (`computeSlideState` — per-slide opacity and scale from elapsed time;
`computeCoverUV` — object-fit: cover for a texture on a plane, since three.js has no
built-in cover mode).

As of the same-day Category model migration (see above), the slide set is no longer a
static manifest — `Hero` receives `categories: Category[]` (fetched server-side by
`app/(marketing)/page.tsx` via `getActiveCategories()`) and derives both the static LCP
background image (`categories[0]`) and the 3D layer's `slides` prop
(`{src: photoUrl, alt: altText}` per category) from it, so admin-edited category photos
flow straight into the hero with no code change. The headline/description/CTA text above
the canvas is driven by the same data through a separate client component,
`HeroCategoryContent.tsx`: it polls (every 250ms, not per-frame)
`getDominantSlideIndex(categories.length, elapsedSeconds)` — a third pure function in
`heroCarouselLayout.ts` that just calls `computeSlideState` for every slide and returns
whichever has the highest opacity — off its own `performance.now()`-based clock. The text
layer and the WebGL canvas never communicate directly; both independently derive the same
answer from the same pure function and the same timing config, so they stay in sync
without any cross-component wiring. The CTA reads "Explore {category.name}" and links to
`/{category.slug}`, replacing the old single flagship tour's "Book now" — every slide now
points at a category's catalog page, not a specific tour's booking flow.

`HeroSceneLoader` gates the accent three ways before anything is downloaded:
`useShouldRender3D` opts out under `prefers-reduced-motion` and when
`navigator.deviceMemory` positively reports <= 4 GB (undefined, as on Safari/Firefox, is
not treated as low-end); an empty `slides` array opts out too, checked before the
`next/dynamic` (`ssr: false`) import of `HeroScene` fires, so the Three.js bundle is not
even fetched when there is nothing to render. When the accent does apply, the import
starts immediately rather than waiting on an idle callback, and the mounted canvas is
cross-faded in (`onCreated` -> opacity transition) instead of popping in — each slide
plane loads its own texture independently behind its own error boundary, so a missing or
broken image just drops that one slide from the rotation.

So the Three.js bundle is never on the critical path, the hero's LCP image and headline
are complete before the canvas exists, and Core Web Vitals pass identically with or
without the accent. The hero's contrast does not depend on it either: the headline sits
above a gradient scrim over the photo, not over the canvas. Every asset the scene wants
(the active categories' photos, the decorative `branch.png` foreground) is optional and
documented in `public/images/home/mosaic/README.md`. (There is no atmosphere/background
drift layer anymore — it fit the gaps between small mosaic tiles, not a full-bleed slide.)

## Coverage gate scope

`CLAUDE.md` calls for an 80% coverage gate "across the whole codebase". As of Phase 2
(2026-09-16) the gate is scoped, in `vitest.config.ts`, to `lib/availability/**`,
`lib/pricing/**`, `lib/content/**` and `lib/seo/**` — the domain and content logic the
project actually owns — rather than the whole tree, because Phase 0 shipped untested UI
scaffolding that a truly global gate would fail against immediately, blocking every PR
for reasons unrelated to the change under review. The globs are whole directories, so
files added to those modules later are gated automatically. `lib/hero/**` was added by
the earlier hero-mosaic work (now `heroCarouselLayout.ts`, since the 2026-09-18 redesign);
the homepage design-system rebuild added `lib/homepage/**` to the same include list, for
the same reason: both are pure layout logic the project owns, not UI scaffolding.

Four files are excluded, on the same precedent each time — a thin wrapper whose only real
behaviour is the database round-trip, verified by an integration test instead of a mock:

| Excluded                                          | Verified by                                                                                                           |
| ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `lib/availability/hold.ts`                        | `tests/integration/availability/hold.test.ts` (real `pg_advisory_xact_lock` concurrency can't be meaningfully mocked) |
| `lib/content/tours.ts`, `transfers.ts`, `blog.ts` | `tests/integration/content/seed.test.ts`                                                                              |

Widening the gate to `app/` and `components/` is a follow-up for the later phases that
ship their own tested UI code; those layers are currently covered by Playwright
(including the multi-viewport and axe suites) rather than by Vitest.
