"use client";

import { useEffect, useState } from "react";
import { useShouldRender3D } from "@/components/three/useShouldRender3D";
import { getDominantSlideIndex } from "@/lib/hero/heroCarouselLayout";

// Polled, not per-frame: text swaps don't need the photo crossfade's
// precision, and 250ms never visibly lags the photo underneath.
const POLL_INTERVAL_MS = 250;

/**
 * Index of the hero slide currently dominant in the 3D crossfade, derived from
 * the same pure clock math the canvas uses so text layers stay in sync with
 * no wiring between them. Stays on slide 0 (the static photo) whenever the
 * carousel is skipped (reduced motion, low-memory device).
 */
export function useHeroSlideIndex(slideCount: number): number {
  const carouselRuns = useShouldRender3D();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slideCount === 0 || !carouselRuns) return;
    const startedAt = performance.now();
    const id = setInterval(() => {
      setIndex(getDominantSlideIndex(slideCount, (performance.now() - startedAt) / 1000));
    }, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [slideCount, carouselRuns]);

  return carouselRuns ? index : 0;
}
