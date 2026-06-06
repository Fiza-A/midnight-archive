"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { SceneWrapper } from "@/components/scenes/SceneWrapper";
import { AnimatedGradientBackground } from "@/components/effects/VisualEffects";
import { updateDebugState } from "@/utils/debugStore";
import { useSceneCallback } from "@/hooks/useSceneCallback";
import { preloadForScene } from "@/hooks/usePreloader";
import { TUNNEL_MEMORIES } from "./data";
import {
  animateScrapbookIn,
  animateScrapbookOut,
  dissolveParticles,
  floatScrapbook,
  TUNNEL_FADE_IN,
  TUNNEL_FADE_OUT,
  TUNNEL_MIN_HOLD,
} from "./animation";
import { MemoryScrapbookCard } from "./MemoryScrapbookCard";
import { TunnelDecorations } from "./TunnelDecorations";
import { tunnelStyles } from "./styles";
import { SceneProps } from "@/types";

function waitForPaint(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
}

export function MemoryTunnel({ isActive, onComplete }: SceneProps) {
  /** Single source of truth — image, date, and caption all derive from this index */
  const [slideIndex, setSlideIndex] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const runningRef = useRef(false);
  const complete = useSceneCallback(onComplete);

  const slide = TUNNEL_MEMORIES[slideIndex] ?? TUNNEL_MEMORIES[0];
  const total = TUNNEL_MEMORIES.length;

  useEffect(() => {
    if (!isActive) {
      runningRef.current = false;
      setSlideIndex(0);
      return;
    }
    if (runningRef.current) return;
    runningRef.current = true;

    let cancelled = false;

    const run = async () => {
      updateDebugState({ currentScene: "memory-tunnel", timelineState: "tunnel-loading" });
      await preloadForScene("memory-tunnel");
      if (cancelled) return;

      for (let i = 0; i < TUNNEL_MEMORIES.length; i++) {
        if (cancelled) break;

        const item = TUNNEL_MEMORIES[i];

        // 1. Update slide index — image + caption + date change in one React render
        setSlideIndex(i);
        updateDebugState({ timelineState: `tunnel ${i + 1}/${total}` });
        await waitForPaint();

        const card = cardRef.current;
        const photo = photoRef.current;
        const text = textRef.current;
        if (!card || !text) continue;

        gsap.killTweensOf([card, photo, text].filter(Boolean));

        // 2. Enter — photo and text fade in together on the same card
        gsap.set(card, { opacity: 0, visibility: "visible", clearProps: "filter" });
        gsap.set(text, { opacity: 0 });

        await new Promise<void>((resolve) => {
          animateScrapbookIn(card, photo, text, resolve);
        });

        floatScrapbook(card, item.readingSeconds);

        const hold = Math.max(
          TUNNEL_MIN_HOLD,
          item.readingSeconds - TUNNEL_FADE_IN - TUNNEL_FADE_OUT
        );
        await new Promise((r) => setTimeout(r, hold * 1000));

        if (cancelled) break;

        // 3. Exit — photo and text fade out together before next slide
        dissolveParticles(card);
        await animateScrapbookOut(card, text);
      }

      if (!cancelled) {
        updateDebugState({ timelineState: "tunnel-complete" });
        complete();
      }
    };

    void run();

    return () => {
      cancelled = true;
      runningRef.current = false;
      const card = cardRef.current;
      const text = textRef.current;
      if (card) gsap.killTweensOf(card);
      if (text) gsap.killTweensOf(text);
    };
  }, [isActive, complete, total]);

  return (
    <SceneWrapper sceneId="memory-tunnel" isActive={isActive} className="bg-primary">
      <div className={tunnelStyles.scene}>
        <div className={tunnelStyles.bgLayer}>
          <AnimatedGradientBackground />
          <div className={tunnelStyles.bgGlow} />
        </div>

        <TunnelDecorations />

        <div className={tunnelStyles.contentLayer}>
          {slide && (
            <MemoryScrapbookCard
              memory={slide}
              index={slideIndex}
              total={total}
              cardRef={cardRef}
              photoRef={photoRef}
              textRef={textRef}
            />
          )}
        </div>

        <div className={tunnelStyles.vignette} />
      </div>
    </SceneWrapper>
  );
}
