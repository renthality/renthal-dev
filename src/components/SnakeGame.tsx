import { useEffect, useRef, useState } from "react";

const SIZE = 15;
const STEP_MS = 120;

type Pt = { x: number; y: number };

export function SnakeGame({ onExit }: { onExit: () => void }) {
  const [snake, setSnake] = useState<Pt[]>([{ x: 7, y: 7 }, { x: 6, y: 7 }, { x: 5, y: 7 }]);
  const [food, setFood] = useState<Pt>({ x: 10, y: 7 });
  const [dir, setDir] = useState<Pt>({ x: 1, y: 0 });
  const [dead, setDead] = useState(false);
  const dirRef = useRef(dir);
  dirRef.current = dir;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key;
      const d = dirRef.current;
      if ((k === "ArrowUp" || k === "w") && d.y !== 1) setDir({ x: 0, y: -1 });
      else if ((k === "ArrowDown" || k === "s") && d.y !== -1) setDir({ x: 0, y: 1 });
      else if ((k === "ArrowLeft" || k === "a") && d.x !== 1) setDir({ x: -1, y: 0 });
      else if ((k === "ArrowRight" || k === "d") && d.x !== -1) setDir({ x: 1, y: 0 });
      if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(k)) e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (dead) return;
    const t = setInterval(() => {
      setSnake((prev) => {
        const head = { x: prev[0].x + dirRef.current.x, y: prev[0].y + dirRef.current.y };
        if (head.x < 0 || head.y < 0 || head.x >= SIZE || head.y >= SIZE || prev.some(p => p.x === head.x && p.y === head.y)) {
          setDead(true);
          return prev;
        }
        const ate = head.x === food.x && head.y === food.y;
        const next = [head, ...prev];
        if (!ate) next.pop();
        else {
          let nf: Pt;
          do { nf = { x: Math.floor(Math.random()*SIZE), y: Math.floor(Math.random()*SIZE) }; }
          while (next.some(p => p.x === nf.x && p.y === nf.y));
          setFood(nf);
        }
        return next;
      });
    }, STEP_MS);
    return () => clearInterval(t);
  }, [dead, food]);

  const cells = [];
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const isSnake = snake.some(p => p.x === x && p.y === y);
      const isHead = snake[0].x === x && snake[0].y === y;
      const isFood = food.x === x && food.y === y;
      cells.push(
        <div key={`${x}-${y}`} className={`aspect-square rounded-[2px] ${isHead ? "bg-white" : isSnake ? "bg-white/70" : isFood ? "bg-red-400" : "bg-white/5"}`} />
      );
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-xs uppercase tracking-[0.2em] text-foreground/50">
        snake · score {snake.length - 3} · arrows/wasd · esc to exit
      </div>
      <div className="grid w-[300px] gap-[2px] rounded-md border border-white/10 bg-black/40 p-2" style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)` }}>
        {cells}
      </div>
      {dead && (
        <div className="flex items-center gap-3 text-xs text-foreground/70">
          <span>game over</span>
          <button onClick={() => { setSnake([{x:7,y:7},{x:6,y:7},{x:5,y:7}]); setDir({x:1,y:0}); setFood({x:10,y:7}); setDead(false); }} className="rounded border border-white/15 px-2 py-1 hover:bg-white/10">restart</button>
          <button onClick={onExit} className="rounded border border-white/15 px-2 py-1 hover:bg-white/10">exit</button>
        </div>
      )}
    </div>
  );
}
