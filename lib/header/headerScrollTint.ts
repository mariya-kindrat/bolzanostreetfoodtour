export interface HeaderScrollTint {
  backgroundColor: string;
  blurPx: number;
  borderAlpha: number;
  shadowAlpha: number;
}

// Endpoints for the interpolation. START is the header at rest (solid
// cream, no blur, an opaque hairline border). END is the fully-scrolled
// state: tinted toward the site's terracotta accent but capped at a light
// 30% mix so it reads as a warm cast, not a color change.
const START = { r: 247, g: 243, b: 234, alpha: 1, blur: 0 };
const END = { r: 227, g: 194, b: 178, alpha: 0.8, blur: 16 };

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

// Pure function of scroll progress (0 = top of page, 1 = fully scrolled) ->
// the header's tint/blur/border/shadow values. Kept separate from the
// component so the interpolation math is unit-testable without a DOM,
// mirroring lib/hero/heroCarouselLayout.ts's pure-function pattern.
export function computeHeaderScrollTint(scrollProgress: number): HeaderScrollTint {
  const p = Math.max(0, Math.min(1, scrollProgress));
  const r = Math.round(lerp(START.r, END.r, p));
  const g = Math.round(lerp(START.g, END.g, p));
  const b = Math.round(lerp(START.b, END.b, p));
  const alpha = lerp(START.alpha, END.alpha, p);

  return {
    backgroundColor: `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(2)})`,
    blurPx: lerp(START.blur, END.blur, p),
    borderAlpha: 1 - p,
    shadowAlpha: 0.18 * p,
  };
}
