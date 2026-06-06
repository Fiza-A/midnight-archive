"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { SceneWrapper } from "@/components/scenes/SceneWrapper";
import { AnimatedGradientBackground } from "@/components/effects/VisualEffects";
import { useSceneCallback } from "@/hooks/useSceneCallback";
import { updateDebugState } from "@/utils/debugStore";
import { TIME_CAPSULE_STATS, CHEST_PROMPT } from "./data";
import { createChestOpen, animateCounter } from "./animation";
import { capsuleStyles } from "./styles";
import { SceneProps } from "@/types";

const AUTO_OPEN_MS = 60000;

export function TimeCapsule({ isActive, onComplete }: SceneProps) {
  const [opened, setOpened] = useState(false);
  const chestRef = useRef<HTMLDivElement>(null);
  const lidRef = useRef<HTMLDivElement>(null);
  const statRowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const statValueRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const completedRef = useRef(false);
  const complete = useSceneCallback(onComplete);

  useEffect(() => {
    if (!isActive) {
      completedRef.current = false;
      setOpened(false);
      return;
    }

    updateDebugState({ currentScene: "time-capsule", timelineState: "waiting" });
    const timer = window.setTimeout(() => {
      if (!completedRef.current && !opened) {
        handleOpen();
      }
    }, AUTO_OPEN_MS);

    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

  const finishScene = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    updateDebugState({ timelineState: "capsule-complete" });
    window.setTimeout(complete, 1500);
  };

  const handleOpen = () => {
    if (opened || !chestRef.current || !lidRef.current) return;
    setOpened(true);
    updateDebugState({ timelineState: "capsule-open" });

    const statRows = statRowRefs.current.filter(Boolean) as HTMLElement[];

    createChestOpen(chestRef.current, lidRef.current, statRows, finishScene);

    TIME_CAPSULE_STATS.forEach((stat, i) => {
      const el = statValueRefs.current[i];
      if (el && stat.animated && typeof stat.value === "number") {
        animateCounter(el, stat.value);
      } else if (el) {
        el.textContent = String(stat.value);
      }
    });
  };

  return (
    <SceneWrapper sceneId="time-capsule" isActive={isActive}>
      <AnimatedGradientBackground />
      <div className="relative z-10 flex flex-col items-center justify-center px-6">
        <div
          ref={chestRef}
          className={capsuleStyles.chest}
          onClick={handleOpen}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && handleOpen()}
          aria-label={CHEST_PROMPT}
        >
          <div ref={lidRef} className={capsuleStyles.lid} style={{ transformStyle: "preserve-3d" }} />
          <div className={capsuleStyles.body}>
            {!opened && (
              <motion.p
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="font-display text-lg text-text-primary"
              >
                {CHEST_PROMPT}
              </motion.p>
            )}
          </div>
        </div>

        {opened && (
          <div className={capsuleStyles.stats}>
            {TIME_CAPSULE_STATS.map((stat, i) => (
              <div
                key={stat.label}
                ref={(el) => {
                  statRowRefs.current[i] = el;
                }}
                className={capsuleStyles.statRow}
                style={{ opacity: 0 }}
              >
                <span className={capsuleStyles.statLabel}>{stat.label}</span>
                <span
                  ref={(el) => {
                    statValueRefs.current[i] = el;
                  }}
                  className={capsuleStyles.statValue}
                >
                  {stat.animated ? "0" : stat.value}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </SceneWrapper>
  );
}
