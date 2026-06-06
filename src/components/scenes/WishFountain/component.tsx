"use client";

import { useEffect, useRef } from "react";
import { SceneWrapper } from "@/components/scenes/SceneWrapper";
import { AnimatedGradientBackground } from "@/components/effects/VisualEffects";
import { WISHES, WISH_INTERVAL } from "./data";
import { createFountainSequence } from "./animation";
import { fountainStyles } from "./styles";
import { useSceneCallback } from "@/hooks/useSceneCallback";
import { updateDebugState } from "@/utils/debugStore";
import { SceneProps } from "@/types";

export function WishFountain({ isActive, onComplete }: SceneProps) {
  const wishRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const particleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const started = useRef(false);
  const complete = useSceneCallback(onComplete);

  useEffect(() => {
    if (!isActive) {
      started.current = false;
      return;
    }
    if (started.current) return;
    started.current = true;

    updateDebugState({ currentScene: "wish-fountain", timelineState: "running" });
    const wishes = wishRefs.current.filter(Boolean) as HTMLElement[];
    const particles = particleRefs.current.filter(Boolean) as HTMLElement[];
    const tl = createFountainSequence(wishes, particles, WISH_INTERVAL, complete);

    return () => {
      tl.kill();
      started.current = false;
    };
  }, [isActive, complete]);

  return (
    <SceneWrapper sceneId="wish-fountain" isActive={isActive}>
      <AnimatedGradientBackground />
      <div className="relative z-10 h-full w-full">
        <div className={fountainStyles.base} />
        <div className={fountainStyles.pool} />

        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={`p-${i}`}
            ref={(el) => {
              particleRefs.current[i] = el;
            }}
            className={fountainStyles.particle}
            style={{ left: `${40 + ((i * 17) % 20)}%` }}
          />
        ))}

        {WISHES.map((wish, i) => (
          <p
            key={i}
            ref={(el) => {
              wishRefs.current[i] = el;
            }}
            className={fountainStyles.wish}
            style={{ opacity: 0 }}
          >
            {wish}
          </p>
        ))}
      </div>
    </SceneWrapper>
  );
}
