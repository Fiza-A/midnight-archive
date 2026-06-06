"use client";

import { useAudioManager } from "@/hooks/useAudioManager";
import { BACKGROUND_MUSIC, HAS_BACKGROUND_MUSIC } from "@/assets/audio";
import { getMusicFileHelpText } from "@/utils/backgroundMusic";

interface AudioControlsProps {
  enabled?: boolean;
}

export function AudioControls({ enabled = true }: AudioControlsProps) {
  const { musicEnabled, musicAvailable, loadError, toggleMusic } = useAudioManager();

  const songLabel = `${BACKGROUND_MUSIC.title} — ${BACKGROUND_MUSIC.artists}`;

  if (!enabled || !HAS_BACKGROUND_MUSIC) return null;

  const title =
    loadError === "missing"
      ? getMusicFileHelpText()
      : loadError === "blocked"
        ? "Playback blocked — click again to start music"
        : musicAvailable
          ? musicEnabled
            ? `Playing: ${songLabel}`
            : `Play: ${songLabel}`
          : `Loading ${songLabel}…`;

  return (
    <button
      type="button"
      onClick={() => void toggleMusic()}
      className="fixed top-4 right-4 z-[100] max-w-[min(18rem,calc(100vw-2rem))] rounded-full border border-accent/40 bg-white/50 px-3 py-2 text-sm text-text-secondary backdrop-blur-sm transition-colors hover:bg-white/80 focus:outline-none focus:ring-2 focus:ring-highlight"
      aria-label={musicEnabled ? `Mute ${songLabel}` : `Play ${songLabel}`}
      title={title}
    >
      {loadError === "missing" ? "🎵❌" : musicEnabled ? "🔊" : "🔇"}
    </button>
  );
}
