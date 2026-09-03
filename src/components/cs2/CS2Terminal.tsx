import { useEffect, useRef, useState } from "react";
import {
  binds,
  crosshair,
  crosshairCode,
  cvars,
  launchOptions,
  settings,
  video,
  viewmodel,
} from "@/data/cs2Config";

type Line = { kind: "in" | "out" | "dim" | "err"; text: string };

const PROMPT = "] ";

const COMMANDS = [
  "help",
  "clear",
  "history",
  "cfg",
  "settings",
  "crosshair",
  "launch_options",
  "video",
  "viewmodel",
  "sensitivity",
  "bind",
  "find",
  "exec",
];

const pad = (k: string, v: string, w = 30) => k.padEnd(w, " ") + `"${v}"`;
const rule = "────────────────────────────";

export function CS2Terminal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [lines, setLines] = useState<Line[]>([
    { kind: "dim", text: "CS2 web console — simulation only. type 'help'." },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [hIdx, setHIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 80);
  }, [open]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [lines]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const push = (ls: Line[]) => setLines((prev) => [...prev, ...ls]);
  const out = (texts: string[]) => push(texts.map((t) => ({ kind: "out" as const, text: t })));

  const execSequence = (steps: string[]) => {
    steps.forEach((s, i) =>
      setTimeout(() => push([{ kind: "dim", text: s }]), 180 * (i + 1)),
    );
  };

  const run = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return;
    setHistory((h) => [...h, trimmed]);
    setHIdx(-1);
    const [cmd, ...args] = trimmed.split(/\s+/);
    const c = cmd.toLowerCase();
    const arg = args.join(" ");

    if (c === "clear") {
      setLines([]);
      return;
    }
    push([{ kind: "in", text: PROMPT + trimmed }]);

    switch (c) {
      case "help":
        out(["CS2 WEB CONSOLE", rule, "Available commands:", ...COMMANDS.map((x) => "  " + x), "", "Type a command to continue."]);
        break;
      case "history":
        out(history.length ? history.map((h, i) => `  ${i + 1}  ${h}`) : ["  (empty)"]);
        break;
      case "settings":
      case "cfg":
        out([
          "CONFIG // RENTHALITY",
          rule,
          pad("sensitivity", settings.sensitivity),
          pad("resolution", settings.resolution),
          pad("refresh_rate", settings.refreshRate),
          pad("msaa", settings.msaa),
          pad("mat_vsync", "0"),
          ...Object.entries(viewmodel).map(([k, v]) => pad(k, v)),
        ]);
        break;
      case "sensitivity":
        out([pad("sensitivity", settings.sensitivity)]);
        break;
      case "viewmodel":
        out(["VIEWMODEL // viewmodelup.cfg", rule, ...Object.entries(viewmodel).map(([k, v]) => pad(k, v))]);
        break;
      case "crosshair":
        out([
          "CROSSHAIR CONFIG",
          rule,
          pad("code", crosshairCode),
          ...Object.entries(crosshair).map(([k, v]) => pad(k, v)),
        ]);
        push([{ kind: "dim", text: "[ tip ] use the COPY button in the crosshair card above" }]);
        break;
      case "launch_options":
        out(["LAUNCH OPTIONS", rule, launchOptions]);
        break;
      case "video":
        out(["VIDEO // cs2_video.txt", rule, ...video.map(([k, v]) => pad(k, v, 24))]);
        break;
      case "bind": {
        if (!arg) {
          out(["BINDS", rule, ...Object.entries(binds).map(([k, v]) => `  "${k}" = "${v}"`)]);
          break;
        }
        const found = Object.keys(binds).find((k) => k.toLowerCase() === arg.toLowerCase());
        if (found) out([`"${found}" = "${binds[found]}"`]);
        else push([{ kind: "err", text: `] "${arg}" is not bound` }]);
        break;
      }
      case "find": {
        if (!arg) {
          push([{ kind: "err", text: "] usage: find <string>" }]);
          break;
        }
        const hits = Object.keys(cvars).filter((k) => k.toLowerCase().includes(arg.toLowerCase()));
        if (hits.length) out([`found ${hits.length} matches for "${arg}"`, rule, ...hits.map((k) => pad(k, cvars[k]))]);
        else push([{ kind: "err", text: `] no cvars matching "${arg}"` }]);
        break;
      }
      case "exec": {
        const f = arg.toLowerCase();
        if (f === "autoexec.cfg" || f === "autoexec") {
          execSequence([
            "[Config] Executing autoexec.cfg...",
            "[Config] Loading binds...",
            "[Config] Loading crosshair...",
            "[Config] Loading HUD settings...",
            "[Config] Loading mouse settings...",
            "[Config] Loading audio settings...",
            "[Config] autoexec.cfg loaded.",
          ]);
        } else if (f === "viewmodelup.cfg" || f === "viewmodelup") {
          execSequence([
            "[Config] Executing viewmodelup.cfg...",
            "[Config] viewmodel_fov 68",
            "[Config] viewmodel_offset_x 2.5",
            "[Config] viewmodel_offset_y 2",
            "[Config] viewmodel_offset_z -2",
            "[Config] viewmodelup.cfg loaded.",
          ]);
        } else {
          push([{ kind: "err", text: `] Could not exec "${arg || "?"}"` }]);
        }
        break;
      }
      default: {
        const cvar = Object.keys(cvars).find((k) => k === c);
        if (cvar) out([pad(cvar, cvars[cvar])]);
        else push([{ kind: "err", text: `] Unknown command: ${cmd}` }]);
      }
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const word = input.trim().toLowerCase();
      if (!word) return;
      const pool = [...COMMANDS, ...Object.keys(cvars)];
      const matches = pool.filter((p) => p.startsWith(word));
      if (matches.length === 1) setInput(matches[0] + " ");
      else if (matches.length > 1) {
        push([{ kind: "in", text: PROMPT + input }, ...matches.map((m) => ({ kind: "dim" as const, text: "  " + m }))]);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!history.length) return;
      const idx = hIdx === -1 ? history.length - 1 : Math.max(0, hIdx - 1);
      setHIdx(idx);
      setInput(history[idx]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (hIdx === -1) return;
      const idx = hIdx + 1;
      if (idx >= history.length) {
        setHIdx(-1);
        setInput("");
      } else {
        setHIdx(idx);
        setInput(history[idx]);
      }
    }
  };

  if (!open) return null;

  const color = (k: Line["kind"]) =>
    k === "in" ? "text-foreground/60" : k === "err" ? "text-rose-300/80" : k === "dim" ? "text-foreground/45" : "text-foreground/85";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 backdrop-blur-sm" onClick={onClose}>
      <div
        className="glass animate-fade-up w-full max-w-[860px] overflow-hidden rounded-xl font-mono text-[11px] shadow-[0_0_60px_rgba(160,200,255,0.07)] sm:text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
          <span className="text-[10px] uppercase tracking-[0.25em] text-foreground/70">cs2 console</span>
          <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-emerald-300/80">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> local
          </span>
          <div className="ml-auto flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
            <button onClick={onClose} className="h-3 w-3 rounded-full bg-red-500/70" aria-label="close console" />
          </div>
        </div>
        <div ref={scrollRef} className="max-h-[62vh] overflow-y-auto px-4 py-4" onClick={() => inputRef.current?.focus()}>
          {lines.map((l, i) => (
            <div key={i} className={`overflow-x-auto whitespace-pre leading-relaxed ${color(l.kind)}`}>
              {l.text}
            </div>
          ))}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              run(input);
              setInput("");
            }}
            className="mt-2 flex items-center gap-1"
          >
            <span className="text-foreground/55">{PROMPT}</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              className="flex-1 bg-transparent text-foreground outline-none"
              spellCheck={false}
              autoComplete="off"
              autoCapitalize="off"
            />
            <span className="animate-blink text-foreground/70">▍</span>
          </form>
        </div>
      </div>
    </div>
  );
}
