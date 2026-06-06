import { LOADING_MESSAGES } from "@/data/config";

type LoadingCallback = (message: string, progress: number) => void;

class LoadingManagerClass {
  private messageIndex = 0;
  private intervalId: ReturnType<typeof setInterval> | null = null;

  startMessageCycle(onMessage: (message: string) => void, intervalMs = 2200): void {
    this.stopMessageCycle();
    onMessage(LOADING_MESSAGES[0]);
    this.messageIndex = 0;

    this.intervalId = setInterval(() => {
      this.messageIndex = (this.messageIndex + 1) % LOADING_MESSAGES.length;
      onMessage(LOADING_MESSAGES[this.messageIndex]);
    }, intervalMs);
  }

  stopMessageCycle(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  simulateProgress(
    onUpdate: LoadingCallback,
    durationMs = 4000
  ): Promise<void> {
    return new Promise((resolve) => {
      const start = Date.now();
      this.startMessageCycle((msg) => {
        const elapsed = Date.now() - start;
        const progress = Math.min(95, (elapsed / durationMs) * 100);
        onUpdate(msg, progress);
      });

      const tick = setInterval(() => {
        const elapsed = Date.now() - start;
        const progress = Math.min(95, (elapsed / durationMs) * 100);
        onUpdate(LOADING_MESSAGES[this.messageIndex], progress);

        if (elapsed >= durationMs) {
          clearInterval(tick);
          this.stopMessageCycle();
          onUpdate("Ready.", 100);
          resolve();
        }
      }, 100);
    });
  }
}

export const LoadingManager = new LoadingManagerClass();
