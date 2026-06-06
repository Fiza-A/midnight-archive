export const tunnelStyles = {
  scene: "relative h-full w-full overflow-hidden",
  bgLayer: "pointer-events-none absolute inset-0 z-0",
  bgGlow:
    "absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(249,223,223,0.55)_0%,transparent_55%),radial-gradient(ellipse_at_bottom,rgba(245,175,175,0.25)_0%,transparent_50%)]",
  stickerLayer: "absolute inset-0 z-[10] overflow-hidden",
  contentLayer:
    "relative z-[50] flex h-full w-full items-center justify-center px-4 py-6 md:px-8",
  scrapbook:
    "relative flex w-full max-w-[900px] flex-col items-center rounded-[2rem] border border-white/60 bg-gradient-to-br from-[#FCF8F8]/95 via-[#FBEFEF]/90 to-[#F9DFDF]/85 p-5 shadow-[0_20px_80px_rgba(245,175,175,0.35)] backdrop-blur-xl md:p-8",
  tapeLeft:
    "pointer-events-none absolute -left-3 top-8 h-14 w-24 -rotate-12 rounded-sm bg-[#F9DFDF]/80 shadow-sm md:-left-4 md:top-10",
  tapeRight:
    "pointer-events-none absolute -right-3 top-16 h-12 w-20 rotate-12 rounded-sm bg-[#F5AFAF]/50 shadow-sm md:-right-4",
  sparkle: "pointer-events-none absolute text-lg opacity-60 md:text-xl",
  polaroidWrap: "relative mx-auto w-full max-w-[520px]",
  polaroid:
    "relative rotate-[-1.5deg] rounded-sm border-[10px] border-white bg-white p-3 pb-10 shadow-[0_12px_40px_rgba(79,61,61,0.15)] transition-transform md:border-[12px] md:pb-12",
  photoArea:
    "relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-[#FBEFEF]",
  polaroidCaption:
    "mt-3 text-center font-handwriting text-sm text-text-secondary md:text-base",
  dateBadge:
    "mb-5 inline-flex items-center gap-2 rounded-full border border-highlight/40 bg-white/70 px-4 py-1.5 font-display text-sm text-highlight shadow-sm md:text-base",
  storyBlock:
    "mt-6 w-full max-w-[520px] border-t border-accent/40 pt-6 text-center",
  storyText:
    "mx-auto max-w-[480px] text-center font-display text-base leading-relaxed text-text-primary md:text-lg",
  progress:
    "text-center font-body text-xs tracking-widest text-text-secondary/70 uppercase",
  debug:
    "mt-3 rounded-lg bg-black/40 p-2 font-mono text-[10px] text-white/80",
  vignette:
    "pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(252,248,248,0.5)_100%)]",
};
