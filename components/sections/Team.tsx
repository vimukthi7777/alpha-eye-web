"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { gsap, revealTrigger } from "@/lib/gsap";
import { useGsapScope } from "@/lib/useGsapScope";
import { team, teamFilters, teamPage } from "@/data";
import { ArrowUpRightIcon, CloseIcon, FilterIcon } from "@/components/ui/Icons";
import TeamProfileCard from "@/components/sections/TeamProfileCard";
import CursorLabel from "@/components/ui/CursorLabel";

const ALL = teamPage.allLabel;

function FilterPill({
  label,
  active,
  onSelect,
  onPanel,
  className,
}: {
  label: string;
  active: boolean;
  onSelect: () => void;
  /** Rendered on the orange mobile panel (lighter glass look). */
  onPanel?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onSelect}
      className={cn(
        "flex h-10 shrink-0 snap-start items-center gap-3 whitespace-nowrap rounded-full border py-1 pl-5 pr-1 text-xs font-medium transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.05] focus-visible:scale-[1.05] sm:text-[13px]",
        active
          ? "border-white bg-white text-accent"
          : onPanel
            ? "border-white/60 bg-white/25 text-white"
            : "glass text-white",
        className,
      )}
    >
      {label}
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-white"
      >
        <ArrowUpRightIcon aria-hidden="true" className="h-4 w-4" />
      </span>
    </button>
  );
}

export default function Team() {
  const [filter, setFilter] = useState(ALL);
  const [panel, setPanel] = useState(false);

  const members = useMemo(
    () => (filter === ALL ? team : team.filter((m) => m.categories.includes(filter))),
    [filter],
  );
  const pills = [ALL, ...teamFilters];
  // Row = first pills, plus the active one if it lives behind the filter button.
  const rowPills = pills.slice(0, teamPage.visibleCount);
  if (!rowPills.includes(filter)) rowPills.push(filter);
  // Mobile row is shorter (teamPage.mobileVisibleCount): the rest moves behind the filter button.
  const mobileHidden = (label: string) =>
    pills.indexOf(label) >= teamPage.mobileVisibleCount && label !== filter;
  const morePills = pills.filter((p, i) => i >= teamPage.mobileVisibleCount && p !== filter);

  const ref = useGsapScope<HTMLElement>(
    ({ isReduced, root }) => {
      if (isReduced) return;
      gsap.from("[data-team-head]", {
        y: 30,
        autoAlpha: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
      });
      gsap.from("[data-team-card]", {
        y: 50,
        autoAlpha: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: revealTrigger(root.querySelector("[data-team-grid]") ?? root, "top 90%"),
      });
    },
    [filter],
  );

  const select = (label: string) => {
    setFilter(label);
    setPanel(false);
  };

  return (
    <section
      ref={ref}
      aria-labelledby="team-title"
      className="relative isolate overflow-hidden pb-24 pt-32 lg:pt-40"
    >
      {/* orange horizon glow + curve behind the filters */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-40 -z-20 h-[26rem] bg-[radial-gradient(ellipse_90%_100%_at_50%_100%,#DE5D0A_0%,rgb(222_93_10/0.5)_38%,transparent_75%)]"
      />
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-[25rem] -z-10 aspect-[2/1] w-[170%] -translate-x-1/2 rounded-[50%] border-t-2 border-[#ff8a3d] bg-starfield shadow-[0_-24px_90px_10px_rgb(222_93_10/0.55)]"
      />

      <div className="container-grid gap-y-8">
        <div className="col-span-12 lg:col-span-6">
          <h1
            id="team-title"
            data-team-head
            className="text-[clamp(2.75rem,5.2vw,4.5rem)] font-semibold leading-none tracking-tight text-white"
          >
            {teamPage.heading}
          </h1>
          <p
            data-team-head
            className="mt-6 max-w-[26rem] text-[13px] font-light leading-relaxed text-white/90 sm:text-sm"
          >
            {teamPage.paragraph}
          </p>
        </div>

        {/* filters: one group; the toggle swaps filter icon <-> close and reveals the rest */}
        <div data-team-head className="col-span-12 mt-6 lg:mt-10">
          <div
            role="group"
            aria-label={teamPage.filterPanelTitle}
            className={cn(
              "rounded-3xl p-0 transition-[background-color,padding] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
              panel && "bg-accent p-4",
            )}
          >
            <div className="flex snap-x items-center gap-3 overflow-x-auto overscroll-x-contain py-1 [scrollbar-width:none] md:flex-wrap md:overflow-visible [&::-webkit-scrollbar]:hidden">
              {rowPills.map((label) => (
                <FilterPill
                  key={label}
                  label={label}
                  className={mobileHidden(label) ? "hidden md:flex" : undefined}
                  onPanel={panel}
                  active={filter === label}
                  onSelect={() => select(label)}
                />
              ))}
              <button
                type="button"
                aria-label={panel ? teamPage.filterCloseLabel : teamPage.filterOpenLabel}
                aria-expanded={panel}
                aria-controls="team-filter-more"
                onClick={() => setPanel((v) => !v)}
                className={cn(
                  "flex h-10 w-10 shrink-0 snap-start items-center justify-center rounded-full text-white transition-[background-color,transform] duration-300 hover:scale-105",
                  panel ? "bg-black" : "bg-accent",
                )}
              >
                {panel ? (
                  <CloseIcon aria-hidden="true" className="h-4 w-4" />
                ) : (
                  <FilterIcon aria-hidden="true" className="h-4 w-4" />
                )}
              </button>
            </div>

            <div
              id="team-filter-more"
              inert={!panel}
              className={cn(
                "grid transition-[grid-template-rows,opacity,margin] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                panel ? "mt-3 grid-rows-[1fr] opacity-100" : "mt-0 grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden">
                <div className="flex flex-wrap gap-3">
                  {morePills.map((label) => (
                    <FilterPill
                      key={label}
                      label={label}
                      // already in the row on larger screens
                      className={pills.indexOf(label) < teamPage.visibleCount ? "md:hidden" : undefined}
                      onPanel
                      active={filter === label}
                      onSelect={() => select(label)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CursorLabel />

      {/* grid */}
      <div className="container-grid mt-14">
        {members.length > 0 ? (
          <ul data-team-grid className="col-span-12 grid grid-cols-1 justify-items-center gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {members.map((m) => (
              <TeamProfileCard key={m.id} member={m} />
            ))}
          </ul>
        ) : (
          <p role="status" className="col-span-12 py-16 text-center text-white/70">
            {teamPage.empty}
          </p>
        )}
      </div>
    </section>
  );
}
