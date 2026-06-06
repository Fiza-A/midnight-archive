"use client";

import { useCallback, useEffect, useState } from "react";
import { usePreloader } from "@/hooks/usePreloader";
import { useSceneManager } from "@/hooks/useSceneManager";
import { initGSAP } from "@/utils/animations";
import { updateDebugState } from "@/utils/debugStore";
import { LoadingScreen } from "@/components/loading/LoadingScreen";
import { ParticleSystem } from "@/components/particles/ParticleSystem";
import { HeartCursor } from "@/components/cursor/HeartCursor";
import { BloomOverlay, GlowLights } from "@/components/effects/VisualEffects";
import { DebugOverlay } from "@/components/debug/DebugOverlay";
import { SecretPortal } from "@/components/scenes/SecretPortal/component";
import { MemoryMachine } from "@/components/scenes/MemoryMachine/component";
import { MemoryTunnel } from "@/components/scenes/MemoryTunnel/component";
import { Constellation } from "@/components/scenes/Constellation/component";
import { WhyYouMatter } from "@/components/scenes/WhyYouMatter/component";
import { WishFountain } from "@/components/scenes/WishFountain/component";
import { TimeCapsule } from "@/components/scenes/TimeCapsule/component";
import { BirthdayReveal } from "@/components/scenes/BirthdayReveal/component";
import { PhotoHeartFinale } from "@/components/scenes/PhotoHeartFinale/component";
import { FinalLetter } from "@/components/scenes/FinalLetter/component";
import { EndScreen } from "@/components/scenes/EndScreen/component";
import { AudioControls } from "@/components/audio/AudioControls";
import { HAS_BACKGROUND_MUSIC } from "@/assets/audio";
import { resetBackgroundMusic } from "@/utils/backgroundMusic";
import { SceneId } from "@/types";

export function BirthdayExperience() {
  const { isLoading, progress, message } = usePreloader();
  const [experienceKey, setExperienceKey] = useState(0);
  const { currentScene, goToScene, nextScene, resetExperience } =
    useSceneManager("loading");

  useEffect(() => {
    initGSAP();
    updateDebugState({
      audioStatus: HAS_BACKGROUND_MUSIC ? "ready" : "disabled",
    });
  }, []);

  useEffect(() => {
    if (!isLoading && currentScene === "loading") {
      goToScene("secret-portal");
    }
  }, [isLoading, currentScene, goToScene]);

  useEffect(() => {
    updateDebugState({ currentScene });
  }, [currentScene]);

  const goTo = useCallback(
    (scene: SceneId) => () => goToScene(scene),
    [goToScene]
  );

  const handleReplay = useCallback(() => {
    resetBackgroundMusic();
    resetExperience();
    setExperienceKey((k) => k + 1);
  }, [resetExperience]);

  if (isLoading) {
    return <LoadingScreen message={message} progress={progress.percentage} />;
  }

  return (
    <main
      key={experienceKey}
      className="fixed inset-0 h-[100dvh] w-full overflow-hidden bg-primary"
      role="application"
      aria-label="Birthday experience"
    >
      <ParticleSystem count={50} />
      <BloomOverlay />
      <GlowLights />
      <HeartCursor />
      <AudioControls />
      <DebugOverlay />

      <SecretPortal isActive={currentScene === "secret-portal"} onComplete={goTo("memory-machine")} />
      <MemoryMachine isActive={currentScene === "memory-machine"} onComplete={goTo("memory-tunnel")} />
      <MemoryTunnel isActive={currentScene === "memory-tunnel"} onComplete={goTo("constellation")} />
      <Constellation isActive={currentScene === "constellation"} onComplete={goTo("why-you-matter")} />
      <WhyYouMatter isActive={currentScene === "why-you-matter"} onComplete={goTo("wish-fountain")} />
      <WishFountain isActive={currentScene === "wish-fountain"} onComplete={goTo("time-capsule")} />
      <TimeCapsule isActive={currentScene === "time-capsule"} onComplete={goTo("birthday-reveal")} />
      <BirthdayReveal isActive={currentScene === "birthday-reveal"} onComplete={goTo("photo-heart-finale")} />
      <PhotoHeartFinale isActive={currentScene === "photo-heart-finale"} onComplete={goTo("final-letter")} />
      <FinalLetter isActive={currentScene === "final-letter"} onComplete={goTo("end-screen")} />
      <EndScreen isActive={currentScene === "end-screen"} onComplete={nextScene} onReplay={handleReplay} />

      <button
        className="fixed bottom-4 right-4 z-50 text-xs text-text-secondary/20 transition-opacity hover:text-highlight/60 focus:outline-none"
        onClick={() => {
          const el = document.createElement("div");
          el.textContent = "I love you ♥";
          el.className =
            "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] font-display text-2xl text-highlight animate-pulse";
          document.body.appendChild(el);
          setTimeout(() => el.remove(), 3000);
        }}
        aria-label="Hidden surprise"
        tabIndex={-1}
      >
        ♥
      </button>
    </main>
  );
}
