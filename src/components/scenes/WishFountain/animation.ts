import gsap from "gsap";
import { AnimationManager } from "@/animations/AnimationManager";

export function createFountainSequence(
  wishes: HTMLElement[],
  particles: HTMLElement[],
  interval: number,
  onComplete: () => void
): gsap.core.Timeline {
  const tl = AnimationManager.createTimeline({ onComplete });

  wishes.forEach((wish, i) => {
    const start = i * interval;

    tl.fromTo(
      wish,
      { opacity: 0, y: 100, scale: 0.8 },
      {
        opacity: 1,
        y: -80,
        scale: 1,
        duration: 3,
        ease: "power1.out",
      },
      start
    );

    tl.to(wish, { opacity: 0, y: -200, duration: 1.5, ease: "power1.in" }, start + 2.5);
  });

  particles.forEach((p, i) => {
    tl.to(
      p,
      {
        y: -300 - Math.random() * 200,
        opacity: 0,
        duration: 4 + Math.random() * 2,
        repeat: -1,
        ease: "none",
      },
      i * 0.2
    );
  });

  tl.to({}, { duration: 2 });

  return tl;
}
