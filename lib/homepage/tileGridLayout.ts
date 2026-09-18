export type TileSize = "large" | "wide" | "tall" | "small";

export interface TileLayoutEntry {
  size: TileSize;
  colStart: number;
  colSpan: number;
  rowStart: number;
  rowSpan: number;
}

// Explicit 6-column x 3-row placement (not auto-flow: dense) - auto-flow with
// span-only sizing does not guarantee a tessellating fit for an arbitrary
// span sequence and previously left a visible gap in row 2 with tile 6
// orphaned onto its own row. This exact geometry mirrors the originally
// validated "Il Mercato" design mockup: 18 cells (6 cols x 3 rows), fully
// tiled with no gaps or overlaps for the homepage's real 6-tile count.
const PATTERN: TileLayoutEntry[] = [
  { size: "large", colStart: 1, colSpan: 3, rowStart: 1, rowSpan: 2 },
  { size: "wide", colStart: 4, colSpan: 3, rowStart: 1, rowSpan: 1 },
  { size: "tall", colStart: 4, colSpan: 2, rowStart: 2, rowSpan: 2 },
  { size: "small", colStart: 6, colSpan: 1, rowStart: 2, rowSpan: 2 },
  { size: "wide", colStart: 1, colSpan: 2, rowStart: 3, rowSpan: 1 },
  { size: "small", colStart: 3, colSpan: 1, rowStart: 3, rowSpan: 1 },
];

// Beyond the base pattern's 6 tiles, cycling no longer guarantees a
// tessellating fit (the explicit geometry above is tuned for exactly 6,
// the real current homepage tile count) - this is a graceful degradation
// for API consistency, not a guarantee, same as before.
export function computeTileLayout(count: number): TileLayoutEntry[] {
  return Array.from({ length: count }, (_, i) => PATTERN[i % PATTERN.length]);
}
