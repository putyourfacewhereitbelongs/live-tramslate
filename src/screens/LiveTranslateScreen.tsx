import React, { useState } from "react";
import {
  AppLanguage,
  SubtitleConfig,
  SubtitleContrast,
  SubtitleFontStyle,
  SUBTITLE_CONTRAST_OPTIONS,
  TranscriptionProviderInfo,
} from "../types";
import { SpeechManager } from "../services/SpeechManager";
import { TranslationEngine } from "../services/TranslationEngine";
import { LanguageSelectorBar } from "../components/LanguageSelectorBar";
import { SubtitleOverlay } from "../components/SubtitleOverlay";
import { WaveformVisualizer } from "../components/WaveformVisualizer";
import { FontSettingsBar } from "../components/FontSettingsBar";
import { AiExplainDialog } from "../components/AiExplainDialog";
import {
  Lock,
  Zap,
  Cloud,
  CloudOff,
  Mic,
  MicOff,
  Volume2,
  Send,
  Sparkles,
  Check,
  CheckCircle2,
  Sliders,
} from "lucide-react";

interface LiveTranslateScreenProps {
  speechManager: SpeechManager;
  translationEngine: TranslationEngine;
  sourceLang: AppLanguage;
  targetLang: AppLanguage;
  onSourceLangChange: (l: AppLanguage) => void;
  onTargetLangChange: (l: AppLanguage) => void;
  onSwapLanguages: () => void;
  liveInput: string;
  liveTranslated: string;
  livePronunciation: string;
  latencyMs: number;
  activeModelName: string;
  isOfflineMode: boolean;
  onToggleOfflineMode: (offline: boolean) => void;
  subtitleConfig: SubtitleConfig;
  onUpdateSubtitleConfig: (c: SubtitleConfig) => void;
  onRecordTurn: (src: string, trans: string) => void;
  e2eeFingerprint: string;
  onNavigateToSettings: () => void;
}

