"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { SceneWrapper } from "@/components/scenes/SceneWrapper";
import { generateStarPositions } from "@/utils/math";
import { FALLBACK_IMAGE_SRC } from "@/utils/assetManager";
import { useViewportSize } from "@/hooks/useAccessibility";
import { useSceneCallback } from "@/hooks/useSceneCallback";
import { preloadForScene } from "@/hooks/usePreloader";
import { updateDebugState } from "@/utils/debugStore";
import { CONSTELLATION_STARS } from "./data";
import { createSkyIntro, createStarReveal } from "./animation";
import { constellationStyles } from "./styles";
import { SceneProps } from "@/types";

const COMPLETE_DELAY_MS = 1500;

export function Constellation({ isActive, onComplete }: SceneProps) {
  const { width, height } = useViewportSize();
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [activeStar, setActiveStar] = useState<number | null>(null);
  const starRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);
  const completedRef = useRef(false);
  const complete = useSceneCallback(onComplete);

  const positions = useMemo(
    () => generateStarPositions(CONSTELLATION_STARS.length, width, height),
    [width, height]
  );

  const totalStars = CONSTELLATION_STARS.length;
  const allRevealed = revealed.size >= totalStars;

  useEffect(() => {
    if (!isActive) {
      completedRef.current = false;
      setRevealed(new Set());
      setActiveStar(null);
      return;
    }

    updateDebugState({ currentScene: "constellation", timelineState: "running" });
    void preloadForScene("constellation");

    const stars = starRefs.current.filter(Boolean) as HTMLElement[];
    const tl = createSkyIntro(stars);

    return () => {
      tl.kill();
    };
  }, [isActive]);

  useEffect(() => {
    if (activeStar === null || !isActive) return;

    let cancelled = false;

    const runReveal = () => {
      const starEl = starRefs.current[activeStar];
      const panelEl = panelRef.current;
      if (!starEl || !panelEl || cancelled) return;

      createStarReveal(starEl, panelEl);
    };

    requestAnimationFrame(() => requestAnimationFrame(runReveal));

    return () => {
      cancelled = true;
    };
  }, [activeStar, isActive]);

  useEffect(() => {
    if (!isActive || completedRef.current || !allRevealed) return;

    completedRef.current = true;
    updateDebugState({ timelineState: "constellation-complete" });

    const timer = window.setTimeout(() => {
      complete();
    }, COMPLETE_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [allRevealed, isActive, complete]);

  const handleStarClick = (index: number) => {
    if (revealed.has(index)) return;
    setRevealed((prev) => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });
    setActiveStar(index);
  };

  const activeMemory = activeStar !== null ? CONSTELLATION_STARS[activeStar] : null;

  return (
    <SceneWrapper sceneId="constellation" isActive={isActive}>
      <div className={constellationStyles.sky}>
        {CONSTELLATION_STARS.map((star, i) => (
          <button
            key={star.id}
            ref={(el) => {
              starRefs.current[i] = el;
            }}
            className={constellationStyles.star}
            style={{
              left: positions[i]?.x ?? 0,
              top: positions[i]?.y ?? 0,
              opacity: 0,
            }}
            onClick={() => handleStarClick(i)}
            aria-label={`Star memory ${i + 1}`}
            disabled={revealed.has(i)}
          >
            <span
              className={constellationStyles.starGlow}
              style={{ opacity: revealed.has(i) ? 0.3 : 1 }}
            />
          </button>
        ))}

        <p className={constellationStyles.hint}>
          {allRevealed
            ? "All memories revealed ✨"
            : `Click the stars to reveal memories (${revealed.size}/${totalStars})`}
        </p>

        {activeMemory && (
          <div
            ref={panelRef}
            className={constellationStyles.panel}
            style={{ opacity: 0 }}
            onClick={() => setActiveStar(null)}
          >
            <div className={constellationStyles.panelImage}>
              <Image
                src={activeMemory.src}
                alt={activeMemory.alt}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 288px, 384px"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = FALLBACK_IMAGE_SRC;
                }}
              />
            </div>
            <p className={constellationStyles.panelText}>{activeMemory.memoryText}</p>
          </div>
        )}
      </div>
    </SceneWrapper>
  );
}
