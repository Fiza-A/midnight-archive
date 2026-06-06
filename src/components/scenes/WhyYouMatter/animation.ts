import gsap from "gsap";
import { AnimationManager } from "@/animations/AnimationManager";

export function createReasonCardsSequence(
  cards: HTMLElement[],
  interval: number,
  onComplete: () => void
): gsap.core.Timeline {
  const tl = AnimationManager.createTimeline({ onComplete });

  cards.forEach((card, i) => {
    const start = i * interval;

    tl.fromTo(
      card,
      { opacity: 0, y: 60, rotateX: -15, scale: 0.9 },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        scale: 1,
        duration: 1.2,
        ease: "power3.out",
      },
      start
    );

    tl.to(
      card,
      { y: -15, duration: 2, repeat: 1, yoyo: true, ease: "sine.inOut" },
      start + 0.5
    );

    if (i < cards.length - 1) {
      tl.to(card, { opacity: 0.3, scale: 0.95, duration: 0.8 }, start + interval - 0.5);
    }
  });

  tl.to({}, { duration: 2 });

  return tl;
}
