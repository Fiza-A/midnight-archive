"use client";

import { useEffect } from "react";
import { HAS_BACKGROUND_MUSIC } from "@/assets/audio";
import {
  mountYouTubeMusicPlayer,
  prepareBackgroundMusic,
  unmountYouTubeMusicPlayer,
} from "@/utils/backgroundMusic";

/** Mounts a body-level YouTube player outside React's DOM tree */
export function YouTubeMusicPlayer() {
  useEffect(() => {
    if (!HAS_BACKGROUND_MUSIC) return;

    mountYouTubeMusicPlayer();
    void prepareBackgroundMusic();

    return () => {
      unmountYouTubeMusicPlayer();
    };
  }, []);

  return null;
}
