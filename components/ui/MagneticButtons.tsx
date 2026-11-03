"use client";

import { useEffect } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";

/** Fraction of the cursor offset (from the button centre) the button follows. */
const DEFAULT_STRENGTH = 0.25;
/** Never move further than this many px, so big buttons stay put. */
const MAX_PX = 12;

/**
 * Magnetic pull + fill origin for every `.btn-hover` element (delegated listeners, no
 * per-frame work).
 *
 * The white liquid fill itself is pure CSS (:hover in globals.css), so it can never get
 * stuck however fast the mouse moves. These listeners only decide *where* it grows from:
 * pointerover stores the entry point, pointerout stores the exit point.
 *
 * The magnetic pull uses the CSS `translate` property so it never fights GSAP `transform`
 * tweens. Skipped for touch input and reduced motion; the CSS hover still works there.
 */
export default function MagneticButtons() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const pull = new WeakMap<HTMLElement, { x: number; y: number }>();
    let current: HTMLElement | null = null;

    const find = (t: EventTarget | null) =>
      (t as Element | null)?.closest?.<HTMLElement>(".btn-hover") ?? null;

    const setOrigin = (el: HTMLElement, e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--lx", `${Math.max(0, Math.min(r.width, e.clientX - r.left))}px`);
      el.style.setProperty("--ly", `${Math.max(0, Math.min(r.height, e.clientY - r.top))}px`);
    };

    const move = (el: HTMLElement, x: number, y: number, duration: number, ease: string) => {
      let s = pull.get(el);
      if (!s) {
        s = { x: 0, y: 0 };
        pull.set(el, s);
      }
      gsap.to(s, {
        x,
        y,
        duration,
        ease,
        overwrite: true,
        onUpdate: () => {
          el.style.translate = `${s!.x}px ${s!.y}px`;
        },
        onComplete: () => {
          if (x === 0 && y === 0) el.style.removeProperty("translate");
        },
      });
    };

    const release = (el: HTMLElement) => move(el, 0, 0, 0.8, "elastic.out(1, 0.5)");

    const onOver = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const el = find(e.target);
      if (el && !el.contains(e.relatedTarget as Node | null)) setOrigin(el, e);
    };

    const onOut = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const el = find(e.target);
      if (!el || el.contains(e.relatedTarget as Node | null)) return;
      setOrigin(el, e);
      release(el);
      if (current === el) current = null;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const raw = find(e.target);
      const target = raw && !(raw as HTMLButtonElement).disabled ? raw : null;

      if (current && current !== target) release(current);
      current = target;
      if (!target) return;

      const strength = parseFloat(target.dataset.magnetic ?? "") || DEFAULT_STRENGTH;
      const r = target.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const clamp = (v: number) => Math.max(-MAX_PX, Math.min(MAX_PX, v));
      move(target, clamp(dx * strength), clamp(dy * strength), 0.4, "power3.out");
    };

    document.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerout", onOut, { passive: true });
    document.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
      document.removeEventListener("pointermove", onMove);
      if (current) current.style.removeProperty("translate");
    };
  }, []);

  return null;
}
