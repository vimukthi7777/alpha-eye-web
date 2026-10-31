"use client";

import Image from "next/image";
import { cn } from "@/lib/cn";
import { gsap, revealTrigger } from "@/lib/gsap";
import { useGsapScope } from "@/lib/useGsapScope";
import type { ServicePanelData } from "@/data";
import { ChevronRightIcon } from "@/components/ui/Icons";
import TextReveal from "@/components/ui/TextReveal";

/** Two different crops of the panel's one source image. */
const CROPS = [
  { className: "flex-[1.35]", position: "0% 100%" },
  { className: "flex-1", position: "100% 0%" },
] as const;

export default function ServicePanel({ panel }: { panel: ServicePanelData }) {
  const { id, title, description, image, items, mirrored } = panel;

  const ref = useGsapScope<HTMLElement>(({ isReduced, root }) => {
    if (isReduced) return;

    gsap
      .timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: revealTrigger(root, "top 75%"),
      })
      .from("[data-sp-card]", { y: 60, autoAlpha: 0, duration: 0.9 })
      .from("[data-sp-copy]", { y: 20, autoAlpha: 0, duration: 0.6 }, "-=0.5")
      .from(
        "[data-sp-img]",
        { y: 60, autoAlpha: 0, duration: 0.8, stagger: 0.12 },
        "-=0.4",
      )
      .from("[data-sp-item]", { y: 28, autoAlpha: 0, duration: 0.6, stagger: 0.12 }, "-=0.7");
  });

  return (
    <section
      ref={ref}
      id={id}
      aria-labelledby={`${id}-title`}
      className="scroll-mt-28 py-6 lg:py-10"
    >
      <div className="container-grid">
        <div
          data-sp-card
          className="col-span-12 grid gap-10 rounded-[2rem] border border-white/40 bg-black/30 p-6 sm:p-9 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:p-12"
        >
          {/* title + image crops */}
          <div className={cn("flex flex-col", mirrored && "lg:order-last")}>
            <TextReveal
              as="h2"
              id={`${id}-title`}
              text={title}
              className="block text-[clamp(1.75rem,2.6vw,2.25rem)] font-semibold leading-tight text-white"
            />
            <p data-sp-copy className="mt-3 max-w-md text-sm leading-relaxed text-white/90">
              {description}
            </p>

            <div className="mt-10 flex h-64 gap-4 sm:h-80 lg:mt-auto lg:h-[22rem] lg:pt-10">
              {CROPS.map((crop, i) => (
                <div
                  key={i}
                  data-sp-img
                  className={cn(
                    "relative min-w-0 overflow-hidden rounded-3xl bg-white/5",
                    crop.className,
                  )}
                >
                  <Image
                    src={image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 28vw, 45vw"
                    style={{ objectPosition: crop.position }}
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* services list */}
          <ul>
            {items.map((item, i) => (
              <li
                key={item.id}
                id={item.id}
                data-sp-item
                className={cn(
                  "scroll-mt-32",
                  i > 0 && "mt-6 border-t border-white/15 pt-6",
                )}
              >
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element -- tiny decorative svg */}
                  <img src={item.icon} alt="" width={22} height={22} className="h-5 w-auto" />
                  <h3 className="text-base font-semibold text-white">{item.title}</h3>
                </div>
                <p className="mt-1.5 max-w-xs pl-8 text-sm leading-snug text-white/90">
                  {item.description}
                </p>
                <ul className="mt-3 space-y-1.5 pl-8">
                  {item.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-[13px] text-white/90">
                      <ChevronRightIcon
                        aria-hidden="true"
                        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent"
                      />
                      {b}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
