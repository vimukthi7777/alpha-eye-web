"use client";

import Image from "next/image";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { useGsapScope } from "@/lib/useGsapScope";
import { about } from "@/data";
import { ArrowUpRightIcon } from "@/components/ui/Icons";
import TextReveal from "@/components/ui/TextReveal";

/**
 * Resting layout of the fanned cards (index 0 = front card).
 * Cards start stacked/straight and rotate/slide into these values as you scroll.
 */
const FAN = [
  { rotation: -9, xPercent: 0, yPercent: 0, z: 3 },
  { rotation: 5, xPercent: 20, yPercent: -3, z: 2 },
  { rotation: 10, xPercent: 24, yPercent: 3, z: 1 },
];

const WORDS = about.paragraph.split(" ");

export default function DigitalPartner() {
  const ref = useGsapScope<HTMLElement>(({ isReduced, root }) => {
    const cards = gsap.utils.toArray<HTMLElement>("[data-dp-card]");

    // Final (readable) state first, so reduced motion / no-scroll users see everything.
    cards.forEach((card, i) => gsap.set(card, { ...FAN[i], zIndex: FAN[i].z }));

    // Hover: the hovered card comes to the front, straightens and scales up.
    const cleanups = cards.map((card, i) => {
      const inner = card.querySelector<HTMLElement>("[data-dp-inner]");
      if (!inner) return () => {};
      const enter = () => {
        gsap.set(card, { zIndex: 10 });
        gsap.to(inner, { scale: 1.06, rotation: -FAN[i].rotation * 0.7, duration: 0.45, ease: "power3.out" });
      };
      const leave = () => {
        gsap.set(card, { zIndex: FAN[i].z });
        gsap.to(inner, { scale: 1, rotation: 0, duration: 0.5, ease: "power3.out" });
      };
      card.addEventListener("pointerenter", enter);
      card.addEventListener("pointerleave", leave);
      return () => {
        card.removeEventListener("pointerenter", enter);
        card.removeEventListener("pointerleave", leave);
      };
    });

    if (!isReduced) {
      // Scroll-linked timeline: cards fan out, paragraph fills in word by word, bullets appear.
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: root, start: "top 75%", end: "center 40%", scrub: 0.6 },
      });

      cards.forEach((card, i) => {
        tl.fromTo(
          card,
          { rotation: 0, xPercent: 0, yPercent: 0 },
          { rotation: FAN[i].rotation, xPercent: FAN[i].xPercent, yPercent: FAN[i].yPercent },
          0,
        );
      });

      tl.fromTo(
        "[data-dp-word]",
        { color: "#222222" },
        { color: "#82807C", stagger: 0.04, duration: 0.12 },
        0.1,
      );
      tl.fromTo(
        "[data-dp-point]",
        { autoAlpha: 0, x: -24 },
        { autoAlpha: 1, x: 0, stagger: 0.12, duration: 0.2 },
        0.55,
      );
      tl.fromTo("[data-dp-cta]", { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.2 }, 0.85);
    }

    return () => cleanups.forEach((fn) => fn());
  });

  return (
    <section
      ref={ref}
      id="about"
      aria-labelledby="about-title"
      className="relative isolate overflow-hidden pb-24 pt-8 lg:pb-32 lg:pt-10"
    >
      <div
        aria-hidden="true"
        className="absolute -bottom-24 -left-24 -z-10 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgb(222_93_10/0.55)_0%,rgb(222_93_10/0.2)_40%,transparent_70%)]"
      />

      <div className="container-grid items-center gap-y-16">
        {/* cards */}
        <div className="col-span-12 lg:col-span-6">
          <div className="relative mx-auto aspect-[1/1.02] w-full max-w-[34rem]">
            {about.cards.map((src, i) => (
              <div
                key={src}
                data-dp-card
                className="absolute left-[7%] top-[8%] w-[62%] will-change-transform"
              >
                <div data-dp-inner className="cursor-pointer will-change-transform">
                  <Image
                    src={src}
                    alt={i === 0 ? "Alpha Eye creative work" : ""}
                    width={395}
                    height={493}
                    sizes="(min-width: 1024px) 22rem, 60vw"
                    className="h-auto w-full rounded-[2rem] shadow-[0_20px_50px_rgb(0_0_0/0.45)]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* copy */}
        <div className="col-span-12 lg:col-span-5 lg:col-start-8">
          <TextReveal
            as="h2"
            id="about-title"
            text={about.heading}
            className="block text-[clamp(2rem,3.4vw,3rem)] font-medium leading-tight text-white"
          />

          <p className="mt-6 max-w-md text-base font-normal leading-relaxed sm:text-lg">
            {WORDS.map((word, i) => (
              <span key={i}>
                <span data-dp-word className="text-muted">
                  {word}
                </span>{" "}
              </span>
            ))}
          </p>

          <ul className="mt-8 space-y-4">
            {about.points.map((point) => (
              <li key={point} data-dp-point className="flex items-center gap-4 text-base text-white sm:text-lg">
                <span
                  aria-hidden="true"
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-white"
                >
                  <ArrowUpRightIcon className="h-3.5 w-3.5" />
                </span>
                {point}
              </li>
            ))}
          </ul>

          <Link
            href={about.cta.href}
            data-dp-cta
            className="glass mt-12 inline-block rounded-full px-8 py-3 text-sm font-semibold text-white btn-hover"
          >
            {about.cta.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
