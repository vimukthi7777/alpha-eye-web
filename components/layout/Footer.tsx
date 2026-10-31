"use client";

import Image from "next/image";
import Link from "next/link";
import { gsap, revealTrigger } from "@/lib/gsap";
import { useGsapScope } from "@/lib/useGsapScope";
import { footerContent, footerPages, services, site, socials } from "@/data";
import { socialIcons } from "@/components/ui/Icons";

const HEADING = "mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50";

export default function Footer() {
  const ref = useGsapScope<HTMLElement>(({ isReduced, root }) => {
    if (isReduced) return;
    gsap
      .timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: revealTrigger(root, "top 85%"),
      })
      .from("[data-footer-col]", { y: 24, autoAlpha: 0, duration: 0.6, stagger: 0.1 })
      .from("[data-footer-word]", { yPercent: 40, autoAlpha: 0, duration: 0.9 }, "-=0.3");
  });

  return (
    <footer ref={ref} className="overflow-hidden px-(--page-margin) pt-10">
      <div className="mx-auto max-w-[1280px]">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-x-10">
          <div data-footer-col className="col-span-2 max-w-xs sm:col-span-1">
            <Link href="/" aria-label={`${site.name} home`} className="mb-5 inline-block">
              <Image src={site.logo} alt="" width={50} height={40} className="h-10 w-auto" />
            </Link>
            <p className="text-xs leading-relaxed text-white/90">{site.description}</p>
            <ul className="mt-5 flex gap-2">
              {socials.map((s) => {
                const Icon = socialIcons[s.icon];
                return (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/40 text-base text-white btn-hover"
                    >
                      <Icon />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          <nav data-footer-col aria-label="Works">
            <h2 className={HEADING}>{footerContent.worksHeading}</h2>
            <ul className="space-y-2">
              {services.map((s) => (
                <li key={s.id}>
                  <Link href="/service" className="text-xs text-white hover:text-accent">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav data-footer-col aria-label="Pages">
            <h2 className={HEADING}>{footerContent.pagesHeading}</h2>
            <ul className="space-y-2">
              {footerPages.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-xs text-white hover:text-accent">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div data-footer-col className="col-span-2 sm:col-span-1">
            <h2 className={HEADING}>{site.handle}</h2>
            <ul className="space-y-2 text-xs text-white">
              <li>{site.email}</li>
              <li>{site.phone}</li>
              <li>{site.address}</li>
            </ul>
          </div>
        </div>

        {/* oversized wordmark with the orange square full stop */}
        <p
          data-footer-word
          aria-label={site.name}
          className="mt-12 select-none whitespace-nowrap text-center text-[clamp(3.5rem,15.5vw,13.5rem)] font-semibold leading-[0.8] tracking-tighter text-white"
        >
          <span aria-hidden="true">
            {site.name}
            <span className="ml-[0.04em] inline-block h-[0.14em] w-[0.14em] bg-accent" />
          </span>
        </p>
      </div>
    </footer>
  );
}
