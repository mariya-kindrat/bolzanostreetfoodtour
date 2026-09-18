"use client";

import { useSyncExternalStore } from "react";

// navigator.deviceMemory is a non-standard Chromium API; it's simply
// undefined on browsers that don't support it (Safari, Firefox), in which
// case we don't treat the device as low-end — we only skip 3D when we can
// positively confirm ≤4GB of memory.
interface NavigatorWithMemory extends Navigator {
  deviceMemory?: number;
}

// matchMedia/deviceMemory only exist client-side and never change mid-session
// for our purposes, so this is a one-shot read, not a live subscription —
// useSyncExternalStore's no-op subscribe models that, and its server snapshot
// keeps SSR/hydration consistent (server always renders the 3D-off state).
function subscribe(): () => void {
  return () => {};
}

function getSnapshot(): boolean {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const memory = (navigator as NavigatorWithMemory).deviceMemory;
  const isLowEndDevice = typeof memory === "number" && memory <= 4;
  return !prefersReducedMotion && !isLowEndDevice;
}

function getServerSnapshot(): boolean {
  return false;
}

export function useShouldRender3D(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
