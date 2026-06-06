import gsap from "gsap";
import { AnimationManager } from "@/animations/AnimationManager";
import { updateDebugState } from "@/utils/debugStore";
import { portalStyles } from "./styles";

export function createPortalIntro(
  line1: HTMLElement | null,
  line2: HTMLElement | null
): gsap.core.Timeline {
  const tl = AnimationManager.createTimeline();
  if (line1) {
    tl.fromTo(
      line1,
      { opacity: 0, y: 30, filter: "blur(10px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.5, ease: "power3.out" }
    );
  }
  if (line2) {
    tl.fromTo(
      line2,
      { opacity: 0, y: 20, filter: "blur(8px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.2, ease: "power3.out" },
      "+=1.5"
    );
  }
  return tl;
}

function getCoverScale(): number {
  const base = Math.min(window.innerWidth, window.innerHeight) * 0.12;
  const size = Math.max(base, 72);
  const scaleX = (window.innerWidth / size) * 1.4;
  const scaleY = (window.innerHeight / size) * 1.4;
  return Math.max(scaleX, scaleY);
}

function createRevealHeartElement(): HTMLDivElement {
  const heartEl = document.createElement("div");
  heartEl.className = portalStyles.heart;
  heartEl.textContent = "♥";
  heartEl.setAttribute("aria-hidden", "true");
  document.body.appendChild(heartEl);
  return heartEl;
}

export function runHeartReveal(
  inputEl: HTMLElement | null,
  containerEl: HTMLElement | null,
  onCoverComplete: () => void
): () => void {
  const heartEl = createRevealHeartElement();
  const coverScale = getCoverScale();
  const tl = AnimationManager.createTimeline();

  updateDebugState({ timelineState: "portal-heart-reveal" });

  gsap.set(heartEl, {
    position: "fixed",
    left: "50%",
    top: "50%",
    xPercent: -50,
    yPercent: -50,
    transformOrigin: "center center",
    zIndex: 9999,
    opacity: 0,
    scale: 0,
  });

  if (containerEl) {
    tl.to(containerEl, { opacity: 0, duration: 0.5, ease: "power2.in" }, 0);
  }

  if (inputEl) {
    tl.to(inputEl, { opacity: 0, scale: 0.8, duration: 0.5, ease: "power2.in" }, 0);
  }

  tl.to(heartEl, {
    opacity: 1,
    scale: 1,
    duration: 0.7,
    ease: "back.out(2.5)",
  })
    .to(heartEl, {
      scale: coverScale,
      opacity: 1,
      duration: 2,
      ease: "power2.in",
    })
    .to({}, { duration: 0.3 })
    .call(onCoverComplete)
    .to(heartEl, {
      opacity: 0,
      duration: 0.6,
      ease: "power2.in",
    })
    .call(() => {
      heartEl.remove();
      updateDebugState({ timelineState: "portal-heart-done" });
    });

  return () => {
    tl.kill();
    heartEl.remove();
  };
}
