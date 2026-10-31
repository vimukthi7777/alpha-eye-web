"use client";

import type { ElementType } from "react";
import { gsap, revealTrigger } from "@/lib/gsap";
import { useGsapScope } from "@/lib/useGsapScope";
import { cn } from "@/lib/cn";

interface TextRevealProps {
  text: string;
  /** Element to render, e.g. "h2" or "p". */
  as?: ElementType;
  className?: string;
  id?: string;
  /** Seconds between words. */
  stagger?: number;
  delay?: number;
  /** ScrollTrigger start position. */
  start?: string;
}

/**
 * Words slide up out of a mask when the element scrolls into view.
 * The visual words are aria-hidden; screen readers get the plain text.
 */
export default function TextReveal({
  text,
  as: Tag = "span",
  className,
  id,
  stagger = 0.05,
  delay = 0,
  start = "top 88%",
}: TextRevealProps) {
  const ref = useGsapScope<HTMLElement>(({ isReduced }) => {
    if (isReduced) return;
    gsap.from("[data-tr-word]", {
      yPercent: 115,
      rotate: 4,
      duration: 0.9,
      delay,
      stagger,
      ease: "power4.out",
      scrollTrigger: revealTrigger("[data-tr-word]", start),
    });
  });

  const words = text.split(" ");

  return (
    <Tag ref={ref} id={id} className={cn(className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, i) => (
          <span key={i}>
            {/* mask: padding/negative margin keeps descenders from being clipped */}
            <span className="-mb-[0.18em] inline-block overflow-hidden pb-[0.18em] align-bottom">
              <span data-tr-word className="inline-block origin-left will-change-transform">
                {word}
              </span>
            </span>
            {i < words.length - 1 ? " " : null}
          </span>
        ))}
      </span>
    </Tag>
  );
}
