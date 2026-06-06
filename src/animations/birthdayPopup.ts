import gsap from "gsap";
import { AnimationManager } from "@/animations/AnimationManager";
import { particleBurst } from "@/utils/animations";

export interface BirthdayPopupOptions {
  /** Keep the message on screen instead of fading out */
  hold?: boolean;
  replayButton?: HTMLElement | null;
}

export function createBirthdayPopupTimeline(
  overlay: HTMLElement,
  popup: HTMLElement,
  title: HTMLElement,
  confetti: HTMLElement,
  options?: BirthdayPopupOptions
): gsap.core.Timeline {
  const tl = AnimationManager.createTimeline();
  const { hold = false, replayButton } = options ?? {};

  gsap.set([overlay, popup, title], { opacity: 0, visibility: "visible" });
  gsap.set(popup, { scale: 0.12, y: 80 });
  gsap.set(title, { scale: 0.35, filter: "blur(20px)" });
  if (replayButton) {
    gsap.set(replayButton, { opacity: 0, y: 16, pointerEvents: "none" });
  }

  tl.to(overlay, { opacity: 1, duration: 0.8, ease: "power2.out" })
    .to(
      popup,
      { opacity: 1, scale: 1, y: 0, duration: 1.4, ease: "back.out(2.6)" },
      "-=0.35"
    )
    .to(
      title,
      {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        duration: 1.1,
        ease: "power3.out",
      },
      "-=0.85"
    )
    .call(() => {
      particleBurst(confetti, 80, "#F5AFAF");
      particleBurst(confetti, 50, "#FFFFFF");
      particleBurst(confetti, 35, "#E8C4C4");
    })
    .to(title, {
      scale: 1.07,
      duration: 0.7,
      ease: "sine.inOut",
      yoyo: true,
      repeat: 5,
    });

  if (hold) {
    if (replayButton) {
      tl.to(replayButton, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        onStart: () => {
          replayButton.style.pointerEvents = "auto";
        },
      });
    }
  } else {
    tl.to({}, { duration: 2.5 }).to([overlay, popup, title], {
      opacity: 0,
      duration: 0.9,
      ease: "power2.in",
    });
  }

  return tl;
}
