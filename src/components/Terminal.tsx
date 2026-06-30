import { useEffect, useRef, useState } from "react";
import { SnakeGame } from "./SnakeGame";

type Line = { kind: "in" | "out"; text: string };

const PROMPT = "visitor@renthality:~$ ";

const links: Record<string, { url: string; label: string }> = {
  steam: { url: "https://steamcommunity.com/id/2o5", label: "steam" },
  discord: { url: "https://discord.com/users/372386857314418688", label: "discord" },
  telegram: { url: "https://t.me/renthality", label: "telegram" },
  instagram: { url: "https://www.instagram.com/renthality", label: "instagram" },
  spotify: { url: "https://open.spotify.com/user/21vybuvzvxxfudqrbfmbvqjba", label: "spotify" },
  twitch: { url: "https://www.twitch.tv/renthality", label: "twitch" },
};

const HELP = [
  "available commands:",
  "  help     — show this list",
  "  clear    — wipe the buffer",
  "  snake    — open snake game",
  "  spotify  — open spotify profile",
  "  steam    — open steam profile",
  "  discord  — open discord profile",
  "  telegram — open telegram",
  "  instagram— open instagram",
  "  twitch   — open twitch channel",
];

export function Terminal({ open, onClose, onUnlock }: { open: boolean; onClose: () => void; onUnlock: () => void }) {
  const [lines, setLines] = useState<Line[]>([
    { kind: "out", text: "renthality.term v2.0 — type 'help' to start" },
  ]);
  const [input, setInput] = useState("");
  const [snake, setSnake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      onUnlock();
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, onUnlock]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [lines]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { if (snake) setSnake(false); else onClose(); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, snake]);

  const run = (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;
    if (cmd === "clear") { setLines([]); return; }
    const newLines: Line[] = [{ kind: "in", text: PROMPT + raw }];
    if (cmd === "help") {
      newLines.push(...HELP.map((t) => ({ kind: "out" as const, text: t })));
    } else if (cmd === "snake") {
      newLines.push({ kind: "out", text: "→ launching snake.exe ... (esc to exit)" });
      setSnake(true);
    } else if (links[cmd]) {
      const { url, label } = links[cmd];
      newLines.push({ kind: "out", text: `→ opening ${label} ...` });
      newLines.push({ kind: "out", text: `   ${url}` });
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      newLines.push({ kind: "out", text: `command not found: ${cmd}. try 'help'.` });
    }
    setLines((prev) => [...prev, ...newLines]);
  };

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="glass w-full max-w-2xl rounded-xl p-0 font-mono text-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
          <div className="flex gap-1.5">
            <button onClick={onClose} className="h-3 w-3 rounded-full bg-red-500/70" />
            <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
            <div className="h-3 w-3 rounded-full bg-green-500/70" />
          </div>
          <span className="ml-2 text-xs uppercase tracking-[0.2em] text-foreground/50">terminal</span>
          <button onClick={onClose} className="ml-auto text-foreground/50 hover:text-foreground">✕</button>
        </div>
        <div ref={scrollRef} className="max-h-[60vh] overflow-y-auto px-4 py-4 text-foreground/85">
          {lines.map((l, i) => (
            <div key={i} className="whitespace-pre-wrap leading-relaxed">{l.text}</div>
          ))}
          {snake && (
            <div className="my-3">
              <SnakeGame onExit={() => setSnake(false)} />
            </div>
          )}
          <form onSubmit={(e) => { e.preventDefault(); run(input); setInput(""); }} className="mt-2 flex items-center gap-1">
            <span className="text-foreground/60">{PROMPT}</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent text-foreground outline-none"
              spellCheck={false} autoComplete="off"
            />
          </form>
        </div>
      </div>
    </div>
  );
}
