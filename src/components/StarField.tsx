import { useEffect, useRef } from "react";

type Star = { x: number; y: number; z: number; r: number; tw: number; vy: number };
type Shooting = { x: number; y: number; vx: number; vy: number; life: number; max: number };

export function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let raf = 0;
    let stars: Star[] = [];
    let shooting: Shooting[] = [];
    let particles: { x: number; y: number; vx: number; vy: number; life: number }[] = [];
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.floor((window.innerWidth * window.innerHeight) / 5000);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        z: Math.random() * 1 + 0.2,
        r: Math.random() * 1.2 + 0.2,
        tw: Math.random() * Math.PI * 2,
        vy: 0.2 + Math.random() * 0.8,
      }));
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: MouseEvent) => {
      mouse.current.tx = (e.clientX / window.innerWidth - 0.5) * 30;
      mouse.current.ty = (e.clientY / window.innerHeight - 0.5) * 30;
      if (Math.random() < 0.3) {
        particles.push({
          x: e.clientX,
          y: e.clientY,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          life: 1,
        });
      }
    };
    window.addEventListener("mousemove", onMove);

    const spawnShooting = () => {
      const fromLeft = Math.random() > 0.5;
      shooting.push({
        x: fromLeft ? -50 : window.innerWidth + 50,
        y: Math.random() * window.innerHeight * 0.5,
        vx: fromLeft ? 8 + Math.random() * 6 : -(8 + Math.random() * 6),
        vy: 3 + Math.random() * 2,
        life: 0,
        max: 60 + Math.random() * 40,
      });
    };
    const shootingInterval = window.setInterval(() => {
      if (Math.random() < 0.4) spawnShooting();
    }, 4000);

    const loop = () => {
      mouse.current.x += (mouse.current.tx - mouse.current.x) * 0.05;
      mouse.current.y += (mouse.current.ty - mouse.current.y) * 0.05;

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (const s of stars) {
        s.tw += 0.02;
        s.y += s.vy * s.z;
        if (s.y > window.innerHeight + 4) {
          s.y = -4;
          s.x = Math.random() * window.innerWidth;
        }
        const tw = (Math.sin(s.tw) + 1) / 2;
        const px = s.x + mouse.current.x * s.z;
        const py = s.y + mouse.current.y * s.z;
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,255,255,${0.3 + tw * 0.6 * s.z})`;
        ctx.arc(px, py, s.r * s.z, 0, Math.PI * 2);
        ctx.fill();
        // soft trail
        ctx.strokeStyle = `rgba(255,255,255,${0.15 * s.z})`;
        ctx.lineWidth = s.r * s.z * 0.8;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px, py - 6 * s.z);
        ctx.stroke();
      }

      shooting = shooting.filter((sh) => {
        sh.x += sh.vx;
        sh.y += sh.vy;
        sh.life++;
        const alpha = Math.max(0, 1 - sh.life / sh.max);
        const grad = ctx.createLinearGradient(sh.x, sh.y, sh.x - sh.vx * 10, sh.y - sh.vy * 10);
        grad.addColorStop(0, `rgba(255,255,255,${alpha})`);
        grad.addColorStop(1, "rgba(255,255,255,0)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(sh.x, sh.y);
        ctx.lineTo(sh.x - sh.vx * 10, sh.y - sh.vy * 10);
        ctx.stroke();
        return sh.life < sh.max;
      });

      particles = particles.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.02;
        if (p.life <= 0) return false;
        ctx.beginPath();
        ctx.fillStyle = `rgba(200,220,255,${p.life * 0.5})`;
        ctx.arc(p.x, p.y, 1.2, 0, Math.PI * 2);
        ctx.fill();
        return true;
      });

      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      clearInterval(shootingInterval);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="fixed inset-0 -z-10 h-full w-full" />
      <div className="nebula pointer-events-none fixed inset-0 -z-10" />
    </>
  );
}
