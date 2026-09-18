"use client";

import { useSyncExternalStore } from "react";

// matchMedia only exists client-side and never changes mid-session for our
// purposes, so this is a one-shot read, not a live subscription.
function subscribe(): () => void {
  return () => {};
}

function getSnapshot(): boolean {
  return window.matchMedia("(pointer: fine)").matches;
}

function getServerSnapshot(): boolean {
  return false;
}

export function useHasFinePointer(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
