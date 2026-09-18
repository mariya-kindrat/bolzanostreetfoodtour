# Homepage Design System Redesign — Market / Editorial / Cantina Hybrid

**Status:** Approved design, ready for implementation planning.

**Relationship to other specs/docs:**
- Extends and depends on `docs/superpowers/specs/2026-09-17-hero-photo-mosaic-redesign-design.md`
  (approved, code complete, but visually inert today because `MOSAIC_PHOTOS` is empty). This
  spec does not modify `components/three/HeroScene.tsx`, `HeroSceneLoader.tsx`, or
  `TreeBranchOverlay.tsx` — it reuses that work as-is.
- Retires `planning/REDESIGN.md` as a creative brief. That file asked for a "mountains, Italy,
  adventure" design language (ridgelines, topographic lines, alpine minimalism) for what is
  actually a street-food/wine/cooking-tour business — confirmed wrong-subject during
  brainstorming. It has been reformatted to Markdown and kept as a working note, not acted on.

## Problem

A full-site design/UX audit (code read + live browser render at desktop and mobile widths)
found the current marketing site has no real design system:

- **No vertical rhythm anywhere.** `app/globals.css:44-48` zeroes all margin/padding
  (`* { margin: 0; padding: 0 }`) and nothing restores it — `Heading.tsx` and `Text.tsx` set
  typography but no margin. Headings sit flush against body text on every page; the tour detail
  page renders as one unbroken ~800px column of text.
- **The homepage hero is a snow-covered Dolomites mountain photo** (`public/images/home/hero-dolomites.jpg`)
  on a street-food tour brand's front door — no food, market, wine, or people. Reinforced by
  `lib/content/homepage.ts`'s `gatewaySection`/`whereIsItSection` copy ("Bolzano — Gateway to the
  Dolomites", a geography lesson where the offer should be).
- **Only 5 minimal UI primitives exist** (`components/ui/{Button,Container,Heading,Section,Text}.tsx`),
  100% inline `style={{}}`, no Tailwind/CSS Modules. Inline styles cannot express `:hover`,
  `:focus-visible`, or media queries, so every link/button/card site-wide shares one blunt global
  rule (`globals.css:93-101`: `a:hover, button:hover { opacity: 0.85 }`, `article:hover`).
- **`components/ui/Button.tsx` is a plain pill** (`borderRadius: 999px`) with a live WCAG 1.4.3
  contrast failure: the `secondary` variant renders transparent-background dark-green text
  directly over the hero photo, illegible at mobile width.
- **`components/marketing/TourTileGrid.tsx`** renders 6 flat `#ede6d6` rounded rectangles with a
  title only, ignoring 4 already-licensed on-theme photos (`public/images/home/tile-*.jpg`).
- **Tokens are fragmented** across `globals.css` (7 colors, 8 spacing steps), `components/ui/tokens.ts`
  (same colors re-exported, plus 2 motion constants nothing imports), and ad hoc per-component
  `const` maps. No type scale, radius, shadow, or border tokens exist anywhere.

Full findings: audit transcript from the brainstorming session, 2026-09-17.

## Goal

Ship a distinctive "Bolzano market" visual language for the homepage and the shared UI
primitives it depends on, replacing the generic/broken current styling. The direction was
explored as three options (market-stall mosaic / bilingual editorial / wine-label cellar) via
mockups and validated with the project owner as a hybrid:

- **Layout logic** — *Il Mercato*'s irregular mosaic tile grid, used for the hero photo layer,
  the homepage tile grid, and tour cards. Tiles are sized by importance, not a uniform
  `auto-fit` grid.
- **Typographic hierarchy** — *Zwei Sprachen*'s kicker (small-caps eyebrow) + italic serif
  headline + bilingual subline, used for section headings site-wide.
