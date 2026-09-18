import { describe, expect, it } from "vitest";
import {
  computeCoverUV,
  computeSlideState,
  getDominantSlideIndex,
  DEFAULT_SLIDE_TIMING,
} from "@/lib/hero/heroCarouselLayout";

const { slideDurationSeconds, crossfadeSeconds } = DEFAULT_SLIDE_TIMING;

describe("computeSlideState", () => {
  it("returns a fully transparent, unscaled state for zero slides", () => {
    expect(computeSlideState(0, 0, 5)).toEqual({ opacity: 0, scale: 1 });
  });

  it("stays fully opaque for a single slide regardless of elapsed time", () => {
    expect(computeSlideState(0, 1, 0).opacity).toBe(1);
    expect(computeSlideState(0, 1, 123.4).opacity).toBe(1);
  });

  it("is fully opaque at a slide's own center", () => {
    // Slide i's center is i * slideDurationSeconds (not offset by half a
    // dwell) — see the "shows a clean slide 0 at t=0" regression test below
    // for why that phase matters.
    const state = computeSlideState(0, 3, 0);
    expect(state.opacity).toBe(1);
  });

  it("shows a clean slide 0 at elapsedSeconds=0 — no ghosting from the wrap-around neighbor", () => {
    // Regression test: an earlier version centered slide i at
    // i * slideDurationSeconds + slideDurationSeconds / 2, which put
    // elapsedSeconds=0 exactly on the crossfade boundary between slide 0
    // and the last slide (wrapping around) — both were ~50% opaque on
    // mount instead of a clean slide 0. Since the R3F clock starts at 0
    // when the Canvas mounts, and slide 0 matches the hero's static LCP
    // fallback image, this is exactly the "no visible jump on mount" case
    // the slide manifest's own comment promises.
    const first = computeSlideState(0, 3, 0);
    const last = computeSlideState(2, 3, 0);
    expect(first.opacity).toBe(1);
    expect(last.opacity).toBe(0);
  });

  it("never lets two adjacent slides both hit opacity 0 at their shared boundary", () => {
    // Regression test: an earlier version placed the opacity-reaches-zero
    // point at the exact midpoint between two slide centers, so both
    // slides went fully transparent simultaneously at every boundary
    // instead of crossfading. The boundary between slide 0 and slide 1 is
    // at t = slideDurationSeconds / 2.
    const boundary = slideDurationSeconds / 2;
    const outgoing = computeSlideState(0, 3, boundary);
    const incoming = computeSlideState(1, 3, boundary);
    expect(outgoing.opacity + incoming.opacity).toBeGreaterThan(0.9);
  });

  it("crossfades symmetrically: outgoing and incoming opacity sum to ~1 across the ramp", () => {
    const boundary = slideDurationSeconds / 2;
    for (const offset of [-crossfadeSeconds / 2, 0, crossfadeSeconds / 2]) {
      const outgoing = computeSlideState(0, 3, boundary + offset);
      const incoming = computeSlideState(1, 3, boundary + offset);
      expect(outgoing.opacity + incoming.opacity).toBeCloseTo(1, 5);
    }
  });

  it("keeps Ken Burns scale continuous across a crossfade boundary (no jump-cut while visible)", () => {
    // Regression test: an earlier version derived scale from an
    // independent per-slide clock (i * slideDurationSeconds as a window
    // start) instead of the same center used for opacity, so a slide's
    // zoom reset from its max back to 1.0 instantly at that boundary —
    // exactly when the neighboring formula put it at ~50% opacity, a
    // visible pop. Scale should now change smoothly through the boundary.
    const boundary = slideDurationSeconds / 2;
    const before = computeSlideState(0, 3, boundary - 0.01).scale;
    const after = computeSlideState(0, 3, boundary + 0.01).scale;
    expect(Math.abs(after - before)).toBeLessThan(0.001);
  });

  it("is 0 once a slide is well outside its own window", () => {
    const state = computeSlideState(0, 3, slideDurationSeconds * 1.5);
    expect(state.opacity).toBe(0);
  });

  it("is symmetric near the end of a cycle too (wraps the other direction)", () => {
    // elapsedSeconds close to cycleLength is "just before" slide 0's center
    // (wrapping the other way around the loop) — exercises the opposite
    // wrap branch from the t=0 test above.
    const cycleLength = slideDurationSeconds * 3;
    const state = computeSlideState(0, 3, cycleLength - 1);
    expect(state.opacity).toBe(1);
  });

  it("is deterministic for the same inputs", () => {
    const a = computeSlideState(1, 3, 7.25);
    const b = computeSlideState(1, 3, 7.25);
    expect(a).toEqual(b);
  });

  it("loops: state repeats one full cycle later", () => {
    const cycleLength = slideDurationSeconds * 3;
    const a = computeSlideState(2, 3, 4.5);
    const b = computeSlideState(2, 3, 4.5 + cycleLength);
    expect(a.opacity).toBeCloseTo(b.opacity, 5);
  });

  it("scales up (Ken Burns) monotonically while a slide is visible", () => {
    // Slide 1 (center = slideDurationSeconds) is fully visible over
    // roughly [center - rampEnd, center + rampEnd]; sampled entirely within
    // that span (no wrap-around) so the three points are directly ordered.
    const start = computeSlideState(1, 3, slideDurationSeconds * 0.42).scale;
    const mid = computeSlideState(1, 3, slideDurationSeconds).scale;
    const end = computeSlideState(1, 3, slideDurationSeconds * 1.58).scale;
    expect(start).toBeLessThan(mid);
    expect(mid).toBeLessThan(end);
  });
});

