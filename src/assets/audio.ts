/**
 * Background music — add your MP3 to public/assets/audio/halka-halka-suroor.mp3
 * (purchase or export the track you own; the file is not bundled in the repo).
 */
export const BACKGROUND_MUSIC = {
  src: "/assets/audio/halka-halka-suroor.mp3",
  title: "Halka Halka Suroor",
  artists: "Madhur Sharma & Nusrat Fateh Ali Khan",
} as const;

export const AUDIO = {
  music: BACKGROUND_MUSIC.src,
  sfx: {
    portalSuccess: "",
    chestOpen: "",
    countdown: "",
    reveal: "",
  },
};

export const HAS_BACKGROUND_MUSIC = Boolean(AUDIO.music);
