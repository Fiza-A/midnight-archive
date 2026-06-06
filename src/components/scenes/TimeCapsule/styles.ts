export const capsuleStyles = {
  chest: "relative z-10 cursor-pointer transition-transform hover:scale-105",
  body: "flex h-40 w-56 flex-col items-center justify-center rounded-t-lg border-2 border-highlight/50 bg-gradient-to-b from-secondary to-accent md:h-48 md:w-64",
  lid: "absolute -top-8 left-0 h-12 w-56 rounded-t-2xl border-2 border-highlight/50 bg-gradient-to-b from-highlight/60 to-secondary md:w-64",
  prompt: "mt-4 font-display text-xl text-text-primary md:text-2xl",
  stats: "mt-8 flex flex-col gap-4",
  statRow: "flex items-center justify-between gap-8 rounded-xl bg-white/40 px-6 py-3 backdrop-blur-sm",
  statLabel: "font-body text-text-secondary",
  statValue: "font-display text-xl text-highlight md:text-2xl",
};
