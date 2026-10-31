"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { gsap, revealTrigger } from "@/lib/gsap";
import { useGsapScope } from "@/lib/useGsapScope";
import { serviceAnchors, services, servicesIntro } from "@/data";
import { ArrowUpRightIcon } from "@/components/ui/Icons";
import TextReveal from "@/components/ui/TextReveal";
import Reveal from "@/components/ui/Reveal";

export default function Services() {
  const [active, setActive] = useState(0);
  const previewRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  // Scroll reveal (runs once)
  const ref = useGsapScope<HTMLElement>(({ isReduced, root }) => {
    if (isReduced) return;

    gsap
      .timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: revealTrigger(root, "top 70%"),
      })
      .from("[data-svc-preview]", { y: 40, autoAlpha: 0, duration: 0.8 }, 0)
      .from("[data-svc-line]", { scaleX: 0, transformOrigin: "left center", duration: 0.8, stagger: 0.1 }, "-=0.6")
      .from("[data-svc-title]", { y: 24, autoAlpha: 0, duration: 0.6, stagger: 0.1 }, "-=0.9");
  });

  // Crossfade the preview image when the active row changes.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const imgs = previewRef.current?.querySelectorAll<HTMLElement>("[data-svc-img]");
    if (!imgs) return;
    imgs.forEach((img, i) => {
      const on = i === active;
      gsap.to(img, {
        autoAlpha: on ? 1 : 0,
        scale: on ? 1 : 1.08,
        duration: 0.5,
        ease: "power2.out",
        overwrite: "auto",
      });
    });
  }, [active]);

  return (
    <section
      ref={ref}
      id="services"
      aria-labelledby="services-title"
      className="relative isolate overflow-hidden py-20 lg:py-28"
    >
      <div
        aria-hidden="true"
        className="absolute -left-40 -top-40 -z-10 h-[34rem] w-[44rem] rounded-full bg-[radial-gradient(ellipse,rgb(222_93_10/0.38)_0%,rgb(222_93_10/0.12)_45%,transparent_70%)]"
      />

      <div className="container-grid gap-y-14">
        {/* intro */}
        <TextReveal
          as="h2"
          id="services-title"
          text={servicesIntro.heading}
          className="col-span-12 block text-[clamp(2rem,3.4vw,3rem)] font-medium leading-tight text-white lg:col-span-6"
        />
        <Reveal variant="right" className="col-span-12 lg:col-span-5 lg:col-start-8">
          <p className="text-sm leading-relaxed text-white/90">{servicesIntro.paragraph}</p>
          <Link
            href={servicesIntro.cta.href}
            className="glass mt-5 inline-block rounded-full px-6 py-2.5 text-xs font-semibold text-white btn-hover"
          >
            {servicesIntro.cta.label}
          </Link>
        </Reveal>

        {/* preview + list */}
        <div
          data-svc-preview
          className="col-span-12 md:col-span-5 lg:col-span-4"
        >
          <div
            ref={previewRef}
            className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-white/5"
          >
            {services.map((s, i) => (
              <Image
                key={s.id}
                data-svc-img
                src={s.image}
                alt={i === active ? s.title : ""}
                fill
                sizes="(min-width: 1024px) 30vw, (min-width: 768px) 40vw, 100vw"
                className={cn("object-cover", i !== 0 && "opacity-0")}
              />
            ))}
          </div>
        </div>

        <ul className="col-span-12 md:col-span-7 lg:col-span-8">
          {services.map((s, i) => {
            const on = i === active;
            return (
              <li key={s.id} className="relative">
                <Link
                  href={`/service#${serviceAnchors[s.id] ?? s.id}`}
                  onPointerEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  aria-current={on ? "true" : undefined}
                  className="group flex items-center justify-between gap-6 py-5 md:py-6"
                >
                  <span
                    data-svc-title
                    className={cn(
                      "text-[clamp(1.5rem,2.6vw,2.25rem)] font-medium leading-tight transition-colors duration-300",
                      on ? "text-white" : "text-white/25",
                    )}
                  >
                    {s.title}
                  </span>
                  <ArrowUpRightIcon
                    aria-hidden="true"
                    className={cn(
                      "h-8 w-8 shrink-0 text-white transition-all duration-300 md:h-10 md:w-10",
                      on ? "translate-x-0 opacity-100" : "-translate-x-3 opacity-0",
                    )}
                  />
                </Link>
                <span
                  data-svc-line
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-px bg-white/25"
                />
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
