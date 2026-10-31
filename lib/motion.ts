/**
 * Single place that decides whether animations are reduced.
 *
 * By default the site honours the OS "reduce motion" setting. On Windows this is
 * switched on by turning off Settings > Accessibility > Visual effects >
 * "Animation effects", which makes every animation silently disappear.
 * Set NEXT_PUBLIC_RESPECT_REDUCED_MOTION=false (e.g. in .env.local) to always
 * play animations during development.
 */
export const RESPECT_REDUCED_MOTION =
  process.env.NEXT_PUBLIC_RESPECT_REDUCED_MOTION !== "false";

export function prefersReducedMotion(): boolean {
  if (!RESPECT_REDUCED_MOTION || typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