describe("getDominantSlideIndex", () => {
  it("returns -1 for zero slides", () => {
    expect(getDominantSlideIndex(0, 5)).toBe(-1);
  });

  it("is always 0 for a single slide", () => {
    expect(getDominantSlideIndex(1, 0)).toBe(0);
    expect(getDominantSlideIndex(1, 999)).toBe(0);
  });

  it("matches whichever slide computeSlideState says is fully opaque", () => {
    expect(getDominantSlideIndex(3, 0)).toBe(0);
    expect(getDominantSlideIndex(3, slideDurationSeconds)).toBe(1);
    expect(getDominantSlideIndex(3, slideDurationSeconds * 2)).toBe(2);
  });

  it("agrees with the 3D layer's own computeSlideState at the same elapsed time", () => {
    // The whole point of this function is that a separate DOM-side clock
    // computing the same thing off the same pure function stays in sync
    // with the 3D canvas without either side telling the other anything.
    for (const t of [0, 2.5, 6, 9.9, 14, 17.99]) {
      const dominant = getDominantSlideIndex(3, t);
      const state = computeSlideState(dominant, 3, t);
      for (let i = 0; i < 3; i++) {
        if (i === dominant) continue;
        expect(computeSlideState(i, 3, t).opacity).toBeLessThanOrEqual(state.opacity);
      }
    }
  });
});

describe("computeCoverUV", () => {
  it("returns full coverage with no cropping when aspect ratios match", () => {
    expect(computeCoverUV(16 / 9, 16 / 9)).toEqual({ repeat: [1, 1], offset: [0, 0] });
  });

  it("crops the sides (reduces horizontal repeat) when the image is wider than the plane", () => {
    const { repeat, offset } = computeCoverUV(2, 1);
    expect(repeat[0]).toBeLessThan(1);
    expect(repeat[1]).toBe(1);
    expect(offset[0]).toBeGreaterThan(0);
    expect(offset[1]).toBe(0);
  });

  it("crops the top/bottom (reduces vertical repeat) when the image is taller than the plane", () => {
    const { repeat, offset } = computeCoverUV(1, 2);
    expect(repeat[1]).toBeLessThan(1);
    expect(repeat[0]).toBe(1);
    expect(offset[1]).toBeGreaterThan(0);
    expect(offset[0]).toBe(0);
  });
});
