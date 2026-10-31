"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { gsap } from "@/lib/gsap";
import { useGsapScope } from "@/lib/useGsapScope";
import { servicesPageHero, servicesPageLinks } from "@/data";
import { ArrowUpRightIcon } from "@/components/ui/Icons";

type ServiceLink = { label: string; target: string };

function Pill({ link }: { link: ServiceLink }) {
  return (
    <Link
      href={`#${link.target}`}
      className="glass group flex h-[3.25rem] items-center justify-between gap-3 rounded-full border-white/35 py-1 pl-6 pr-1.5 text-[13px] font-medium text-white transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.05] focus-visible:scale-[1.05] sm:text-sm"
    >
      <span className="min-w-0 flex-1 text-center">{link.label}</span>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent">
        <ArrowUpRightIcon aria-hidden="true" className="h-5 w-5" />
      </span>
    </Link>
  );
}

function PillColumn({ links, className }: { links: ServiceLink[]; className?: string }) {
  return (
    <ul className={cn("flex flex-col gap-5", className)}>
      {links.map((l) => (
        <li key={l.target} data-sv-pill>
          <Pill link={l} />
        </li>
      ))}
    </ul>
  );
}

/** Splits the combined list into swipeable pages (left column first, then right). */
function chunk<T>(items: T[], size: number): T[][] {
  const pages: T[][] = [];
  for (let i = 0; i < items.length; i += size) pages.push(items.slice(i, i + size));
  return pages;
}

export default function ServicesHero() {
  const [page, setPage] = useState(0);
  const track = useRef<HTMLDivElement>(null);
  const pages = chunk(
    [...servicesPageLinks.left, ...servicesPageLinks.right],
    servicesPageHero.mobilePageSize,
  );

  const ref = useGsapScope<HTMLElement>(({ isReduced }) => {
    if (isReduced) return;

    gsap
      .timeline({ defaults: { ease: "power3.out" } })
      .from("[data-sv-title]", { yPercent: 60, autoAlpha: 0, duration: 0.9 })
      .from("[data-sv-copy]", { y: 20, autoAlpha: 0, duration: 0.7 }, "-=0.5")
      .from(
        "[data-sv-pill]",
        { x: 60, autoAlpha: 0, duration: 0.7, stagger: 0.07 },
        0.2,
      );
  });

  const onScroll = () => {
    const el = track.current;
    if (!el) return;
    setPage(Math.round(el.scrollLeft / el.clientWidth));
  };
  const goTo = (i: number) => {
    const el = track.current;
    el?.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  };

  return (
    <section
      ref={ref}
      aria-labelledby="services-page-title"
      className="relative isolate min-h-svh overflow-hidden pb-40 pt-32 lg:pt-40"
    >
      {/* orange horizon glow + curve (same treatment as the landing hero) */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-20 h-3/5 bg-[radial-gradient(ellipse_90%_100%_at_50%_100%,#DE5D0A_0%,rgb(222_93_10/0.55)_38%,transparent_75%)]"
      />
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-[84%] -z-10 aspect-[2/1] w-[170%] -translate-x-1/2 rounded-[50%] border-t-2 border-[#ff8a3d] bg-starfield shadow-[0_-24px_90px_10px_rgb(222_93_10/0.55)] md:top-[80%]"
      />

      <div className="container-grid items-start gap-y-12">
        <div className="col-span-12 lg:col-span-5">
          <h1
            id="services-page-title"
            data-sv-title
            className="text-[clamp(2.75rem,5.2vw,4.5rem)] font-semibold leading-none tracking-tight text-white"
          >
            {servicesPageHero.heading}
          </h1>
          <p
            data-sv-copy
            className="mt-8 max-w-[26rem] text-[13px] font-light leading-relaxed text-white/90 sm:text-sm"
          >
            {servicesPageHero.paragraph}
          </p>
        </div>

        <div className="col-span-12 lg:col-span-7">
          {/* tablet / desktop: two staggered columns */}
          <nav aria-label="Our services" className="hidden gap-5 sm:grid sm:grid-cols-2">
            <PillColumn links={servicesPageLinks.left} />
            <PillColumn links={servicesPageLinks.right} className="sm:mt-16" />
          </nav>

          {/* mobile: swipe through pages of four */}
          <div className="sm:hidden">
            <div
              ref={track}
              onScroll={onScroll}
              role="group"
              aria-roledescription="carousel"
              aria-label="Our services"
              className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {pages.map((links, i) => (
                <ul
                  key={i}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${i + 1} of ${pages.length}`}
                  className="flex w-full shrink-0 snap-start flex-col gap-4 px-1"
                >
                  {links.map((l) => (
                    <li key={l.target} data-sv-pill>
                      <Pill link={l} />
                    </li>
                  ))}
                </ul>
              ))}
            </div>

            {/* swipe indicator: long pill = current page, dots = the others */}
            <div className="mt-6 flex items-center justify-center gap-2">
              {pages.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Go to services page ${i + 1}`}
                  aria-current={i === page ? "true" : undefined}
                  onClick={() => goTo(i)}
                  className={cn(
                    "h-3 rounded-full bg-accent transition-all duration-300",
                    i === page ? "w-10" : "w-3 opacity-70",
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
