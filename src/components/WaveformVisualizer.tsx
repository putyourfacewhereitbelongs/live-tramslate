import React, { useEffect, useRef } from "react";

interface WaveformVisualizerProps {
  isListening: boolean;
  amplitude: number;
  barCount?: number;
}

export const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({
  isListening,
  amplitude,
  barCount = 32,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let phase = 0;

    const render = () => {
      const w = (canvas.width = canvas.clientWidth);
      const h = (canvas.height = canvas.clientHeight);
      ctx.clearRect(0, 0, w, h);

      phase += 0.06;
      const midY = h / 2;
      const activeAmp = isListening ? Math.max(3, amplitude * 18) : 2;

      // Primary sine wave ribbon
      ctx.beginPath();
      ctx.moveTo(0, midY);
      const step = 8;
      for (let x = 0; x <= w; x += step) {
        const progress = x / w;
        const envelope = Math.sin(progress * Math.PI);
        const y = midY + Math.sin(progress * 4 * Math.PI + phase) * activeAmp * envelope;
        ctx.lineTo(x, y);
      }
      const grad1 = ctx.createLinearGradient(0, 0, w, 0);
      grad1.addColorStop(0, "#00E5FF");
      grad1.addColorStop(0.5, "#6366F1");
      grad1.addColorStop(1, "#D500F9");
      ctx.strokeStyle = grad1;
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      ctx.stroke();

      // Complementary harmonic wave
      if (isListening) {
        ctx.beginPath();
        ctx.moveTo(0, midY);
        for (let x = 0; x <= w; x += step) {
          const progress = x / w;
          const envelope = Math.sin(progress * Math.PI);
          const y = midY + Math.sin(progress * 6 * Math.PI - phase * 1.3) * (activeAmp * 0.65) * envelope;
          ctx.lineTo(x, y);
        }
        const grad2 = ctx.createLinearGradient(0, 0, w, 0);
        grad2.addColorStop(0, "#38BDF8");
        grad2.addColorStop(1, "#00E5FF");
        ctx.strokeStyle = grad2;
        ctx.lineWidth = 1.8;
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isListening, amplitude]);

  return (
    <div
      id="waveform_visualizer"
      className="w-full bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800/90 p-3 shadow-inner"
    >
      {/* Sine wave canvas */}
      <div className="w-full h-10 overflow-hidden mb-2">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      {/* 32-band Spectrum Equalizer */}
      <div className="flex items-center justify-between gap-1 h-8 px-1">
        {Array.from({ length: barCount }).map((_, i) => {
          const harmonic = Math.sin((i / barCount) * Math.PI);
          const noise = isListening ? (Math.sin(i * 99 + Date.now() * 0.005) * 0.2 + 0.8) : 0.1;
          const heightPercent = isListening
            ? Math.min(100, Math.max(12, amplitude * noise * (0.3 + harmonic * 0.7) * 120))
            : 10;

          const isCyan = i < barCount / 3;
          const isPurple = i >= (barCount * 2) / 3;

          return (
            <div
              key={i}
              className="flex-1 rounded-full transition-all duration-75"
              style={{
                height: `${heightPercent}%`,
                background: isListening
                  ? isCyan
                    ? "linear-gradient(to top, #00E5FF, #6366F1)"
                    : isPurple
                    ? "linear-gradient(to top, #D500F9, #00E676)"
                    : "linear-gradient(to top, #6366F1, #D500F9)"
                  : "rgba(99, 102, 241, 0.2)",
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
