import gsap from "gsap";
import { AnimationManager } from "@/animations/AnimationManager";

export function createHeartFormation(
  photoEls: HTMLElement[],
  positions: { x: number; y: number }[],
  messageEl: HTMLElement | null,
  subtitleEl: HTMLElement | null,
  onComplete: () => void
): gsap.core.Timeline {
  const tl = AnimationManager.createTimeline({ onComplete });

  photoEls.forEach((photo, i) => {
    const pos = positions[i];
    if (!pos) return;

    tl.fromTo(
      photo,
      {
        opacity: 0,
        x: (Math.random() - 0.5) * window.innerWidth,
        y: (Math.random() - 0.5) * window.innerHeight,
        scale: 0,
        rotation: Math.random() * 360,
      },
      {
        opacity: 1,
        x: pos.x - window.innerWidth / 2,
        y: pos.y - window.innerHeight / 2,
        scale: 1,
        rotation: 0,
        duration: 1.5,
        ease: "power3.out",
      },
      i * 0.04
    );
  });

  tl.to({}, { duration: 3 });

  if (messageEl) {
    tl.fromTo(
      messageEl,
      { opacity: 0, scale: 0.8, y: 30 },
      { opacity: 1, scale: 1, y: 0, duration: 1.5, ease: "power3.out" }
    );
  }

  if (subtitleEl) {
    tl.fromTo(
      subtitleEl,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, ease: "power2.out" },
      "-=0.5"
    );
  }

  tl.to({}, { duration: 3 });

  return tl;
}
