Read this file first.

Alpha Eye is a dark agency website built with Next.js 16 (App Router), TypeScript,
Tailwind CSS v4 and GSAP (ScrollTrigger). Font is Poppins.

> Next.js 16 has breaking changes vs. older versions. Check
> `node_modules/next/dist/docs/` before writing framework code (see AGENTS.md).
> Tailwind v4 is CSS-first: tokens live in `@theme` in `app/globals.css`, there is no tailwind.config.

## Design references
- Full design: `design/reference/landingP.pdf`
- Section screenshots: `design/sections/` (navbar, hero, cards, services, latest-work, contact, footer) — use for exact spacing and sizes
- Runtime assets: `public/images/`

## Design system (Figma)
- 12-column grid, margin 80px, gutter 20px (`container-grid` utility)
- Black base with a generated vector starfield (`bg-starfield`, 3 tiled layers from `public/images/stars/`, made by `node scripts/generate-stars.mjs`; on `<body>` and the hero curve). `TextureBG.svg` is no longer used (low-quality raster).
- Accent `#DE5D0A` with `#DE5D0A` glow, white text; muted `#82807C`, dim `#222222`
- Poppins for all text

## Rules
- Frontend only, no backend. **All site content lives in `data/`** and is imported from there; components contain no hard-coded copy.
- GSAP code lives only in `"use client"` components, uses `lib/useGsapScope.ts`, and respects `prefers-reduced-motion`.
- Use the typo-corrected mockup text (Strategies, Development, Media, Nuwara Eliya). Each paragraph appears once.

## Folder structure
```
app/            layout.tsx, page.tsx, globals.css, about|service|gallery|contact/page.tsx (stubs, phase 2)
components/
  layout/       Navbar, Footer
  sections/     Hero, WorkWith, DigitalPartner, Services, VideoStats, LatestWork, Testimonials, Contact
  ui/           Button, GlassCard, SectionHeading, Pill, ...
lib/            gsap.ts (plugin registration), useGsapScope.ts, cn.ts
data/           types.ts + site, hero, about, services, projects, team, workwith, clients, gallery, stats, testimonials, contact
design/         reference/landingP.pdf, sections/*.png
public/images/  logo, hero, cards, services (incl. brand_video.mp4), projects, workWithLogo, contactBG, team
```

## Sections, in order
1. Glassmorphism navbar
2. Hero: left arrowImg.svg + titleImg.svg; right character.svg; curve shape below
3. "Work with" strip (workWith logos)
4. Three cards, animate on scroll, angled with scroll; subtext color animates #222222 → #82807C
5. Services
6+7. One section (VideoStats): brand_video.mp4 autoplays muted in view, stats overlay it and count up from 0
8. Our Latest Work
9. Client Testimonials
10. Contact
11. Footer

## Build order
0 Foundation ✅ · 1 Navbar+Footer shell ✅ · 2 Hero ✅ · 3 Work with ✅ · 4 Cards ✅ · 5 Services ✅ · 6+7 Video+Stats ✅ · 8 Latest work ✅ · 9 Testimonials ✅ · 10 Contact ✅ · 11 Polish ✅ · Reveal+text reveal+scroll animations ✅ (needs review) · 12 Subpages (service ✅ — hero, 4 panels, contact form; about/gallery/contact pending).
Build one section at a time and stop for review after each.

## Open items
- Stats and Testimonials have no mockup screenshot; data is placeholder.
- `hero/character.png` has 4 glass pills baked in; text of 3 is missing (labels overlay removed on purpose; re-export the PNG if text is needed). `character.svg` (12 MB) is unused.
- Two different phone numbers in the mockup (contact vs footer) — confirm.

## Animation helpers
- `components/ui/TextReveal.tsx` — words slide up out of a mask on scroll (`as`, `text`, `delay`, `stagger`).
- `components/ui/Reveal.tsx` — fade + slide block reveal (`variant`: up/down/left/right/scale/fade).
- `components/ui/ScrollProgress.tsx` — top scroll progress bar.
- Scroll effects: hero content lifts/fades, hero character/glow parallax, project image parallax, navbar stays sticky (fixed), gets denser on scroll and highlights the active section.

## GSAP gotchas (learned the hard way)
- Never pass `trigger: "#section-id"` for the section that owns the scope: selector strings inside `gsap.context` only match *descendants*, so the trigger silently falls back to the page top. Use the `root` element given by `useGsapScope`.
- For play-once reveals use `scrollTrigger: revealTrigger(trigger, start)` from `lib/gsap.ts`, not a bare `once: true` (a scroll jump past the range would leave content hidden).
- Animations are skipped when the OS has "Animation effects" off; `.env.local` sets `NEXT_PUBLIC_RESPECT_REDUCED_MOTION=false` for local dev (see `lib/motion.ts`).
