import gsap from "gsap";
import { AnimationManager } from "@/animations/AnimationManager";
import { particleBurst } from "@/utils/animations";

export function createEndScreenIntro(
  overlay: HTMLElement,
  popup: HTMLElement,
  title: HTMLElement,
  confetti: HTMLElement,
  footerText: HTMLElement,
  button: HTMLElement
): gsap.core.Timeline {
  const tl = AnimationManager.createTimeline();

  gsap.set([overlay, popup, title, footerText, button], { opacity: 0 });
  gsap.set(popup, { scale: 0.2, y: 40 });
  gsap.set(title, { scale: 0.5, filter: "blur(12px)" });

  tl.to(overlay, { opacity: 1, duration: 0.6, ease: "power2.out" })
    .to(
      popup,
      { opacity: 1, scale: 1, y: 0, duration: 1.1, ease: "back.out(2.2)" },
      "-=0.2"
    )
    .to(
      title,
      {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        duration: 0.9,
        ease: "power3.out",
      },
      "-=0.65"
    )
    .call(() => {
      particleBurst(confetti, 60, "#F5AFAF");
      particleBurst(confetti, 40, "#FFFFFF");
      particleBurst(confetti, 25, "#E8C4C4");
    })
    .to(title, {
      scale: 1.04,
      duration: 0.8,
      ease: "sine.inOut",
      yoyo: true,
      repeat: 3,
    })
    .to({}, { duration: 1.2 })
    .to(popup, { scale: 0.92, duration: 0.5, ease: "power2.inOut" })
    .fromTo(
      footerText,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
      "-=0.2"
    )
    .fromTo(
      button,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.5)" },
      "-=0.5"
    );

  return tl;
}
