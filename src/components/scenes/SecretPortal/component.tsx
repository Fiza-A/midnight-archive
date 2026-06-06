"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SceneWrapper } from "@/components/scenes/SceneWrapper";
import { AnimatedGradientBackground } from "@/components/effects/VisualEffects";
import { WRONG_CODE_MESSAGES } from "@/data/config";
import { useSafeComplete } from "@/hooks/useSceneCallback";
import { updateDebugState } from "@/utils/debugStore";
import { PORTAL_TEXT } from "./data";
import { createPortalIntro, runHeartReveal } from "./animation";
import { portalStyles } from "./styles";
import { HAS_BACKGROUND_MUSIC } from "@/assets/audio";
import {
  playBackgroundMusic,
  prepareBackgroundMusic,
  unlockBackgroundMusicSync,
} from "@/utils/backgroundMusic";
import { SceneProps } from "@/types";

const REVEAL_TIMEOUT_MS = 10000;

export function SecretPortal({ isActive, onComplete }: SceneProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [revealing, setRevealing] = useState(false);
  const line1Ref = useRef<HTMLParagraphElement>(null);
  const line2Ref = useRef<HTMLParagraphElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cleanupRevealRef = useRef<(() => void) | null>(null);
  const complete = useSafeComplete(onComplete);
  const completeRef = useRef(complete);
  completeRef.current = complete;

  useEffect(() => {
    if (!isActive) return;

    updateDebugState({ currentScene: "secret-portal", timelineState: "portal-intro" });
    const tl = createPortalIntro(line1Ref.current, line2Ref.current);
    tl.call(() => setShowInput(true), undefined, "+=0.5");

    return () => {
      tl.kill();
    };
  }, [isActive]);

  useEffect(() => {
    if (!revealing) return;

    let finished = false;
    let fallbackTimer = 0;

    const finish = () => {
      if (finished) return;
      finished = true;
      window.clearTimeout(fallbackTimer);
      updateDebugState({ timelineState: "portal-complete" });
      completeRef.current();
    };

    fallbackTimer = window.setTimeout(() => {
      updateDebugState({ timelineState: "portal-fallback-timeout" });
      finish();
    }, REVEAL_TIMEOUT_MS);

    cleanupRevealRef.current?.();
    cleanupRevealRef.current = runHeartReveal(
      inputRef.current,
      containerRef.current,
      finish
    );

    return () => {
      window.clearTimeout(fallbackTimer);
      // Do not kill the reveal when the scene deactivates — let the heart finish fading out.
    };
  }, [revealing]);

  useEffect(() => {
    return () => {
      cleanupRevealRef.current?.();
      cleanupRevealRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!isActive || !showInput || !HAS_BACKGROUND_MUSIC) return;
    void prepareBackgroundMusic();
  }, [isActive, showInput]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (revealing) return;

    if (HAS_BACKGROUND_MUSIC) {
      unlockBackgroundMusicSync();
    }

    try {
      const res = await fetch("/api/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();

      if (data.valid) {
        if (HAS_BACKGROUND_MUSIC) {
          await playBackgroundMusic();
        }
        setRevealing(true);
        setError("");
      } else {
        setError(
          WRONG_CODE_MESSAGES[Math.floor(Math.random() * WRONG_CODE_MESSAGES.length)]
        );
      }
    } catch {
      setError("Something went wrong. Try again.");
    }
  };

  return (
    <SceneWrapper sceneId="secret-portal" isActive={isActive}>
      <AnimatedGradientBackground />
      <div ref={containerRef} className={portalStyles.container}>
        <p ref={line1Ref} className={portalStyles.line} style={{ opacity: 0 }}>
          {PORTAL_TEXT.waiting}
        </p>
        <p ref={line2Ref} className={portalStyles.line} style={{ opacity: 0 }}>
          {PORTAL_TEXT.prompt}
        </p>

        <AnimatePresence>
          {showInput && !revealing && (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="flex flex-col items-center gap-3"
            >
              <input
                ref={inputRef}
                type="password"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={PORTAL_TEXT.placeholder}
                className={portalStyles.input}
                aria-label="Secret code"
                autoComplete="off"
              />
              {error && (
                <p className={portalStyles.error} role="alert">
                  {error}
                </p>
              )}
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </SceneWrapper>
  );
}
