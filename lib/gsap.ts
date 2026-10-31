"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };

/**
 * ScrollTrigger config for "play once when this scrolls into view" reveals.
 *
 * Plain `once: true` is not enough: if the scroll position jumps past the whole
 * trigger range in one frame (anchor links, fast scrolling, page restored
 * scrolled), GSAP only fires `onLeave` and the animation never plays, leaving
 * the content stuck in its hidden start state. Playing from onLeave/onRefresh
 * as well guarantees the reveal always completes.
 */
export function revealTrigger(trigger: gsap.DOMTarget, start = "top 85%"): ScrollTrigger.Vars {
  return {
    trigger,
    start,
    once: true,
    onLeave: (self) => self.animation?.play(),
    onRefresh: (self) => {
      if (self.scroll() >= self.start) self.animation?.play();
    },
  };
}
