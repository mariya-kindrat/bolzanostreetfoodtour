import type { CSSProperties } from "react";
import { useId } from "react";
import {
  BRAND_MONOGRAM_CIRCLE_STYLE,
  BRAND_MONOGRAM_GLYPH_STYLE,
} from "@/components/marketing/brandMonogramStyle";

// Circular "stamp" brand logo (curved brand text ringing a terracotta
// monogram) — an editorial-travel touch, used at hero size and, scaled down,
// as the header logo. Positioning is the caller's job (`style`). Static, not
// spinning: CLAUDE.md's motion policy is "moderate," and a
// constantly-rotating badge would compete with the hero's own
// crossfade/Ken Burns motion for attention.
export function BrandBadge({ size, style }: { size: number; style?: CSSProperties }) {
  // Unique per instance: the hero and header badges are on the same page.
  const ringId = useId();
  return (
    <svg width={size} height={size} viewBox="0 0 112 112" aria-hidden="true" style={style}>
      {/* Opaque backing disc, not a translucent wash: the hero's contrast
          scrim has faded to nothing by the top of the photo where this
          badge sits, so the cream ring text needs a guaranteed-dark
          backdrop regardless of which slide (or which part of it) is
          behind it — same reasoning as Button's solid (not transparent)
          secondary variant. */}
      <circle cx="56" cy="56" r="54" style={{ fill: "var(--color-forest-dark)" }} />
      <circle
        cx="56"
        cy="56"
        r="52"
        fill="none"
        style={{ stroke: "var(--color-cream)", strokeWidth: 1, opacity: 0.85 }}
      />
      <path id={ringId} d="M 56,56 m -41,0 a 41,41 0 1,1 82,0 a 41,41 0 1,1 -82,0" fill="none" />
      <text
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "8.5px",
          letterSpacing: "2px",
          fill: "var(--color-cream)",
        }}
      >
        <textPath href={`#${ringId}`} startOffset="2%">
          BOLZANO STREET FOOD TOUR • EST. 2017 •
        </textPath>
      </text>
      <circle cx="56" cy="56" r="28" style={BRAND_MONOGRAM_CIRCLE_STYLE} />
      <text
        x="56"
        y="66"
        textAnchor="middle"
        style={{ ...BRAND_MONOGRAM_GLYPH_STYLE, fontSize: "24px" }}
      >
        B
      </text>
    </svg>
  );
}
