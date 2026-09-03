import { useState } from "react";

export function CopyButton({ value, label = "copy" }: { value: string; label?: string }) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      /* clipboard unavailable */
    }
    setDone(true);
    setTimeout(() => setDone(false), 1200);
  };
  return (
    <button
      onClick={copy}
      className="shrink-0 rounded-md border border-white/10 bg-white/[0.03] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/60 transition-all hover:border-white/25 hover:text-foreground hover:shadow-[0_0_20px_rgba(200,220,255,0.15)]"
    >
      {done ? "copied" : label}
    </button>
  );
}
