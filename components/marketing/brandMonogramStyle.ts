import type { CSSProperties } from "react";

// Colors/font/weight of the "B" monogram inside BrandBadge.
export const BRAND_MONOGRAM_CIRCLE_STYLE: CSSProperties = {
  fill: "var(--color-terracotta)",
  stroke: "var(--color-forest-dark)",
  strokeWidth: 1.5,
};

export const BRAND_MONOGRAM_GLYPH_STYLE: CSSProperties = {
  fontFamily: "var(--font-serif)",
  fontStyle: "italic",
  fontWeight: 700,
  fill: "#fff",
};
