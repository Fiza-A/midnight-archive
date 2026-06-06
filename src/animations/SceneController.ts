import gsap from "gsap";
import { SceneId } from "@/types";
import { AnimationManager } from "./AnimationManager";

type SceneChangeCallback = (from: SceneId, to: SceneId) => void;

class SceneControllerClass {
  private currentScene: SceneId = "loading";
  private listeners: SceneChangeCallback[] = [];
  private transitionTimeline: gsap.core.Timeline | null = null;

  getCurrentScene(): SceneId {
    return this.currentScene;
  }

  onSceneChange(callback: SceneChangeCallback): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  private notify(from: SceneId, to: SceneId): void {
    this.listeners.forEach((cb) => cb(from, to));
  }

  transitionTo(
    nextScene: SceneId,
    exitEl?: HTMLElement | null,
    enterEl?: HTMLElement | null
  ): Promise<void> {
    return new Promise((resolve) => {
      const from = this.currentScene;
      this.transitionTimeline?.kill();

      const tl = gsap.timeline({
        onComplete: () => {
          this.currentScene = nextScene;
          this.notify(from, nextScene);
          resolve();
        },
      });

      this.transitionTimeline = tl;

      if (exitEl) {
        tl.to(exitEl, {
          opacity: 0,
          scale: 1.05,
          duration: 1,
          ease: "power2.inOut",
        });
      }

      tl.call(() => {
        this.currentScene = nextScene;
        this.notify(from, nextScene);
      });

      if (enterEl) {
        tl.fromTo(
          enterEl,
          { opacity: 0, scale: 0.95 },
          { opacity: 1, scale: 1, duration: 1.2, ease: "power2.out" }
        );
      }
    });
  }

  heartExpandTransition(
    heartEl: HTMLElement,
    onMidpoint: () => void
  ): Promise<void> {
    return new Promise((resolve) => {
      const tl = AnimationManager.createTimeline({ onComplete: () => resolve() });

      tl.to(heartEl, {
        scale: 15,
        opacity: 1,
        duration: 2,
        ease: "power2.inOut",
        onComplete: onMidpoint,
      }).to(heartEl, {
        opacity: 0,
        duration: 0.8,
        ease: "power2.in",
      });
    });
  }

  lightBurstTransition(
    burstEl: HTMLElement,
    onMidpoint: () => void
  ): Promise<void> {
    return new Promise((resolve) => {
      const tl = AnimationManager.createTimeline({ onComplete: () => resolve() });

      tl.fromTo(
        burstEl,
        { scale: 0, opacity: 0 },
        {
          scale: 3,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          onComplete: onMidpoint,
        }
      ).to(burstEl, {
        opacity: 0,
        duration: 0.6,
        ease: "power2.in",
      });
    });
  }
}

export const SceneController = new SceneControllerClass();
