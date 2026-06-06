"use client";

import { useEffect, useRef } from "react";
import { SceneWrapper } from "@/components/scenes/SceneWrapper";
import { LETTER } from "./data";
import { createLetterSequence } from "./animation";
import { letterStyles } from "./styles";
import { useSceneCallback } from "@/hooks/useSceneCallback";
import { updateDebugState } from "@/utils/debugStore";
import { SceneProps } from "@/types";

export function FinalLetter({ isActive, onComplete }: SceneProps) {
  const paperRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const started = useRef(false);
  const complete = useSceneCallback(onComplete);

  const allLines = [
    `Dear ${LETTER.partnerName},`,
    ...LETTER.paragraphs,
    LETTER.closing,
    LETTER.yourName,
  ];

  useEffect(() => {
    if (!isActive) {
      started.current = false;
      return;
    }
    if (started.current || !paperRef.current) return;
    started.current = true;

    updateDebugState({ currentScene: "final-letter", timelineState: "running" });
    const lines = lineRefs.current.filter(Boolean) as HTMLElement[];
    const tl = createLetterSequence(paperRef.current, lines, complete);

    return () => {
      tl.kill();
      started.current = false;
    };
  }, [isActive, complete]);

  return (
    <SceneWrapper sceneId="final-letter" isActive={isActive} className="bg-secondary/50">
      <div
        ref={paperRef}
        className={letterStyles.paper}
        style={{ opacity: 0 }}
        role="article"
        aria-label="Birthday letter"
      >
        {allLines.map((line, i) => (
          <p
            key={i}
            ref={(el) => {
              lineRefs.current[i] = el;
            }}
            data-text={line}
            className={
              i === 0
                ? letterStyles.salutation
                : i >= allLines.length - 2
                  ? letterStyles.signature
                  : letterStyles.paragraph
            }
          />
        ))}
      </div>
    </SceneWrapper>
  );
}
