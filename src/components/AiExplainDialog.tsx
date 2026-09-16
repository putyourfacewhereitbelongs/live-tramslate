import React from "react";
import { Sparkles, X, Volume2, Loader2 } from "lucide-react";

interface AiExplainDialogProps {
  sourceText: string;
  translatedText: string;
  pronunciation: string;
  explanation: string;
  isLoading: boolean;
  onDismiss: () => void;
  onSpeak: () => void;
}

export const AiExplainDialog: React.FC<AiExplainDialogProps> = ({
  sourceText,
  translatedText,
  pronunciation,
  explanation,
  isLoading,
  onDismiss,
  onSpeak,
}) => {
  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div
        id="ai_explain_dialog"
        className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl p-6 shadow-2xl overflow-y-auto max-h-[90vh] text-slate-100 flex flex-col gap-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-100">AI Translation Breakdown</h3>
              <p className="text-xs text-slate-400">Linguistic & Cultural Context</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onDismiss}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Translation & Pronunciation Card */}
        <div className="bg-slate-800/70 border border-slate-700/60 rounded-2xl p-4">
          <span className="text-[10px] font-bold tracking-wider text-teal-400 uppercase">
            Translation
          </span>
          <div className="flex items-center justify-between gap-2 mt-1">
            <span className="text-lg font-bold text-slate-100">{translatedText || "—"}</span>
            <button
              type="button"
              onClick={onSpeak}
              className="p-2 rounded-lg bg-teal-500/20 text-teal-300 hover:bg-teal-500/30 transition-colors"
              title="Speak"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
          {pronunciation && (
            <p className="mt-2 text-xs font-mono text-amber-300">
              Pronunciation: {pronunciation}
            </p>
          )}
          {sourceText && (
            <p className="mt-1 text-xs text-slate-400 italic">
              Original: "{sourceText}"
            </p>
          )}
        </div>

        {/* AI Breakdown Body */}
        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 className="w-7 h-7 text-teal-400 animate-spin" />
            <p className="text-xs">Analyzing linguistic nuances, cultural registers & syllables...</p>
          </div>
        ) : (
          <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-4 text-xs leading-relaxed text-slate-200 space-y-3">
            {explanation.split("\n\n").map((chunk, idx) => (
              <p key={idx} className="whitespace-pre-line">
                {chunk}
              </p>
            ))}
          </div>
        )}

        {/* Close button */}
        <button
          id="ai_explain_close_button"
          type="button"
          onClick={onDismiss}
          className="w-full py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm transition-all"
        >
          Done
        </button>
      </div>
    </div>
  );
};
