"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useGsapScope } from "@/lib/useGsapScope";
import { navLinks, site, hero } from "@/data";
import { PhoneIcon } from "@/components/ui/Icons";

/** Page sections the nav links point to (order on the page). */
const SECTION_IDS = ["home", "about", "services", "work", "contact"];

/** Landing-page section id a nav link points at ("home" for "/"); other routes have none. */
const sectionOf = (href: string) => {
  if (href.startsWith("/#")) return href.split("#")[1];
  return href === "/" ? "home" : null;
};

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");
  const pathname = usePathname();
  // On the landing page the scroll spy decides; on other routes the path does.
  const isActive = (href: string) =>
    pathname === "/" ? sectionOf(href) === active : href === pathname;

  const ref = useGsapScope<HTMLElement>(({ isReduced }) => {
    if (!isReduced) {
      gsap.from("[data-nav-bar]", { y: -40, autoAlpha: 0, duration: 0.8, ease: "power3.out" });
      gsap.from("[data-nav-item]", {
        y: -12,
        autoAlpha: 0,
        duration: 0.5,
        stagger: 0.07,
        delay: 0.3,
        ease: "power2.out",
      });
    }
    // Navbar stays fixed (sticky); the glass just gets denser after the first scroll.
    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const y = self.scroll();
        setScrolled(y > 40);
      },
    });

    // Scroll spy: highlight the link of the section currently in view.
    SECTION_IDS.forEach((id) => {
      const section = document.getElementById(id);
      if (!section) return;
      ScrollTrigger.create({
        trigger: section,
        start: "top 55%",
        end: "bottom 55%",
        onToggle: (self) => {
          if (self.isActive) setActive(id);
        },
      });
    });
  });

  return (
    <header
      ref={ref}
      className="pointer-events-none fixed inset-x-0 top-0 z-50 px-(--page-margin) pt-4"
    >
      <div
        data-nav-bar
        className={cn(
          "pointer-events-auto mx-auto max-w-[1280px] rounded-2xl border border-white/40 px-5 py-3 transition-all duration-300",
          scrolled
            ? "bg-black/70 shadow-[0_8px_30px_rgb(0_0_0/0.5)] backdrop-blur-2xl"
            : "bg-white/6 backdrop-blur-xl",
        )}
      >
        <div className="flex items-center justify-between gap-6">
          <Link href="/" aria-label={`${site.name} home`} data-nav-item className="shrink-0">
            <Image
              src={site.logoWithName}
              alt={`${site.name} ${site.tagline}`}
              width={140}
              height={40}
              priority
              className="h-10 w-auto"
            />
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-8 xl:gap-10">
              {navLinks.map((link) => (
                <li key={link.label} data-nav-item>
                  <Link
                    href={link.href}
                    aria-current={
                      isActive(link.href) ? (pathname === "/" ? "location" : "page") : undefined
                    }
                    className={cn(
                      "text-[15px] font-semibold transition-colors hover:text-accent",
                      isActive(link.href) ? "text-accent" : "text-white",
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href={hero.cta.href}
              data-nav-item
              className="glass hidden rounded-full px-6 py-2 text-[15px] font-semibold text-white btn-hover sm:inline-flex sm:items-center sm:gap-2"
            >
              <PhoneIcon aria-hidden="true" className="h-4 w-4" />
              {hero.cta.label}
            </Link>

            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((v) => !v)}
              className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
            >
              <span
                className={cn(
                  "h-0.5 w-6 bg-white transition-transform",
                  open && "translate-y-2 rotate-45",
                )}
              />
              <span className={cn("h-0.5 w-6 bg-white transition-opacity", open && "opacity-0")} />
              <span
                className={cn(
                  "h-0.5 w-6 bg-white transition-transform",
                  open && "-translate-y-2 -rotate-45",
                )}
              />
            </button>
          </div>
        </div>

        <div
          id="mobile-menu"
          className={cn(
            "grid transition-all duration-300 lg:hidden",
            open ? "mt-4 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
          )}
        >
          <ul className="flex flex-col gap-1 overflow-hidden">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-2 py-3 text-base font-semibold text-white hover:text-accent"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={hero.cta.href}
                onClick={() => setOpen(false)}
                className="glass btn-hover mt-2 flex items-center justify-center gap-2 rounded-full px-6 py-3 text-center font-semibold text-white"
              >
                <PhoneIcon aria-hidden="true" className="h-4 w-4" />
                {hero.cta.label}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