export const LiveTranslateScreen: React.FC<LiveTranslateScreenProps> = ({
  speechManager,
  translationEngine,
  sourceLang,
  targetLang,
  onSourceLangChange,
  onTargetLangChange,
  onSwapLanguages,
  liveInput,
  liveTranslated,
  livePronunciation,
  latencyMs,
  activeModelName,
  isOfflineMode,
  onToggleOfflineMode,
  subtitleConfig,
  onUpdateSubtitleConfig,
  onRecordTurn,
  e2eeFingerprint,
  onNavigateToSettings,
}) => {
  const [is180Flipped, setIs180Flipped] = useState(false);
  const [fontScale, setFontScale] = useState(1.0);
  const [fontStyle, setFontStyle] = useState("Sans");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showSubtitleModal, setShowSubtitleModal] = useState(false);
  const [showAiExplainModal, setShowAiExplainModal] = useState(false);
  const [aiExplanation, setAiExplanation] = useState("");
  const [isLoadingExplain, setIsLoadingExplain] = useState(false);
  const [manualQuery, setManualQuery] = useState("");

  const quickPhrases = React.useMemo(() => {
    switch (sourceLang.code) {
      case "es":
        return [
          "Hola cómo estás",
          "Dónde está el hospital",
          "Necesito ayuda",
          "Muchas gracias",
          "Buenos días",
        ];
      case "hi":
        return [
          "नमस्ते",
          "आप कैसे हैं?",
          "अस्पताल कहाँ है?",
          "धन्यवाद",
          "मुझे मदद चाहिए",
        ];
      default:
        return [
          "Hello how are you",
          "Where is the hospital",
          "Can you help me",
          "Thank you very much",
          "I need help",
        ];
    }
  }, [sourceLang.code]);

  const handleToggleMic = () => {
    if (speechManager.isListening) {
      speechManager.stopListening();
    } else {
      speechManager.startListening(sourceLang);
    }
  };

  const handleManualSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!manualQuery.trim()) return;
    const q = manualQuery.trim();
    setManualQuery("");
    speechManager.simulateAudioInput(q);
  };

  const handleAiExplain = async () => {
    const src = liveInput.trim() || (sourceLang.code === "es" ? "Hola" : "Hello");
    const tgt = liveTranslated.trim() || (targetLang.code === "hi" ? "नमस्ते" : "Hola");
    setShowAiExplainModal(true);
    setIsLoadingExplain(true);
    const explanation = await translationEngine.explainTranslation(
      src,
      tgt,
      sourceLang,
      targetLang
    );
    setAiExplanation(explanation);
    setIsLoadingExplain(false);
  };

  // Full Screen text display presentation
  if (isFullScreen) {
    return (
      <div
        className="fixed inset-0 z-50 bg-slate-950 flex flex-col justify-between p-6 sm:p-12 select-none animate-fadeIn"
        onClick={() => setIsFullScreen(false)}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold tracking-widest text-teal-400 uppercase">
              {sourceLang.displayName} ➔ {targetLang.displayName} • {speechManager.activeProvider.name}
            </span>
          </div>
          <button
            id="exit_fullscreen_button"
            onClick={() => setIsFullScreen(false)}
            className="px-3 py-1.5 rounded-xl bg-slate-800/90 text-slate-300 text-xs font-semibold hover:bg-slate-700"
          >
            Exit Full Screen (Tap anywhere)
          </button>
        </div>

        <div className="flex-1 flex flex-col justify-center items-center text-center my-8 max-w-4xl mx-auto w-full gap-6">
          {liveInput && (
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl px-6 py-3">
              <span className="text-xs text-sky-400 font-bold tracking-widest uppercase block mb-1">
                {sourceLang.displayName} (Original)
              </span>
              <p
                className="text-slate-300 font-normal leading-relaxed"
                style={{ fontSize: `${20 * fontScale}px` }}
              >
                {liveInput}
              </p>
            </div>
          )}

          <div className="w-full bg-slate-900/80 border border-teal-500/30 rounded-3xl p-8 shadow-2xl">
            <span className="text-xs text-emerald-400 font-extrabold tracking-widest uppercase block mb-3">
              {targetLang.displayName} (Live Translation)
            </span>
            <h1
              className="text-white font-bold leading-tight break-words"
              style={{ fontSize: `${42 * fontScale}px` }}
            >
              {liveTranslated || (speechManager.isListening ? "Listening..." : "Speak now")}
            </h1>

            {livePronunciation && (
              <div className="mt-4 flex items-center justify-center gap-2 text-amber-300 text-base font-mono italic">
                <span>Pronunciation:</span>
                <span>{livePronunciation}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center text-xs text-slate-500">
          <span>Latency: {latencyMs}ms</span>
          <span>Transcription: {speechManager.activeProvider.name}</span>
          <span>Trill Instant Engine</span>
        </div>
      </div>
    );
  }

  return (
    <div
      id="live_translate_screen"
      className="flex flex-col gap-4 max-w-3xl mx-auto w-full pb-20 pt-2 px-3 sm:px-4"
    >
      {/* Top Security, Provider & Latency Header Bar */}
      <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
        {/* E2EE Badge */}
        <div
          id="e2ee_badge"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-teal-500/15 border border-teal-500/30 text-teal-300 font-semibold"
        >
          <Lock className="w-3.5 h-3.5 text-teal-400" />
          <span>E2EE {e2eeFingerprint}</span>
        </div>

        {/* Transcription Provider Indicator (Samsung Default) */}
        <button
          onClick={onNavigateToSettings}
          title="Change Transcription Provider in Settings"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 font-semibold hover:bg-indigo-500/25 transition-all"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
          <span className="truncate max-w-[170px] sm:max-w-none">
            {speechManager.activeProvider.name}
          </span>
        </button>

        {/* Latency Chip */}
        <div
          id="latency_chip"
          className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold"
        >
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>{latencyMs}ms</span>
        </div>

        {/* Offline / Cloud Toggle */}
        <button
          id="offline_mode_toggle"
          type="button"
          onClick={() => onToggleOfflineMode(!isOfflineMode)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border transition-all font-semibold ${
            isOfflineMode
              ? "bg-purple-500/20 border-purple-500/40 text-purple-300"
              : "bg-slate-800 border-slate-700 text-slate-300"
          }`}
        >
          {isOfflineMode ? (
            <>
              <CloudOff className="w-3.5 h-3.5 text-purple-400" />
              <span>Offline Whisper</span>
            </>
          ) : (
            <>
              <Cloud className="w-3.5 h-3.5 text-sky-400" />
              <span>Cloud AI</span>
            </>
          )}
        </button>
      </div>

      {/* Decorative Brand Hero Banner */}
      <div className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-r from-teal-950/80 via-slate-900 to-indigo-950/80 border border-slate-800/80 p-4 shadow-xl flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-extrabold tracking-widest text-teal-400">
              Samsung Live Transcribe • Real-Time
            </span>
            <span className="px-2 py-0.5 rounded-full bg-teal-400/20 text-teal-300 text-[10px] font-bold">
              0-5ms Latency
            </span>
          </div>
          <h2 className="text-lg font-extrabold text-white tracking-tight">
            Instant Multilingual Translation
          </h2>
          <p className="text-xs text-slate-300">
            English ⇄ Spanish ⇄ Hindi with dictionary pronunciations & face-to-face mode
          </p>
        </div>
      </div>

      {/* Language Selector Bar */}
      <LanguageSelectorBar
        sourceLang={sourceLang}
        targetLang={targetLang}
        onSourceChange={onSourceLangChange}
        onTargetChange={onTargetLangChange}
        onSwap={onSwapLanguages}
      />

      {/* Configurable Font & Display Toolbar */}
      <FontSettingsBar
        currentScale={fontScale}
        currentStyle={fontStyle}
        onScaleChange={setFontScale}
        onStyleChange={setFontStyle}
        onToggleFullScreen={() => setIsFullScreen(true)}
      />

      {/* Subtitle Card with 180° Flip & Dictionary Pronunciation */}
      <SubtitleOverlay
        translatedText={liveTranslated}
        sourceText={liveInput}
        pronunciation={livePronunciation}
        targetLanguageName={targetLang.displayName}
        subtitleConfig={{
          ...subtitleConfig,
          fontSizeSp: Math.round(subtitleConfig.fontSizeSp * fontScale),
          fontStyle:
            fontStyle === "Mono"
              ? "MONOSPACE"
              : fontStyle === "Serif"
              ? "DYSLEXIC_FRIENDLY"
              : "SANS_SERIF",
        }}
        isListening={speechManager.isListening}
        is180Flipped={is180Flipped}
        onToggle180={() => setIs180Flipped(!is180Flipped)}
        onAiExplainClick={handleAiExplain}
        onSpeakClick={() => speechManager.speakText(liveTranslated, targetLang)}
        onOpenSettingsClick={() => setShowSubtitleModal(true)}
      />

      {/* Audio Waveform Visualizer */}
      <div className="bg-slate-900/50 backdrop-blur-md rounded-2xl border border-slate-800/80 p-3.5 shadow-lg">
        <div className="flex items-center justify-between text-xs mb-2">
          <div className="flex items-center gap-2 truncate">
            <span
              className={`w-2 h-2 rounded-full ${
                speechManager.isListening
                  ? "bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400"
                  : "bg-slate-500"
              }`}
            />
            <span className="text-slate-300 font-medium truncate">
              {speechManager.isListening
                ? speechManager.voiceDetectionStatus
                : "Audio Stream Idle"}
            </span>
          </div>
          {speechManager.isListening && (
            <span className="px-2 py-0.5 rounded-md bg-teal-500/20 text-teal-300 font-mono font-bold text-[11px]">
              {speechManager.micDecibels} dB
            </span>
          )}
        </div>
        <WaveformVisualizer
          isListening={speechManager.isListening}
          amplitude={speechManager.audioAmplitude}
        />
      </div>

      {/* Central Tactile Microphone Action Button */}
      <div className="flex flex-col items-center justify-center my-1 gap-2">
        <div className="relative flex items-center justify-center">
          {speechManager.isListening && (
            <div className="absolute w-24 h-24 rounded-full bg-rose-500/25 animate-ping pointer-events-none" />
          )}
          <button
            id="microphone_toggle_button"
            type="button"
            onClick={handleToggleMic}
            className={`w-18 h-18 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 active:scale-90 ${
              speechManager.isListening
                ? "bg-rose-500 hover:bg-rose-600 text-white ring-4 ring-rose-500/40"
                : "bg-gradient-to-tr from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-white ring-4 ring-teal-500/25 shadow-teal-500/30"
            }`}
          >
            {speechManager.isListening ? (
              <MicOff className="w-8 h-8" />
            ) : (
              <Mic className="w-8 h-8" />
            )}
          </button>
        </div>

        <p className="text-xs font-medium text-slate-300 text-center">
          {speechManager.isListening
            ? `Listening via ${speechManager.activeProvider.name} (${speechManager.micDecibels} dB) • Tap to stop`
            : "Tap microphone to speak or pick a quick test phrase below"}
        </p>

        {/* Test Voice Audio button for instant testing in preview */}
        <button
          id="simulate_voice_button"
          type="button"
          onClick={() => {
            const sample = quickPhrases[0] || "Hello how are you";
            speechManager.simulateAudioInput(sample);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-teal-300 border border-teal-500/30 text-xs font-semibold transition-all mt-1"
        >
          <Volume2 className="w-3.5 h-3.5 text-teal-400" />
          <span>Test Voice Audio: "{quickPhrases[0]}"</span>
        </button>
      </div>

      {/* Quick Test Phrase Chips */}
      <div className="flex flex-col gap-2 mt-1">
        <span className="text-[11px] font-bold tracking-wider text-teal-400 uppercase">
          Quick Test Phrases ({sourceLang.code.toUpperCase()})
        </span>
        <div className="flex flex-wrap gap-2">
          {quickPhrases.map((phrase) => (
            <button
              key={phrase}
              id={`quick_phrase_${phrase.slice(0, 8)}`}
              type="button"
              onClick={() => speechManager.simulateAudioInput(phrase)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                liveInput.toLowerCase() === phrase.toLowerCase()
                  ? "bg-teal-500 text-slate-950 border-teal-400 font-bold shadow-sm"
                  : "bg-slate-900/80 border-slate-700/70 text-slate-300 hover:bg-slate-800 hover:border-slate-600"
              }`}
            >
              {phrase}
            </button>
          ))}
        </div>
      </div>

      {/* Manual Direct Text Input */}
      <form onSubmit={handleManualSubmit} className="flex items-center gap-2 mt-2">
        <input
          id="manual_text_input"
          type="text"
          value={manualQuery}
          onChange={(e) => setManualQuery(e.target.value)}
          placeholder={sourceLang.placeholder}
          className="flex-1 bg-slate-900/80 border border-slate-700/80 focus:border-teal-500 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 outline-none transition-all"
        />
        <button
          id="send_manual_text_button"
          type="submit"
          className="w-10 h-10 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 flex items-center justify-center transition-all shrink-0 active:scale-95"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      {/* Subtitle Customization Modal */}
      {showSubtitleModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl p-6 shadow-2xl flex flex-col gap-4 text-slate-100">
            <h3 className="font-bold text-base">Subtitle & Accessibility Styling</h3>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Font Size</span>
                <span className="font-bold text-teal-400">{subtitleConfig.fontSizeSp}px</span>
              </div>
              <input
                id="font_size_slider"
                type="range"
                min="14"
                max="36"
                step="2"
                value={subtitleConfig.fontSizeSp}
                onChange={(e) =>
                  onUpdateSubtitleConfig({
                    ...subtitleConfig,
                    fontSizeSp: Number(e.target.value),
                  })
                }
                className="w-full accent-teal-400"
              />
            </div>

            <div>
              <span className="text-xs font-semibold block mb-2">High Contrast Mode</span>
              <div className="grid grid-cols-2 gap-2">
                {SUBTITLE_CONTRAST_OPTIONS.map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() =>
                      onUpdateSubtitleConfig({
                        ...subtitleConfig,
                        contrastMode: mode.id,
                      })
                    }
                    className={`flex items-center gap-2 p-2 rounded-xl border text-xs text-left transition-all ${
                      subtitleConfig.contrastMode === mode.id
                        ? "border-teal-400 bg-slate-800"
                        : "border-slate-800 hover:bg-slate-800/50"
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-slate-600 shrink-0"
                      style={{ backgroundColor: mode.bgHex }}
                    />
                    <span className="truncate">{mode.label}</span>
                    {subtitleConfig.contrastMode === mode.id && (
                      <Check className="w-3.5 h-3.5 text-teal-400 ml-auto shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold block mb-2">Typography Style</span>
              <div className="flex gap-2">
                {(["SANS_SERIF", "MONOSPACE", "DYSLEXIC_FRIENDLY"] as SubtitleFontStyle[]).map(
                  (style) => (
                    <button
                      key={style}
                      type="button"
                      onClick={() =>
                        onUpdateSubtitleConfig({
                          ...subtitleConfig,
                          fontStyle: style,
                        })
                      }
                      className={`flex-1 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                        subtitleConfig.fontStyle === style
                          ? "border-teal-400 bg-teal-500/20 text-teal-300 font-bold"
                          : "border-slate-800 text-slate-300 hover:bg-slate-800"
                      }`}
                    >
                      {style === "SANS_SERIF"
                        ? "Sans"
                        : style === "MONOSPACE"
                        ? "Mono"
                        : "Rounded"}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <span className="text-xs font-medium">Read Aloud with TTS</span>
              <input
                id="tts_switch"
                type="checkbox"
                checked={subtitleConfig.speakerTtsEnabled}
                onChange={(e) =>
                  onUpdateSubtitleConfig({
                    ...subtitleConfig,
                    speakerTtsEnabled: e.target.checked,
                  })
                }
                className="w-4 h-4 accent-teal-400"
              />
            </div>

            <button
              id="save_subtitle_settings_button"
              type="button"
              onClick={() => setShowSubtitleModal(false)}
              className="mt-2 w-full py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs"
            >
              Apply Settings
            </button>
          </div>
        </div>
      )}

      {/* AI Explain Modal */}
      {showAiExplainModal && (
        <AiExplainDialog
          sourceText={liveInput}
          translatedText={liveTranslated}
          pronunciation={livePronunciation}
          explanation={aiExplanation}
          isLoading={isLoadingExplain}
          onDismiss={() => setShowAiExplainModal(false)}
          onSpeak={() => speechManager.speakText(liveTranslated, targetLang)}
        />
      )}
    </div>
  );
};
