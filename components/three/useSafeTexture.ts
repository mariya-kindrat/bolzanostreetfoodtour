import { useEffect, useState } from "react";
import { TextureLoader, type Texture } from "three";

// Loads a texture without react-three-fiber's Suspense-throw pattern
// (useLoader): a texture-load failure rejects asynchronously, outside
// React's render call stack, so it wasn't reliably reaching the
// TileBoundary error boundary wrapping callers — a missing/broken file
// surfaced as an uncaught browser error instead of failing silently.
// Mirrors TreeBranchOverlay's onError-based <img> pattern, adapted to
// three.js's TextureLoader callback API. Returns null while loading and on
// failure alike — callers treat "no texture yet" and "never getting one"
// the same way (render nothing).
export function useSafeTexture(url: string): Texture | null {
  const [texture, setTexture] = useState<Texture | null>(null);

  useEffect(() => {
    let cancelled = false;
    // No reset-to-null here: `url` is a stable, static path for every
    // caller in this codebase (never changes after mount), so this effect
    // only ever runs once — there's no stale texture to clear.
    new TextureLoader().load(
      url,
      (loaded) => {
        if (!cancelled) setTexture(loaded);
      },
      undefined,
      () => {
        // Missing or broken file: leave texture null, same as a failed <img>.
      },
    );
    return () => {
      cancelled = true;
    };
  }, [url]);

  return texture;
}
