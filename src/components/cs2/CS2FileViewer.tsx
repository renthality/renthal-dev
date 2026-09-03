import { useEffect } from "react";
import { CopyButton } from "./CopyButton";

function highlight(line: string) {
  if (line.trim().startsWith("//")) return <span className="text-foreground/30">{line}</span>;
  const parts = line.split(/("(?:[^"]*)")/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith('"') ? (
          <span key={i} className="text-sky-200/80">
            {p}
          </span>
        ) : (
          <span key={i} className="text-foreground/75">
            {p}
          </span>
        ),
      )}
    </>
  );
}

export function CS2FileViewer({
  file,
  onClose,
}: {
  file: { name: string; lines: readonly string[] } | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!file) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [file, onClose]);

  if (!file) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="glass animate-fade-up w-full max-w-3xl overflow-hidden rounded-xl font-mono text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
          <span className="text-[11px] uppercase tracking-[0.2em] text-foreground/70">{file.name}</span>
          <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-emerald-300/80">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> loaded
          </span>
          <div className="ml-auto flex items-center gap-2">
            <CopyButton value={file.lines.join("\n")} />
            <button
              onClick={onClose}
              className="rounded-md border border-white/10 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-foreground/60 hover:text-foreground"
            >
              close
            </button>
          </div>
        </div>
        <div className="max-h-[65vh] overflow-auto px-2 py-3">
          {file.lines.map((l, i) => (
            <div key={i} className="flex gap-3 whitespace-pre px-2 leading-relaxed hover:bg-white/[0.02]">
              <span className="w-8 shrink-0 select-none text-right text-foreground/25">{i + 1}</span>
              <span>{highlight(l) as unknown as string}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
