import { SceneConfig } from "@/types";
import { TOTAL_PHOTO_COUNT } from "@/data/images";

export const SCENES: SceneConfig[] = [
  { id: "loading", label: "Loading", duration: 0 },
  { id: "secret-portal", label: "Secret Portal", interactive: true },
  { id: "memory-machine", label: "Memory Machine", duration: 12 },
  { id: "memory-tunnel", label: "Memory Tunnel", duration: 185 },
  { id: "constellation", label: "Constellation", interactive: true },
  { id: "why-you-matter", label: "Why You Matter", duration: 40 },
  { id: "wish-fountain", label: "Wish Fountain", duration: 35 },
  { id: "time-capsule", label: "Time Capsule", interactive: true },
  { id: "birthday-reveal", label: "Birthday Reveal", duration: 25 },
  { id: "photo-heart-finale", label: "Photo Heart", duration: 45 },
  { id: "final-letter", label: "Final Letter", duration: 60 },
  { id: "end-screen", label: "End", interactive: true },
];

export const LOADING_MESSAGES = [
  "Gathering memories...",
  "Polishing surprises...",
  "Preparing happiness...",
  "Almost ready...",
];

export const WRONG_CODE_MESSAGES = [
  "Not quite ❤️",
  "Think about one of our favorite memories.",
  "Try again, my love.",
  "That wasn't our secret...",
  "Hint: something only we would know.",
];

export const MEMORY_MACHINE_COUNTS = [
  1,
  Math.max(2, Math.round(TOTAL_PHOTO_COUNT * 0.11)),
  Math.max(5, Math.round(TOTAL_PHOTO_COUNT * 0.33)),
  Math.max(10, Math.round(TOTAL_PHOTO_COUNT * 0.67)),
  TOTAL_PHOTO_COUNT,
];

export const RELATIONSHIP_START =
  process.env.NEXT_PUBLIC_RELATIONSHIP_START ?? "2023-01-15";

export function getDaysTogether(): number {
  const start = new Date(RELATIONSHIP_START);
  const now = new Date();
  const diff = now.getTime() - start.getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

export const TIME_CAPSULE_STATS = [
  { label: "Photos Collected", value: TOTAL_PHOTO_COUNT, animated: true },
  { label: "Days We've Known Each Other", value: getDaysTogether(), animated: true },
  { label: "Favorite Person Level", value: "Infinite", animated: false },
  { label: "Arguments Won By Me", value: "100%", animated: false },
];
