"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import { gsap, revealTrigger } from "@/lib/gsap";
import { cn } from "@/lib/cn";
import { prefersReducedMotion } from "@/lib/motion";

const VARIANTS = {
  up: { y: 48 },
  down: { y: -48 },
  left: { x: -72 },
  right: { x: 72 },
  scale: { scale: 0.88 },
  fade: {},
} as const;

interface RevealProps {
  children: ReactNode;
  variant?: keyof typeof VARIANTS;
  as?: ElementType;
  className?: string;
  delay?: number;
  duration?: number;
  start?: string;
}

/** Fades + slides its content in once when it scrolls into view. */
export default function Reveal({
  children,
  variant = "up",
  as: Tag = "div",
  className,
  delay = 0,
  duration = 0.9,
  start = "top 88%",
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.from(el, {
        ...VARIANTS[variant],
        autoAlpha: 0,
        duration,
        delay,
        ease: "power3.out",
        scrollTrigger: revealTrigger(el, start),
      });
    }, el);

    return () => ctx.revert();
  }, [variant, delay, duration, start]);

  return (
    <Tag ref={ref} className={cn(className)}>
      {children}
    </Tag>
  );
}
