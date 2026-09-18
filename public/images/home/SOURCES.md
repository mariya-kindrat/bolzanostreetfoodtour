# Image sources

One line per image: filename, Wikimedia Commons file title, license, source URL.

This is the internal licensing trail (git history, not public). The public-facing
attribution required by the CC BY / CC BY-SA licenses below lives at `/photo-credits`
(`app/(marketing)/photo-credits/page.tsx`), sourced from `lib/content/photo-credits.ts` —
keep that file in sync with this one when images here change.

See `mosaic/README.md` for the hero carousel's current 3-photo slide set (a subset of
what's sourced below, as of the 2026-09-18 redesign pass).

- `hero-market.jpg` — Pexels photo 34456811 (cropped from the original 1920x2880
  portrait to a 1920x960 wide band centered on the pretzel/Schüttelbrot display, since
  the hero renders full-bleed at a wide aspect and the original portrait crop couldn't
  cover it without losing most of the composition) — Pexels License — free for
  commercial use, no attribution required — https://www.pexels.com/photo/rustic-bakery-display-in-bolzano-italy-34456811/
  — sourced at the project owner's direction, replacing the solid-color placeholder
  `Hero.tsx` rendered until this task.
- `hero-dolomites.jpg` — no longer used by `Hero.tsx` as of Task 9 (kept on disk;
  `lib/content/photo-credits.ts` still lists it, out of scope for this task) — File:Drei Zinnen Tre Cime di Lavaredo Dolomites.jpg — CC BY-SA 3.0 — https://commons.wikimedia.org/wiki/File:Drei_Zinnen_Tre_Cime_di_Lavaredo_Dolomites.jpg
- `tile-street-food.jpg` — File:Speck in Bolzano (Bozen).JPG — CC BY-SA 4.0 — https://commons.wikimedia.org/wiki/File:Speck_in_Bolzano_(Bozen).JPG
- `tile-cooking-classes.jpg` — File:Maso Rover - Campi.jpg — CC BY-SA 4.0 — https://commons.wikimedia.org/wiki/File:Maso_Rover_-_Campi.jpg (substitution note: no Commons image of an actual South Tyrolean cooking class/farmhouse kitchen interior was found after several search attempts; this is a South Tyrolean "Maso" farmhouse exterior, the closest on-theme real photo available — see task report)
- `tile-wine-tours.jpg` — File:Suedtirol vineyard Kaltern.jpg — CC BY 3.0 — https://commons.wikimedia.org/wiki/File:Suedtirol_vineyard_Kaltern.jpg
- `tile-winter-tours.jpg` — File:Villaggio natalizio a Mercatini di Bolzano.jpg — CC BY-SA 4.0 — https://commons.wikimedia.org/wiki/File:Villaggio_natalizio_a_Mercatini_di_Bolzano.jpg

## Hero mosaic (`mosaic/`)

All sourced from Pexels (Pexels License — free for commercial use, modification
permitted, no attribution required) at the project owner's direction. Cropped to the
mosaic tile's aspect ratio (1091x800) and compressed; originals are the full-resolution
Pexels download at each URL below.

- `mosaic/market-cheese-vendor.jpg` — Pexels photo 26268376 — Pexels License — https://www.pexels.com/photo/young-man-selling-a-variety-of-cheeses-26268376/
- `mosaic/market-parmigiano.jpg` — Pexels photo 26268371 — Pexels License — https://www.pexels.com/photo/man-selling-parmiggiano-reggiano-cheese-26268371/
- `mosaic/bolzano-arch-wine.jpg` — Pexels photo 38985950 — Pexels License — https://www.pexels.com/photo/charming-alleyway-in-bolzano-with-wine-display-38985950/
- `mosaic/farmhouse-kitchen.jpg` — Pexels photo 39025299 — Pexels License — https://www.pexels.com/photo/vintage-kitchen-with-copper-cookware-and-vegetables-39025299/
- `mosaic/christmas-market-stall.jpg` — Pexels photo 29875483 — Pexels License — https://www.pexels.com/photo/couple-shopping-at-a-christmas-market-at-night-29875483/
- `mosaic/vineyard-village.jpg` — Pexels photo 31222493 — Pexels License — https://www.pexels.com/photo/vineyards-in-schenna-with-mountain-panorama-31222493/
- `mosaic/bolzano-arcade-street.jpg` — Pexels photo 37983257 — Pexels License — https://www.pexels.com/photo/charming-cobblestone-street-in-bolzano-italy-37983257/
