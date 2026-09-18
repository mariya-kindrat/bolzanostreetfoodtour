# Homepage Hero Redesign — Photo Mosaic 3D Accent

**Status:** Approved design, ready for implementation planning.
**Supersedes:** the Phase 2 `HeroScene` (three rotating flat-color cones), which the
project owner rejected as a design failure — not premium, and slow to appear (idle-gated
dynamic import of a heavy WebGL bundle with no loading transition).

## Problem

The current homepage hero 3D accent (`components/three/HeroScene.tsx`) renders three
flat, solid-color low-poly cones rotating in front of a static Dolomites photo. Visually
it reads as an unfinished placeholder, not the "premium travel magazine" feel `CLAUDE.md`
calls for. Separately, the accent is gated behind `requestIdleCallback` + a 200ms
fallback before its (large) `three`/`@react-three/fiber` bundle even starts downloading,
so on any real network there's a multi-second gap with no loading indication before an
abrupt pop-in.

## Goal

Replace the hero 3D accent with a photo-tile "mosaic assembly" scene: real photography
(Dolomites, Bolzano, food, vineyards — sourced by the project owner) flies in as 3D tiles
on page load and settles into a full-bleed collage, with a foreground swaying branch
layer and a soft atmospheric back layer, while fixing the load-choreography problem that
caused the original "slow to load" complaint. Must keep `CLAUDE.md`'s existing
guarantees: lazy-loaded after critical content is interactive, skipped under
`prefers-reduced-motion`/low-end devices with a static-image fallback, never a hard
Core Web Vitals requirement.

## Non-goals (decomposed out of this spec)

- **Per-tour photo galleries** (2-3 admin-editable photos per `Tour`) — a separate,
  much smaller Prisma-schema + content change, tracked and implemented independently
  after this spec. Unrelated data flow: the hero mosaic reads static files from
  `public/images/home/mosaic/`, never `Tour` records.
