"use client";

import { useEffect, useState } from "react";
import { DEBUG, debugState, subscribeDebug } from "@/utils/debugStore";

export function DebugOverlay() {
  const [, tick] = useState(0);

  useEffect(() => {
    if (!DEBUG) return;
    return subscribeDebug(() => tick((n) => n + 1));
  }, []);

  if (!DEBUG) return null;

  return (
    <div
      className="fixed bottom-4 left-4 z-[9998] max-w-xs rounded-lg border border-accent/40 bg-black/75 p-3 font-mono text-[10px] leading-relaxed text-white/90 backdrop-blur-sm"
      aria-hidden="true"
    >
      <p className="mb-1 font-bold text-highlight">DEBUG</p>
      <p>Scene: {debugState.currentScene}</p>
      <p>
        Images: {debugState.loadedImages}/{debugState.totalImages} loaded
      </p>
      <p>Failed: {debugState.failedImages.length}</p>
      <p>Audio: {debugState.audioStatus}</p>
      <p>Timeline: {debugState.timelineState}</p>
      {debugState.lastError && (
        <p className="mt-1 text-red-300">Err: {debugState.lastError}</p>
      )}
    </div>
  );
}
