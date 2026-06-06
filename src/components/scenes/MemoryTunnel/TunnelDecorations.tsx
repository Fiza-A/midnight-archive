"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useReducedMotion } from "@/hooks/useAccessibility";
import { tunnelStyles } from "./styles";

const STICKERS = ["♥", "💕", "💗", "✨", "🌸", "💖", "🩷", "⭐", "💫", "🎀", "💌", "🌺"];

export function TunnelDecorations() {
  const stickerRef = useRef<HTMLDivElement>(null);
  const bokehRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const cleanups: (() => void)[] = [];

    if (stickerRef.current) {
      const container = stickerRef.current;
      for (let i = 0; i < 16; i++) {
        const el = document.createElement("span");
        el.textContent = STICKERS[i % STICKERS.length];
        el.className = "pointer-events-none absolute select-none";
        el.style.fontSize = `${16 + Math.random() * 14}px`;
        el.style.left = `${Math.random() * 100}%`;
        el.style.top = `${Math.random() * 100}%`;
        el.style.opacity = `${0.12 + Math.random() * 0.28}`;
        container.appendChild(el);

        const tween = gsap.to(el, {
          y: "+=40",
          x: "+=20",
          rotation: 360,
          duration: 10 + Math.random() * 8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
        cleanups.push(() => {
          tween.kill();
          el.remove();
        });
      }
    }

    if (bokehRef.current) {
      const container = bokehRef.current;
      for (let i = 0; i < 8; i++) {
        const dot = document.createElement("div");
        dot.className = "absolute rounded-full bg-highlight/20 blur-xl";
        const size = 60 + Math.random() * 100;
        dot.style.width = `${size}px`;
        dot.style.height = `${size}px`;
        dot.style.left = `${Math.random() * 100}%`;
        dot.style.top = `${Math.random() * 100}%`;
        container.appendChild(dot);

        const tween = gsap.to(dot, {
          x: "+=30",
          y: "+=20",
          opacity: 0.35,
          duration: 6 + Math.random() * 4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
        cleanups.push(() => {
          tween.kill();
          dot.remove();
        });
      }
    }

    return () => cleanups.forEach((fn) => fn());
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <>
      <div ref={bokehRef} className={`${tunnelStyles.bgLayer} z-[5]`} aria-hidden="true" />
      <div ref={stickerRef} className={tunnelStyles.stickerLayer} aria-hidden="true" />
    </>
  );
}
