import gsap from "gsap";
import { AnimationManager } from "@/animations/AnimationManager";

export function createStarReveal(
  starEl: HTMLElement,
  panelEl: HTMLElement,
  onComplete?: () => void
): gsap.core.Timeline {
  const tl = AnimationManager.createTimeline({ onComplete });

  tl.to(starEl, {
    scale: 2,
    opacity: 0.3,
    duration: 0.5,
    ease: "power2.out",
  }).fromTo(
    panelEl,
    { opacity: 0, scale: 0.5 },
    { opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.5)" }
  );

  return tl;
}

export function createSkyIntro(stars: HTMLElement[]): gsap.core.Timeline {
  const tl = AnimationManager.createTimeline();

  tl.fromTo(
    stars,
    { opacity: 0, scale: 0 },
    {
      opacity: 1,
      scale: 1,
      duration: 0.6,
      stagger: 0.1,
      ease: "back.out(2)",
    }
  );

  stars.forEach((star, i) => {
    tl.to(
      star,
      {
        y: "+=10",
        duration: 1.5 + i * 0.1,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      },
      0
    );
  });

  return tl;
}