- **Ornament** — *Cantina*'s notched label-chip + wax-seal motif, used as one shared
  price-tag/category-badge/appellation-number device (`No. 01`, `No. 04`, …) everywhere a price
  or category needs marking. Cantina's dark cellar-ground panel is kept as a sparing accent (one
  homepage panel), not the whole site's background — a fully dark ground would fight the
  market-grid photography.

## Non-goals (decomposed out of this spec)

- **Rollout beyond the homepage** (tour-detail pages, blog, private-transfers rate tables,
  footer/nav) — the worst-designed screens today, but a separate sub-project/spec after this one
  ships and is reviewed live on the dev environment, per `CLAUDE.md`'s release gate.
- **Sourcing real photography.** Files still come from the project owner, or via
  `files/photo-library-reference-guide.md` (re-pointed at the right themes below) — this spec
  designs components to consume whatever photo set exists, including placeholder color blocks
  until real files land. Same non-goal pattern as the mosaic spec.
- **Full homepage copy rewrite.** Only the `gatewaySection`/`whereIsItSection` text in
  `lib/content/homepage.ts` gets a light touch-up (see below); no other copy changes.
- **A Tailwind migration.** CSS Modules, per the styling-approach decision below.

## Design

### Styling approach: CSS Modules + an expanded token layer

Chosen over Tailwind v4 because the hybrid direction leans on bespoke shapes (label-chip
clip-paths, irregular mosaic grids, custom hover/focus states) that utility classes fight
against, and it's zero-runtime under the App Router/RSC setup.

- `app/globals.css` gains: a fluid type scale (replacing the two ad hoc `clamp()`s in
  `Heading.tsx` and the three fixed `rem` sizes in `Text.tsx`), a radius/shape token set
  (including the label-chip `clip-path` defined once, not repeated per usage), a small shadow
  scale. `--space-*` stays, extended only if a step is missing.
- `components/ui/tokens.ts` becomes the TypeScript mirror of the same values. Its two existing
  motion constants (`MOTION_DURATION_MS`, `MOTION_EASE`) are currently dead — imported nowhere,
  while `globals.css` hardcodes the same duration/easing separately. Wire them up as the single
  source of truth or delete them; don't leave them orphaned.
- Remove the two blanket rules in `globals.css:86-101` (`a:hover, button:hover { opacity: 0.85 }`,
  `article:hover { transform: translateY(-2px) }`). Every component that needs a hover/focus
  state owns it in its own CSS Module from here on. Add real `:focus-visible` styling — absent
  site-wide today.
- Each primitive gets a colocated `.module.css` (e.g. `Button.tsx` + `Button.module.css`).

### New/rebuilt primitives (`components/ui/`)

- **`Button`** — replace the pill with the stamped crate-label rectangle from the validated
  mockup (small radius, `box-shadow: 2px 2px 0 var(--color-forest-dark)`), real
  `:hover`/`:focus-visible`/`:active`/`:disabled` states. Fixes the WCAG contrast failure: the
  `secondary` variant gets a solid/scrim background instead of transparent-over-photo.
- **`LabelChip`** (new) — the shared notched clip-path ornament (`No. 0X` + amount/category +
  wax-seal circle). Built once and reused across hero, tile grid, and cards, rather than
  duplicated per usage as in the mockup prototype.
- **`Card`** (new) — replaces the ad hoc `article` styling currently duplicated inline in
  `components/catalog/ProductCard.tsx`; mosaic-shaped photo area + `LabelChip` + `Kicker`/title,
  owns its own hover (lift + shadow) now that the global `article:hover` rule is gone.
