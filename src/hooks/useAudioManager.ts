"use client";

import { useCallback, useEffect, useState } from "react";
import { updateDebugState, debugWarn } from "@/utils/debugStore";
import {
  getBackgroundMusicState,
  playBackgroundMusic,
  stopBackgroundMusic,
  subscribeBackgroundMusic,
  toggleBackgroundMusic,
} from "@/utils/backgroundMusic";

interface AudioState {
  musicEnabled: boolean;
  musicAvailable: boolean;
  musicUnlocked: boolean;
  loadError: "missing" | "blocked" | null;
  resolvedSrc: string | null;
  sfxEnabled: boolean;
  musicVolume: number;
  sfxVolume: number;
}

export function useAudioManager() {
  const [state, setState] = useState<AudioState>(() => ({
    ...getBackgroundMusicState(),
    sfxEnabled: true,
    musicVolume: 0.35,
    sfxVolume: 0.5,
  }));

  useEffect(() => {
    return subscribeBackgroundMusic(() => {
      setState((prev) => ({ ...prev, ...getBackgroundMusicState() }));
    });
  }, []);

  const playMusic = useCallback(async () => {
    await playBackgroundMusic();
  }, []);

  const stopMusic = useCallback(() => {
    stopBackgroundMusic();
  }, []);

  const playSfx = useCallback(
    async (src?: string) => {
      if (!src?.trim() || !state.sfxEnabled) return;

      try {
        const sfx = new Audio(src);
        sfx.volume = state.sfxVolume;
        sfx.preload = "none";

        const ok = await new Promise<boolean>((resolve) => {
          sfx.addEventListener("canplaythrough", () => resolve(true), { once: true });
          sfx.addEventListener("error", () => resolve(false), { once: true });
          sfx.load();
        });

        if (ok) await sfx.play();
      } catch {
        debugWarn("SFX failed — continuing");
      }
    },
    [state.sfxEnabled, state.sfxVolume]
  );

  const toggleMusic = useCallback(async () => {
    await toggleBackgroundMusic();
  }, []);

  return {
    ...state,
    playMusic,
    stopMusic,
    playSfx,
    toggleMusic,
  };
}

export { playBackgroundMusic, stopBackgroundMusic, toggleBackgroundMusic };
