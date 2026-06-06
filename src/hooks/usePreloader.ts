"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AssetManager } from "@/utils/assetManager";
import { LoadingManager } from "@/utils/loadingManager";
import {
  ALL_IMAGES,
  TUNNEL_IMAGES,
  CONSTELLATION_IMAGES,
  HEART_IMAGES,
} from "@/data/images";
import { PreloadProgress } from "@/types";
import { updateDebugState } from "@/utils/debugStore";

/** Fast-start batch — enough for portal + tunnel opening */
const PRIORITY_COUNT = 12;

export function usePreloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState<PreloadProgress>({
    loaded: 0,
    total: PRIORITY_COUNT,
    percentage: 0,
  });
  const [message, setMessage] = useState("Gathering memories...");
  const started = useRef(false);

  const startPreload = useCallback(async () => {
    if (started.current) return;
    started.current = true;

    const prioritySources = TUNNEL_IMAGES.slice(0, PRIORITY_COUNT).map(
      (img) => img.src
    );

    updateDebugState({
      totalImages: ALL_IMAGES.length,
      timelineState: "preloading-priority",
    });

    LoadingManager.startMessageCycle(setMessage);

    await AssetManager.preloadImagesSettled(prioritySources, setProgress);

    LoadingManager.stopMessageCycle();
    setMessage("Ready.");
    setProgress({ loaded: PRIORITY_COUNT, total: PRIORITY_COUNT, percentage: 100 });
    updateDebugState({ timelineState: "ready" });

    await new Promise((r) => setTimeout(r, 600));
    setIsLoading(false);

    // Background: remaining tunnel + constellation + heart photos
    const prioritySet = new Set(prioritySources);
    const rest = ALL_IMAGES.map((img) => img.src).filter((s) => !prioritySet.has(s));
    updateDebugState({ timelineState: "preloading-background" });
    void AssetManager.preloadImagesSettled(rest).then(() => {
      updateDebugState({ timelineState: "idle" });
    });
  }, []);

  useEffect(() => {
    startPreload();
    return () => LoadingManager.stopMessageCycle();
  }, [startPreload]);

  return { isLoading, progress, message };
}

/** Preload images needed for a specific scene before it animates */
export async function preloadForScene(
  scene:
    | "memory-tunnel"
    | "constellation"
    | "photo-heart-finale"
): Promise<void> {
  const map = {
    "memory-tunnel": TUNNEL_IMAGES.map((i) => i.src),
    constellation: CONSTELLATION_IMAGES.map((i) => i.src),
    "photo-heart-finale": HEART_IMAGES.map((i) => i.src),
  };
  await AssetManager.preloadImagesSettled(map[scene]);
}
