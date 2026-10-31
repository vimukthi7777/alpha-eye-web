"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";
import { gsap, revealTrigger } from "@/lib/gsap";
import { useGsapScope } from "@/lib/useGsapScope";
import { testimonials, testimonialsHeading } from "@/data";
import { ChevronLeftIcon, ChevronRightIcon, QuoteIcon } from "@/components/ui/Icons";
import TextReveal from "@/components/ui/TextReveal";
import { prefersReducedMotion } from "@/lib/motion";

const GAP = 20; // matches the 20px grid gutter
const AUTOPLAY_MS = 6000;

function getPerView() {
  if (window.innerWidth >= 1024) return 3;
  if (window.innerWidth >= 768) return 2;
  return 1;
}

function subscribe(cb: () => void) {
  window.addEventListener("resize", cb);
  return () => window.removeEventListener("resize", cb);
}

const initials = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

export default function Testimonials() {
  const trackRef = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const perView = useSyncExternalStore(subscribe, getPerView, () => 1);
  const maxIndex = Math.max(0, testimonials.length - perView);
  const current = Math.min(index, maxIndex);
  const canSlide = maxIndex > 0;

  const ref = useGsapScope<HTMLElement>(({ isReduced, root }) => {
    if (isReduced) return;
    gsap
      .timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: revealTrigger(root, "top 75%"),
      })
      .from("[data-tm-head]", { y: 30, autoAlpha: 0, duration: 0.7, stagger: 0.1 })
      .from("[data-tm-slide]", { y: 50, autoAlpha: 0, duration: 0.8, stagger: 0.15 }, "-=0.3");
  });

  // Move the track to the current slide (and keep it aligned on resize).
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const slide = track.querySelector<HTMLElement>("[data-tm-slide]");
    if (!slide) return;
    const step = slide.offsetWidth + GAP;
    gsap.to(track, { x: -current * step, duration: 0.7, ease: "power3.inOut", overwrite: "auto" });
  }, [current, perView]);

  // Autoplay (pauses on hover/focus; off for reduced motion or when nothing to slide)
  useEffect(() => {
    if (!canSlide || paused) return;
    if (prefersReducedMotion()) return;
    const id = window.setInterval(
      () => setIndex((i) => (Math.min(i, maxIndex) >= maxIndex ? 0 : Math.min(i, maxIndex) + 1)),
      AUTOPLAY_MS,
    );
    return () => window.clearInterval(id);
  }, [canSlide, paused, maxIndex]);

  const go = (next: number) => setIndex(Math.max(0, Math.min(next, maxIndex)));

  return (
    <section
      ref={ref}
      id="testimonials"
      aria-labelledby="testimonials-title"
      className="relative isolate overflow-hidden py-20 lg:py-28"
    >
      <div
        aria-hidden="true"
        className="absolute -right-40 top-1/3 -z-10 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgb(222_93_10/0.3)_0%,rgb(222_93_10/0.1)_45%,transparent_70%)]"
      />

      <div className="container-grid gap-y-10">
        <div className="col-span-12 flex items-center justify-between gap-6">
          <TextReveal
            as="h2"
            id="testimonials-title"
            text={testimonialsHeading}
            className="block text-[clamp(2rem,3.4vw,3rem)] font-medium leading-tight text-white"
          />

          {canSlide && (
            <div data-tm-head className="flex shrink-0 gap-3">
              <button
                type="button"
                onClick={() => go(current - 1)}
                disabled={current === 0}
                aria-label="Previous testimonial"
                className="glass flex h-11 w-11 items-center justify-center rounded-full text-xl text-white btn-hover disabled:opacity-40"
              >
                <ChevronLeftIcon />
              </button>
              <button
                type="button"
                onClick={() => go(current + 1)}
                disabled={current === maxIndex}
                aria-label="Next testimonial"
                className="glass flex h-11 w-11 items-center justify-center rounded-full text-xl text-white btn-hover disabled:opacity-40"
              >
                <ChevronRightIcon />
              </button>
            </div>
          )}
        </div>

        <div
          className="col-span-12 overflow-hidden py-2"
          role="region"
          aria-roledescription="carousel"
          aria-label={testimonialsHeading}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <ul ref={trackRef} className="flex will-change-transform" style={{ gap: GAP }}>
            {testimonials.map((t, i) => (
              <li
                key={t.id}
                data-tm-slide
                aria-hidden={i < current || i >= current + perView ? true : undefined}
                className="w-full shrink-0 basis-full md:basis-[calc((100%-20px)/2)] lg:basis-[calc((100%-40px)/3)]"
              >
                <figure className="glass flex h-full flex-col rounded-3xl p-7 sm:p-8">
                  <QuoteIcon className="mb-5 h-7 w-9 text-accent" />
                  <blockquote className="flex-1 text-base leading-relaxed text-white/90">
                    {t.quote}
                  </blockquote>
                  <figcaption className="mt-8 flex items-center gap-4">
                    {t.avatar ? (
                      <Image
                        src={t.avatar}
                        alt=""
                        width={48}
                        height={48}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <span
                        aria-hidden="true"
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-white"
                      >
                        {initials(t.name)}
                      </span>
                    )}
                    <span>
                      <span className="block text-sm font-semibold text-white">{t.name}</span>
                      <span className="block text-xs text-white/70">
                        {t.role}
                        {t.company ? ` · ${t.company}` : ""}
                      </span>
                    </span>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </div>

        {canSlide && (
          <div className="col-span-12 flex justify-center gap-2" aria-hidden="true">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <span
                key={i}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === current ? "w-8 bg-accent" : "w-1.5 bg-white/30",
                )}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
