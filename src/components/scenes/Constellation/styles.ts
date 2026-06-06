export const constellationStyles = {
  sky: "relative z-10 h-full w-full bg-[radial-gradient(ellipse_at_center,#1a1020_0%,#0a0612_100%)]",
  star: "absolute cursor-pointer text-white transition-transform hover:scale-125 focus:scale-125 focus:outline-none",
  starGlow:
    "flex h-4 w-4 items-center justify-center rounded-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.8)] md:h-5 md:w-5",
  panel:
    "absolute left-1/2 top-1/2 z-30 flex max-w-sm -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-4 rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-lg md:max-w-md",
  panelImage:
    "relative flex h-52 w-72 items-center justify-center overflow-hidden rounded-xl bg-white/10 md:h-60 md:w-80 lg:h-64 lg:w-96",
  panelText: "text-center font-display text-lg text-white md:text-xl",
  hint: "absolute bottom-8 left-1/2 z-20 -translate-x-1/2 font-body text-sm text-white/50",
};
