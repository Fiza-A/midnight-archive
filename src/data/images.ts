/**
 * Photos are loaded from whatever images exist in public/assets/photos/
 * (any filename — numbering doesn't matter).
 *
 * After adding or changing photos, run:
 *   npm run sync-photos
 *
 * This rescans the folder and shuffles them into a random order.
 */

import { MemoryImage } from "@/types";
import { PHOTO_MANIFEST, PHOTO_COUNT } from "@/data/photoManifest";

export const PHOTO_FOLDER = "/assets/photos";

function toMemoryImages(sources: string[]): MemoryImage[] {
  return sources.map((src, i) => ({
    id: `memory-${i}-${src.split("/").pop()?.replace(/\.[^.]+$/, "") ?? i}`,
    src,
    alt: `Memory photo ${i + 1}`,
  }));
}

/** All photos in random order */
export const ALL_IMAGES = toMemoryImages(PHOTO_MANIFEST);

/** Memory tunnel — ~42% of photos */
const tunnelCount = Math.max(1, Math.round(PHOTO_COUNT * 0.42));
export const TUNNEL_IMAGES = ALL_IMAGES.slice(0, tunnelCount);

/** Constellation — ~23% of photos (non-overlapping with tunnel) */
const constellationCount = Math.max(1, Math.round(PHOTO_COUNT * 0.23));
export const CONSTELLATION_IMAGES = ALL_IMAGES.slice(
  tunnelCount,
  tunnelCount + constellationCount
);

/** Heart finale — every photo */
export const HEART_IMAGES = ALL_IMAGES;

export const TOTAL_PHOTO_COUNT = PHOTO_COUNT;
