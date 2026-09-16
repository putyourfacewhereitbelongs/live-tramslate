import React, { useEffect, useRef } from "react";

interface PspWaveBackgroundProps {
  audioEnergy?: number;
  gradientTheme?: "CLASSIC_PSP" | "MIDNIGHT_NEON" | "DEEP_RUBY" | "EMERALD";
  styleType?: "PSP_WAVES" | "AURORA" | "COSMIC" | "SUBTLE" | "OFF";
  intensity?: number;
  children: React.ReactNode;
}

export const PspWaveBackground: React.FC<PspWaveBackgroundProps> = ({
  audioEnergy = 0,
  gradientTheme = "CLASSIC_PSP",
  styleType = "PSP_WAVES",
  intensity = 0.7,
  children,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (styleType === "OFF") return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    let t = 0;
    const particles = Array.from({ length: 24 }, (_, i) => ({
      x: ((i * 47) % 100) / 100,
      y: ((i * 73) % 100) / 100,
      radius: 1.5 + (i % 3) * 1.2,
      speed: 0.0003 + (i % 4) * 0.0002,
      alpha: (0.2 + (i % 5) * 0.12) * intensity,
    }));

    const render = () => {
      t += 0.012 + audioEnergy * 0.03;
      ctx.clearRect(0, 0, width, height);

      // Base gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      if (gradientTheme === "DEEP_RUBY") {
        bgGrad.addColorStop(0, "#1E050D");
        bgGrad.addColorStop(1, "#3B0B19");
      } else if (gradientTheme === "EMERALD") {
        bgGrad.addColorStop(0, "#031A14");
        bgGrad.addColorStop(1, "#063327");
      } else if (gradientTheme === "MIDNIGHT_NEON") {
        bgGrad.addColorStop(0, "#080B1E");
        bgGrad.addColorStop(1, "#150C2C");
      } else {
        // CLASSIC_PSP
        bgGrad.addColorStop(0, "#090D1A");
        bgGrad.addColorStop(1, "#141A32");
      }
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      const energyBoost = Math.min(50, audioEnergy * 45);

      // Draw 3 layered resonant PSP ribbons
      const ribbons = [
        {
          baseY: height * 0.52,
          amp1: (45 + energyBoost * 0.8) * intensity,
          amp2: 25 * intensity,
          freq: 0.0028,
          speed: 0.8,
          fillColor: "rgba(99, 102, 241, 0.12)",
          strokeColor: "rgba(99, 102, 241, 0.45)",
          lineWidth: 2,
        },
        {
          baseY: height * 0.48,
          amp1: (65 + energyBoost) * intensity,
          amp2: 35 * intensity,
          freq: 0.0034,
          speed: 1.1,
          fillColor: "rgba(129, 140, 248, 0.16)",
          strokeColor: "rgba(129, 140, 248, 0.75)",
          lineWidth: 2.8,
        },
        {
          baseY: height * 0.56,
          amp1: (40 + energyBoost * 0.6) * intensity,
          amp2: 20 * intensity,
          freq: 0.0042,
          speed: 1.4,
          fillColor: "rgba(56, 189, 248, 0.10)",
          strokeColor: "rgba(56, 189, 248, 0.65)",
          lineWidth: 1.8,
        },
      ];

      ribbons.forEach((r) => {
        // Fill ribbon
        ctx.beginPath();
        ctx.moveTo(0, height);
        for (let x = 0; x <= width + 16; x += 16) {
          const y =
            r.baseY +
            Math.sin(x * r.freq + t * r.speed) * r.amp1 +
            Math.cos(x * r.freq * 0.5 - t * 0.7) * r.amp2;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(width, height);
        ctx.closePath();
        ctx.fillStyle = r.fillColor;
        ctx.fill();

        // Stroke crest
        ctx.beginPath();
        for (let x = 0; x <= width + 16; x += 16) {
          const y =
            r.baseY +
            Math.sin(x * r.freq + t * r.speed) * r.amp1 +
            Math.cos(x * r.freq * 0.5 - t * 0.7) * r.amp2;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = r.strokeColor;
        ctx.lineWidth = r.lineWidth;
        ctx.stroke();
      });

      // Ambient floating dust particles
      particles.forEach((p) => {
        p.y = (p.y - p.speed + 1) % 1;
        const px = p.x * width + Math.sin(t + p.y * 5) * 12;
        const py = p.y * height;
        ctx.beginPath();
        ctx.arc(px, py, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
        ctx.fill();
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [audioEnergy, gradientTheme, styleType, intensity]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-950 text-slate-100 flex flex-col">
      {styleType !== "OFF" && (
        <canvas
          ref={canvasRef}
          className="fixed inset-0 w-full h-full pointer-events-none z-0"
        />
      )}
      <div className="relative z-10 flex flex-col flex-1">{children}</div>
    </div>
  );
};
