import gsap from "gsap";
import { AnimationManager } from "@/animations/AnimationManager";

export function createMachineSequence(
  elements: {
    machine?: HTMLElement | null;
    counter?: HTMLElement | null;
    status?: HTMLElement | null;
    burst?: HTMLElement | null;
  },
  counts: number[],
  onComplete: () => void
): gsap.core.Timeline {
  const tl = AnimationManager.createTimeline({ onComplete });

  if (elements.machine) {
    tl.fromTo(
      elements.machine,
      { scale: 0.5, opacity: 0, rotateY: -30 },
      { scale: 1, opacity: 1, rotateY: 0, duration: 1.5, ease: "power3.out" }
    );
  }

  if (elements.status) {
    tl.fromTo(elements.status, { opacity: 0 }, { opacity: 1, duration: 0.5 });
  }

  counts.forEach((count, i) => {
    tl.call(() => {
      if (elements.counter) {
        elements.counter.textContent = `${count} memories found...`;
      }
    });
    tl.to({}, { duration: i === counts.length - 1 ? 1 : 0.55 });
  });

  if (elements.status) {
    tl.call(() => {
      if (elements.status) elements.status.textContent = "Preparing birthday surprise...";
    });
  }

  tl.to({}, { duration: 1 });

  if (elements.machine) {
    tl.to(elements.machine, {
      scale: 1.05,
      duration: 0.25,
      repeat: 3,
      yoyo: true,
      ease: "power1.inOut",
    });
  }

  if (elements.burst) {
    tl.fromTo(
      elements.burst,
      { scale: 0, opacity: 0 },
      { scale: 4, opacity: 1, duration: 1, ease: "power2.out" }
    ).to(elements.burst, { opacity: 0, duration: 0.5 });
  }

  return tl;
}
