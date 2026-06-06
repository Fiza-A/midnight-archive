import gsap from "gsap";
import { AnimationManager } from "./AnimationManager";

class MasterTimelineClass {
  private master: gsap.core.Timeline | null = null;

  create(): gsap.core.Timeline {
    this.kill();
    this.master = gsap.timeline({ paused: true });
    return this.master;
  }

  get(): gsap.core.Timeline | null {
    return this.master;
  }

  play(): void {
    this.master?.play();
  }

  pause(): void {
    this.master?.pause();
  }

  kill(): void {
    this.master?.kill();
    this.master = null;
    AnimationManager.killAll();
  }

  /** Build auto-progression timeline for a scene */
  autoAdvance(delaySeconds: number, onComplete: () => void): gsap.core.Tween {
    return gsap.delayedCall(delaySeconds, onComplete);
  }
}

export const MasterTimeline = new MasterTimelineClass();
