import React, { useState } from "react";
import { AppLanguage, SUPPORTED_LANGUAGES } from "../types";
import { ArrowLeftRight, ChevronDown } from "lucide-react";

interface LanguageSelectorBarProps {
  sourceLang: AppLanguage;
  targetLang: AppLanguage;
  onSourceChange: (lang: AppLanguage) => void;
  onTargetChange: (lang: AppLanguage) => void;
  onSwap: () => void;
}

export const LanguageSelectorBar: React.FC<LanguageSelectorBarProps> = ({
  sourceLang,
  targetLang,
  onSourceChange,
  onTargetChange,
  onSwap,
}) => {
  const [sourceOpen, setSourceOpen] = useState(false);
  const [targetOpen, setTargetOpen] = useState(false);
  const [swapDegree, setSwapDegree] = useState(0);

  const handleSwap = () => {
    setSwapDegree((prev) => prev + 180);
    onSwap();
  };

  return (
    <div
      id="language_selector_bar"
      className="w-full bg-slate-900/75 backdrop-blur-md border border-slate-800/80 rounded-2xl p-2 flex items-center justify-between gap-2 shadow-lg"
    >
      {/* Source Language Pill */}
      <div className="relative flex-1">
        <button
          id="source_lang_pill"
          type="button"
          onClick={() => {
            setSourceOpen(!sourceOpen);
            setTargetOpen(false);
          }}
          className="w-full flex items-center justify-between bg-slate-800/90 hover:bg-slate-800 rounded-xl px-3 py-2 border border-slate-700/60 transition-all text-left"
        >
          <div className="flex items-center gap-2.5 overflow-hidden">
            <span className="text-2xl select-none">{sourceLang.flagEmoji}</span>
            <div className="flex flex-col truncate">
              <span className="text-[10px] font-bold tracking-wider text-teal-400 uppercase">
                Input
              </span>
              <span className="text-sm font-semibold text-slate-100 truncate">
                {sourceLang.displayName}
              </span>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
        </button>

        {sourceOpen && (
          <div className="absolute left-0 top-full mt-1.5 w-56 bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-xl shadow-2xl z-50 py-1 overflow-hidden">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                id={`select_source_${lang.code}`}
                onClick={() => {
                  onSourceChange(lang);
                  setSourceOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-left hover:bg-teal-500/20 transition-colors ${
                  lang.code === sourceLang.code ? "bg-teal-500/15 text-teal-300 font-semibold" : "text-slate-200"
                }`}
              >
                <span className="text-lg">{lang.flagEmoji}</span>
                <span>{lang.displayName} ({lang.nativeName})</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Swap Button */}
      <button
        id="swap_languages_button"
        type="button"
        onClick={handleSwap}
        aria-label="Swap Languages"
        className="w-10 h-10 rounded-full bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 flex items-center justify-center transition-all duration-300 active:scale-90 shrink-0"
      >
        <ArrowLeftRight
          className="w-4 h-4 transition-transform duration-300"
          style={{ transform: `rotate(${swapDegree}deg)` }}
        />
      </button>

      {/* Target Language Pill */}
      <div className="relative flex-1">
        <button
          id="target_lang_pill"
          type="button"
          onClick={() => {
            setTargetOpen(!targetOpen);
            setSourceOpen(false);
          }}
          className="w-full flex items-center justify-between bg-slate-800/90 hover:bg-slate-800 rounded-xl px-3 py-2 border border-slate-700/60 transition-all text-left"
        >
          <div className="flex items-center gap-2.5 overflow-hidden">
            <span className="text-2xl select-none">{targetLang.flagEmoji}</span>
            <div className="flex flex-col truncate">
              <span className="text-[10px] font-bold tracking-wider text-teal-400 uppercase">
                Translate To
              </span>
              <span className="text-sm font-semibold text-slate-100 truncate">
                {targetLang.displayName}
              </span>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
        </button>

        {targetOpen && (
          <div className="absolute right-0 top-full mt-1.5 w-56 bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-xl shadow-2xl z-50 py-1 overflow-hidden">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                id={`select_target_${lang.code}`}
                onClick={() => {
                  onTargetChange(lang);
                  setTargetOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-left hover:bg-teal-500/20 transition-colors ${
                  lang.code === targetLang.code ? "bg-teal-500/15 text-teal-300 font-semibold" : "text-slate-200"
                }`}
              >
                <span className="text-lg">{lang.flagEmoji}</span>
                <span>{lang.displayName} ({lang.nativeName})</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
