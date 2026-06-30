import { useEffect, useState } from "react";

function fmt(d: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Paris",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(d);
}

export function Status() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="glass mt-6 flex items-center gap-3 rounded-full px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] text-foreground/80">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
      </span>
      <span>PAR</span>
      <span className="opacity-40">//</span>
      <span className="tabular-nums">{fmt(now)}</span>
      <span className="opacity-40">//</span>
      <span>48.85°N · 2.35°E</span>
    </div>
  );
}
