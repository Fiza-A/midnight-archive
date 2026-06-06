import { TUNNEL_IMAGES } from "@/data/images";
import { getLoveChapter, getReadingDurationSeconds } from "@/data/loveStory";
import { TunnelMemory } from "@/types";

export const TUNNEL_MEMORIES: TunnelMemory[] = TUNNEL_IMAGES.map((img, i) => {
  const chapter = getLoveChapter(i);
  return {
    ...img,
    date: chapter.date,
    paragraph: chapter.paragraph,
    readingSeconds: getReadingDurationSeconds(chapter.paragraph),
  };
});
