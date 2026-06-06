import gsap from "gsap";
import { AnimationManager } from "@/animations/AnimationManager";

export function createEndScreenIntro(
  text: HTMLElement,
  button: HTMLElement
): gsap.core.Timeline {
  const tl = AnimationManager.createTimeline();

  gsap.set([text, button], { opacity: 0, y: 24 });

  tl.fromTo(
    text,
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 1.5, ease: "power3.out" }
  ).fromTo(
    button,
    { opacity: 0, scale: 0.9, y: 16 },
    { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "back.out(1.5)" },
    "-=0.4"
  );

  return tl;
}
