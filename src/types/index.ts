export type SceneId =
  | "loading"
  | "secret-portal"
  | "memory-machine"
  | "memory-tunnel"
  | "constellation"
  | "why-you-matter"
  | "wish-fountain"
  | "time-capsule"
  | "birthday-reveal"
  | "photo-heart-finale"
  | "final-letter"
  | "end-screen";

export interface SceneConfig {
  id: SceneId;
  label: string;
  duration?: number;
  interactive?: boolean;
}

export interface SceneProps {
  isActive: boolean;
  onComplete: () => void;
}

export interface MemoryImage {
  id: string;
  src: string;
  alt: string;
}

export interface CaptionedMemory extends MemoryImage {
  caption: string;
}

export interface TunnelMemory extends MemoryImage {
  date: string;
  paragraph: string;
  readingSeconds: number;
}

export interface ConstellationStar extends MemoryImage {
  memoryText: string;
  x: number;
  y: number;
}

export interface TimeCapsuleStat {
  label: string;
  value: string | number;
  suffix?: string;
  animated?: boolean;
}

export interface PreloadProgress {
  loaded: number;
  total: number;
  percentage: number;
}
