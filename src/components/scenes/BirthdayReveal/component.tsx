"use client";

import { useEffect, useRef } from "react";
import { SceneWrapper } from "@/components/scenes/SceneWrapper";
import { REVEAL_TEXT } from "./data";
import { createBirthdayReveal } from "./animation";
import { revealStyles } from "./styles";
import { useSceneCallback } from "@/hooks/useSceneCallback";
import { updateDebugState } from "@/utils/debugStore";
import { SceneProps } from "@/types";

export function BirthdayReveal({ isActive, onComplete }: SceneProps) {
  const waitRef = useRef<HTMLParagraphElement>(null);
  const oneThingRef = useRef<HTMLParagraphElement>(null);
  const countdownRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const burstRef = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  const complete = useSceneCallback(onComplete);

  useEffect(() => {
    if (!isActive) {
      started.current = false;
      return;
    }
    if (started.current) return;
    started.current = true;

    updateDebugState({ currentScene: "birthday-reveal", timelineState: "running" });
    const tl = createBirthdayReveal(
      {
        wait: waitRef.current,
        oneThing: oneThingRef.current,
        countdown: countdownRef.current,
        title: titleRef.current,
        burstContainer: burstRef.current,
      },
      complete
    );

    return () => {
      tl.kill();
      started.current = false;
    };
  }, [isActive, complete]);

  return (
    <SceneWrapper sceneId="birthday-reveal" isActive={isActive} className={revealStyles.dark}>
      <div className={revealStyles.spotlight} />
      <p ref={waitRef} className={revealStyles.text} style={{ opacity: 0 }}>
        {REVEAL_TEXT.wait}
      </p>
      <p ref={oneThingRef} className={`${revealStyles.text} absolute`} style={{ opacity: 0 }}>
        {REVEAL_TEXT.oneThing}
      </p>
      <p ref={countdownRef} className={revealStyles.countdown} style={{ opacity: 0 }} />
      <h1 ref={titleRef} className={revealStyles.title} style={{ opacity: 0 }}>
        {REVEAL_TEXT.happyBirthday}
      </h1>
      <div ref={burstRef} className={revealStyles.confetti} />
    </SceneWrapper>
  );
}
