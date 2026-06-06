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
  const textRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isActive) return;

    updateDebugState({ currentScene: "end-screen", timelineState: "running" });

    const text = textRef.current;
    const button = buttonRef.current;
    if (!text || !button) return;

    const tl = createEndScreenIntro(text, button);

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
