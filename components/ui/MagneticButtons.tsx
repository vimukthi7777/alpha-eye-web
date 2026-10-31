"use client";

import { useEffect } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";

/** Fraction of the cursor offset (from the button centre) the button follows. */
const DEFAULT_STRENGTH = 0.25;
/** Never move further than this many px, so big buttons stay put. */
const MAX_PX = 12;
/** Fill radius at which nothing is visible (matches the CSS default). */
const FILL_OFF = -16;

/**
 * Hover behaviour for every `.btn-hover` element (one delegated listener):
 *  - liquid fill: a white circle floods the button from where the cursor entered and
 *    drains toward where it left (GSAP tweens the --lx/--ly/--lr CSS variables that
 *    the radial-gradient in globals.css reads);
 *  - magnetic pull: the button drifts toward the cursor and eases back on leave.
 * Override magnetic strength with data-magnetic="0.06". The pull uses the CSS
 * `translate` property so it never fights GSAP `transform` tweens on the same element.
 * Skipped for touch input, disabled buttons and reduced motion; the CSS :hover
 * fallback (no `liquid-ready` class on <html>) takes over there.
 */
export default function MagneticButtons() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!fine.matches) return;

    const root = document.documentElement;
    root.classList.add("liquid-ready");

    const pull = new WeakMap<HTMLElement, { x: number; y: number }>();
    let current: HTMLElement | null = null;
    let last = { x: 0, y: 0 };

    const find = (t: EventTarget | null) => {
      const el = (t as Element | null)?.closest?.<HTMLElement>(".btn-hover") ?? null;
      return el && !(el as HTMLButtonElement).disabled ? el : null;
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

    /** Point of the pointer inside the button, clamped to its box. */
    const local = (el: HTMLElement, cx: number, cy: number) => {
      const r = el.getBoundingClientRect();
      return {
        x: Math.max(0, Math.min(r.width, cx - r.left)),
        y: Math.max(0, Math.min(r.height, cy - r.top)),
        w: r.width,
        h: r.height,
      };
    };

    const fill = (el: HTMLElement, cx: number, cy: number) => {
      const p = local(el, cx, cy);
      const full = Math.hypot(Math.max(p.x, p.w - p.x), Math.max(p.y, p.h - p.y)) + 24;
      el.style.setProperty("--lx", `${p.x}px`);
      el.style.setProperty("--ly", `${p.y}px`);
      if (!el.style.getPropertyValue("--lr")) el.style.setProperty("--lr", `${FILL_OFF}px`);
      gsap.to(el, { "--lr": `${full}px`, duration: 0.8, ease: "power3.out", overwrite: "auto" });
    };

    const drain = (el: HTMLElement, cx: number, cy: number) => {
      const p = local(el, cx, cy);
      el.style.setProperty("--lx", `${p.x}px`);
      el.style.setProperty("--ly", `${p.y}px`);
      gsap.to(el, {
        "--lr": `${FILL_OFF}px`,
        duration: 0.65,
        ease: "power3.inOut",
        overwrite: "auto",
      });
    };

    const release = (el: HTMLElement) => {
      drain(el, last.x, last.y);
      move(el, 0, 0, 0.8, "elastic.out(1, 0.5)");
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      last = { x: e.clientX, y: e.clientY };
      const target = find(e.target);

      if (current && current !== target) release(current);
      if (target && target !== current) fill(target, e.clientX, e.clientY);
      current = target;
      if (!target) return;

      const strength = parseFloat(target.dataset.magnetic ?? "") || DEFAULT_STRENGTH;
      const r = target.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const clamp = (v: number) => Math.max(-MAX_PX, Math.min(MAX_PX, v));
      move(target, clamp(dx * strength), clamp(dy * strength), 0.4, "power3.out");
    };

    const onLeaveWindow = () => {
      if (current) release(current);
      current = null;
    };

    // Keyboard focus: flood from the centre so focus is as visible as hover.
    const onFocusIn = (e: FocusEvent) => {
      const el = find(e.target);
      if (!el || !el.matches(":focus-visible")) return;
      const r = el.getBoundingClientRect();
      fill(el, r.left + r.width / 2, r.top + r.height / 2);
    };
    const onFocusOut = (e: FocusEvent) => {
      const el = find(e.target);
      if (!el || el === current) return;
      const r = el.getBoundingClientRect();
      drain(el, r.left + r.width / 2, r.top + r.height / 2);
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);
    root.addEventListener("pointerleave", onLeaveWindow);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
      root.removeEventListener("pointerleave", onLeaveWindow);
      root.classList.remove("liquid-ready");
      if (current) current.style.removeProperty("translate");
    };
  }, []);

  return null;
}
