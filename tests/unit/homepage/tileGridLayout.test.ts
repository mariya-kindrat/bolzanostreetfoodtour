import { describe, expect, it } from "vitest";
import { computeTileLayout } from "@/lib/homepage/tileGridLayout";

describe("computeTileLayout", () => {
  it("returns an empty array for zero tiles", () => {
    expect(computeTileLayout(0)).toEqual([]);
  });

  it("returns exactly one entry per tile, in order", () => {
    expect(computeTileLayout(6)).toHaveLength(6);
  });

  it("gives the first tile the flagship large slot at the grid origin", () => {
    const layout = computeTileLayout(6);
    expect(layout[0]).toEqual({ size: "large", colStart: 1, colSpan: 3, rowStart: 1, rowSpan: 2 });
  });

  it("every span and start is a positive integer", () => {
    for (const entry of computeTileLayout(6)) {
      expect(entry.colSpan).toBeGreaterThan(0);
      expect(entry.rowSpan).toBeGreaterThan(0);
      expect(entry.colStart).toBeGreaterThan(0);
      expect(entry.rowStart).toBeGreaterThan(0);
      expect(Number.isInteger(entry.colSpan)).toBe(true);
      expect(Number.isInteger(entry.rowSpan)).toBe(true);
      expect(Number.isInteger(entry.colStart)).toBe(true);
      expect(Number.isInteger(entry.rowStart)).toBe(true);
    }
  });

  it("is deterministic — same count, same output every call", () => {
    expect(computeTileLayout(6)).toEqual(computeTileLayout(6));
  });

  it("cycles the pattern for counts beyond the base pattern length", () => {
    const eight = computeTileLayout(8);
    const six = computeTileLayout(6);
    expect(eight.slice(0, 6)).toEqual(six);
    expect(eight[6]).toEqual(six[0]);
    expect(eight[7]).toEqual(six[1]);
  });

  it("the base 6-tile pattern exactly tiles a 6-column, 3-row grid with no gaps or overlaps", () => {
    const layout = computeTileLayout(6);
    const occupied = new Set<string>();
    for (const entry of layout) {
      for (let c = entry.colStart; c < entry.colStart + entry.colSpan; c++) {
        for (let r = entry.rowStart; r < entry.rowStart + entry.rowSpan; r++) {
          const key = `${c},${r}`;
          expect(occupied.has(key)).toBe(false);
          occupied.add(key);
        }
      }
    }
    expect(occupied.size).toBe(18);
  });
});
