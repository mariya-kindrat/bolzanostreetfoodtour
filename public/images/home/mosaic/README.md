# Hero carousel photos

This folder held photography for the homepage hero's auto-advancing 3D crossfade carousel
(see `docs/architecture.md`'s "Homepage 3D accent" section) until the 2026-09-18 Category
model migration. **The hero's slide set is no longer a static manifest** — it's driven by
`getActiveCategories()` (`lib/content/categories.ts`), one slide per active `Category` row,
using that category's own `photoUrl`/`altText`. To change what the hero shows, edit a
category's photo via `/admin/categories` (or `prisma/seed.ts`'s `CATEGORIES` array for the
seeded defaults) — not a file in this folder.

## Changing a category's photo

1. Add the replacement image somewhere under `public/images/` (the 4 seeded categories'
   photos live in `public/images/tours/`, not this folder): ~1200x800px or wider,
   optimized JPEG, target under 150KB — these load client-side as WebGL textures, so file
   size directly affects how fast the carousel appears.
2. Update that category's `photoUrl`/`altText` — via `/admin/categories`, or by editing
   `CATEGORIES` in `prisma/seed.ts` and re-running `npm run db:seed` for the seeded
   defaults.
3. Record the new photo's source in `../SOURCES.md` (or `public/images/tours/`'s own
   sourcing notes), and its public attribution (if the license requires it) in
   `lib/content/photo-credits.ts` / `/photo-credits`.

Any image aspect ratio works — `HeroScene.tsx` applies an `object-fit: cover` crop
(`computeCoverUV` in `lib/hero/heroCarouselLayout.ts`) so slides never stretch or
distort, regardless of their native aspect ratio versus the hero's.

## Other mosaic-sourced photos in this folder

`market-cheese-vendor.jpg`, `market-parmigiano.jpg`, `bolzano-arch-wine.jpg`,
`farmhouse-kitchen.jpg`, and `christmas-market-stall.jpg` were sourced for the earlier
many-tile photo-mosaic hero and aren't referenced by any component right now. They're
real, already-licensed assets (see `../SOURCES.md`) kept on disk as spare stock for
later elements of this redesign (e.g. the "Discover our tours" card grid) rather than
deleted.

## Foreground branch layer

`public/images/home/branch.png` — a single alpha-channel PNG of a pine/larch branch,
roughly matching the site's existing photography's color temperature. Gracefully
optional: the hero hides this layer entirely if the file is missing.

## Licensing

Same model as the rest of this project's photography (`../SOURCES.md`): free-to-use,
commercially-licensed images from Unsplash, Pexels, or Wikimedia Commons (CC BY / CC
BY-SA). Record each new photo's source in `../SOURCES.md`, and its public attribution (if
the license requires it) in `lib/content/photo-credits.ts` / `/photo-credits`.
