import gsap from "gsap";

export const TUNNEL_FADE_IN = 0.75;
export const TUNNEL_FADE_OUT = 0.7;
export const TUNNEL_MIN_HOLD = 2.5;

const FADE_IN = TUNNEL_FADE_IN;
const FADE_OUT = TUNNEL_FADE_OUT;

export function animateScrapbookIn(
  card: HTMLElement,
  photo: HTMLElement | null,
  text: HTMLElement | null,
  onComplete?: () => void
): gsap.core.Timeline {
  const tl = gsap.timeline({ onComplete });

  gsap.set(card, { opacity: 1, visibility: "visible", scale: 1, y: 0 });
  if (text) gsap.set(text, { opacity: 0, y: 12 });

  tl.fromTo(
    card,
    { opacity: 0, y: 48, scale: 0.92, rotateX: 8 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      duration: FADE_IN,
      ease: "back.out(1.4)",
    }
  );

  if (photo) {
    tl.fromTo(
      photo,
      { y: -30, rotate: -6, opacity: 0 },
      { y: 0, rotate: -1.5, opacity: 1, duration: FADE_IN, ease: "back.out(1.6)" },
      "-=0.55"
    );
  }

  if (text) {
    tl.fromTo(
      text,
      { opacity: 0, y: 16, filter: "blur(6px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: FADE_IN * 0.85,
        ease: "power2.out",
      },
      `-=${FADE_IN * 0.7}`
    );
  }

  return tl;
}

export function animateScrapbookOut(
  card: HTMLElement,
  text: HTMLElement | null
): Promise<void> {
  return new Promise((resolve) => {
    const targets = text ? [card, text] : [card];
    gsap.to(targets, {
      opacity: 0,
      y: -16,
      duration: FADE_OUT * 0.6,
      ease: "power2.in",
      stagger: 0,
    });
    gsap.to(card, {
      scale: 0.96,
      filter: "blur(8px)",
      duration: FADE_OUT,
      ease: "power2.in",
      onComplete: resolve,
    });
  });
}

export function floatScrapbook(card: HTMLElement, duration: number): gsap.core.Tween {
  return gsap.to(card, {
    y: -6,
    duration: duration * 0.35,
    ease: "sine.inOut",
    yoyo: true,
    repeat: 1,
  });
}

export function dissolveParticles(container: HTMLElement): void {
  for (let i = 0; i < 12; i++) {
    const p = document.createElement("span");
    p.textContent = ["♥", "✨", "💕"][i % 3];
    p.className = "pointer-events-none absolute left-1/2 top-1/2 text-highlight";
    container.appendChild(p);
    gsap.fromTo(
      p,
      { x: 0, y: 0, opacity: 1, scale: 1 },
      {
        x: (Math.random() - 0.5) * 120,
        y: (Math.random() - 0.5) * 80,
        opacity: 0,
        scale: 0,
        duration: 0.8,
        ease: "power2.out",
        onComplete: () => p.remove(),
      }
    );
  }
}
