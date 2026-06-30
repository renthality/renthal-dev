import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { StarField } from "@/components/StarField";
import { CursorGlow } from "@/components/CursorGlow";
import { Hero } from "@/components/Hero";
import { Status } from "@/components/Status";
import { SocialHub } from "@/components/SocialHub";
import { IdentityCard } from "@/components/IdentityCard";
import { Terminal } from "@/components/Terminal";
import { LoadingScreen } from "@/components/LoadingScreen";
import { AchievementToast, useAchievements } from "@/components/Achievements";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Renthality — 0x3b" },
      { name: "description", content: "Renthal · cybersecurity student · Paris. A premium digital identity card." },
      { property: "og:title", content: "Renthality" },
      { property: "og:description", content: "Premium digital identity card — Paris." },
    ],
  }),
  component: Index,
});

function Index() {
  const [loading, setLoading] = useState(true);
  const [termOpen, setTermOpen] = useState(false);
  const { unlock, toast } = useAchievements();

  return (
    <>
      {loading && <LoadingScreen onDone={() => setLoading(false)} />}
      <StarField />
      <CursorGlow />

      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-16">
        <Hero />
        <Status />
        <SocialHub onUnlock={() => unlock("social")} />
        <IdentityCard />

        <button
          onClick={() => { setTermOpen(true); unlock("terminal"); }}
          className="glass mt-8 flex items-center gap-2 rounded-full px-4 py-2 font-mono text-xs uppercase tracking-[0.25em] text-foreground/80 transition-all hover:text-foreground hover:shadow-[0_0_30px_rgba(200,220,255,0.25)]"
        >
          ›_ open terminal
        </button>

        <footer className="mt-16 font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/40">
          © 2026 Renthality. all rights reserved.
        </footer>
      </main>

      <Terminal open={termOpen} onClose={() => setTermOpen(false)} onUnlock={() => unlock("terminal")} />
      <AchievementToast toast={toast} />
    </>
  );
}
