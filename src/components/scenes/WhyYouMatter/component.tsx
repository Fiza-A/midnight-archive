"use client";

import { useEffect, useRef } from "react";
import { SceneWrapper } from "@/components/scenes/SceneWrapper";
import { AnimatedGradientBackground, GlowLights } from "@/components/effects/VisualEffects";
import { REASONS, CARD_INTERVAL } from "./data";
import { createReasonCardsSequence } from "./animation";
import { matterStyles } from "./styles";
import { useSceneCallback } from "@/hooks/useSceneCallback";
import { updateDebugState } from "@/utils/debugStore";
import { SceneProps } from "@/types";

export function WhyYouMatter({ isActive, onComplete }: SceneProps) {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const started = useRef(false);
  const complete = useSceneCallback(onComplete);

  useEffect(() => {
    if (!isActive) {
      started.current = false;
      return;
    }
    if (started.current) return;
    started.current = true;

    updateDebugState({ currentScene: "why-you-matter", timelineState: "running" });
    const cards = cardRefs.current.filter(Boolean) as HTMLElement[];
    const tl = createReasonCardsSequence(cards, CARD_INTERVAL, complete);

    return () => {
      tl.kill();
      started.current = false;
    };
  }, [isActive, complete]);

  return (
    <SceneWrapper sceneId="why-you-matter" isActive={isActive}>
      <AnimatedGradientBackground />
      <GlowLights />
      <div className="relative z-10 flex h-full w-full items-center justify-center px-6">
        {REASONS.map((reason, i) => (
          <div
            key={i}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            className={`${matterStyles.card} absolute`}
            style={{ opacity: 0 }}
          >
            <p className={matterStyles.text}>{reason}</p>
          </div>
        ))}
      </div>
    </SceneWrapper>
  );
}
