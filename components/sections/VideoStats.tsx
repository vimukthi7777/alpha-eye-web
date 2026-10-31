"use client";

import { useRef, useState } from "react";
import { gsap, ScrollTrigger, revealTrigger } from "@/lib/gsap";
import { useGsapScope } from "@/lib/useGsapScope";
import { brandVideo, stats } from "@/data";
import { PauseIcon, PlayIcon, VolumeOffIcon, VolumeOnIcon } from "@/components/ui/Icons";

const format = (n: number) => Math.round(n).toLocaleString("en-US");

export default function VideoStats() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(true);

  const ref = useGsapScope<HTMLElement>(({ isReduced, root }) => {
    const video = videoRef.current;
    if (!video) return;

    // Set as a property: React's `muted` attribute is not reliably rendered, and
    // browsers only allow autoplay for videos that are really muted.
    video.muted = true;

    const play = () => video.play().catch(() => setPlaying(false));
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);

    // Autoplay while the section is on screen, pause when it leaves.
    ScrollTrigger.create({
      trigger: root,
      start: "top 85%",
      end: "bottom 15%",
      onEnter: play,
      onEnterBack: play,
      onLeave: () => video.pause(),
      onLeaveBack: () => video.pause(),
    });

    // Count-up numbers
    const nums = gsap.utils.toArray<HTMLElement>("[data-stat-value]");
    const values = stats.map((s) => s.value);
    if (!isReduced) {
      nums.forEach((el) => (el.textContent = "0"));
      const counter = { t: 0 };
      gsap.to(counter, {
        t: 1,
        duration: 2.2,
        ease: "power2.out",
        scrollTrigger: revealTrigger("[data-stat-grid]", "top 90%"),
        onUpdate: () => nums.forEach((el, i) => (el.textContent = format(values[i] * counter.t))),
        onComplete: () => nums.forEach((el, i) => (el.textContent = format(values[i]))),
      });

      // Card grows from a smaller, rounder shape while scrolling in.
      gsap.fromTo(
        "[data-vs-card]",
        { scale: 0.82, borderRadius: 64 },
        {
          scale: 1,
          borderRadius: 24,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top 95%", end: "top 35%", scrub: 0.6 },
        },
      );
      gsap.from("[data-stat]", {
        y: 20,
        autoAlpha: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: revealTrigger("[data-stat-grid]", "top 90%"),
      });
    }

    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
    };
  });

  const toggleSound = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  };

  return (
    <section
      ref={ref}
      id="video-stats"
      aria-label={brandVideo.label}
      className="px-(--page-margin) py-16 lg:py-24"
    >
      <div
        data-vs-card
        className="relative mx-auto w-full max-w-[1280px] overflow-hidden rounded-3xl bg-[#0b0b0b] will-change-transform"
      >
        <div className="relative aspect-video w-full">
          <video
            ref={videoRef}
            src={brandVideo.src}
            className="h-full w-full object-cover"
            muted
            loop
            playsInline
            preload="auto"
            aria-label={brandVideo.label}
          />

          <div className="absolute right-4 top-4 flex gap-2">
            <button
              type="button"
              onClick={togglePlay}
              aria-label={playing ? "Pause video" : "Play video"}
              className="glass flex h-10 w-10 items-center justify-center rounded-full text-lg text-white btn-hover"
            >
              {playing ? <PauseIcon aria-hidden="true" /> : <PlayIcon aria-hidden="true" />}
            </button>
            <button
              type="button"
              onClick={toggleSound}
              aria-pressed={!muted}
              aria-label={muted ? "Unmute video" : "Mute video"}
              className="glass flex h-10 w-10 items-center justify-center rounded-full text-lg text-white btn-hover"
            >
              {muted ? <VolumeOffIcon aria-hidden="true" /> : <VolumeOnIcon aria-hidden="true" />}
            </button>
          </div>
        </div>

        {/* stats: overlaid on the video from md up, stacked under it on mobile */}
        <div className="bg-black/80 px-6 py-8 md:absolute md:inset-x-0 md:bottom-0 md:bg-black/0 md:bg-gradient-to-t md:from-black md:via-black/70 md:to-transparent md:px-10 md:pb-8 md:pt-24">
          <dl data-stat-grid className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.id} data-stat className="text-center">
                <dd className="text-4xl font-semibold text-white md:text-5xl">
                  <span data-stat-value>{format(s.value)}</span>
                  <span className="text-accent">{s.suffix}</span>
                </dd>
                <dt className="mt-1 text-xs font-light text-white/80 sm:text-sm">{s.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
