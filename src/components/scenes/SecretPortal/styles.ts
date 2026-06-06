export const portalStyles = {
  container: "relative z-10 flex flex-col items-center gap-8 px-6",
  line: "font-display text-2xl text-text-primary md:text-4xl lg:text-5xl text-glow",
  input:
    "w-72 rounded-full border border-accent/50 bg-white/60 px-6 py-4 text-center font-body text-lg text-text-primary backdrop-blur-sm outline-none transition-all focus:border-highlight focus:shadow-[0_0_30px_rgba(245,175,175,0.4)] md:w-96",
  error:
    "max-w-sm rounded-xl border border-red-300/60 bg-white/95 px-4 py-3 text-center font-body text-sm font-medium text-red-800 shadow-sm",
  setupError:
    "max-w-md rounded-xl border border-highlight/50 bg-white/95 px-4 py-3 text-center font-body text-sm leading-relaxed text-text-primary shadow-sm",
  heart:
    "pointer-events-none fixed left-1/2 top-1/2 z-[9999] flex h-24 w-24 items-center justify-center text-[72px] leading-none text-highlight drop-shadow-[0_0_40px_rgba(245,175,175,0.8)] will-change-transform md:h-32 md:w-32 md:text-[120px]",
};
