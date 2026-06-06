/** Background music via YouTube — Halka Halka Suroor */
export const BACKGROUND_MUSIC = {
  videoId: "G8wCaZ2Kok8",
  embedUrl: "https://www.youtube.com/embed/G8wCaZ2Kok8",
  title: "Halka Halka Suroor",
  artists: "Nusrat Fateh Ali Khan",
} as const;

export const AUDIO = {
  sfx: {
    portalSuccess: "",
    chestOpen: "",
    countdown: "",
    reveal: "",
  },
};

export const HAS_BACKGROUND_MUSIC = Boolean(BACKGROUND_MUSIC.videoId);
