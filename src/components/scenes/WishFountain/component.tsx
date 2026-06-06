"use client";

import { useEffect, useRef } from "react";
import { SceneWrapper } from "@/components/scenes/SceneWrapper";
import { AnimatedGradientBackground } from "@/components/effects/VisualEffects";
import { createBirthdayPopupTimeline } from "@/animations/birthdayPopup";
import { birthdayPopupStyles } from "@/components/effects/birthdayPopupStyles";
import { BIRTHDAY_POPUP_TEXT } from "@/data/birthdayPopup";
import { END_TEXT } from "@/components/scenes/EndScreen/data";
import { WISHES, WISH_INTERVAL } from "./data";
import { createFountainSequence } from "./animation";
import { fountainStyles } from "./styles";
import { updateDebugState } from "@/utils/debugStore";
import { SceneProps } from "@/types";

interface WishFountainProps extends SceneProps {
  onReplay: () => void;
}

export function WishFountain({ isActive, onReplay }: WishFountainProps) {
  const wishRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const particleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const overlayRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const confettiRef = useRef<HTMLDivElement>(null);
  const replayRef = useRef<HTMLButtonElement>(null);
  const started = useRef(false);

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
    const overlay = overlayRef.current;
    const popup = popupRef.current;
    const title = titleRef.current;
    const confetti = confettiRef.current;
    const replay = replayRef.current;

    const finale =
      overlay && popup && title && confetti
        ? createBirthdayPopupTimeline(overlay, popup, title, confetti, {
            hold: true,
            replayButton: replay,
          })
        : undefined;

    const tl = createFountainSequence(wishes, particles, WISH_INTERVAL, finale);

    if (finale) {
      tl.call(() => {
        updateDebugState({ timelineState: "birthday-finale" });
      }, undefined, Math.max(0, (wishes.length - 1) * WISH_INTERVAL + 2.5));
    }

    return () => {
      tl.kill();
      started.current = false;
    };
  }, [isActive]);

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

      <div ref={confettiRef} className={birthdayPopupStyles.confetti} aria-hidden="true" />

      <div
        ref={overlayRef}
        className={birthdayPopupStyles.overlay}
        style={{ opacity: 0, visibility: "hidden" }}
      >
        <div ref={popupRef} className={birthdayPopupStyles.popup} style={{ opacity: 0 }}>
          <h1 ref={titleRef} className={birthdayPopupStyles.title} style={{ opacity: 0 }}>
            {BIRTHDAY_POPUP_TEXT}
          </h1>
          <button
            ref={replayRef}
            type="button"
            className={birthdayPopupStyles.replay}
            style={{ opacity: 0 }}
            onClick={onReplay}
            aria-label={END_TEXT.replay}
          >
            {END_TEXT.replay}
          </button>
        </div>
      </div>
    </SceneWrapper>
  );
}
