import gsap from "gsap";

class AnimationManagerClass {
  private activeTimelines: gsap.core.Timeline[] = [];

  createTimeline(vars?: gsap.TimelineVars): gsap.core.Timeline {
    const tl = gsap.timeline(vars);
    this.activeTimelines.push(tl);
    return tl;
  }

  killAll(): void {
    this.activeTimelines.forEach((tl) => tl.kill());
    this.activeTimelines = [];
    gsap.killTweensOf("*");
  }

  pauseAll(): void {
    this.activeTimelines.forEach((tl) => tl.pause());
  }

  resumeAll(): void {
    this.activeTimelines.forEach((tl) => tl.resume());
  }

  sceneEnter(
    element: HTMLElement | null,
    onComplete?: () => void
  ): gsap.core.Timeline {
    const tl = this.createTimeline({ onComplete });
    if (!element) return tl;

    tl.fromTo(
      element,
      { opacity: 0, scale: 1.02 },
      { opacity: 1, scale: 1, duration: 1.2, ease: "power2.out" }
    );
    return tl;
  }

  sceneExit(
    element: HTMLElement | null,
    onComplete?: () => void
  ): gsap.core.Timeline {
    const tl = this.createTimeline({ onComplete });
    if (!element) {
      onComplete?.();
      return tl;
    }

    tl.to(element, {
      opacity: 0,
      scale: 0.98,
      duration: 1,
      ease: "power2.in",
    });
    return tl;
  }

  cinematicTextReveal(
    elements: HTMLElement[],
    stagger = 0.8
  ): gsap.core.Timeline {
    const tl = this.createTimeline();
    elements.forEach((el, i) => {
      tl.fromTo(
        el,
        { opacity: 0, y: 20, filter: "blur(8px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1.2,
          ease: "power3.out",
        },
        i * stagger
      );
    });
    return tl;
  }
}

export const AnimationManager = new AnimationManagerClass();
