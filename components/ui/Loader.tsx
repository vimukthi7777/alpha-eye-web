"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { site } from "@/data";

/** Loads faster than this never show the loader (it also fades in via CSS after this delay). */
const SHOW_AFTER_MS = 200;
/** How long the exit wipe lasts (keep in sync with .loader-wipe in globals.css). */
const WIPE_MS = 700;
/** Give up waiting and open the site after this long. */
const MAX_MS = 4000;
const RING_R = 66;
const RING_LEN = 2 * Math.PI * RING_R;

/**
 * Loader built from the logo. It is in the server HTML but fades in only after
 * SHOW_AFTER_MS (CSS), so it appears on slow first loads even before React hydrates, and
 * never on fast ones: once hydrated, if the page is already ready inside that window it is
 * removed silently. Otherwise an orange ring fills 0% to 100% following the real loading
 * stages, then the content fades and the screen wipes up.
 *
 * It does not touch the GSAP clock, so navbar/hero entrances always run normally.
 * Hidden for reduced motion and without JS.
 */
export default function Loader() {
  const [leaving, setLeaving] = useState(false);
  const [done, setDone] = useState(false);
  const ring = useRef<SVGCircleElement>(null);
  const count = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setDone(true); // eslint-disable-line react-hooks/set-state-in-effect -- skip the loader entirely
      return;
    }

    let loaded = document.readyState === "complete";
    let fontsReady = !document.fonts || document.fonts.status === "loaded";

    // Everything was ready before the loader would even have appeared: never show it.
    if (loaded && fontsReady && performance.now() < SHOW_AFTER_MS) {
      setDone(true);
      return;
    }

    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = "hidden";

    const start = performance.now();
    let progress = 0;
    let last = start;
    let finished = false;
    let wipeTimer: ReturnType<typeof setTimeout> | undefined;
    let releaseTimer: ReturnType<typeof setTimeout> | undefined;

    const onLoad = () => {
      loaded = true;
    };
    if (!loaded) window.addEventListener("load", onLoad);
    if (document.fonts) {
      const ok = () => {
        fontsReady = true;
      };
      document.fonts.ready.then(ok).catch(ok);
    }

    const release = () => {
      html.style.overflow = prevOverflow;
    };

    const paint = () => {
      ring.current?.style.setProperty("stroke-dashoffset", String(RING_LEN * (1 - progress)));
      if (count.current) {
        count.current.textContent = String(Math.round(progress * 100)).padStart(2, "0");
      }
    };

    // gsap.ticker passes seconds, not performance.now() milliseconds, so read the clock ourselves.
    const tick = () => {
      const now = performance.now();
      const t = now - start;
      const dt = now - last;
      last = now;
      // Ready = document parsed + fonts (not the window load event: on a slow phone connection that waits for every image and video). The time cap is a safety net.
      const ready = (document.readyState !== "loading" && fontsReady) || t > MAX_MS;
      // Real loading stages (document parsed, page loaded, fonts ready) set the target; a slow
      // creep keeps the number moving between stages. 100% is only reached when ready.
      const stage =
        0.1 +
        (document.readyState !== "loading" ? 0.3 : 0) +
        (loaded ? 0.35 : 0) +
        (fontsReady ? 0.2 : 0);
      const creep = 0.9 * (1 - Math.exp(-t / 2500));
      const goal = ready ? 1 : Math.min(0.95, Math.max(stage, creep));
      progress += (goal - progress) * (1 - Math.pow(0.00002, dt / 1000));
      paint();

      if (!finished && ready && progress > 0.995) {
        finished = true;
        progress = 1;
        paint();
        gsap.ticker.remove(tick);
        setLeaving(true);
        // Let the content fade first, then unlock scroll while the wipe plays.
        releaseTimer = setTimeout(release, 200);
        wipeTimer = setTimeout(() => setDone(true), WIPE_MS + 200);
      }
    };
    gsap.ticker.add(tick);

    return () => {
      clearTimeout(wipeTimer);
      clearTimeout(releaseTimer);
      window.removeEventListener("load", onLoad);
      gsap.ticker.remove(tick);
      release();
    };
  }, []);

  if (done) return null;

  return (
    <div
      id="site-loader"
      role="status"
      aria-live="polite"
      aria-busy={!leaving}
      className={`loader-wipe bg-starfield fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden ${
        leaving ? "loader-leaving" : ""
      }`}
    >
      <span className="sr-only">{leaving ? "Loaded" : "Loading"}</span>

      <div
        aria-hidden="true"
        className="loader-glow absolute h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgb(222_93_10/0.55)_0%,rgb(222_93_10/0.18)_40%,transparent_70%)]"
      />

      <div aria-hidden="true" className="loader-content relative flex flex-col items-center">
        <div className="relative h-40 w-40">
          <svg viewBox="0 0 160 160" className="absolute inset-0 h-full w-full -rotate-90">
            <circle cx="80" cy="80" r={RING_R} fill="none" stroke="rgb(255 255 255 / 0.12)" strokeWidth="2" />
            <circle
              ref={ring}
              cx="80"
              cy="80"
              r={RING_R}
              fill="none"
              stroke="#DE5D0A"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={RING_LEN}
              strokeDashoffset={RING_LEN}
              style={{ filter: "drop-shadow(0 0 6px rgb(222 93 10 / 0.8))" }}
            />
          </svg>

          <div className="loader-logo absolute left-1/2 top-1/2 h-12 w-[3.75rem] -translate-x-1/2 -translate-y-1/2 sm:h-14 sm:w-[4.375rem]">
            <Image src={site.logo} alt="" fill priority sizes="70px" className="object-contain" />
            {/* light sweep through the logo shape */}
            <div
              className="loader-shine absolute inset-0"
              style={{
                WebkitMask: `url(${site.logo}) center / contain no-repeat`,
                mask: `url(${site.logo}) center / contain no-repeat`,
              }}
            />
          </div>
        </div>

        <p className="loader-text mt-6 text-[11px] font-medium uppercase tracking-[0.35em] text-white/70">
          {site.name} {site.tagline}
        </p>
        <p className="mt-2 text-xs tabular-nums text-accent">
          <span ref={count}>00</span>%
        </p>
      </div>
    </div>
  );
}
