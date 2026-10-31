"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRightIcon, WhatsappIcon } from "@/components/ui/Icons";
import { gsap } from "@/lib/gsap";
import { useGsapScope } from "@/lib/useGsapScope";
import { hero, site } from "@/data";

export default function Hero() {
  const ref = useGsapScope<HTMLElement>(({ isReduced, root }) => {
    if (isReduced) return;

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from("[data-hero-line]", { yPercent: 60, autoAlpha: 0, duration: 0.9, stagger: 0.15 })
      .from("[data-hero-arrow]", { rotate: -180, scale: 0.4, autoAlpha: 0, duration: 0.9 }, 0.2)
      .from("[data-hero-pill]", { scaleX: 0, transformOrigin: "left center", duration: 0.9 }, 0.45)
      .from("[data-hero-copy]", { y: 20, autoAlpha: 0, duration: 0.7 }, "-=0.4")
      .from("[data-hero-character]", { x: 120, autoAlpha: 0, duration: 1.1 }, 0.3);

    // gentle idle float on the character
    gsap.to("[data-hero-float]", {
      y: -10,
      duration: 3,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });

    // parallax while scrolling past the hero
    gsap.to("[data-hero-character]", {
      yPercent: -8,
      ease: "none",
      scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
    });
    gsap.to("[data-hero-content]", {
      yPercent: -14,
      autoAlpha: 0.1,
      ease: "none",
      scrollTrigger: { trigger: root, start: "top top", end: "65% top", scrub: true },
    });
    gsap.to("[data-hero-glow]", {
      yPercent: 15,
      ease: "none",
      scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
    });
  });

  return (
    <section
      ref={ref}
      id="home"
      className="relative isolate min-h-svh overflow-hidden pb-[calc(24svh+2rem)] pt-32 md:pb-[calc(28svh+2rem)] lg:pt-36"
    >
      {/* orange horizon glow + curve */}
      <div
        data-hero-glow
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-20 h-3/5 bg-[radial-gradient(ellipse_90%_100%_at_50%_100%,#DE5D0A_0%,rgb(222_93_10/0.55)_38%,transparent_75%)]"
      />
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-[76%] -z-10 aspect-[2/1] w-[170%] -translate-x-1/2 rounded-[50%] border-t-2 border-[#ff8a3d] bg-starfield shadow-[0_-24px_90px_10px_rgb(222_93_10/0.55)] md:top-[72%]"
      />

      {/* character with baked-in glass pills */}
      <div
        data-hero-character
        className="pointer-events-none absolute right-0 bottom-[24%] -z-[15] w-[58%] max-w-[720px] md:right-0 md:top-[14%] md:bottom-auto md:w-[46%]"
      >
        <div data-hero-float className="relative">
          <Image
            src={hero.characterImage}
            alt=""
            width={1086}
            height={1040}
            priority
            sizes="(min-width: 768px) 46vw, 58vw"
            className="h-auto w-full"
          />
        </div>
      </div>

      <div data-hero-content className="container-grid">
        <div className="col-span-12 md:col-span-8 lg:col-span-7">
          <h1
            aria-label={hero.headline}
            className="text-[clamp(2.25rem,5.2vw,4.5rem)] leading-[1.15] tracking-tight text-white"
          >
            <span data-hero-line className="flex flex-wrap items-center gap-x-[0.25em]" aria-hidden="true">
              <span className="font-semibold">Grow</span>
              <Image
                data-hero-arrow
                src={hero.arrowImage}
                alt=""
                width={66}
                height={66}
                className="h-[1em] w-[1em]"
              />
              <span className="font-light italic">Your</span>
              <span className="font-semibold">Brand</span>
            </span>
            <span data-hero-line className="flex flex-wrap items-center gap-x-[0.25em]" aria-hidden="true">
              <Image
                data-hero-pill
                src={hero.titleImage}
                alt=""
                width={235}
                height={75}
                className="h-[0.95em] w-auto"
              />
              <span className="font-light">&amp;</span>
              <span className="font-semibold">Business</span>
            </span>
            <span data-hero-line className="flex flex-wrap items-center gap-x-[0.25em]" aria-hidden="true">
              <span className="font-light italic">With</span>
              <Image src={site.logo} alt="" width={50} height={40} className="h-[0.95em] w-auto" />
              <span className="font-semibold">{site.name}</span>
            </span>
          </h1>

          <p
            data-hero-copy
            className="mt-8 max-w-[26rem] text-[13px] font-light leading-relaxed text-white/90 sm:text-sm"
          >
            {hero.paragraph}
          </p>

          <div data-hero-copy className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href={hero.primaryCta.href}
              className="flex h-12 items-center gap-3 rounded-full bg-accent pl-6 pr-1.5 text-sm font-semibold text-white btn-hover"
            >
              {hero.primaryCta.label}
              <span data-btn-icon className="flex h-9 w-9 items-center justify-center rounded-full bg-black/30">
                <ArrowUpRightIcon aria-hidden="true" className="h-4 w-4" />
              </span>
            </Link>
            <a
              href={hero.whatsappCta.href}
              target="_blank"
              rel="noopener noreferrer"
              className="glass flex h-12 items-center gap-2.5 rounded-full px-6 text-sm font-semibold text-white btn-hover"
            >
              <WhatsappIcon aria-hidden="true" className="h-5 w-5" />
              {hero.whatsappCta.label}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
