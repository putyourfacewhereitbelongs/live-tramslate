import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  AppLanguage,
  SUPPORTED_LANGUAGES,
  SubtitleConfig,
  TranscriptionProviderId,
  LatencyMode,
  BackgroundStyle,
  TranscriptSession,
  TranscriptTurn,
} from "./types";
import { SpeechManager } from "./services/SpeechManager";
import { TranslationEngine } from "./services/TranslationEngine";
import { PspWaveBackground } from "./components/PspWaveBackground";
import { LiveTranslateScreen } from "./screens/LiveTranslateScreen";
import { CameraTranslateScreen } from "./screens/CameraTranslateScreen";
import { TrillAiScreen } from "./screens/TrillAiScreen";
import { HistoryScreen } from "./screens/HistoryScreen";
import { SettingsScreen } from "./screens/SettingsScreen";
import { PWAInstallButton } from "./components/PWAInstallButton";
import { OfflineIndicator } from "./components/OfflineIndicator";
import {
  Mic,
  Camera,
  Bot,
  History,
  Settings,
  Cpu,
} from "lucide-react";

type ActiveTab = "LIVE" | "CAMERA" | "TRILL_AI" | "HISTORY" | "SETTINGS";

function computeFingerprint(passphrase: string): string {
  let hash = 0;
  for (let i = 0; i < passphrase.length; i++) {
    hash = ((hash << 5) - hash + passphrase.charCodeAt(i)) | 0;
  }
  return "#" + Math.abs(hash).toString(16).toUpperCase().padStart(8, "0").slice(0, 8);
}

