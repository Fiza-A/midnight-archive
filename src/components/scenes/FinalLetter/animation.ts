import gsap from "gsap";
import { AnimationManager } from "@/animations/AnimationManager";

function typeLine(line: HTMLElement, text: string): Promise<void> {
  return new Promise((resolve) => {
    line.textContent = "";
    let charIndex = 0;
    const interval = setInterval(() => {
      if (charIndex < text.length) {
        line.textContent += text[charIndex];
        charIndex++;
      } else {
        clearInterval(interval);
        resolve();
      }
    }, 35);
  });
}

export function createLetterSequence(
  paper: HTMLElement,
  lines: HTMLElement[],
  onComplete: () => void
): gsap.core.Timeline {
  const tl = AnimationManager.createTimeline({ onComplete });

  tl.fromTo(
    paper,
    { opacity: 0, y: 50, rotateX: 10 },
    { opacity: 1, y: 0, rotateX: 0, duration: 1.5, ease: "power3.out" }
  );

  lines.forEach((line, i) => {
    const text = line.dataset.text ?? "";
    tl.call(() => {
      typeLine(line, text);
    });
    tl.to({}, { duration: Math.max(1.5, text.length * 0.04) });
  });

  tl.to({}, { duration: 2 });

  return tl;
}
