import gsap from "gsap";
import { AnimationManager } from "@/animations/AnimationManager";
import { particleBurst } from "@/utils/animations";

export function createBirthdayReveal(
  elements: {
    wait?: HTMLElement | null;
    oneThing?: HTMLElement | null;
    countdown?: HTMLElement | null;
    title?: HTMLElement | null;
    burstContainer?: HTMLElement | null;
  },
  onComplete: () => void
): gsap.core.Timeline {
  const tl = AnimationManager.createTimeline({ onComplete });

  if (elements.wait) {
    tl.fromTo(elements.wait, { opacity: 0 }, { opacity: 1, duration: 1 });
    tl.to(elements.wait, { opacity: 0, duration: 0.8 }, "+=1.5");
  }

  if (elements.oneThing) {
    tl.fromTo(elements.oneThing, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1 }, "-=0.3");
    tl.to(elements.oneThing, { opacity: 0, duration: 0.8 }, "+=1.5");
  }

  [3, 2, 1].forEach((num) => {
    if (elements.countdown) {
      tl.call(() => {
        if (elements.countdown) {
          elements.countdown.textContent = String(num);
          gsap.fromTo(
            elements.countdown,
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(3)" }
          );
        }
      });
      tl.to({}, { duration: 0.8 });
      tl.to(elements.countdown, { opacity: 0, scale: 1.5, duration: 0.3 });
    }
  });

  if (elements.title) {
    tl.fromTo(
      elements.title,
      { opacity: 0, scale: 0.3, filter: "blur(20px)" },
      {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        duration: 1.5,
        ease: "power3.out",
      }
    );
  }

  if (elements.burstContainer) {
    tl.call(() => {
      particleBurst(elements.burstContainer!, 50, "#F5AFAF");
      particleBurst(elements.burstContainer!, 30, "#FFFFFF");
    });
  }

  tl.to({}, { duration: 3 });

  return tl;
}
