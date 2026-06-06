import gsap from "gsap";
import { AnimationManager } from "@/animations/AnimationManager";

const MS_PER_CHAR = 35;

function typeLine(line: HTMLElement, text: string): Promise<void> {
  return new Promise((resolve) => {
    line.textContent = "";
    if (!text) {
      resolve();
      return;
    }

    let charIndex = 0;
    const interval = window.setInterval(() => {
      if (charIndex < text.length) {
        line.textContent += text[charIndex];
        charIndex++;
      } else {
        window.clearInterval(interval);
        resolve();
      }
    }, MS_PER_CHAR);
  });
}

function typingDuration(text: string): number {
  return Math.max(0.9, (text.length * MS_PER_CHAR) / 1000 + 0.45);
}

export function createLetterSequence(
  paper: HTMLElement,
  lines: HTMLElement[]
): gsap.core.Timeline {
  const tl = AnimationManager.createTimeline();

  tl.fromTo(
    paper,
    { opacity: 0, y: 50, rotateX: 10 },
    { opacity: 1, y: 0, rotateX: 0, duration: 1.5, ease: "power3.out" }
  );

  lines.forEach((line) => {
    const text = line.dataset.text ?? "";
    tl.call(() => {
      void typeLine(line, text);
    });
    tl.to({}, { duration: typingDuration(text) });
  });

  tl.to({}, { duration: 1.2 });

  return tl;
}
