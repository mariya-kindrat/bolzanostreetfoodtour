export interface HeroSlide {
  src: string;
  alt: string;
}

export interface HeroSlideTimingConfig {
  slideDurationSeconds: number;
  crossfadeSeconds: number;
  kenBurnsScale: number;
}

// 6s dwell (matches the travel-editorial reference this redesign follows),
// 1.2s crossfade overlap, a slow 6% zoom across each slide's dwell.
export const DEFAULT_SLIDE_TIMING: HeroSlideTimingConfig = {
  slideDurationSeconds: 6,
  crossfadeSeconds: 1.2,
  kenBurnsScale: 0.06,
};

export interface SlideState {
  opacity: number;
  scale: number;
}

// Signed distance from a to b around a loop of length cycleLength, wrapped
// into (-cycleLength/2, cycleLength/2] — i.e. "how far and which direction"
// rather than cyclicDistance's unsigned "how far".
function signedCyclicDistance(a: number, b: number, cycleLength: number): number {
  let d = (a - b) % cycleLength;
  if (d > cycleLength / 2) d -= cycleLength;
  if (d < -cycleLength / 2) d += cycleLength;
  return d;
}

// Pure function of elapsed time -> one slide's opacity/scale. Slides sit at
// evenly-spaced centers around a looping cycle (slide i's center is
// i * slideDurationSeconds — not offset by half a dwell — so elapsedSeconds
// === 0 lands exactly on slide 0's peak, not on a crossfade boundary: the
// hero's static fallback image is slide 0, so the 3D canvas must show slide
// 0 cleanly the instant it mounts, not two slides ghosted at ~50% each).
// Opacity is a trapezoid of "distance from this slide's center" (full hold
// in the middle, linear crossfade ramp at the edges) — since adjacent
// slides are spaced exactly slideDurationSeconds apart, this automatically
// gives a true overlapping crossfade at each boundary rather than a hard
// cut. Ken Burns scale is derived from that same signed distance (not an
// independent per-slide clock), so its zoom only changes while the slide is
// at least partially visible and only resets during the far longer
// fully-invisible gap between windows — never a jump-cut while it's still
// on screen mid-crossfade.
export function computeSlideState(
  slideIndex: number,
  slideCount: number,
  elapsedSeconds: number,
  config: HeroSlideTimingConfig = DEFAULT_SLIDE_TIMING,
): SlideState {
  if (slideCount <= 0) return { opacity: 0, scale: 1 };

  const { slideDurationSeconds, crossfadeSeconds, kenBurnsScale } = config;

  if (slideCount === 1) {
    // Nothing to cross-dissolve with, and always fully visible — a hard
    // ramp-and-reset zoom would pop while fully opaque, so drift smoothly
    // instead of using the crossfade-synced model below.
    const driftHz = 1 / (slideDurationSeconds * 4);
    const wave = 0.5 + 0.5 * Math.sin(elapsedSeconds * Math.PI * 2 * driftHz);
    return { opacity: 1, scale: 1 + kenBurnsScale * wave };
  }

  const cycleLength = slideDurationSeconds * slideCount;
  const slideCenter = slideIndex * slideDurationSeconds;
  const elapsedInCycle = ((elapsedSeconds % cycleLength) + cycleLength) % cycleLength;
  const signed = signedCyclicDistance(elapsedInCycle, slideCenter, cycleLength);
  const dist = Math.abs(signed);

  // halfHold is the flat "fully visible" half-width; opacity then ramps
  // linearly to 0 over the next crossfadeSeconds. Using slideDurationSeconds
  // / 2 as the zero-point (instead of halfHold + crossfadeSeconds) would
  // put BOTH neighbors at opacity 0 simultaneously right at the boundary
  // between them — a momentary blackout instead of a crossfade — since
  // that distance is equidistant from both slides' centers.
  const halfHold = Math.max(0, (slideDurationSeconds - crossfadeSeconds) / 2);
  const rampEnd = halfHold + crossfadeSeconds;
  let opacity: number;
  if (dist <= halfHold) opacity = 1;
  else if (dist >= rampEnd) opacity = 0;
  else opacity = 1 - (dist - halfHold) / crossfadeSeconds;

  const progress = Math.max(0, Math.min(1, (signed + rampEnd) / (2 * rampEnd)));
  const scale = 1 + kenBurnsScale * progress;

  return { opacity, scale };
}

// Which slide is currently most visible — lets a plain DOM text overlay
// (title/description/link) track the same crossfade the 3D canvas is
// rendering without the canvas needing to tell it anything: both sides call
// this same pure function off their own clock, using the shared config, so
// they naturally agree. Polled on a coarse interval by the caller (text
// swaps don't need per-frame precision the way the photo crossfade does).
export function getDominantSlideIndex(
  slideCount: number,
  elapsedSeconds: number,
  config: HeroSlideTimingConfig = DEFAULT_SLIDE_TIMING,
): number {
  if (slideCount <= 0) return -1;
  let bestIndex = 0;
  let bestOpacity = -1;
  for (let i = 0; i < slideCount; i++) {
    const { opacity } = computeSlideState(i, slideCount, elapsedSeconds, config);
    if (opacity > bestOpacity) {
      bestOpacity = opacity;
      bestIndex = i;
    }
  }
  return bestIndex;
}

export interface CoverUV {
  repeat: [number, number];
  offset: [number, number];
}

// object-fit: cover for a texture on a plane, computed from the image's and
// plane's aspect ratios (three.js has no built-in "cover" mode — this is
// the standard repeat/offset trick, kept here as a pure/tested function
// rather than inline in the render loop).
export function computeCoverUV(imageAspect: number, planeAspect: number): CoverUV {
  if (imageAspect > planeAspect) {
    const repeatX = planeAspect / imageAspect;
    return { repeat: [repeatX, 1], offset: [(1 - repeatX) / 2, 0] };
  }
  const repeatY = imageAspect / planeAspect;
  return { repeat: [1, repeatY], offset: [0, (1 - repeatY) / 2] };
}