- **`Kicker`** (new) — the small-caps, letter-spaced eyebrow label (e.g. "No. 01 — Speck &
  Markt"), used above headings wherever the editorial voice applies.
- **`Input`, `Badge`, CTA `Link`** — don't exist today. `NewsletterForm`/`ContactForm` need real
  styled inputs; the three bare `<a href>` CTAs that currently bypass `next/link`
  (`components/booking/BookingWidgetComingSoon.tsx:20`, `components/booking/QuoteOnlyNotice.tsx:21`,
  `app/(marketing)/private-transfers/page.tsx:64`) get converted to a real CTA-link component.
- **`Heading`/`Text`** — keep the component boundary; fix the root cause of "no vertical rhythm"
  (no margin is ever set or restored). Either the components own a per-level margin-bottom, or a
  new `Stack` primitive provides consistent spacing between children — pick whichever reads
  cleaner during implementation; the requirement is that no page ever again has zero space
  between a heading and its following text.
- **`Section`** — gains a `tone="forest-dark"` variant for the sparing Cantina accent panel, and
  support for full-bleed/asymmetric layouts so sections stop being a uniform centered-band
  stripe (currently every section is the same `72rem` centered container at the same
  `--space-8` block padding).

### Homepage-specific changes

- **`Hero.tsx`** — swap `hero-dolomites.jpg` for an owner-supplied market/food-themed static
  fallback image; keep the existing mosaic 3D layer wiring untouched (already correct per the
  mosaic spec, just currently starved of photos); add `Kicker` + `LabelChip` to the hero copy
  per the validated mockup.
- **`TourTileGrid.tsx`** — rebuilt as the irregular mosaic grid (asymmetric tile sizing, not
  uniform `auto-fit` rectangles), each tile carrying a photo + `LabelChip`.
  `lib/content/homepage.ts`'s `tiles` array (currently `{ title, href }` only) gains `image` and
  `category` fields per tile.
- **One `Section tone="forest-dark"` accent panel** on the homepage (e.g. framing the Wine Tours
  tile), demonstrating the Cantina motif — exact placement decided during implementation
  planning against the validated mockup.
- **`lib/content/homepage.ts` copy**: light rewrite of `gatewaySection`/`whereIsItSection` so
  "Gateway to the Dolomites" stops being centered as its own homepage section — geography
  becomes a brief mention, not a section thesis. No other copy changes in this spec.

### Motion

Add the `motion` package (current framer-motion) — not installed today. The only existing
motion primitive is `components/motion/Reveal.tsx` (one `IntersectionObserver` + the `.reveal`
CSS class, a 400ms/16px translate; its `delay` prop is defined but unused anywhere, so there's
no stagger on the site today). Use `motion` for: staggered reveal of tile-grid items, and the
label-chip "settle" micro-interaction on card hover. Every new motion addition uses `motion`'s
`useReducedMotion` hook — matching, not weakening, today's three independent
`prefers-reduced-motion` checks (`globals.css:161-182`, `Reveal.tsx:27`, `useShouldRender3D`).

### Testing (mandatory per `CLAUDE.md`, every implementation step)

- **Vitest** — any pure logic extracted (e.g. label-chip numbering/sequencing, tile-grid sizing
  logic) gets unit tests, same pattern already used for `photoMosaicLayout.ts`.
- **Playwright** — update the homepage e2e spec and its multi-viewport (mobile/tablet/desktop)
  coverage for the new hero/tile-grid/card markup. Extend `@axe-core/playwright` checks to cover
  the new components; the contrast bug fixed here gets an explicit regression assertion.
- **`app/style-guide/page.tsx`** — expand as the living showcase and visual-regression target
  for the new primitives (`Button`, `LabelChip`, `Card`, `Kicker`, `Section` tone variants).

## Known open items (carried forward, not silently resolved)

- Real photography for the hero, tile grid, and cards is still owner-supplied. This spec ships
  against clearly-labeled placeholder color blocks until files land in `public/images/home/` and
  `public/images/home/mosaic/`.
- `files/photo-library-reference-guide.md` gets re-pointed from Dolomites/mountains search
  themes to market-stall, speck/cheese, farmhouse-kitchen, cellar/vineyard-interior,
  Christmas-market-food, and guide/guest-portrait themes, as part of this work (a content/doc
  change, not code).
- Sub-project 2 — rollout to tour-detail/blog/transfers/footer/nav — is deferred to its own spec
  after this one ships and passes the manual dev-environment review gate.
