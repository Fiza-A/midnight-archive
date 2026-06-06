import { CONSTELLATION_IMAGES } from "@/data/images";
import { memoryForIndex } from "@/data/constellationMemories";
import { ConstellationStar } from "@/types";

export const CONSTELLATION_STARS: ConstellationStar[] = CONSTELLATION_IMAGES.map(
  (img, i) => ({
    ...img,
    memoryText: memoryForIndex(i),
    x: 0,
    y: 0,
  })
);
