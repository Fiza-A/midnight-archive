import { SceneProps } from "@/types";

export const sceneBase =
  "fixed inset-0 w-full h-full overflow-hidden flex items-center justify-center";

export const sceneHidden = "opacity-0 pointer-events-none invisible";

export const sceneVisible = "opacity-100 pointer-events-auto visible";

export function getSceneClassName(isActive: boolean): string {
  return `${sceneBase} transition-opacity duration-300 ${
    isActive ? `${sceneVisible} z-30` : `${sceneHidden} z-0`
  }`;
}

export const textCinematic =
  "font-display text-text-primary tracking-wide text-center";

export const textGlow = "drop-shadow-[0_0_20px_rgba(245,175,175,0.4)]";

export const cardStyle =
  "rounded-2xl bg-secondary/80 backdrop-blur-md border border-accent/30 shadow-lg";

export type BaseSceneProps = SceneProps;
