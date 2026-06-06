import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const PHOTO_COUNT = 108;
const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "public", "assets", "photos");
mkdirSync(outDir, { recursive: true });

const hues = [350, 355, 340, 330, 345, 360, 335, 348];

for (let i = 1; i <= PHOTO_COUNT; i++) {
  const hue = hues[i % hues.length];
  const hue2 = (hue + 15) % 360;
  const label = String(i).padStart(3, "0");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:hsl(${hue},45%,92%)"/>
      <stop offset="100%" style="stop-color:hsl(${hue2},55%,85%)"/>
    </linearGradient>
    <filter id="blur"><feGaussianBlur stdDeviation="2"/></filter>
  </defs>
  <rect width="800" height="600" fill="url(#g)"/>
  <circle cx="200" cy="150" r="80" fill="hsla(${hue},60%,90%,0.5)" filter="url(#blur)"/>
  <circle cx="600" cy="400" r="120" fill="hsla(${hue2},50%,88%,0.4)" filter="url(#blur)"/>
  <text x="400" y="300" text-anchor="middle" font-family="Georgia,serif" font-size="28" fill="#8E6C6C" opacity="0.6">Photo ${label}</text>
  <text x="400" y="340" text-anchor="middle" font-family="Georgia,serif" font-size="14" fill="#8E6C6C" opacity="0.4">Replace with your photo</text>
</svg>`;
  writeFileSync(join(outDir, `photo-${label}.svg`), svg);
}

console.log(`Generated ${PHOTO_COUNT} placeholder photos in public/assets/photos/`);
console.log("Naming: photo-001.svg … photo-108.svg");
console.log("When you add real photos, use photo-001.jpg … photo-108.jpg and set PHOTO_EXTENSION = \".jpg\" in src/data/images.ts");
