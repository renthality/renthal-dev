export function IdentityCard() {
  return (
    <div className="glass mt-8 w-full max-w-md rounded-2xl p-5 font-mono text-sm">
      <div className="mb-4 flex items-center gap-2 border-b border-white/10 pb-3">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-red-500/70" />
          <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
          <div className="h-3 w-3 rounded-full bg-green-500/70" />
        </div>
        <span className="ml-2 text-xs uppercase tracking-[0.2em] text-foreground/50">id_card.sys</span>
      </div>
      <div className="grid grid-cols-[80px_1fr] gap-y-2 text-foreground/80">
        <span className="text-foreground/40">name</span><span>Renthal</span>
        <span className="text-foreground/40">handle</span><span>0x3b</span>
        <span className="text-foreground/40">loc</span><span>Paris, FR</span>
        <span className="text-foreground/40">language</span><span>French · Polish · English</span>
      </div>
    </div>
  );
}
