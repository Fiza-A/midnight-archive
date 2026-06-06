"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { SceneId } from "@/types";
import { SCENES } from "@/data/config";
import { AnimationManager } from "@/animations/AnimationManager";
import { MasterTimeline } from "@/animations/MasterTimeline";

export function useSceneManager(initialScene: SceneId = "loading") {
  const [currentScene, setCurrentScene] = useState<SceneId>(initialScene);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const autoTimerRef = useRef<gsap.core.Tween | null>(null);

  const goToScene = useCallback((sceneId: SceneId) => {
    setIsTransitioning(true);
    setCurrentScene(sceneId);
    requestAnimationFrame(() => setIsTransitioning(false));
  }, []);

  const nextScene = useCallback(() => {
    const idx = SCENES.findIndex((s) => s.id === currentScene);
    if (idx >= 0 && idx < SCENES.length - 1) {
      goToScene(SCENES[idx + 1].id);
    }
  }, [currentScene, goToScene]);

  const resetExperience = useCallback(() => {
    autoTimerRef.current?.kill();
    MasterTimeline.kill();
    AnimationManager.killAll();
    goToScene("secret-portal");
  }, [goToScene]);

  const scheduleAutoAdvance = useCallback(
    (delaySeconds: number, onComplete?: () => void) => {
      autoTimerRef.current?.kill();
      autoTimerRef.current = MasterTimeline.autoAdvance(delaySeconds, () => {
        onComplete?.();
        nextScene();
      });
    },
    [nextScene]
  );

  useEffect(() => {
    return () => {
      autoTimerRef.current?.kill();
      MasterTimeline.kill();
    };
  }, []);

  const sceneConfig = SCENES.find((s) => s.id === currentScene);

  return {
    currentScene,
    sceneConfig,
    isTransitioning,
    goToScene,
    nextScene,
    resetExperience,
    scheduleAutoAdvance,
  };
}
