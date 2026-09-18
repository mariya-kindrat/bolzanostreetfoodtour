"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Component, useEffect, useRef, type ReactNode } from "react";
import type { Mesh, MeshBasicMaterial, Group } from "three";
import { computeCoverUV, computeSlideState, type HeroSlide } from "@/lib/hero/heroCarouselLayout";
import { useHasFinePointer } from "@/components/hooks/useHasFinePointer";
import { useSafeTexture } from "@/components/three/useSafeTexture";

// Defense in depth for a single slide/layer against any *other* unexpected
// render error — missing/broken image files are handled by useSafeTexture
// (see below) and never reach here, since a Suspense-throw from useLoader
// wasn't reliably caught by this boundary: the rejection surfaces
// asynchronously, outside React's render call stack, and was reaching the
// browser as an uncaught error instead.
class SlideBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}

function SlidePhoto({
  slide,
  index,
  slideCount,
}: {
  slide: HeroSlide;
  index: number;
  slideCount: number;
}) {
  const texture = useSafeTexture(slide.src);
  const meshRef = useRef<Mesh>(null);
  const materialRef = useRef<MeshBasicMaterial>(null);
  const { viewport } = useThree();

  // object-fit: cover, recomputed if the viewport aspect changes (window
  // resize) — the texture itself never changes, only how it's sampled.
  useEffect(() => {
    // three.js types `Texture.image` as `{}` (it accepts video/canvas/etc.
    // sources too) — narrow to what TextureLoader actually produces.
    if (!texture) return;
    const image = texture.image as HTMLImageElement | undefined;
    if (!image) return;
    // Guards a zero/not-yet-measured viewport on the very first effect run
    // (e.g. canvas still at zero layout size right after mount) — without
    // this, planeAspect could be 0 or Infinity, poisoning repeat/offset
    // with NaN until the next resize happens to recompute them. The effect
    // re-runs once viewport.width/height become real (they're deps below).
    if (image.width <= 0 || image.height <= 0 || viewport.width <= 0 || viewport.height <= 0) {
      return;
    }
    const imageAspect = image.width / image.height;
    const planeAspect = viewport.width / viewport.height;
    const { repeat, offset } = computeCoverUV(imageAspect, planeAspect);
    // three.js's Texture is an imperative GPU-resource handle, not React
    // state — mutating repeat/offset/needsUpdate in place is the library's
    // own API for re-sampling an already-uploaded texture, the same
    // category as mutating a ref's `.current` (which this rule allows).
    texture.repeat.set(repeat[0], repeat[1]);
    texture.offset.set(offset[0], offset[1]);
    // eslint-disable-next-line react-hooks/immutability
    texture.needsUpdate = true;
  }, [texture, viewport.width, viewport.height]);

  useFrame((state) => {
    const mesh = meshRef.current;
    const material = materialRef.current;
    if (!mesh || !material) return;
    const { opacity, scale } = computeSlideState(index, slideCount, state.clock.elapsedTime);
    material.opacity = opacity;
    mesh.scale.setScalar(scale);
  });

  if (!texture) return null;

  return (
    // Tiny per-slide z offset avoids z-fighting between full-screen planes
    // stacked at the same depth — imperceptible at this camera distance.
    <mesh ref={meshRef} position={[0, 0, index * -0.01]}>
      <planeGeometry args={[viewport.width, viewport.height]} />
      <meshBasicMaterial ref={materialRef} map={texture} transparent opacity={0} />
    </mesh>
  );
}

function ParallaxGroup({ children }: { children: ReactNode }) {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    const group = groupRef.current;
    if (!group) return;
    const targetRotY = state.pointer.x * 0.08;
    const targetRotX = -state.pointer.y * 0.05;
    group.rotation.y += (targetRotY - group.rotation.y) * 0.05;
    group.rotation.x += (targetRotX - group.rotation.x) * 0.05;
  });

  return <group ref={groupRef}>{children}</group>;
}

function CarouselScene({ slides }: { slides: HeroSlide[] }) {
  const hasFinePointer = useHasFinePointer();

  const planes = (
    <>
      {slides.map((slide, index) => (
        // Keyed by index, not slide.src: Category.photoUrl has no unique
        // constraint, so two admin-set categories could share a photo —
        // slides is a fresh, stably-ordered array derived from `categories`
        // props each render (never client-side reordered), so index is a
        // safe, collision-free key here.
        <SlideBoundary key={index}>
          <SlidePhoto slide={slide} index={index} slideCount={slides.length} />
        </SlideBoundary>
      ))}
    </>
  );

  return hasFinePointer ? <ParallaxGroup>{planes}</ParallaxGroup> : <group>{planes}</group>;
}

export function HeroScene({
  slides,
  onReady,
}: {
  slides: HeroSlide[];
  onReady?: () => void;
}) {
  if (slides.length === 0) return null;

  return (
    <Canvas
      aria-hidden="true"
      camera={{ position: [0, 0, 5], fov: 45 }}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      onCreated={() => onReady?.()}
    >
      <CarouselScene slides={slides} />
    </Canvas>
  );
}
