import { describe, expect, it } from "vitest";
import { computeHeaderScrollTint } from "@/lib/header/headerScrollTint";

describe("computeHeaderScrollTint", () => {
  it("is solid, unblurred cream at rest (progress 0)", () => {
    const tint = computeHeaderScrollTint(0);
    expect(tint.backgroundColor).toBe("rgba(247, 243, 234, 1.00)");
    expect(tint.blurPx).toBe(0);
    expect(tint.borderAlpha).toBe(1);
    expect(tint.shadowAlpha).toBe(0);
  });

  it("is fully tinted/blurred at full scroll (progress 1)", () => {
    const tint = computeHeaderScrollTint(1);
    expect(tint.backgroundColor).toBe("rgba(227, 194, 178, 0.80)");
    expect(tint.blurPx).toBe(16);
    expect(tint.borderAlpha).toBe(0);
    expect(tint.shadowAlpha).toBeCloseTo(0.18, 5);
  });

  it("interpolates linearly at the midpoint", () => {
    const tint = computeHeaderScrollTint(0.5);
    expect(tint.blurPx).toBeCloseTo(8, 5);
    expect(tint.borderAlpha).toBeCloseTo(0.5, 5);
    expect(tint.shadowAlpha).toBeCloseTo(0.09, 5);
  });

  it("clamps out-of-range progress instead of extrapolating", () => {
    expect(computeHeaderScrollTint(-5)).toEqual(computeHeaderScrollTint(0));
    expect(computeHeaderScrollTint(5)).toEqual(computeHeaderScrollTint(1));
  });

  it("is deterministic for the same input", () => {
    expect(computeHeaderScrollTint(0.37)).toEqual(computeHeaderScrollTint(0.37));
  });
});
