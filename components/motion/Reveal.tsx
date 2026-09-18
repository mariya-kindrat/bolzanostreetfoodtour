"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

// Elements already inside the viewport when the page loads (e.g. the first
// row of a catalog grid) render visible immediately, with no slide-in: the
// scroll-reveal motion is reserved for content the user has yet to scroll to.
function isInViewport(node: HTMLElement) {
  const rect = node.getBoundingClientRect();
  return rect.top < window.innerHeight && rect.bottom > 0;
}

export function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useLayoutEffect(() => {
    const node = ref.current;
    if (node && isInViewport(node)) {
      setVisible(true);
    }
  }, []);

  useEffect(() => {
    if (visible) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      const id = window.setTimeout(() => setVisible(true), 0);
      return () => window.clearTimeout(id);
    }

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [delay, visible]);

  return (
    <div ref={ref} className={`reveal${visible ? " is-visible" : ""}`}>
      {children}
    </div>
  );
}
