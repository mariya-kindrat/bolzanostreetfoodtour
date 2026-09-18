"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useShouldRender3D } from "@/components/three/useShouldRender3D";
import type { HeroSlide } from "@/lib/hero/heroCarouselLayout";

const HeroScene = dynamic(() => import("@/components/three/HeroScene").then((m) => m.HeroScene), {
  ssr: false,
});

export function HeroSceneLoader({ slides }: { slides: HeroSlide[] }) {
  const shouldRender = useShouldRender3D();
  const [ready, setReady] = useState(false);

  // Checking slides.length here - before the dynamic import even fires -
  // avoids downloading the WebGL bundle at all until there's something to
  // show.
  if (!shouldRender || slides.length === 0) return null;

  // Fades in once the WebGL canvas mounts and starts its first crossfade.
  return (
    <div style={{ opacity: ready ? 1 : 0, transition: "opacity 0.4s ease" }} aria-hidden="true">
      <HeroScene slides={slides} onReady={() => setReady(true)} />
    </div>
  );
}
