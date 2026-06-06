export const birthdayPopupStyles = {
  overlay:
    "pointer-events-none fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-lg",
  popup:
    "relative z-[130] mx-4 w-[min(94vw,60rem)] rounded-[2rem] border-2 border-highlight/70 bg-gradient-to-br from-white/98 via-primary/95 to-highlight/35 px-10 py-16 text-center shadow-[0_0_100px_rgba(245,175,175,0.65),0_0_200px_rgba(245,175,175,0.3)] md:px-20 md:py-24",
  title:
    "font-display text-5xl leading-[1.1] tracking-wide text-text-primary drop-shadow-[0_0_40px_rgba(245,175,175,0.7)] sm:text-6xl md:text-8xl lg:text-[6.5rem]",
  confetti: "pointer-events-none fixed inset-0 z-[115] overflow-hidden",
  replay:
    "pointer-events-none mt-10 rounded-full border border-highlight/50 bg-white/60 px-8 py-4 font-body text-lg text-text-primary backdrop-blur-sm transition-all hover:bg-highlight/20 hover:shadow-[0_0_30px_rgba(245,175,175,0.3)] focus:outline-none focus:ring-2 focus:ring-highlight",
};
