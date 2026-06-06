"use client";

import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";
import { SceneWrapper } from "@/components/scenes/SceneWrapper";
import { AnimatedGradientBackground } from "@/components/effects/VisualEffects";
import { heartPositions } from "@/utils/math";
import { FALLBACK_IMAGE_SRC } from "@/utils/assetManager";
import { useViewportSize } from "@/hooks/useAccessibility";
import { useSceneCallback } from "@/hooks/useSceneCallback";
import { preloadForScene } from "@/hooks/usePreloader";
import { updateDebugState } from "@/utils/debugStore";
import { HEART_IMAGES } from "./data";
import { createHeartFormation } from "./animation";
import { heartFinaleStyles } from "./styles";
import { SceneProps } from "@/types";

export function PhotoHeartFinale({ isActive, onComplete }: SceneProps) {
  const { width, height } = useViewportSize();
  const photoRefs = useRef<(HTMLDivElement | null)[]>([]);
  const messageRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const started = useRef(false);
  const complete = useSceneCallback(onComplete);

  const positions = useMemo(
    () => heartPositions(HEART_IMAGES.length, width, height, 0.12),
    [width, height]
  );

  useEffect(() => {
    if (!isActive) {
      started.current = false;
      return;
    }
    if (started.current) return;

    let tl: gsap.core.Timeline | null = null;
    let cancelled = false;

    const run = async () => {
      started.current = true;
      updateDebugState({ currentScene: "photo-heart-finale", timelineState: "heart-loading" });
      await preloadForScene("photo-heart-finale");
      if (cancelled) return;

      updateDebugState({ timelineState: "heart-running" });
      const photos = photoRefs.current.filter(Boolean) as HTMLElement[];
      tl = createHeartFormation(
        photos,
        positions,
        messageRef.current,
        subtitleRef.current,
        complete
      );
    };

    void run();

    return () => {
      cancelled = true;
      tl?.kill();
      started.current = false;
    };
  }, [isActive, complete, positions]);

  return (
    <SceneWrapper sceneId="photo-heart-finale" isActive={isActive}>
      <AnimatedGradientBackground />
      <div className={heartFinaleStyles.container}>
        {HEART_IMAGES.map((img, i) => (
          <div
            key={img.id}
            ref={(el) => {
              photoRefs.current[i] = el;
            }}
            className={heartFinaleStyles.photo}
            style={{
              left: "50%",
              top: "50%",
              opacity: 0,
              transform: "translate(-50%, -50%)",
            }}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-contain"
              sizes="72px"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = FALLBACK_IMAGE_SRC;
              }}
            />
          </div>
        ))}

        <h2 ref={messageRef} className={heartFinaleStyles.message} style={{ opacity: 0 }}>
          Happy Birthday ❤️
        </h2>
        <p ref={subtitleRef} className={heartFinaleStyles.subtitle} style={{ opacity: 0 }}>
          My Favorite Person
        </p>
      </div>
    </SceneWrapper>
  );
}
