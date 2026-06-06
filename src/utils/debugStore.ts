/** Enable debug overlay — set NEXT_PUBLIC_DEBUG=true in .env.local */
export const DEBUG = process.env.NEXT_PUBLIC_DEBUG === "true";

export interface DebugState {
  currentScene: string;
  loadedImages: number;
  failedImages: string[];
  totalImages: number;
  audioStatus: string;
  timelineState: string;
  lastError: string;
}

export const debugState: DebugState = {
  currentScene: "loading",
  loadedImages: 0,
  failedImages: [],
  totalImages: 0,
  audioStatus: "idle",
  timelineState: "idle",
  lastError: "",
};

type Listener = () => void;
const listeners = new Set<Listener>();

export function updateDebugState(patch: Partial<DebugState>): void {
  Object.assign(debugState, patch);
  if (DEBUG) listeners.forEach((l) => l());
}

export function subscribeDebug(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function debugWarn(message: string, detail?: unknown): void {
  if (DEBUG) {
    console.warn(`[BirthdayExperience] ${message}`, detail ?? "");
  }
}

export function debugError(message: string, error?: unknown): void {
  console.error(`[BirthdayExperience] ${message}`, error ?? "");
  updateDebugState({ lastError: message, timelineState: "error" });
}
