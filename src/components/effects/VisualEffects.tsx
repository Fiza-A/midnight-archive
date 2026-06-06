"use client";

export function BloomOverlay() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[2] opacity-30 mix-blend-soft-light"
      aria-hidden="true"
      style={{
        background:
          "radial-gradient(ellipse at 30% 20%, rgba(245,175,175,0.3) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(249,223,223,0.25) 0%, transparent 50%)",
      }}
    />
  );
}

export function GlowLights() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="absolute -left-20 top-1/4 h-96 w-96 animate-pulse-slow rounded-full bg-highlight/10 blur-3xl" />
      <div className="absolute -right-20 bottom-1/4 h-80 w-80 animate-pulse-slow rounded-full bg-accent/15 blur-3xl animation-delay-2000" />
      <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 animate-pulse-slow rounded-full bg-secondary/20 blur-3xl animation-delay-4000" />
    </div>
  );
}

export function AnimatedGradientBackground() {
  return (
    <div
      className="absolute inset-0 z-0 animate-gradient-shift"
      style={{
        background:
          "linear-gradient(135deg, #FCF8F8 0%, #FBEFEF 25%, #F9DFDF 50%, #FBEFEF 75%, #FCF8F8 100%)",
        backgroundSize: "400% 400%",
      }}
      aria-hidden="true"
    />
  );
}
