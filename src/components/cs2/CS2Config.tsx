import { useState } from "react";
import { CopyButton } from "./CopyButton";
import { CS2Terminal } from "./CS2Terminal";
import { CS2FileViewer } from "./CS2FileViewer";
import { crosshair, crosshairCode, files, launchOptions, settings, viewmodel } from "@/data/cs2Config";

const stats: [string, string][] = [
  ["sensitivity", "1.00"],
  ["resolution", settings.resolution],
  ["refresh rate", settings.refreshRate],
  ["viewmodel fov", viewmodel.viewmodel_fov],
  ["viewmodel x", viewmodel.viewmodel_offset_x],
  ["viewmodel y", viewmodel.viewmodel_offset_y],
  ["viewmodel z", viewmodel.viewmodel_offset_z],
  ["v-sync", settings.vsync],
  ["msaa", settings.msaa],
  ["display", "1280 × 960 @ 144Hz"],
];

export function CS2Config() {
  const [term, setTerm] = useState(false);
  const [file, setFile] = useState<(typeof files)[number] | null>(null);

  return (
    <section className="mt-20 w-full max-w-3xl animate-fade-up">
      <div className="mb-6 text-center">
        <h2 className="font-mono text-xs uppercase tracking-[0.45em] text-foreground/70 sm:text-sm">
          cs2 <span className="opacity-40">//</span> configuration
        </h2>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/40">
          personal competitive configuration
        </p>
      </div>

      <div className="glass rounded-2xl p-5 transition-shadow hover:shadow-[0_0_50px_rgba(160,200,255,0.08)] sm:p-6">
        <div className="mb-5 flex flex-wrap items-center gap-3 border-b border-white/10 pb-4">
          <span className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-300/80">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> config online
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/40">counter-strike 2</span>
          <button
            onClick={() => setTerm(true)}
            className="ml-auto rounded-full border border-white/10 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/70 transition-all hover:text-foreground hover:shadow-[0_0_25px_rgba(200,220,255,0.2)]"
          >
            ›_ open console
          </button>
        </div>

        {/* settings grid */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 font-mono sm:grid-cols-3">
          {stats.map(([k, v]) => (
            <div key={k}>
              <div className="text-[9px] uppercase tracking-[0.25em] text-foreground/35">{k}</div>
              <div className="mt-1 text-sm text-foreground/90">{v}</div>
            </div>
          ))}
        </div>

        {/* crosshair */}
        <div className="mt-7 border-t border-white/10 pt-5">
          <div className="mb-2 flex items-baseline gap-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/60">crosshair</span>
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-foreground/30">current crosshair</span>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-black/40 px-3 py-2">
            <span className="text-foreground/35">$</span>
            <code className="flex-1 overflow-x-auto whitespace-nowrap font-mono text-xs text-foreground/85">
              {crosshairCode}
            </code>
            <CopyButton value={crosshairCode} />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1 font-mono text-[10px] text-foreground/50 sm:grid-cols-3">
            {Object.entries(crosshair).slice(0, 9).map(([k, v]) => (
              <div key={k} className="flex justify-between gap-2">
                <span className="truncate">{k.replace("cl_crosshair", "")||"style"}</span>
                <span className="text-foreground/80">{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* launch options */}
        <div className="mt-7 border-t border-white/10 pt-5">
          <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/60">launch options</div>
          <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-black/40 px-3 py-2">
            <span className="shrink-0 text-foreground/35">›_</span>
            <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap font-mono text-xs text-foreground/85">
              {launchOptions}
            </code>
            <CopyButton value={launchOptions} />
          </div>
        </div>

        {/* config files */}
        <div className="mt-7 border-t border-white/10 pt-5">
          <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/60">config files</div>
          <div className="grid gap-3 sm:grid-cols-3">
            {files.map((f) => (
              <button
                key={f.name}
                onClick={() => setFile(f)}
                className="rounded-lg border border-white/10 bg-white/[0.02] p-3 text-left font-mono transition-all hover:border-white/25 hover:shadow-[0_0_25px_rgba(200,220,255,0.12)]"
              >
                <div className="text-xs text-foreground/85">{f.name}</div>
                <div className="mt-1 text-[10px] text-foreground/45">{f.desc}</div>
                <div className="mt-2 text-[9px] uppercase tracking-[0.2em] text-foreground/30">{f.meta}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <CS2Terminal open={term} onClose={() => setTerm(false)} />
      <CS2FileViewer file={file} onClose={() => setFile(null)} />
    </section>
  );
}
