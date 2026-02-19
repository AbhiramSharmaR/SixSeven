import { useEffect, useRef } from "react";

interface Pixel {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  size: number;
  color: string;
  vx: number;
  vy: number;
}

// Generate colors from cyan to dark green
const getHelixColor = (t: number): string => {
  const colors = [
    [0, 255, 255],   // cyan
    [0, 200, 200],
    [0, 180, 160],
    [0, 150, 120],
    [0, 130, 90],
    [0, 100, 64],    // dark green
  ];
  const idx = Math.min(Math.floor(t * (colors.length - 1)), colors.length - 2);
  const frac = (t * (colors.length - 1)) - idx;
  const r = Math.round(colors[idx][0] + (colors[idx + 1][0] - colors[idx][0]) * frac);
  const g = Math.round(colors[idx][1] + (colors[idx + 1][1] - colors[idx][1]) * frac);
  const b = Math.round(colors[idx][2] + (colors[idx + 1][2] - colors[idx][2]) * frac);
  return `rgb(${r},${g},${b})`;
};

export default function DnaCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const pixelsRef = useRef<Pixel[]>([]);
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      initPixels();
    };

    const initPixels = () => {
      const pixels: Pixel[] = [];
      const w = canvas.width;
      const h = canvas.height;
      const spacing = 12;
      const cols = Math.ceil(w / spacing);
      const rows = Math.ceil(h / spacing);

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * spacing + spacing / 2;
          const y = row * spacing + spacing / 2;
          pixels.push({
            x, y, baseX: x, baseY: y,
            size: 2 + Math.random() * 2,
            color: getHelixColor(Math.random()),
            vx: 0, vy: 0,
          });
        }
      }
      pixelsRef.current = pixels;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const animate = () => {
      if (!ctx) return;
      timeRef.current += 0.02;
      const t = timeRef.current;
      const w = canvas.width;
      const h = canvas.height;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      ctx.fillStyle = "rgba(8, 12, 20, 0.15)";
      ctx.fillRect(0, 0, w, h);

      const centerX = w / 2;
      const amplitude = Math.min(w * 0.15, 120);

      for (const p of pixelsRef.current) {
        // DNA helix shape influence
        const normalizedY = p.baseY / h;
        const helixPhase = normalizedY * Math.PI * 4 + t;
        const strand1X = centerX + Math.sin(helixPhase) * amplitude;
        const strand2X = centerX + Math.sin(helixPhase + Math.PI) * amplitude;

        const dist1 = Math.abs(p.baseX - strand1X);
        const dist2 = Math.abs(p.baseX - strand2X);
        const minDist = Math.min(dist1, dist2);

        // Connection bars between strands
        const isBar = Math.abs(Math.sin(helixPhase * 0.5)) < 0.15 &&
                      p.baseX > Math.min(strand1X, strand2X) - 10 &&
                      p.baseX < Math.max(strand1X, strand2X) + 10;

        const helixInfluence = minDist < 40 || isBar ? 1 - Math.min(minDist / 40, 1) : 0;

        // Mouse repulsion
        const dx = p.x - mx;
        const dy = p.y - my;
        const mouseDist = Math.sqrt(dx * dx + dy * dy);
        const mouseRadius = 120;

        if (mouseDist < mouseRadius && mouseDist > 0) {
          const force = (mouseRadius - mouseDist) / mouseRadius * 8;
          p.vx += (dx / mouseDist) * force;
          p.vy += (dy / mouseDist) * force;
        }

        // Spring back
        p.vx += (p.baseX - p.x) * 0.05;
        p.vy += (p.baseY - p.y) * 0.05;
        p.vx *= 0.85;
        p.vy *= 0.85;
        p.x += p.vx;
        p.y += p.vy;

        // Only draw if near helix or bar
        const opacity = Math.max(helixInfluence * 0.9, 0.03);
        const size = p.size * (1 + helixInfluence * 1.5);
        const colorT = (normalizedY + Math.sin(helixPhase) * 0.2 + 0.5) % 1;

        ctx.globalAlpha = opacity;
        ctx.fillStyle = getHelixColor(colorT);
        ctx.fillRect(Math.floor(p.x), Math.floor(p.y), size, size);
      }

      ctx.globalAlpha = 1;
      animRef.current = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener("resize", resize);
    canvas.addEventListener("mousemove", handleMouseMove);
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ background: "hsl(210 30% 4%)" }}
    />
  );
}
