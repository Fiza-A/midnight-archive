import { AUDIO } from "@/assets/audio";
import { debugWarn, updateDebugState } from "@/utils/debugStore";

const MUSIC_VOLUME = 0.35;
const LOAD_TIMEOUT_MS = 8000;

const MUSIC_CANDIDATES = [
  AUDIO.music,
  "/assets/audio/background-music.mp3",
  "/assets/audio/music.mp3",
].filter((src, index, list) => src.trim() && list.indexOf(src) === index);

type ProbeStatus = "idle" | "checking" | "found" | "missing";

let audio: HTMLAudioElement | null = null;
let resolvedSrc: string | null = null;
let probeStatus: ProbeStatus = "idle";
let musicEnabled = false;
let musicAvailable = false;
let musicUnlocked = false;
let loadError: "missing" | "blocked" | null = null;
const listeners = new Set<() => void>();

function notifyListeners(): void {
  listeners.forEach((listener) => listener());
}

export function getBackgroundMusicState() {
  return { musicEnabled, musicAvailable, musicUnlocked, loadError, resolvedSrc };
}

export function subscribeBackgroundMusic(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

async function findMusicSrc(): Promise<string | null> {
  if (probeStatus === "found") return resolvedSrc;
  if (probeStatus === "missing") return null;
  if (probeStatus === "checking") {
    await new Promise((r) => window.setTimeout(r, 50));
    return findMusicSrc();
  }

  probeStatus = "checking";

  for (const src of MUSIC_CANDIDATES) {
    try {
      const res = await fetch(src, { method: "HEAD", cache: "no-store" });
      if (res.ok) {
        resolvedSrc = src;
        probeStatus = "found";
        loadError = null;
        return src;
      }
    } catch {
      // try next candidate
    }
  }

  resolvedSrc = null;
  probeStatus = "missing";
  loadError = "missing";
  musicAvailable = false;
  updateDebugState({ audioStatus: "missing" });
  debugWarn(
    "Music file not found. Add your MP3 to public/assets/audio/halka-halka-suroor.mp3"
  );
  notifyListeners();
  return null;
}

function waitForAudioReady(element: HTMLAudioElement): Promise<boolean> {
  return new Promise((resolve) => {
    if (element.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA) {
      resolve(true);
      return;
    }

    let settled = false;
    const finish = (ok: boolean) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      element.removeEventListener("canplaythrough", onReady);
      element.removeEventListener("canplay", onReady);
      element.removeEventListener("error", onError);
      resolve(ok);
    };

    const onReady = () => finish(true);
    const onError = () => finish(false);
    const timer = window.setTimeout(() => {
      finish(element.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA);
    }, LOAD_TIMEOUT_MS);

    element.addEventListener("canplaythrough", onReady, { once: true });
    element.addEventListener("canplay", onReady, { once: true });
    element.addEventListener("error", onError, { once: true });
  });
}

/** Create/load the audio element — only after a successful file probe */
export async function prepareBackgroundMusic(): Promise<boolean> {
  if (!MUSIC_CANDIDATES.length) {
    updateDebugState({ audioStatus: "disabled" });
    return false;
  }

  if (probeStatus === "missing") return false;

  const src = await findMusicSrc();
  if (!src) return false;

  if (audio && !audio.error && audio.src.endsWith(src)) {
    musicAvailable = audio.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA;
    notifyListeners();
    return musicAvailable;
  }

  const element = new Audio(src);
  element.loop = true;
  element.volume = MUSIC_VOLUME;
  element.preload = "auto";
  element.load();

  const loaded = await waitForAudioReady(element);
  if (!loaded) {
    element.removeAttribute("src");
    element.load();
    probeStatus = "missing";
    resolvedSrc = null;
    audio = null;
    musicAvailable = false;
    loadError = "missing";
    updateDebugState({ audioStatus: "missing" });
    notifyListeners();
    return false;
  }

  audio = element;
  musicAvailable = true;
  loadError = null;
  updateDebugState({ audioStatus: "loaded" });
  notifyListeners();
  return true;
}

export function unlockBackgroundMusicSync(): boolean {
  if (!audio || !musicAvailable) return false;

  try {
    const attempt = audio.play();
    attempt
      ?.then(() => {
        if (!musicEnabled && audio) {
          audio.pause();
          audio.currentTime = 0;
        }
        musicUnlocked = true;
        loadError = null;
        notifyListeners();
      })
      .catch(() => {
        loadError = "blocked";
        updateDebugState({ audioStatus: "blocked" });
        notifyListeners();
      });
    return true;
  } catch {
    loadError = "blocked";
    notifyListeners();
    return false;
  }
}

export async function playBackgroundMusic(): Promise<boolean> {
  if (probeStatus === "missing") return false;

  if (!audio) {
    const ready = await prepareBackgroundMusic();
    if (!ready) return false;
  }

  if (!audio) return false;

  try {
    await audio.play();
    musicEnabled = true;
    musicUnlocked = true;
    loadError = null;
    updateDebugState({ audioStatus: "playing" });
    notifyListeners();
    return true;
  } catch {
    loadError = "blocked";
    updateDebugState({ audioStatus: "blocked" });
    musicEnabled = false;
    notifyListeners();
    return false;
  }
}

export function stopBackgroundMusic(): void {
  audio?.pause();
  musicEnabled = false;
  updateDebugState({ audioStatus: "paused" });
  notifyListeners();
}

export async function toggleBackgroundMusic(): Promise<void> {
  if (musicEnabled) {
    stopBackgroundMusic();
    return;
  }
  await playBackgroundMusic();
}

export function resetBackgroundMusic(): void {
  if (audio) {
    audio.pause();
    audio.removeAttribute("src");
    audio.load();
    audio = null;
  }
  resolvedSrc = null;
  probeStatus = "idle";
  musicEnabled = false;
  musicAvailable = false;
  musicUnlocked = false;
  loadError = null;
  notifyListeners();
}

export function getMusicFileHelpText(): string {
  return "Add your MP3 here: public/assets/audio/halka-halka-suroor.mp3";
}
