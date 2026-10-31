"use client";

import { useEffect, useRef, type RefObject } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Runs `setup` inside a gsap.context scoped to the returned ref, so every
 * selector is limited to the section and all tweens/triggers are reverted on
 * unmount. Pass `root` (not an "#id" selector) as a ScrollTrigger `trigger`:
 * selector strings are scoped to descendants, so they never match the root itself.
 * `isReduced` is true when the user prefers reduced motion, so
 * sections can skip scrub/pin and show a static layout.
 */
export function useGsapScope<T extends HTMLElement = HTMLElement>(
  setup: (opts: { isReduced: boolean; root: T }) => void,
  deps: unknown[] = [],
): RefObject<T | null> {
  const scope = useRef<T | null>(null);

  useEffect(() => {
    if (!scope.current) return;
    const isReduced = prefersReducedMotion();
    const root = scope.current;
    const ctx = gsap.context(() => setup({ isReduced, root }), root);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return scope;
}
