/** Scales down so the long edge is at most `maxEdge`; never scales up. */
export function fitWithin(
  width: number,
  height: number,
  maxEdge: number,
): { width: number; height: number } {
  const longEdge = Math.max(width, height);
  if (longEdge <= maxEdge) return { width, height };
  const scale = maxEdge / longEdge;
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}
