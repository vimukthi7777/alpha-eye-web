"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Cursor-following circle with a white label. It shows while the mouse is over any
 * element carrying `data-cursor="<label>"` and shrinks away elsewhere. Purely
 * decorative (aria-hidden); the underlying element keeps its own accessible name.
 * Mouse only: skipped for touch and reduced motion.
 */
export default function CursorLabel() {
  const dot = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");

  useEffect(() => {
    const el = dot.current;
    if (!el || prefersReducedMotion()) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    gsap.set(el, { xPercent: -50, yPercent: -50, scale: 0, autoAlpha: 0 });
    const moveX = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3.out" });
    const moveY = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3.out" });

    let shown = false;
    let last = { x: 0, y: 0 };

    const show = (on: boolean) => {
      if (on === shown) return;
      shown = on;
      gsap.to(el, {
        scale: on ? 1 : 0,
        autoAlpha: on ? 1 : 0,
        duration: on ? 0.45 : 0.3,
        ease: on ? "back.out(1.7)" : "power2.in",
        overwrite: "auto",
      });
    };

    const update = (target: EventTarget | null) => {
      const el = target as Element | null;
      const host = el?.closest?.<HTMLElement>("[data-cursor]");
      // Hide over links/buttons inside the host so their own pointer cursor shows.
      const over = !!host && !el?.closest("a, button");
      if (over) setLabel(host.dataset.cursor ?? "");
      show(over);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      last = { x: e.clientX, y: e.clientY };
      moveX(e.clientX);
      moveY(e.clientY);
      update(e.target);
    };
    // After a click the element under the cursor may have changed (card flipped).
    const onClick = () =>
      requestAnimationFrame(() => update(document.elementFromPoint(last.x, last.y)));
    const onLeave = () => show(false);

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("click", onClick);
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("click", onClick);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf(el);
    };
  }, []);

  return (
    <div
      ref={dot}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[60] flex h-24 w-24 items-center justify-center rounded-full border border-white/40 bg-white/10 p-3 text-center text-[11px] font-semibold leading-tight text-white opacity-0 shadow-[0_8px_32px_rgb(0_0_0/0.35),inset_0_1px_0_rgb(255_255_255/0.35)] backdrop-blur-md backdrop-saturate-150"
    >
      {label}
    </div>
  );
}
