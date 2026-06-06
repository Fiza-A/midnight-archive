"use client";

import { useEffect, useRef } from "react";
import { SceneWrapper } from "@/components/scenes/SceneWrapper";
import { AnimatedGradientBackground } from "@/components/effects/VisualEffects";
import { MEMORY_MACHINE_COUNTS } from "@/data/config";
import { useSceneCallback } from "@/hooks/useSceneCallback";
import { updateDebugState } from "@/utils/debugStore";
import { createMachineSequence } from "./animation";
import { machineStyles } from "./styles";
import { SceneProps } from "@/types";

export function MemoryMachine({ isActive, onComplete }: SceneProps) {
  const machineRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLParagraphElement>(null);
  const statusRef = useRef<HTMLParagraphElement>(null);
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

    updateDebugState({
      currentScene: "memory-machine",
      timelineState: "machine-running",
    });

    if (statusRef.current) {
      statusRef.current.textContent = "Retrieving memories...";
    }

    const tl = createMachineSequence(
      {
        machine: machineRef.current,
        counter: counterRef.current,
        status: statusRef.current,
        burst: burstRef.current,
      },
      MEMORY_MACHINE_COUNTS,
      () => {
        updateDebugState({ timelineState: "machine-complete" });
        complete();
      }
    );

    return () => {
      tl.kill();
      started.current = false;
    };
  }, [isActive, complete]);

  return (
    <SceneWrapper sceneId="memory-machine" isActive={isActive}>
      <AnimatedGradientBackground />
      <div ref={machineRef} className={machineStyles.machine} style={{ opacity: 0 }}>
        <div className={machineStyles.core} />
        <p ref={counterRef} className={machineStyles.counter} />
      </div>
      <p ref={statusRef} className={`${machineStyles.status} relative z-10`} />
      <div ref={burstRef} className={machineStyles.burst} style={{ opacity: 0 }} />
    </SceneWrapper>
  );
}
