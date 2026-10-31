"use client";

import Image from "next/image";
import Link from "next/link";
import { gsap, revealTrigger } from "@/lib/gsap";
import { useGsapScope } from "@/lib/useGsapScope";
import { projects, projectsIntro } from "@/data";
import TextReveal from "@/components/ui/TextReveal";

export default function LatestWork() {
  const ref = useGsapScope<HTMLElement>(({ isReduced, root }) => {
    if (isReduced) return;

    gsap
      .timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: revealTrigger(root, "top 75%"),
      })
      .from("[data-lw-head]", { y: 30, autoAlpha: 0, duration: 0.7, stagger: 0.1 })
      .from(
        "[data-lw-card]",
        { y: 70, scale: 0.94, autoAlpha: 0, duration: 0.9, stagger: 0.18 },
        "-=0.3",
      );

    // Scroll parallax: each project image drifts inside its frame.
    gsap.utils.toArray<HTMLElement>("[data-lw-parallax]").forEach((el) => {
      gsap.fromTo(
        el,
        { yPercent: -6 },
        {
          yPercent: 6,
          ease: "none",
          scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    });
  });

  return (
    <section
      ref={ref}
      id="work"
      aria-labelledby="work-title"
      className="relative isolate overflow-hidden py-20 lg:py-28"
    >
      <div
        aria-hidden="true"
        className="absolute -bottom-32 -left-32 -z-10 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgb(222_93_10/0.5)_0%,rgb(222_93_10/0.18)_42%,transparent_70%)]"
      />

      <div className="container-grid gap-y-10">
        <div className="col-span-12 flex items-center justify-between gap-6">
          <TextReveal
            as="h2"
            id="work-title"
            text={projectsIntro.heading}
            className="block text-[clamp(2rem,3.4vw,3rem)] font-medium leading-tight text-white"
          />
          <Link
            href={projectsIntro.cta.href}
            data-lw-head
            className="glass shrink-0 rounded-full px-6 py-2.5 text-xs font-semibold text-white btn-hover"
          >
            {projectsIntro.cta.label}
          </Link>
        </div>

        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/gallery#${project.id}`}
            data-lw-card
            aria-label={`${project.title} – see more`}
            className="group relative col-span-12 block aspect-[1/0.96] overflow-hidden rounded-3xl border border-white/10 bg-white/5 md:col-span-6"
          >
            <div data-lw-parallax className="absolute inset-x-0 -top-[8%] h-[116%]">
              <Image
                src={project.image}
                alt={project.title}
                fill
                sizes="(min-width: 768px) 45vw, 100vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/85 via-black/40 to-transparent"
            />
            <div className="absolute inset-x-0 bottom-0 p-6 transition-transform duration-500 ease-out group-hover:-translate-y-2 sm:p-8">
              <h3 className="text-xl font-normal text-white sm:text-2xl">{project.title}</h3>
              <span className="mt-1 inline-block text-xs text-white/85 transition-colors group-hover:text-accent">
                See more...
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
