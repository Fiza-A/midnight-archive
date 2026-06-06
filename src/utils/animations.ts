import gsap from "gsap";

/** Register GSAP plugins if needed */
export function initGSAP(): void {
  gsap.defaults({
    ease: "power2.inOut",
    duration: 1,
  });
}

export function fadeIn(
  target: gsap.TweenTarget,
  duration = 1,
  delay = 0
): gsap.core.Tween {
  return gsap.fromTo(
    target,
    { opacity: 0 },
    { opacity: 1, duration, delay, ease: "power2.out" }
  );
}

export function fadeOut(
  target: gsap.TweenTarget,
  duration = 1,
  delay = 0
): gsap.core.Tween {
  return gsap.to(target, { opacity: 0, duration, delay, ease: "power2.in" });
}

export function scaleIn(
  target: gsap.TweenTarget,
  duration = 1,
  delay = 0
): gsap.core.Timeline {
  const tl = gsap.timeline({ delay });
  tl.fromTo(
    target,
    { scale: 0, opacity: 0 },
    { scale: 1, opacity: 1, duration, ease: "back.out(1.4)" }
  );
  return tl;
}

export function typewriterEffect(
  element: HTMLElement,
  text: string,
  speed = 0.04
): gsap.core.Timeline {
  const tl = gsap.timeline();
  element.textContent = "";
  const chars = text.split("");

  chars.forEach((char, i) => {
    tl.call(() => {
      element.textContent += char;
    }, undefined, i * speed);
  });

  return tl;
}

export function staggerReveal(
  targets: gsap.TweenTarget,
  stagger = 0.15,
  duration = 0.8
): gsap.core.Tween {
  return gsap.fromTo(
    targets,
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration, stagger, ease: "power3.out" }
  );
}

export function particleBurst(
  container: HTMLElement,
  count = 30,
  color = "#F5AFAF"
): void {
  for (let i = 0; i < count; i++) {
    const particle = document.createElement("div");
    particle.className = "burst-particle";
    particle.style.background = color;
    container.appendChild(particle);

    const angle = (i / count) * Math.PI * 2;
    const distance = 80 + Math.random() * 120;

    gsap.fromTo(
      particle,
      { x: 0, y: 0, opacity: 1, scale: 1 },
      {
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        opacity: 0,
        scale: 0,
        duration: 1 + Math.random(),
        ease: "power2.out",
        onComplete: () => particle.remove(),
      }
    );
  }
}
