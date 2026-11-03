"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, revealTrigger } from "@/lib/gsap";
import { useGsapScope } from "@/lib/useGsapScope";
import { prefersReducedMotion } from "@/lib/motion";
import { workWith, workWithHeading } from "@/data";

/** Seconds the marquee takes to move by one full set of logos (higher = slower). */
const SECONDS_PER_LOGO = 4;
/**
 * The track is two identical groups, and each group repeats the logo set this many times so a
 * single group is always wider than the screen (a loop needs no gap). Sliding the track by
 * exactly one group (-50%) then lands on an identical picture, so the loop is seamless.
 */
const REPEATS_PER_GROUP = 2;

/** Grow the logo a little on hover, ease back on leave. */
const zoom = (tile: HTMLElement, scale: number) => {
  if (prefersReducedMotion()) return;
  gsap.to(tile.querySelector("img"), {
    scale,
    duration: 0.45,
    ease: "power3.out",
    overwrite: "auto",
  });
};

/** "Our clients": one row of logos looping right to left, on every screen size. */
export default function WorkWith() {
  const marquee = useRef<gsap.core.Tween | null>(null);

  const ref = useGsapScope<HTMLElement>(({ isReduced, root }) => {
    if (isReduced) return; // static row, the strip stays scrollable by hand

    gsap.from("[data-ww-row]", {
      y: 30,
      autoAlpha: 0,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: revealTrigger(root, "top 85%"),
    });

    marquee.current = gsap.to("[data-ww-track]", {
      xPercent: -50,
      duration: workWith.length * REPEATS_PER_GROUP * SECONDS_PER_LOGO,
      ease: "none",
      repeat: -1,
    });
  });

  // Slow to a stop while the pointer is over the row, then pick the speed back up.
  const setSpeed = (scale: number) => {
    if (marquee.current) {
      gsap.to(marquee.current, {
        timeScale: scale,
        duration: 0.6,
        ease: "power2.out",
        overwrite: true,
      });
    }
  };

  const group = (groupIndex: number) =>
    Array.from({ length: REPEATS_PER_GROUP }, (_, rep) =>
      workWith.map((logo) => {
        const duplicate = groupIndex > 0 || rep > 0;
        return (
          <li
            key={`${groupIndex}-${rep}-${logo.id}`}
            aria-hidden={duplicate ? true : undefined}
            onPointerEnter={(e) => zoom(e.currentTarget, 1.15)}
            onPointerLeave={(e) => zoom(e.currentTarget, 1)}
            className="mr-4 flex h-20 w-28 shrink-0 items-center justify-center sm:mr-8 sm:h-24 sm:w-36"
          >
            <Image
              src={logo.image}
              alt={duplicate ? "" : logo.name}
              width={160}
              height={80}
              className="h-full w-auto max-w-full object-contain"
            />
          </li>
        );
      }),
    );

  return (
    <section
      ref={ref}
      id="work-with"
      aria-label={workWithHeading}
      className="relative z-10 -mt-[calc(24svh-3rem)] px-(--page-margin) pb-6 md:-mt-[calc(28svh-3rem)]"
    >
      {/* 10px extra inset on each side, on top of the page margin */}
      <div className="mx-2.5">
        <div
          data-ww-row
          onPointerEnter={() => setSpeed(0)}
          onPointerLeave={() => setSpeed(1)}
          className="mx-auto max-w-[1280px] overflow-x-auto px-0 [mask-image:linear-gradient(to_right,transparent,#000_2.5rem,#000_calc(100%-2.5rem),transparent)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <div data-ww-track className="flex w-max">
            <ul className="flex shrink-0">{group(0)}</ul>
            <ul aria-hidden="true" className="flex shrink-0">
              {group(1)}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
