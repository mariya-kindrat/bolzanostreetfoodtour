"use client";

import { useLayoutEffect, useRef, useState } from "react";

// Real photography (an alpha-channel branch cutout) is supplied by the
// project owner, not this codebase — see public/images/home/mosaic/README.md.
// Until it exists, the layer hides itself instead of showing a broken-image
// icon.
export function TreeBranchOverlay() {
  const ref = useRef<HTMLImageElement>(null);
  const [failed, setFailed] = useState(false);

  // This img is server-rendered, so a missing file's `error` event fires
  // during HTML parse — before React hydrates and attaches onError, which
  // then never runs. Re-check the already-settled state on mount (a loaded
  // image reports complete with a zero naturalWidth only when it failed).
  useLayoutEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) {
      setFailed(true);
    }
  }, []);

  if (failed) return null;

  return (
    /* eslint-disable-next-line @next/next/no-img-element -- decorative
       layer that must fail silently on a missing file; next/image doesn't
       support that. */
    <img
      ref={ref}
      src="/images/home/branch.png"
      alt=""
      aria-hidden="true"
      className="hero-branch"
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        zIndex: 2,
        maxWidth: "40%",
        height: "auto",
        pointerEvents: "none",
      }}
      onError={() => setFailed(true)}
    />
  );
}