export default function App() {
  // Services
  const speechManager = useMemo(() => new SpeechManager(), []);
  const translationEngine = useMemo(() => new TranslationEngine(), []);

  // Navigation
  const [currentTab, setCurrentTab] = useState<ActiveTab>("LIVE");

  // Language pair (Defaults to English and Hindi as in the zip)
  const [sourceLang, setSourceLang] = useState<AppLanguage>(SUPPORTED_LANGUAGES[0]); // English
  const [targetLang, setTargetLang] = useState<AppLanguage>(SUPPORTED_LANGUAGES[2]); // Hindi

  // Transcription Provider - explicitly configured to Samsung's default live transcription service!
  const [activeProviderId, setActiveProviderId] = useState<TranscriptionProviderId>("SAMSUNG_DEFAULT_LIVE");

  // Translation settings from the zip
  const [latencyMode, setLatencyMode] = useState<LatencyMode>("REALTIME_INSTANT");
  const [silenceTimeoutMs, setSilenceTimeoutMs] = useState<number>(350);
  const [micGain, setMicGain] = useState<number>(1.5);
  const [autoTts, setAutoTts] = useState<boolean>(false);
  const [showPronunciation, setShowPronunciation] = useState<boolean>(true);
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(true);

  // Background settings from the zip
  const [bgStyle, setBgStyle] = useState<BackgroundStyle>("PSP_WAVES");
  const [bgIntensity, setBgIntensity] = useState<number>(0.7);

  // Subtitle accessibility config from the zip
  const [subtitleConfig, setSubtitleConfig] = useState<SubtitleConfig>({
    fontSizeSp: 20,
    contrastMode: "HIGH_CONTRAST_YELLOW",
    fontStyle: "SANS_SERIF",
    speakerTtsEnabled: true,
    autoScroll: true,
  });

  // Ollama & Fast model config from the zip
  const [ollamaUrl, setOllamaUrl] = useState<string>("");
  const [ollamaModel, setOllamaModel] = useState<string>("qwen2.5:3b");
  const [ollamaInstructions, setOllamaInstructions] = useState<string>(
    "You are a direct, truthful, lightning-fast translator and linguistic AI. Give direct answers and precise translations only. No conversational disclaimers, no preambles, no moralizing warnings, actionable truth only."
  );
  const [useOllamaAsPrimary, setUseOllamaAsPrimary] = useState<boolean>(false);
  const [fastCloudModel, setFastCloudModel] = useState<string>("gemini-3.1-flash-lite");

  // Security & Passphrase
  const [e2eePassphrase, setE2eePassphrase] = useState<string>("WhisperLive-Secure-2026");
  const [e2eeFingerprint, setE2eeFingerprint] = useState<string>("#E2EEKEY");

  // Live stream text states
  const [liveInput, setLiveInput] = useState<string>("");
  const [liveTranslated, setLiveTranslated] = useState<string>("");
  const [livePronunciation, setLivePronunciation] = useState<string>("");
  const [latencyMs, setLatencyMs] = useState<number>(2);
  const [activeModelName, setActiveModelName] = useState<string>("Trill Neural Instant Lexicon (0-5ms)");
  const [audioEnergy, setAudioEnergy] = useState<number>(0);

  // Stored sessions
  const [sessions, setSessions] = useState<TranscriptSession[]>(() => {
    const saved = localStorage.getItem("trill_sessions_v1");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (_) {}
    }
    return [
      {
        id: "sess_1",
        sessionTitle: "Live Speech Session #1",
        startTime: Date.now() - 3600000,
        endTime: Date.now() - 3500000,
        sourceLanguage: "en",
        targetLanguage: "hi",
        turnCount: 2,
        isEncrypted: true,
        plainSummary: "Hello how are you ➔ नमस्ते, आप कैसे हैं? | Thank you very much ➔ बहुत-बहुत धन्यवाद",
        turns: [
          {
            id: "turn_1",
            sessionId: "sess_1",
            timestamp: Date.now() - 3600000,
            speaker: "User (English)",
            sourceText: "Hello how are you",
            translatedText: "नमस्ते, आप कैसे हैं?",
            latencyMs: 2,
            isOffline: true,
            confidence: 0.99,
          },
          {
            id: "turn_2",
            sessionId: "sess_1",
            timestamp: Date.now() - 3550000,
            speaker: "User (English)",
            sourceText: "Thank you very much",
            translatedText: "बहुत-बहुत धन्यवाद",
            latencyMs: 3,
            isOffline: true,
            confidence: 0.99,
          },
        ],
      },
    ];
  });

  const [activeSessionId, setActiveSessionId] = useState<string>(sessions[0]?.id || "sess_1");

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem("trill_sessions_v1", JSON.stringify(sessions));
  }, [sessions]);

  // Handle provider update
  const handleProviderChange = (id: TranscriptionProviderId) => {
    setActiveProviderId(id);
    speechManager.setTranscriptionProvider(id);
  };

  // Sync speech engine settings
  useEffect(() => {
    speechManager.silenceTimeoutMs = silenceTimeoutMs;
  }, [speechManager, silenceTimeoutMs]);

  useEffect(() => {
    speechManager.micSensitivityBoost = micGain;
  }, [speechManager, micGain]);

  // Sync translation engine settings
  useEffect(() => {
    translationEngine.ollamaBaseUrl = ollamaUrl;
    translationEngine.ollamaModel = ollamaModel;
    translationEngine.ollamaSystemPrompt = ollamaInstructions;
    translationEngine.useOllamaAsPrimary = useOllamaAsPrimary;
    translationEngine.fastCloudModel = fastCloudModel;
  }, [
    translationEngine,
    ollamaUrl,
    ollamaModel,
    ollamaInstructions,
    useOllamaAsPrimary,
    fastCloudModel,
  ]);

  // Listen to speech state changes
  useEffect(() => {
    speechManager.onStateChange = () => {
      setAudioEnergy(speechManager.audioAmplitude);
      if (speechManager.livePartialSpeech) {
        setLiveInput(speechManager.livePartialSpeech);
        // Instant streaming partial translation (0-5ms)
        const instant = translationEngine.translateInstantOffline(
          speechManager.livePartialSpeech,
          sourceLang,
          targetLang
        );
        setLiveTranslated(instant.translatedText);
        setLivePronunciation(instant.pronunciation);
        setLatencyMs(instant.latencyMs);
      }
    };

    speechManager.onFinalSpeechResult = async (spokenText: string) => {
      if (!spokenText.trim()) return;
      setLiveInput(spokenText);

      // Instant 0-5ms preview
      const instant = translationEngine.translateInstantOffline(
        spokenText,
        sourceLang,
        targetLang
      );
      setLiveTranslated(instant.translatedText);
      setLivePronunciation(instant.pronunciation);
      setLatencyMs(instant.latencyMs);
      setActiveModelName(instant.modelName);

      if (autoTts && instant.translatedText) {
        speechManager.speakText(instant.translatedText, targetLang);
      }

      // Record turn
      const turn: TranscriptTurn = {
        id: `turn_${Date.now()}`,
        sessionId: activeSessionId,
        timestamp: Date.now(),
        speaker: `User (${sourceLang.displayName})`,
        sourceText: spokenText,
        translatedText: instant.translatedText,
        latencyMs: instant.latencyMs,
        isOffline: isOfflineMode,
        confidence: 0.98,
      };

      setSessions((prev) =>
        prev.map((s) => {
          if (s.id === activeSessionId) {
            const updatedTurns = [...(s.turns || []), turn];
            const updatedSummary = s.plainSummary
              ? `${s.plainSummary.slice(0, 100)}... | ${spokenText} ➔ ${instant.translatedText}`
              : `${spokenText} ➔ ${instant.translatedText}`;
            return {
              ...s,
              endTime: Date.now(),
              turnCount: updatedTurns.length,
              plainSummary: updatedSummary.slice(0, 250),
              turns: updatedTurns,
            };
          }
          return s;
        })
      );

      // Sync state to Web Broadcast Server endpoint (/api/live)
      try {
        fetch("/api/live", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            original: spokenText,
            translated: instant.translatedText,
            pronunciation: instant.pronunciation,
            sourceLang: sourceLang.displayName,
            targetLang: targetLang.displayName,
            isListening: speechManager.isListening,
            audioEnergy: speechManager.audioAmplitude,
            latencyMs: instant.latencyMs,
            transcriptionProvider: speechManager.activeProvider.name,
          }),
        }).catch(() => {});
      } catch (_) {}
    };

    return () => {
      speechManager.stopListening();
    };
  }, [
    speechManager,
    translationEngine,
    sourceLang,
    targetLang,
    activeSessionId,
    autoTts,
    isOfflineMode,
  ]);

  const handleSwapLanguages = () => {
    const prevSrc = sourceLang;
    const prevTgt = targetLang;
    setSourceLang(prevTgt);
    setTargetLang(prevSrc);

    const prevIn = liveInput;
    const prevOut = liveTranslated;
    setLiveInput(prevOut);
    setLiveTranslated(prevIn);
  };

  const handleCreateSession = (title: string) => {
    const newSess: TranscriptSession = {
      id: `sess_${Date.now()}`,
      sessionTitle: title,
      startTime: Date.now(),
      endTime: Date.now(),
      sourceLanguage: sourceLang.code,
      targetLanguage: targetLang.code,
      turnCount: 0,
      isEncrypted: true,
      plainSummary: `Session started (${sourceLang.code.toUpperCase()} ➔ ${targetLang.code.toUpperCase()})`,
      turns: [],
    };
    setSessions((prev) => [newSess, ...prev]);
    setActiveSessionId(newSess.id);
  };

  const handleDeleteSession = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <PspWaveBackground
      audioEnergy={audioEnergy}
      styleType={bgStyle}
      intensity={bgIntensity}
      gradientTheme="CLASSIC_PSP"
    >
      {/* Top App Header */}
      <header
        id="app_top_bar"
        className="sticky top-0 z-30 w-full bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-3 sm:px-4 py-2 flex items-center justify-between gap-2"
      >
        <div className="flex items-center gap-2.5">
          <img
            src="/icons/icon-192.png"
            alt="Trill icon"
            className="w-8 h-8 rounded-xl border border-emerald-500/30 shadow-md shadow-emerald-950/40 object-cover"
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm sm:text-base font-black tracking-wider bg-gradient-to-r from-teal-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent uppercase leading-tight">
                TRILL TRANSLATE
              </h1>
              <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-300 text-[10px] font-bold">
                <Cpu className="w-3 h-3" />
                <span>Samsung Live Transcribe</span>
              </span>
            </div>
            <p className="text-[10px] font-medium text-slate-400 tracking-wide leading-none">
              Creation by Brian Cross
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <PWAInstallButton variant="header" />
        </div>
      </header>

      {/* Main Content View */}
      <main id="whisper_main_scaffold" className="flex-1 flex flex-col">
        {currentTab === "LIVE" && (
          <LiveTranslateScreen
            speechManager={speechManager}
            translationEngine={translationEngine}
            sourceLang={sourceLang}
            targetLang={targetLang}
            onSourceLangChange={setSourceLang}
            onTargetLangChange={setTargetLang}
            onSwapLanguages={handleSwapLanguages}
            liveInput={liveInput}
            liveTranslated={liveTranslated}
            livePronunciation={livePronunciation}
            latencyMs={latencyMs}
            activeModelName={activeModelName}
            isOfflineMode={isOfflineMode}
            onToggleOfflineMode={setIsOfflineMode}
            subtitleConfig={subtitleConfig}
            onUpdateSubtitleConfig={setSubtitleConfig}
            onRecordTurn={(src, trans) => {}}
            e2eeFingerprint={e2eeFingerprint}
            onNavigateToSettings={() => setCurrentTab("SETTINGS")}
          />
        )}

        {currentTab === "CAMERA" && (
          <CameraTranslateScreen
            speechManager={speechManager}
            translationEngine={translationEngine}
            sourceLang={sourceLang}
            targetLang={targetLang}
          />
        )}

        {currentTab === "TRILL_AI" && (
          <TrillAiScreen
            speechManager={speechManager}
            translationEngine={translationEngine}
            targetLang={targetLang}
          />
        )}

        {currentTab === "HISTORY" && (
          <HistoryScreen
            sessions={sessions}
            activeSessionId={activeSessionId}
            onSelectSession={setActiveSessionId}
            onCreateSession={handleCreateSession}
            onDeleteSession={handleDeleteSession}
            e2eeFingerprint={e2eeFingerprint}
          />
        )}

        {currentTab === "SETTINGS" && (
          <SettingsScreen
            speechManager={speechManager}
            translationEngine={translationEngine}
            activeProviderId={activeProviderId}
            onProviderChange={handleProviderChange}
            latencyMode={latencyMode}
            onLatencyModeChange={setLatencyMode}
            silenceTimeoutMs={silenceTimeoutMs}
            onSilenceTimeoutChange={setSilenceTimeoutMs}
            micGain={micGain}
            onMicGainChange={setMicGain}
            autoTts={autoTts}
            onAutoTtsChange={setAutoTts}
            showPronunciation={showPronunciation}
            onShowPronunciationChange={setShowPronunciation}
            bgStyle={bgStyle}
            onBgStyleChange={setBgStyle}
            bgIntensity={bgIntensity}
            onBgIntensityChange={setBgIntensity}
            ollamaUrl={ollamaUrl}
            onOllamaUrlChange={setOllamaUrl}
            ollamaModel={ollamaModel}
            onOllamaModelChange={setOllamaModel}
            useOllamaAsPrimary={useOllamaAsPrimary}
            onUseOllamaChange={setUseOllamaAsPrimary}
            ollamaInstructions={ollamaInstructions}
            onOllamaInstructionsChange={setOllamaInstructions}
            fastCloudModel={fastCloudModel}
            onFastCloudModelChange={setFastCloudModel}
            e2eePassphrase={e2eePassphrase}
            onE2eePassphraseChange={(p) => {
              setE2eePassphrase(p);
              setE2eeFingerprint(computeFingerprint(p));
            }}
            e2eeFingerprint={e2eeFingerprint}
          />
        )}
      </main>

      {/* Bottom Navigation Bar */}
      <nav
        id="bottom_navigation_bar"
        className="fixed bottom-0 inset-x-0 z-40 bg-slate-950/90 backdrop-blur-xl border-t border-slate-800/90 max-w-xl mx-auto rounded-t-3xl shadow-2xl px-2 py-1.5"
      >
        <div className="flex items-center justify-around">
          {[
            { id: "LIVE", label: "Live", icon: Mic, tag: "nav_live" },
            { id: "CAMERA", label: "Camera AR", icon: Camera, tag: "nav_camera" },
            { id: "TRILL_AI", label: "Trill AI", icon: Bot, tag: "nav_trill_ai" },
            { id: "HISTORY", label: "History", icon: History, tag: "nav_history" },
            { id: "SETTINGS", label: "Settings", icon: Settings, tag: "nav_settings" },
          ].map(({ id, label, icon: Icon, tag }) => {
            const isActive = currentTab === id;
            return (
              <button
                key={id}
                id={tag}
                type="button"
                onClick={() => setCurrentTab(id as ActiveTab)}
                className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl min-h-[44px] transition-all duration-200 active:scale-95 ${
                  isActive
                    ? "text-teal-400 font-bold"
                    : "text-slate-400 hover:text-slate-200 font-medium"
                }`}
              >
                <div
                  className={`p-1.5 rounded-xl transition-all ${
                    isActive ? "bg-teal-500/20 shadow-sm shadow-teal-500/30" : ""
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] mt-0.5">{label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* PWA Offline Banner */}
      <OfflineIndicator />
    </PspWaveBackground>
  );
}
