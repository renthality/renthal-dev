import { useEffect, useState } from "react";

const steps = [
  "Initializing...",
  "Loading profile...",
  "Establishing connection...",
  "Welcome, Visitor.",
];

export function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [shown, setShown] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      setShown((p) => [...p, steps[i]]);
      i++;
      if (i >= steps.length) {
        clearInterval(id);
        setTimeout(() => { setDone(true); setTimeout(onDone, 500); }, 600);
      }
    }, 500);
    return () => clearInterval(id);
  }, [onDone]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-black transition-opacity duration-500 ${done ? "opacity-0" : "opacity-100"}`}
    >
      <div className="font-mono text-sm text-foreground/80">
        {shown.map((s, i) => (
          <div key={i} className="animate-fade-up">
            › {s}
          </div>
        ))}
        <span className="animate-blink">▍</span>
      </div>
    </div>
  );
}
