import React from "react";
import { SubtitleConfig, SUBTITLE_CONTRAST_OPTIONS } from "../types";
import {
  RotateCcw,
  Sparkles,
  Volume2,
  SlidersHorizontal,
} from "lucide-react";

interface SubtitleOverlayProps {
  translatedText: string;
  sourceText: string;
  pronunciation: string;
  targetLanguageName: string;
  subtitleConfig: SubtitleConfig;
  isListening: boolean;
  is180Flipped: boolean;
  onToggle180: () => void;
  onAiExplainClick: () => void;
  onSpeakClick: () => void;
  onOpenSettingsClick: () => void;
}

export const SubtitleOverlay: React.FC<SubtitleOverlayProps> = ({
  translatedText,
  sourceText,
  pronunciation,
  targetLanguageName,
  subtitleConfig,
  isListening,
  is180Flipped,
  onToggle180,
  onAiExplainClick,
  onSpeakClick,
  onOpenSettingsClick,
}) => {
  const contrastOption =
    SUBTITLE_CONTRAST_OPTIONS.find((c) => c.id === subtitleConfig.contrastMode) ||
    SUBTITLE_CONTRAST_OPTIONS[0];

  const fontFamilyClass =
    subtitleConfig.fontStyle === "MONOSPACE"
      ? "font-mono"
      : subtitleConfig.fontStyle === "DYSLEXIC_FRIENDLY"
      ? "font-serif tracking-wide"
      : "font-sans";

  const displayText =
    translatedText.trim() ||
    (isListening
      ? "Listening and transcribing..."
      : "Subtitles ready. Tap the microphone or quick phrases to start.");

  return (
    <div
      id="subtitle_overlay_card"
      style={{
        backgroundColor: contrastOption.bgHex,
        color: contrastOption.textHex,
        transform: is180Flipped ? "rotate(180deg)" : "none",
        transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
      className="w-full rounded-2xl p-5 shadow-2xl border border-white/10 relative overflow-hidden select-none"
    >
      {/* Top Header inside Subtitle Card */}
      <div className="flex items-center justify-between gap-2 mb-3 border-b border-current/15 pb-2.5">
        <div className="flex items-center gap-2">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              isListening ? "bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400" : "bg-current opacity-40"
            }`}
          />
          <span className="text-[11px] font-bold tracking-widest uppercase">
            {is180Flipped
              ? `180° FACE-TO-FACE • ${targetLanguageName}`
              : `LIVE SUBTITLES • ${targetLanguageName}`}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1">
          {/* 180 Degree Flip Toggle */}
          <button
            id="subtitle_180_toggle_button"
            type="button"
            onClick={onToggle180}
            title="Rotate 180° for Face-to-Face conversation"
            className={`p-1.5 rounded-lg transition-all ${
              is180Flipped
                ? "bg-cyan-500/30 text-cyan-300 ring-1 ring-cyan-400"
                : "hover:bg-white/10 opacity-80 hover:opacity-100"
            }`}
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* AI Explain Button */}
          <button
            id="subtitle_ai_explain_button"
            type="button"
            onClick={onAiExplainClick}
            title="AI Explain Meaning and Nuances"
            className="p-1.5 rounded-lg hover:bg-white/10 transition-all opacity-80 hover:opacity-100 text-amber-400"
          >
            <Sparkles className="w-4 h-4" />
          </button>

          {/* Read Out Loud TTS */}
          <button
            id="subtitle_tts_button"
            type="button"
            onClick={onSpeakClick}
            title="Speak translation aloud"
            className="p-1.5 rounded-lg hover:bg-white/10 transition-all opacity-80 hover:opacity-100"
          >
            <Volume2 className="w-4 h-4" />
          </button>

          {/* Subtitle Customizer */}
          <button
            id="subtitle_customize_button"
            type="button"
            onClick={onOpenSettingsClick}
            title="Customize Subtitle Styling"
            className="p-1.5 rounded-lg hover:bg-white/10 transition-all opacity-80 hover:opacity-100"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Translated Subtitle Text */}
      <div
        id="subtitle_main_text"
        className={`font-semibold leading-relaxed tracking-tight break-words min-h-[3.2rem] ${fontFamilyClass}`}
        style={{ fontSize: `${subtitleConfig.fontSizeSp}px` }}
      >
        {displayText}
      </div>

      {/* Dictionary-Style Pronunciation Guide Box */}
      {pronunciation && (
        <div
          id="pronunciation_guide_badge"
          className="mt-3 flex items-center gap-2 rounded-lg bg-current/10 border border-current/20 px-3 py-1.5 text-xs"
        >
          <span className="text-[10px] font-extrabold tracking-wider uppercase opacity-75 shrink-0">
            Pronunciation
          </span>
          <span className="font-mono tracking-wide italic font-medium truncate">
            {pronunciation}
          </span>
        </div>
      )}

      {/* Original Source Caption Preview */}
      {sourceText && sourceText !== translatedText && (
        <div className="mt-2 rounded-lg bg-current/5 px-3 py-1 text-xs opacity-75 font-sans truncate">
          Original: {sourceText}
        </div>
      )}
    </div>
  );
};
