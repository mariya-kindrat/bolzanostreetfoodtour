"use client";

import { Children, useCallback, useEffect, useRef, useState } from "react";
import styles from "@/components/marketing/TourCarousel.module.css";

const SLIDE_MS = 1500;
const REST_MS = 4000;

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);

/**
 * Endless row of cards that slides one visible page (3 on desktop, 2 on
 * tablet, 1 on mobile) over ~1.5s, rests for 4s, and repeats, always moving
 * forward. Cards are rendered twice so that once the first set has scrolled
 * past, the position wraps back by exactly one set's width, invisibly. The
 * rhythm pauses while the pointer or focus is inside and is off under reduced
 * motion; the arrows and swiping still work either way.
 */
export function TourCarousel({ children }: { children: React.ReactNode }) {
  const track = useRef<HTMLUListElement>(null);
  const frame = useRef(0);
  const [paused, setPaused] = useState(false);
  const [stopped, setStopped] = useState(false);
  const count = Children.count(children);

  /** Pixel width of one full set of cards, including the trailing gap. */
  const setWidth = useCallback(() => {
    const items = track.current!.children as HTMLCollectionOf<HTMLElement>;
    return items[count].offsetLeft - items[0].offsetLeft;
  }, [count]);

  const slide = useCallback(
    (direction: 1 | -1) => {
      const el = track.current!;
      const first = el.firstElementChild as HTMLElement;
      const card = first.offsetWidth + parseFloat(getComputedStyle(el).columnGap);
      const distance = Math.max(1, Math.round(el.clientWidth / card)) * card;

      cancelAnimationFrame(frame.current);
      if (el.scrollLeft >= setWidth()) el.scrollLeft -= setWidth();
      if (direction === -1 && el.scrollLeft < distance) el.scrollLeft += setWidth();

      const from = Math.round(el.scrollLeft / card) * card;
      const start = performance.now();
      return new Promise<void>((resolve) => {
        frame.current = requestAnimationFrame(function tick(now) {
          const t = Math.min((now - start) / SLIDE_MS, 1);
          el.scrollLeft = from + direction * distance * easeInOutCubic(t);
          if (t < 1) frame.current = requestAnimationFrame(tick);
          else resolve();
        });
      });
    },
    [setWidth],
  );

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (paused || stopped || reduced) return;
    let timer: ReturnType<typeof setTimeout>;
    const scheduleNext = () => {
      timer = setTimeout(() => slide(1).then(scheduleNext), REST_MS);
    };
    scheduleNext();
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(frame.current);
    };
  }, [paused, stopped, slide]);

  return (
    <div
      className={styles.carousel}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <ul ref={track} className={styles.track}>
        {Children.map(children, (child) => (
          <li className={styles.slide}>{child}</li>
        ))}
        {Children.map(children, (child) => (
          <li className={styles.slide} inert>
            {child}
          </li>
        ))}
      </ul>
      <div className={styles.controls}>
        <button type="button" aria-label="Previous tours" onClick={() => slide(-1)}>
          &larr;
        </button>
        <button type="button" aria-label="Next tours" onClick={() => slide(1)}>
          &rarr;
        </button>
        <button type="button" aria-pressed={stopped} onClick={() => setStopped(!stopped)}>
          {stopped ? "Play" : "Pause"}
        </button>
      </div>
    </div>
  );
}
