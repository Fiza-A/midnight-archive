"use client";

import { useEffect, useRef } from "react";
import { SceneWrapper } from "@/components/scenes/SceneWrapper";
import { AnimatedGradientBackground } from "@/components/effects/VisualEffects";
import { updateDebugState } from "@/utils/debugStore";
import { END_TEXT } from "./data";
import { createEndScreenIntro } from "./animation";
import { endStyles } from "./styles";
import { SceneProps } from "@/types";

interface EndScreenProps extends SceneProps {
  onReplay: () => void;
}

export function EndScreen({ isActive, onReplay }: EndScreenProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const confettiRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isActive) return;

    updateDebugState({ currentScene: "end-screen", timelineState: "birthday-popup" });

    const overlay = overlayRef.current;
    const popup = popupRef.current;
    const title = titleRef.current;
    const confetti = confettiRef.current;
    const footerText = textRef.current;
    const button = buttonRef.current;

    if (!overlay || !popup || !title || !confetti || !footerText || !button) return;

    const tl = createEndScreenIntro(overlay, popup, title, confetti, footerText, button);

    tl.call(() => {
      updateDebugState({ timelineState: "end-complete" });
    });

    return () => {
      tl.kill();
    };
  }, [isActive]);

  return (
    <SceneWrapper sceneId="end-screen" isActive={isActive}>
      <AnimatedGradientBackground />

      <div ref={confettiRef} className={endStyles.confetti} aria-hidden="true" />

      <div ref={overlayRef} className={endStyles.overlay} style={{ opacity: 0 }}>
        <div ref={popupRef} className={endStyles.popup} style={{ opacity: 0 }}>
          <h1 ref={titleRef} className={endStyles.popupTitle} style={{ opacity: 0 }}>
            {END_TEXT.birthdayPopup}
          </h1>
        </div>
      </div>

      <div className={endStyles.footer}>
        <p ref={textRef} className={endStyles.text} style={{ opacity: 0 }}>
          {END_TEXT.thankYou}
        </p>
        <button
          ref={buttonRef}
          className={endStyles.button}
          style={{ opacity: 0 }}
          onClick={onReplay}
          aria-label={END_TEXT.replay}
        >
          {END_TEXT.replay}
        </button>
      </div>
    </SceneWrapper>
  );
}
