import gsap from "gsap";
import { AnimationManager } from "@/animations/AnimationManager";

export function createChestOpen(
  chest: HTMLElement,
  lid: HTMLElement,
  stats: HTMLElement[],
  onComplete: () => void
): gsap.core.Timeline {
  const tl = AnimationManager.createTimeline();

  tl.to(lid, {
    rotateX: -120,
    duration: 1.2,
    ease: "power2.out",
    transformOrigin: "bottom center",
  })
    .fromTo(
      chest,
      { boxShadow: "0 0 20px rgba(245,175,175,0.3)" },
      { boxShadow: "0 0 80px rgba(245,175,175,0.6)", duration: 0.8 },
      "-=0.5"
    )
    .fromTo(
      stats,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.4, ease: "power3.out" }
    )
    .to({}, { duration: 4, onComplete });

  return tl;
}

export function animateCounter(
  element: HTMLElement,
  target: number,
  duration = 2
): gsap.core.Tween {
  const obj = { value: 0 };
  return gsap.to(obj, {
    value: target,
    duration,
    ease: "power2.out",
    onUpdate: () => {
      element.textContent = Math.round(obj.value).toString();
    },
  });
}
