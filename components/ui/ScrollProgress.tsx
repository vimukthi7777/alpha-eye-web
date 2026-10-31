"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/** Thin orange bar at the top of the viewport showing page scroll progress. */
export default function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = bar.current;
    if (!el) return;

    const tween = gsap.fromTo(
      el,
      { scaleX: 0 },
      { scaleX: 1, ease: "none", transformOrigin: "left center" },
    );
    const trigger = ScrollTrigger.create({
      animation: tween,
      trigger: document.documentElement,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.2,
    });

    return () => {
      trigger.kill();
      tween.kill();
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]"
    >
      <div ref={bar} className="h-full origin-left scale-x-0 bg-accent shadow-glow" />
    </div>
  );
}
