"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useReducedMotion } from "@/hooks/useAccessibility";

const STICKERS = ["♥", "💕", "💗", "✨", "🌸", "💖", "🩷", "⭐", "💫", "🎀"];

interface Sticker {
  el: HTMLSpanElement;
  x: number;
  y: number;
  speed: number;
  drift: number;
}

export function FloatingLoveStickers() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !containerRef.current) return;

    const container = containerRef.current;
    const count = 18;
    const stickers: Sticker[] = [];

    for (let i = 0; i < count; i++) {
      const el = document.createElement("span");
      el.textContent = STICKERS[i % STICKERS.length];
      el.className = "pointer-events-none absolute select-none opacity-0";
      el.style.fontSize = `${14 + Math.random() * 18}px`;
      el.style.filter = "drop-shadow(0 0 8px rgba(245,175,175,0.5))";
      container.appendChild(el);

      const x = Math.random() * 100;
      const y = Math.random() * 100;
      gsap.set(el, { left: `${x}%`, top: `${y}%`, opacity: 0.15 + Math.random() * 0.35 });
      gsap.to(el, {
        y: `+=${30 + Math.random() * 40}`,
        x: `+=${-20 + Math.random() * 40}`,
        rotation: Math.random() * 360,
        duration: 8 + Math.random() * 10,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      stickers.push({ el, x, y, speed: 1, drift: 1 });
    }

    return () => {
      stickers.forEach(({ el }) => el.remove());
    };
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
      aria-hidden="true"
    />
  );
}
