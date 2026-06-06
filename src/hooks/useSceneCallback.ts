"use client";

import { useCallback, useRef } from "react";

/** Stable callback ref — prevents GSAP effect cleanup when parent re-renders */
export function useSceneCallback(onComplete: () => void): () => void {
  const ref = useRef(onComplete);
  ref.current = onComplete;

  return useCallback(() => {
    ref.current();
  }, []);
}

/** Guard against double-firing scene completion */
export function useSafeComplete(onComplete: () => void): () => void {
  const ref = useRef(onComplete);
  ref.current = onComplete;
  const fired = useRef(false);

  return useCallback(() => {
    if (fired.current) return;
    fired.current = true;
    ref.current();
  }, []);
}

export function resetSafeComplete(fired: React.MutableRefObject<boolean>): void {
  fired.current = false;
}
