"use client";

import Image from "next/image";
import { gsap, revealTrigger } from "@/lib/gsap";
import { useGsapScope } from "@/lib/useGsapScope";
import { prefersReducedMotion } from "@/lib/motion";
import { workWith, workWithHeading } from "@/data";

/** Grow the logo a little on hover, ease back on leave. */
const zoom = (tile: HTMLElement, scale: number) => {
  if (prefersReducedMotion()) return;
  gsap.to(tile.querySelector("img"), { scale, duration: 0.45, ease: "power3.out", overwrite: "auto" });
};

/** "Our clients": a grid of white rounded tiles, one logo per tile. */
export default function WorkWith() {
  const ref = useGsapScope<HTMLElement>(({ isReduced, root }) => {
    if (isReduced) return;

    gsap.from("[data-ww-logo]", {
      y: 30,
      autoAlpha: 0,
      duration: 0.7,
      stagger: 0.08,
      ease: "power3.out",
      scrollTrigger: revealTrigger(root, "top 85%"),
    });
  });

  return (
    <section
      ref={ref}
      id="work-with"
      aria-label={workWithHeading}
      className="relative z-10 -mt-[calc(24svh-3rem)] px-(--page-margin) pb-6 md:-mt-[calc(28svh-3rem)]"
    >
      <div className="mx-auto max-w-[1280px]">

        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {workWith.map((logo) => (
            <li
              key={logo.id}
              data-ww-logo
              onPointerEnter={(e) => zoom(e.currentTarget, 1.15)}
              onPointerLeave={(e) => zoom(e.currentTarget, 1)}
              className="flex aspect-[7/4] items-center justify-center rounded-3xl p-3"
            >
              <Image
                src={logo.image}
                alt={logo.name}
                width={160}
                height={80}
                className="h-full max-h-24 w-auto max-w-full object-contain sm:max-h-28"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
