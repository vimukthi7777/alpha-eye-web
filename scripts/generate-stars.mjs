// Generates crisp, resolution-independent starfield tiles (vector SVG) into
// public/images/stars/. Run: node scripts/generate-stars.mjs
import { writeFileSync, mkdirSync } from "node:fs";

// Small seeded PRNG so output is reproducible.
function rng(seed) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

const LAYERS = [
  // size = tile edge in px; sizes are deliberately not multiples of each other
  { name: "stars-1", size: 700, count: 110, r: [0.45, 0.9], a: [0.25, 0.7], warm: 0.05, seed: 11 },
  { name: "stars-2", size: 1100, count: 95, r: [0.6, 1.2], a: [0.35, 0.85], warm: 0.1, seed: 23 },
  { name: "stars-3", size: 1700, count: 55, r: [0.9, 1.7], a: [0.5, 1], warm: 0.18, seed: 37, glow: true },
];

mkdirSync("public/images/stars", { recursive: true });

for (const L of LAYERS) {
  const rand = rng(L.seed);
  const circles = [];
  for (let i = 0; i < L.count; i++) {
    const r = L.r[0] + rand() * (L.r[1] - L.r[0]);
    const a = L.a[0] + rand() * (L.a[1] - L.a[0]);
    const x = rand() * L.size;
    const y = rand() * L.size;
    const fill = rand() < L.warm ? "#ffb27a" : "#ffffff"; // a few warm (brand orange) stars
    // draw wrapped copies near the edges so the tile repeats without seams
    for (const dx of [-L.size, 0, L.size]) {
      for (const dy of [-L.size, 0, L.size]) {
        const cx = x + dx, cy = y + dy;
        if (cx < -4 || cy < -4 || cx > L.size + 4 || cy > L.size + 4) continue;
        circles.push(`<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r.toFixed(2)}" fill="${fill}" fill-opacity="${a.toFixed(2)}"/>`);
        if (L.glow && r > 1.3) {
          circles.push(`<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${(r * 3).toFixed(2)}" fill="${fill}" fill-opacity="0.08"/>`);
        }
      }
    }
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${L.size}" height="${L.size}" viewBox="0 0 ${L.size} ${L.size}">${circles.join("")}</svg>\n`;
  writeFileSync(`public/images/stars/${L.name}.svg`, svg);
  console.log(L.name, svg.length, "bytes", circles.length, "circles");
}
