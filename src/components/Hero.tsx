export function Hero() {
  return (
    <div className="text-center">
      <h1
        className="font-mono text-2xl font-medium tracking-[0.5em] text-foreground/90 animate-breathe sm:text-3xl md:text-4xl"
        style={{ textShadow: "0 0 12px rgba(255,255,255,0.35), 0 0 32px rgba(180,210,255,0.2)" }}
      >
        RENTHALITY
      </h1>
      <div className="mx-auto mt-3 h-px w-16 bg-foreground/20" />
    </div>
  );
}
