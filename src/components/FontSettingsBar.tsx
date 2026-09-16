import React from "react";
import { Maximize2, Type } from "lucide-react";

interface FontSettingsBarProps {
  currentScale: number;
  currentStyle: string;
  onScaleChange: (scale: number) => void;
  onStyleChange: (style: string) => void;
  onToggleFullScreen: () => void;
}

export const FontSettingsBar: React.FC<FontSettingsBarProps> = ({
  currentScale,
  currentStyle,
  onScaleChange,
  onStyleChange,
  onToggleFullScreen,
}) => {
  const sizes = [
    { label: "S", scale: 0.85 },
    { label: "M", scale: 1.0 },
    { label: "L", scale: 1.35 },
    { label: "XL", scale: 1.75 },
  ];

  const styles = ["Sans", "Mono", "Serif"];

  return (
    <div
      id="font_settings_bar"
      className="w-full bg-slate-900/70 backdrop-blur-md rounded-2xl border border-slate-800/80 px-3 py-2 flex items-center justify-between gap-3 text-xs overflow-x-auto shadow-md"
    >
      <div className="flex items-center gap-1.5 text-slate-400 font-bold shrink-0">
        <Type className="w-3.5 h-3.5 text-teal-400" />
        <span>Font</span>
      </div>

      {/* Size Selector */}
      <div className="flex items-center gap-1 shrink-0">
        {sizes.map(({ label, scale }) => {
          const isSelected = Math.abs(currentScale - scale) < 0.05;
          return (
            <button
              key={label}
              id={`font_size_${label}`}
              type="button"
              onClick={() => onScaleChange(scale)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                isSelected
                  ? "bg-teal-500 text-slate-950 font-bold shadow-sm"
                  : "bg-slate-800/80 text-slate-300 hover:bg-slate-800"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Style Selector */}
      <div className="flex items-center gap-1 shrink-0">
        {styles.map((style) => {
          const isSelected = currentStyle === style;
          return (
            <button
              key={style}
              id={`font_style_${style}`}
              type="button"
              onClick={() => onStyleChange(style)}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                isSelected
                  ? "bg-indigo-500 text-white font-bold shadow-sm"
                  : "bg-slate-800/80 text-slate-300 hover:bg-slate-800"
              }`}
            >
              {style}
            </button>
          );
        })}
      </div>

      {/* Full Screen Mode Toggle */}
      <button
        id="fullscreen_button"
        type="button"
        onClick={onToggleFullScreen}
        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/30 font-semibold transition-all shrink-0 ml-auto"
      >
        <Maximize2 className="w-3.5 h-3.5" />
        <span>Full Screen</span>
      </button>
    </div>
  );
};
