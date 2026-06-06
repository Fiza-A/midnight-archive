import { BACKGROUND_MUSIC } from "@/assets/audio";
import { debugWarn, updateDebugState } from "@/utils/debugStore";

const MUSIC_VOLUME = 35;
const PLAYER_READY_TIMEOUT_MS = 15000;

interface YouTubePlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  stopVideo: () => void;
  setVolume: (volume: number) => void;
  mute: () => void;
  unMute: () => void;
  getPlayerState: () => number;
  destroy: () => void;
}

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT?: {
      Player: new (
        element: HTMLElement | string,
        config: Record<string, unknown>
      ) => YouTubePlayer;
      PlayerState: {
        UNSTARTED: number;
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
        BUFFERING: number;
        CUED: number;
      };
    };
  }
}

let player: YouTubePlayer | null = null;
let containerEl: HTMLElement | null = null;
let mountHost: HTMLDivElement | null = null;
let apiLoading: Promise<void> | null = null;
let apiReady = false;
let playerReady = false;
let musicEnabled = false;
let musicAvailable = false;
let musicUnlocked = false;
let loadError: "missing" | "blocked" | null = null;
const listeners = new Set<() => void>();

function notifyListeners(): void {
  listeners.forEach((listener) => listener());
}

export function getBackgroundMusicState() {
  return {
    musicEnabled,
    musicAvailable,
    musicUnlocked,
    loadError,
    resolvedSrc: BACKGROUND_MUSIC.videoId,
  };
}

export function subscribeBackgroundMusic(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function loadYouTubeApi(): Promise<void> {
  if (apiReady) return Promise.resolve();
  if (apiLoading) return apiLoading;

  apiLoading = new Promise((resolve) => {
    if (window.YT?.Player) {
      apiReady = true;
      resolve();
      return;
    }

    const previousReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      apiReady = true;
      previousReady?.();
      resolve();
    };

    if (!document.getElementById("youtube-iframe-api")) {
      const script = document.createElement("script");
      script.id = "youtube-iframe-api";
      script.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(script);
    }
  });

  return apiLoading;
}

function createPlayer(): void {
  if (!containerEl || player || !window.YT?.Player) return;

  const target = document.createElement("div");
  target.id = "youtube-music-player";
  containerEl.appendChild(target);

  player = new window.YT.Player(target, {
    height: "1",
    width: "1",
    videoId: BACKGROUND_MUSIC.videoId,
    playerVars: {
      autoplay: 0,
      controls: 0,
      disablekb: 1,
      fs: 0,
      iv_load_policy: 3,
      modestbranding: 1,
      playsinline: 1,
      rel: 0,
      loop: 1,
      playlist: BACKGROUND_MUSIC.videoId,
      origin: typeof window !== "undefined" ? window.location.origin : undefined,
    },
    events: {
      onReady: (event: { target: YouTubePlayer }) => {
        event.target.setVolume(MUSIC_VOLUME);
        playerReady = true;
        musicAvailable = true;
        loadError = null;
        updateDebugState({ audioStatus: "loaded" });
        notifyListeners();
      },
      onStateChange: (event: { data: number }) => {
        const playing = event.data === window.YT?.PlayerState.PLAYING;
        const paused = event.data === window.YT?.PlayerState.PAUSED;
        if (playing) {
          musicEnabled = true;
          musicUnlocked = true;
          loadError = null;
          updateDebugState({ audioStatus: "playing" });
          notifyListeners();
        } else if (paused) {
          musicEnabled = false;
          updateDebugState({ audioStatus: "paused" });
          notifyListeners();
        }
      },
      onError: () => {
        playerReady = false;
        musicAvailable = false;
        loadError = "missing";
        debugWarn("YouTube music failed to load", BACKGROUND_MUSIC.videoId);
        updateDebugState({ audioStatus: "missing" });
        notifyListeners();
      },
    },
  });
}

export function mountYouTubeMusicPlayer(): void {
  if (mountHost) return;

  mountHost = document.createElement("div");
  mountHost.id = "youtube-music-host";
  mountHost.className =
    "pointer-events-none fixed -left-[9999px] top-0 h-px w-px overflow-hidden opacity-0";
  mountHost.setAttribute("aria-hidden", "true");
  document.body.appendChild(mountHost);
  containerEl = mountHost;

  if (apiReady) createPlayer();
}

export function unmountYouTubeMusicPlayer(): void {
  if (player) {
    try {
      player.stopVideo();
      player.destroy();
    } catch {
      // player may already be torn down
    }
    player = null;
  }

  mountHost?.remove();
  mountHost = null;
  containerEl = null;
  playerReady = false;
  musicEnabled = false;
  musicAvailable = false;
  musicUnlocked = false;
}

export function registerYouTubeMusicContainer(element: HTMLElement | null): void {
  containerEl = element ?? mountHost;
  if (containerEl && apiReady && !player) {
    createPlayer();
  }
}

function waitForPlayerReady(): Promise<boolean> {
  if (playerReady) return Promise.resolve(true);

  return new Promise((resolve) => {
    const timeout = window.setTimeout(() => {
      unsubscribe();
      resolve(playerReady);
    }, PLAYER_READY_TIMEOUT_MS);

    const unsubscribe = subscribeBackgroundMusic(() => {
      if (playerReady) {
        window.clearTimeout(timeout);
        unsubscribe();
        resolve(true);
      }
      if (loadError === "missing") {
        window.clearTimeout(timeout);
        unsubscribe();
        resolve(false);
      }
    });
  });
}

export async function prepareBackgroundMusic(): Promise<boolean> {
  if (!BACKGROUND_MUSIC.videoId) {
    updateDebugState({ audioStatus: "disabled" });
    return false;
  }

  if (loadError === "missing" && !playerReady) return false;

  await loadYouTubeApi();
  if (containerEl) createPlayer();
  return waitForPlayerReady();
}

export function unlockBackgroundMusicSync(): boolean {
  if (!player || !playerReady) return false;

  try {
    player.playVideo();
    if (!musicEnabled) {
      player.pauseVideo();
    }
    musicUnlocked = true;
    loadError = null;
    notifyListeners();
    return true;
  } catch {
    loadError = "blocked";
    notifyListeners();
    return false;
  }
}

export async function playBackgroundMusic(): Promise<boolean> {
  const ready = playerReady || (await prepareBackgroundMusic());
  if (!ready || !player) {
    if (!ready) loadError = loadError ?? "blocked";
    notifyListeners();
    return false;
  }

  try {
    player.unMute();
    player.setVolume(MUSIC_VOLUME);
    player.playVideo();
    musicEnabled = true;
    musicUnlocked = true;
    loadError = null;
    updateDebugState({ audioStatus: "playing" });
    notifyListeners();
    return true;
  } catch {
    loadError = "blocked";
    debugWarn("YouTube playback blocked — click the speaker button");
    updateDebugState({ audioStatus: "blocked" });
    musicEnabled = false;
    notifyListeners();
    return false;
  }
}

export function stopBackgroundMusic(): void {
  player?.pauseVideo();
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
  if (player) {
    try {
      player.stopVideo();
      player.destroy();
    } catch {
      // ignore teardown errors
    }
    player = null;
  }

  if (mountHost) {
    mountHost.innerHTML = "";
  }

  playerReady = false;
  musicEnabled = false;
  musicAvailable = false;
  musicUnlocked = false;
  loadError = null;
  notifyListeners();

  if (containerEl && apiReady) {
    createPlayer();
  }
}

export function getMusicFileHelpText(): string {
  return `${BACKGROUND_MUSIC.title} — ${BACKGROUND_MUSIC.artists} (YouTube)`;
}