- Sourcing the actual photography. The project owner is supplying the images; this spec
  designs the system to consume whatever set is provided (including zero images, before
  they're sourced).

## Design

### Components

```
components/three/
  HeroScene.tsx          — rewritten: PhotoMosaic scene (replaces Peaks)
  HeroSceneLoader.tsx    — updated: prefetch immediately, cross-fade in when ready
                           (no more idle-callback + fixed delay before starting the import)
  useShouldRender3D.ts   — unchanged (reduced-motion / low-end device gate)
  photoMosaicLayout.ts   — new, pure function: (photoCount, viewportSize) => per-tile
                           target position/rotation/depth + category-tinted border color.
                           Framework-free so it's directly unit-testable.
components/marketing/
  Hero.tsx               — rewritten layer order (see "z-index bug fix" below); adds
                           <TreeBranchOverlay />
  TreeBranchOverlay.tsx  — new: foreground branch photo (alpha PNG), CSS sway animation
                           gated by prefers-reduced-motion, aria-hidden, pointer-events: none
lib/content/
  home-mosaic.ts         — new: manifest of { filename, category }[] for mosaic photos
public/images/home/mosaic/
  *.jpg                  — photo set (project owner supplies)
  branch.png             — alpha-channel branch cutout (project owner supplies)
```

### Scene content (`PhotoMosaic`)

Each entry in `home-mosaic.ts` becomes one `THREE.Mesh` (`PlaneGeometry` + texture via
drei's `useTexture`), backed by a second, slightly larger cream-colored plane offset a
hair's-width behind it in z — a cheap shader-free "matte frame" per tile. Tiles spawn at
randomized off-screen positions/rotations/depths and ease (via `useFrame`, one-time, not
looped) toward a target slot computed by `photoMosaicLayout.ts`:

- **Desktop:** ~10-14 tiles, irregular (not perfectly gridded) collage filling the hero.
- **Mobile:** ~5-6 tiles, shorter fly-in distances, same mechanism at reduced density.

Tile border gets a thin terracotta or forest-green highlight keyed to the photo's
`category` (food/wine → terracotta, landscape/culture → forest green), so the settled
mosaic isn't visually flat.

**Back layer:** one wide, softly blurred, desaturated mountain-silhouette/cloud texture
behind the tile plane, animated with a very slow drift (not the one-time assembly — an
ambient, near-imperceptible parallax) for atmospheric depth.

**Post-settle life:** on desktop only (skipped on touch/no-cursor devices), the tile
group applies a few degrees of parallax tilt toward cursor position — rotating the
existing group, no re-simulation — so the scene doesn't read as frozen after the one-time
reveal.

**Foreground:** `TreeBranchOverlay` (outside the WebGL canvas, a plain positioned `<img>`)
sways via CSS transform, `prefers-reduced-motion`-gated per the existing `Reveal.tsx`
pattern already in the codebase.

### Load choreography fix

`HeroSceneLoader` currently: wait for idle callback (or 200ms) → *then* start the dynamic
`import()` of `HeroScene` → mount abruptly when ready. New behavior: start prefetching the
`HeroScene` chunk immediately on mount (still `next/dynamic` with `ssr: false`, still
gated by `useShouldRender3D` so reduced-motion/low-end users never fetch it at all), and
cross-fade it in over ~400ms on top of the always-visible static hero photo once loaded,
instead of popping in unannounced. The static photo is the first paint either way, so LCP
is unaffected; this only changes what happens after.

### z-index bug fix (found during investigation, folded into this rewrite)

The current `Hero.tsx` sets the background `<Image>` to `zIndex: -1` inside a positioned
parent with no isolated stacking context, which made the photo invisible (confirmed via
browser inspection — only the dark gradient overlay was visible, no photo, no cones). The
rewrite establishes an explicit stacking order: back atmosphere layer → photo mosaic →
branch overlay → existing text-contrast gradient → headline content.

### Asset guidance (for the project owner sourcing photos)

- `mosaic/*.jpg`: ~1200×800px, optimized JPEG, target <150KB each — texture loading
  shouldn't become the next "slow to load" bottleneck.
- `branch.png`: alpha-channel PNG, pine/larch branch, roughly matches existing site
  photography's color temperature.
- Same licensing model as the existing 5 images (`public/images/home/SOURCES.md`): CC
  BY / BY-SA from Wikimedia Commons, Unsplash, or Pexels, with attribution recorded in
  `SOURCES.md` and `/photo-credits`.

### Error handling / graceful degradation

- `home-mosaic.ts` empty or all textures fail to load → `PhotoMosaic` doesn't mount;
  `Hero.tsx`'s always-present static `<Image>` is the only thing shown. This means the
  feature ships correctly *before* real photos exist, not just after.
- A single tile's texture failing to load (missing file, network error) is caught and
  that tile is skipped, not treated as a scene-ending error.
- `prefers-reduced-motion` / low-end-device path is unchanged: static image only, no
  mosaic, no branch sway (branch image itself, if present, still renders — just without
  the sway keyframes).

## Testing

- **Vitest** (`photoMosaicLayout.ts`): photo counts of 0, 1, 3, and 14; desktop vs.
  mobile tile density; all computed target positions stay within viewport bounds.
- **Playwright:**
  - Hero renders without throwing when `mosaic/` is empty (falls back to static image).
  - Hero renders the expected tile count when photos exist.
  - `prefers-reduced-motion` path shows the static image, no `<canvas>`.
  - Mobile viewport gets the reduced tile count.
  - axe scan passes — headline contrast holds over the new layer stack.
- Re-run the existing Phase 2 CWV/Lighthouse verification script against both the
  enabled and fallback paths to confirm LCP/INP still pass.

## Follow-up (separate, decomposed piece)

Once this ships, add a `TourImage` (or similar) relation to the `Tour` model so each tour
can carry 2-3 admin-editable photos — a small, independent Prisma-schema change, not part
of this spec's implementation plan.
