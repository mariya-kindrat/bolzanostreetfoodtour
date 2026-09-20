# Redesign Prompt — Two-Phase Audit + Redesign

> Working notes: this is an AI-prompt draft (audit, then redesign), not a project plan.
> Run Phase 1 and review its output before proceeding to Phase 2.
>
> **2026-09-18 direction update:** the "non-negotiable" principles below (written for the
> original ridgeline/organic-shape/topographic direction) are superseded for the current
> redesign pass. New direction: keep the Alpine Editorial palette and serif type as the
> brand throughline, but draw structural inspiration from the Lovable "Wanderlust Editorial"
> travel-blog template — abundant full-bleed lifestyle/food/market photography, category
> and filter navigation, hover-crossfade cards, day-guide-style itinerary content blocks,
> and a warmer, simpler hero treatment. Grids, carousels, and hero-with-CTA compositions are
> back in scope; they are no longer banned outright. "Wanderlust-adjacent, not
> Wanderlust-identical" — the earlier "no generic template patterns" prose below should be
> read as "no *default, unconsidered* template patterns," not a ban on grids/carousels/CTAs
> as such. Work proceeds element-by-element with explicit approval at each step (see
> `docs/superpowers/plans/` for the current phase's task breakdown).

## Redesign status (updated 2026-09-20)

Worked element by element, each proposed in chat, approved, code-reviewed, then committed
under its Jira story. Jira: BSFT-42 Done, EPIC-2 (BSFT-14) In Progress, the rest To Do.

| Page / element | State |
|---|---|
| Header navigation, hero | Done |
| Home: tours carousel, Why, wine feature, Gateway, Where, trust stamps, newsletter | Done |
| Site footer | Done |
| Tour Detail template (BSFT-43) | Done: hero and facts strip, body sections, booking card, mobile bar, related tours |
| Catalog and category pages (BSFT-44) | Done: header, chips, cards, categories tiles |
| Private Transfers (BSFT-45) | Done |
| About and Contact (BSFT-46) | In progress: About done, Contact next |
| Blog, Legal (BSFT-47, BSFT-48) | Not started |

**Pending owner input:** social account URLs; review of draft copy (wine, Gateway, trust
stamps, newsletter, footer description); decision on the unused `tile-*.jpg` images; whether
the untracked reference screenshots in `public/images/home/` stay out of the repo.


## Phase 1 — Deep Analysis

Run this first; wait for output before Phase 2. Do **not** write any code yet — this
phase is analysis only.

You are auditing a Next.js website for a tour company / blog about mountains in Italy.

### 1. Codebase audit

- Map the current page/route structure, layout components, and shared UI primitives
  (buttons, cards, headers, nav).
- Identify which UI library / CSS approach is used (Tailwind, CSS modules,
  styled-components, etc.) and how consistent it is.
- Flag every component that is a generic/templated pattern: hero with centered text +
  CTA button, 3-column feature grid, standard bullet lists, carousel-of-cards,
  footer-with-columns.
- Note current animation/interaction usage (if any): libraries, scroll behavior, hover
  states.
- Check performance basics: image formats, lazy loading, font loading strategy,
  Lighthouse-relevant issues.

### 2. Content & visual audit

- List the real content this site has: regions/mountains covered, tour types, blog
  categories, photography available.
- Assess current typography, color palette, spacing rhythm — call out anywhere it reads
  as "generic template" vs. anywhere it already reflects the subject matter (mountains,
  nature, Italy).
- Identify where imagery is underused, cropped awkwardly, or not treated as a hero
  element.

### 3. Competitive / reference scan

- Identify 3–5 non-generic design languages that would fit "mountains, Italy, nature,
  adventure" (e.g. editorial travel journalism sites, topographic/cartographic design
  systems, alpine minimalism, organic/handcrafted textures) — **not** generic
  travel-agency templates.
- For each, note what makes it distinctive in shape language, motion, and layout logic
  (not just color).

### 4. Output

Produce a structured report with:

- Current-state summary (strengths/weaknesses)
- A ranked list of the most "template-like" elements to eliminate first
- A shortlist of 2–3 distinct creative directions for the redesign, each with a one-line
  design thesis
- Technical constraints/opportunities in the current Next.js setup (App Router vs. Pages
  Router, existing animation libs, image pipeline)

## Phase 2 — Redesign

Run after reviewing Phase 1 output; pick or refine one creative direction.

Using the analysis above and creative direction **[X — paste chosen direction]**,
redesign this Next.js website.

### Design principles (non-negotiable)

- **No generic template patterns**: no centered-hero-with-button, no uniform 3-column
  card grids, no default bullet lists, no boxy pill-shaped buttons. Every recurring
  element (nav, card, CTA, list, section divider) should have a shape/silhouette that
  feels intentional and specific to mountains/nature — think ridgelines, contour lines,
  torn-paper/rock textures, organic curves, asymmetric grids — not rectangles with
  border-radius.
- **Nature should be structurally present, not decorative**: let terrain/mountain
  silhouettes, topographic lines, or organic masking shape actual layout containers
  (section dividers, image masks, navigation shapes), not just used as background photos.
- **Typography should do expressive work**: variable-weight or fluid type scales,
  occasional editorial/display treatment for headlines, letter-spacing/kerning that
  responds to scroll or viewport — avoid uniform default system-font blocks.
- **Motion should reveal content, not just decorate**: scroll-triggered reveals,
  parallax depth between foreground/midground/background imagery, elements that respond
  to cursor position, page-transition choreography between routes.
- **Images get signature treatment**: custom hover states (not just opacity/scale),
  image masking with irregular/organic shapes, possible duotone/grain treatment tied to
  the alpine aesthetic, zoom-on-scroll or Ken Burns-style subtle motion on hero imagery.
- **Consider a restrained set of 3D or quasi-3D moments** (not everywhere) — e.g. a
  WebGL/Three.js hero with parallax mountain layers, a tilt/perspective card effect on
  hover, or scroll-driven 3D terrain — used deliberately, not as gimmick clutter.

### Technical requirements (Next.js specific)

- Use Framer Motion (or GSAP + ScrollTrigger) for scroll/hover/page-transition animation.
- If using 3D: React Three Fiber + drei, kept performant (lazy-loaded, mobile-fallback to
  static imagery).
- Use `next/image` with proper sizing/priority for hero imagery; respect Core Web
  Vitals — animation must not tank LCP/CLS.
- Respect `prefers-reduced-motion` for all animation.
- Keep design tokens (colors, spacing, type scale, easing curves) centralized so the
  "signature" look is systematized, not one-off per component.
- Ensure the redesign works responsively — the unique shapes/motion need graceful mobile
  equivalents, not just a desktop showpiece.

### Deliverable

- Start with the hero section and primary navigation as the flagship demonstration of
  the new direction.
- Then propose the redesigned component system (cards, buttons/CTAs, section dividers,
  footer) as reusable primitives.
- For each component, briefly explain the design rationale (why this shape/motion, not a
  generic template) before showing code.
