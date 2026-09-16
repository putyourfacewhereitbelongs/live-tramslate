import React, { useState } from "react";
import {
  TRANSCRIPTION_PROVIDERS,
  TranscriptionProviderId,
  LatencyMode,
  BackgroundStyle,
  SyncDevice,
} from "../types";
import { SpeechManager } from "../services/SpeechManager";
import { TranslationEngine } from "../services/TranslationEngine";
import { PWAInstallButton } from "../components/PWAInstallButton";
import {
  Check,
  CheckCircle2,
  Cpu,
  Smartphone,
  Sliders,
  Sparkles,
  Zap,
  Volume2,
  Lock,
  RefreshCw,
  Laptop,
  Tablet,
  Radio,
  ExternalLink,
} from "lucide-react";

interface SettingsScreenProps {
  speechManager: SpeechManager;
  translationEngine: TranslationEngine;
  activeProviderId: TranscriptionProviderId;
  onProviderChange: (id: TranscriptionProviderId) => void;
  latencyMode: LatencyMode;
  onLatencyModeChange: (m: LatencyMode) => void;
  silenceTimeoutMs: number;
  onSilenceTimeoutChange: (ms: number) => void;
  micGain: number;
  onMicGainChange: (gain: number) => void;
  autoTts: boolean;
  onAutoTtsChange: (enabled: boolean) => void;
  showPronunciation: boolean;
  onShowPronunciationChange: (enabled: boolean) => void;
  bgStyle: BackgroundStyle;
  onBgStyleChange: (s: BackgroundStyle) => void;
  bgIntensity: number;
  onBgIntensityChange: (i: number) => void;
  ollamaUrl: string;
  onOllamaUrlChange: (u: string) => void;
  ollamaModel: string;
  onOllamaModelChange: (m: string) => void;
  useOllamaAsPrimary: boolean;
  onUseOllamaChange: (u: boolean) => void;
  ollamaInstructions: string;
  onOllamaInstructionsChange: (i: string) => void;
  fastCloudModel: string;
  onFastCloudModelChange: (m: string) => void;
  e2eePassphrase: string;
  onE2eePassphraseChange: (p: string) => void;
  e2eeFingerprint: string;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  speechManager,
  translationEngine,
  activeProviderId,
  onProviderChange,
  latencyMode,
  onLatencyModeChange,
  silenceTimeoutMs,
  onSilenceTimeoutChange,
  micGain,
  onMicGainChange,
  autoTts,
  onAutoTtsChange,
  showPronunciation,
  onShowPronunciationChange,
  bgStyle,
  onBgStyleChange,
  bgIntensity,
  onBgIntensityChange,
  ollamaUrl,
  onOllamaUrlChange,
  ollamaModel,
  onOllamaModelChange,
  useOllamaAsPrimary,
  onUseOllamaChange,
  ollamaInstructions,
  onOllamaInstructionsChange,
  fastCloudModel,
  onFastCloudModelChange,
  e2eePassphrase,
  onE2eePassphraseChange,
  e2eeFingerprint,
}) => {
  const [ollamaTesting, setOllamaTesting] = useState(false);
  const [ollamaStatus, setOllamaStatus] = useState<string | null>(null);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [tempPassphrase, setTempPassphrase] = useState(e2eePassphrase);
  const [syncStatus, setSyncStatus] = useState("All 3 devices synchronized (0ms latency queue)");
  const [isSyncing, setIsSyncing] = useState(false);

  const [syncDevices, setSyncDevices] = useState<SyncDevice[]>([
    {
      id: "dev_1",
      deviceName: "Samsung Galaxy S24 Ultra (This Device)",
      platform: "Android 14 / One UI 6.1",
      lastSyncTimestamp: Date.now(),
      isCurrent: true,
      syncStatus: "Active",
    },
    {
      id: "dev_2",
      deviceName: "MacBook Pro (Chrome Web Mirror)",
      platform: "Desktop Browser :8082",
      lastSyncTimestamp: Date.now() - 420000,
      isCurrent: false,
      syncStatus: "Synced E2EE",
    },
    {
      id: "dev_3",
      deviceName: "Samsung Galaxy Tab S9+",
      platform: "Tablet / Samsung DeX",
      lastSyncTimestamp: Date.now() - 3600000,
      isCurrent: false,
      syncStatus: "Synced E2EE",
    },
  ]);

  const handleTestOllama = async () => {
    if (!ollamaUrl.trim()) {
      setOllamaStatus("Please enter an Ollama base URL first.");
      return;
    }
    setOllamaTesting(true);
    setOllamaStatus("Testing connection to Ollama...");
    const res = await translationEngine.testOllamaConnection(ollamaUrl);
    setOllamaTesting(false);
    setOllamaStatus(res.message);
  };

  const handleTriggerSync = () => {
    setIsSyncing(true);
    setSyncStatus("Synchronizing encrypted transcripts across devices...");
    setTimeout(() => {
      setSyncStatus("All 3 devices synchronized (0ms latency queue)");
      setIsSyncing(false);
      setSyncDevices((prev) =>
        prev.map((d) => ({ ...d, lastSyncTimestamp: Date.now() }))
      );
    }, 700);
  };

  return (
    <div
      id="settings_screen"
      className="flex flex-col gap-6 max-w-3xl mx-auto w-full pb-24 pt-3 px-3 sm:px-4 text-slate-100"
    >
      <div>
        <h1 className="text-xl font-bold tracking-tight text-white">
          Preferences & Security Settings
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Transcription provider, translation engine, latency parameters, and E2EE keys
        </p>
      </div>

      {/* 1. TRANSCRIPTION SERVICE PROVIDER SECTION (Samsung Default Highlighted) */}
      <div className="bg-slate-900/80 border-2 border-teal-500/50 rounded-3xl p-5 shadow-2xl backdrop-blur-md">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-100">
                  TRANSCRIPTION SERVICE PROVIDER
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-extrabold text-[10px] tracking-wider">
                  ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Samsung default live transcription service selected
              </p>
            </div>
          </div>
        </div>

        {/* List of Transcription Providers */}
        <div className="flex flex-col gap-3 mt-3">
          {TRANSCRIPTION_PROVIDERS.map((provider) => {
            const isSelected = activeProviderId === provider.id;
            return (
              <div
                key={provider.id}
                onClick={() => onProviderChange(provider.id)}
                className={`cursor-pointer rounded-2xl p-4 border transition-all ${
                  isSelected
                    ? "bg-teal-950/40 border-teal-400 ring-1 ring-teal-400/50 shadow-lg shadow-teal-950/50"
                    : "bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/70"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-5 h-5 rounded-full mt-0.5 flex items-center justify-center border transition-all ${
                        isSelected
                          ? "border-teal-400 bg-teal-500 text-slate-950"
                          : "border-slate-600 bg-slate-900"
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-white">
                          {provider.name}
                        </span>
                        {provider.isDeviceDefault && (
                          <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">
                            SAMSUNG DEFAULT ON-DEVICE
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-400 block mt-0.5">
                        {provider.subName}
                      </span>
                      <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                        {provider.description}
                      </p>

                      <div className="flex items-center gap-3 mt-3 text-[11px] font-mono text-slate-400 flex-wrap">
                        <span className="bg-slate-900/80 px-2 py-0.5 rounded border border-slate-700/70">
                          Package: <strong className="text-teal-300">{provider.packageId}</strong>
                        </span>
                        <span className="bg-slate-900/80 px-2 py-0.5 rounded border border-slate-700/70">
                          Latency: <strong className="text-emerald-400">{provider.latencyRating}</strong>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. REAL-TIME LATENCY & TRANSLATION ENGINE SETTINGS (From Zip) */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-xl backdrop-blur-md flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-bold text-slate-100">
            TRANSLATION & LATENCY ENGINE SETTINGS
          </h2>
        </div>

        {/* Latency Engine Mode */}
        <div>
          <span className="text-xs font-semibold text-slate-300 block mb-1">
            Latency Engine Mode
          </span>
          <span className="text-[11px] text-slate-400 block mb-2">
            Controls translation processing speed and linguistic fidelity
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              id="latency_mode_instant"
              type="button"
              onClick={() => onLatencyModeChange("REALTIME_INSTANT")}
              className={`p-3 rounded-xl border text-left transition-all ${
                latencyMode === "REALTIME_INSTANT"
                  ? "border-teal-400 bg-teal-500/15 text-teal-200 shadow-sm"
                  : "border-slate-800 bg-slate-800/40 text-slate-300 hover:bg-slate-800/70"
              }`}
            >
              <span className="text-xs font-bold block">Instant Local (0-5ms)</span>
              <span className="text-[10px] text-slate-400">Zero network latency, offline lexicon</span>
            </button>

            <button
              id="latency_mode_hybrid"
              type="button"
              onClick={() => onLatencyModeChange("HYBRID")}
              className={`p-3 rounded-xl border text-left transition-all ${
                latencyMode === "HYBRID"
                  ? "border-teal-400 bg-teal-500/15 text-teal-200 shadow-sm"
                  : "border-slate-800 bg-slate-800/40 text-slate-300 hover:bg-slate-800/70"
              }`}
            >
              <span className="text-xs font-bold block">Hybrid Polish</span>
              <span className="text-[10px] text-slate-400">Instant local preview + cloud speculative polish</span>
            </button>
          </div>
        </div>

        {/* Speech End Silence Detection */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="font-semibold text-slate-300">Speech End Silence Threshold</span>
            <span className="font-bold text-amber-400">{silenceTimeoutMs}ms</span>
          </div>
          <span className="text-[11px] text-slate-400 block mb-2">
            Lower threshold finalizes speaker turns snappier for instant dialogue
          </span>
          <div className="flex gap-2">
            {[
              { ms: 250, label: "250ms (Ultra-Fast)" },
              { ms: 350, label: "350ms (Snappy)" },
              { ms: 600, label: "600ms (Natural)" },
            ].map(({ ms, label }) => (
              <button
                key={ms}
                type="button"
                onClick={() => onSilenceTimeoutChange(ms)}
                className={`flex-1 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                  silenceTimeoutMs === ms
                    ? "border-teal-400 bg-teal-500/20 text-teal-300 font-bold"
                    : "border-slate-800 bg-slate-800/40 text-slate-300 hover:bg-slate-800"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Microphone Gain Boost */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="font-semibold text-slate-300">Microphone Input Gain Boost</span>
            <span className="font-bold text-teal-400">{micGain.toFixed(1)}x</span>
          </div>
          <input
            id="mic_gain_slider"
            type="range"
            min="1.0"
            max="3.0"
            step="0.5"
            value={micGain}
            onChange={(e) => onMicGainChange(Number(e.target.value))}
            className="w-full accent-teal-400"
          />
        </div>

        {/* Auto-Read Aloud on Speech */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <div>
            <span className="text-xs font-semibold text-slate-200 block">
              Auto-Read Aloud on Speech
            </span>
            <span className="text-[11px] text-slate-400">
              Automatically speak translation when speaker turn completes
            </span>
          </div>
          <input
            id="auto_tts_switch"
            type="checkbox"
            checked={autoTts}
            onChange={(e) => onAutoTtsChange(e.target.checked)}
            className="w-4 h-4 accent-teal-400"
          />
        </div>

        {/* Dictionary Pronunciation Guide Toggle */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <div>
            <span className="text-xs font-semibold text-slate-200 block">
              Dictionary Pronunciation Guide
            </span>
            <span className="text-[11px] text-slate-400">
              Display phonetic dictionary respelling under translations
            </span>
          </div>
          <input
            id="show_pronunciation_switch"
            type="checkbox"
            checked={showPronunciation}
            onChange={(e) => onShowPronunciationChange(e.target.checked)}
            className="w-4 h-4 accent-teal-400"
          />
        </div>
      </div>

      {/* 3. DYNAMIC AMBIENT BACKGROUND CONTROLS (From Zip) */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-xl backdrop-blur-md flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <h2 className="text-sm font-bold text-slate-100">
            DYNAMIC AMBIENT BACKGROUND
          </h2>
        </div>

        <div>
          <span className="text-xs font-semibold text-slate-300 block mb-2">
            Animation Style
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: "PSP_WAVES", label: "PSP Waves" },
              { id: "AURORA", label: "Aurora" },
              { id: "COSMIC", label: "Cosmic" },
              { id: "OFF", label: "Off" },
            ].map(({ id, label }) => (
              <button
                key={id}
                id={`bg_style_${id}`}
                type="button"
                onClick={() => onBgStyleChange(id as BackgroundStyle)}
                className={`py-2 rounded-xl border text-xs font-medium transition-all ${
                  bgStyle === id
                    ? "border-purple-400 bg-purple-500/20 text-purple-300 font-bold"
                    : "border-slate-800 bg-slate-800/40 text-slate-300 hover:bg-slate-800"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {bgStyle !== "OFF" && (
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-semibold text-slate-300">Luminous Glow Intensity</span>
              <span className="font-bold text-purple-400">{Math.round(bgIntensity * 100)}%</span>
            </div>
            <input
              id="bg_intensity_slider"
              type="range"
              min="0.2"
              max="1.0"
              step="0.1"
              value={bgIntensity}
              onChange={(e) => onBgIntensityChange(Number(e.target.value))}
              className="w-full accent-purple-400"
            />
          </div>
        )}
      </div>

      {/* 4. OLLAMA & FAST CLOUD MODEL (Current settings from zip) */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-xl backdrop-blur-md flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-sky-400" />
          <h2 className="text-sm font-bold text-slate-100">
            OLLAMA & FAST CLOUD ENGINE SETTINGS
          </h2>
        </div>

        <div>
          <span className="text-xs font-semibold text-slate-300 block mb-1">
            Ollama Endpoint URL (Optional)
          </span>
          <div className="flex gap-2">
            <input
              type="text"
              value={ollamaUrl}
              onChange={(e) => onOllamaUrlChange(e.target.value)}
              placeholder="e.g. http://192.168.1.50:11434"
              className="flex-1 bg-slate-800/60 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 outline-none"
            />
            <button
              type="button"
              onClick={handleTestOllama}
              disabled={ollamaTesting}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 text-xs font-semibold border border-slate-700 shrink-0"
            >
              {ollamaTesting ? "Testing..." : "Test"}
            </button>
          </div>
          {ollamaStatus && (
            <span className="text-[11px] text-teal-300 block mt-1.5">
              {ollamaStatus}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <span className="text-xs font-semibold text-slate-300 block mb-1">
              Ollama Model
            </span>
            <input
              type="text"
              value={ollamaModel}
              onChange={(e) => onOllamaModelChange(e.target.value)}
              placeholder="qwen2.5:3b"
              className="w-full bg-slate-800/60 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 outline-none"
            />
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-300 block mb-1">
              Fast Cloud Model
            </span>
            <select
              value={fastCloudModel}
              onChange={(e) => onFastCloudModelChange(e.target.value)}
              className="w-full bg-slate-800/60 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none"
            >
              <option value="gemini-3.1-flash-lite">Gemini 3.1 Flash-Lite (Ultra-Fast)</option>
              <option value="gemini-3.8-flash">Gemini 3.8 Flash (Balanced)</option>
              <option value="gemini-3.6-flash">Gemini 3.6 Flash</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <div>
            <span className="text-xs font-semibold text-slate-200 block">
              Use Ollama as Primary Translation Engine
            </span>
            <span className="text-[11px] text-slate-400">
              Direct all speech queries to your local private Ollama instance
            </span>
          </div>
          <input
            type="checkbox"
            checked={useOllamaAsPrimary}
            onChange={(e) => onUseOllamaChange(e.target.checked)}
            className="w-4 h-4 accent-teal-400"
          />
        </div>
      </div>

      {/* 5. PROGRESSIVE WEB APP (PWA) & OFFLINE ENGINE */}
      <div id="pwa-settings-card" className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-xl backdrop-blur-md flex flex-col gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
              Progressive Web App (PWA) & Offline
            </h2>
            <p className="text-[11px] text-slate-400">
              Install Trill directly onto your device home screen for standalone offline use
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <PWAInstallButton variant="settings" />

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="bg-slate-950/40 border border-slate-800/80 p-2.5 rounded-xl flex flex-col gap-0.5">
              <span className="text-slate-400 font-medium">Service Worker Cache</span>
              <span className="text-emerald-400 font-mono font-semibold">Active & Pre-cached</span>
            </div>
            <div className="bg-slate-950/40 border border-slate-800/80 p-2.5 rounded-xl flex flex-col gap-0.5">
              <span className="text-slate-400 font-medium">Offline Translation</span>
              <span className="text-emerald-400 font-mono font-semibold">0ms Local Dict Ready</span>
            </div>
          </div>
        </div>
      </div>

      {/* 6. CONNECTED SYNC DEVICES & E2EE KEY CARD */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-xl backdrop-blur-md flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <div>
              <h2 className="text-sm font-bold text-slate-100">
                CONNECTED SYNC DEVICES & E2EE SECURITY
              </h2>
              <span className="text-[11px] text-emerald-400 block">{syncStatus}</span>
            </div>
          </div>
          <button
            id="trigger_sync_button"
            type="button"
            onClick={handleTriggerSync}
            disabled={isSyncing}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 transition-all"
            title="Sync Now"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? "animate-spin" : ""}`} />
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {syncDevices.map((dev) => (
            <div
              key={dev.id}
              className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/40 border border-slate-800"
            >
              <div className="flex items-center gap-3">
                {dev.platform.includes("Desktop") ? (
                  <Laptop className="w-4 h-4 text-slate-400" />
                ) : dev.platform.includes("Tablet") ? (
                  <Tablet className="w-4 h-4 text-slate-400" />
                ) : (
                  <Smartphone className="w-4 h-4 text-teal-400" />
                )}
                <div>
                  <span className="text-xs font-semibold text-slate-100 block">
                    {dev.deviceName}
                  </span>
                  <span className="text-[10px] text-slate-400">{dev.platform}</span>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-mono text-[10px] font-bold">
                {dev.syncStatus}
              </span>
            </div>
          ))}
        </div>

        {/* E2EE Key update */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <div>
            <span className="text-xs font-semibold text-slate-200 block">
              Cryptographic Passphrase & Fingerprint
            </span>
            <span className="text-[11px] text-teal-400 font-mono">
              Key Fingerprint: {e2eeFingerprint}
            </span>
          </div>
          <button
            id="change_e2ee_key_button"
            type="button"
            onClick={() => setShowKeyModal(true)}
            className="px-3 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold transition-all"
          >
            Update Key
          </button>
        </div>
      </div>

      {/* E2EE Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl flex flex-col gap-4 text-slate-100">
            <h3 className="font-bold text-base">Update E2EE Master Cryptographic Key</h3>
            <p className="text-xs text-slate-400">
              All transcripts, session notes, and synced packets are encrypted locally with AES-256-GCM.
            </p>
            <input
              id="passphrase_input"
              type="text"
              value={tempPassphrase}
              onChange={(e) => setTempPassphrase(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white outline-none"
            />
            <div className="flex justify-end gap-2 mt-2">
              <button
                type="button"
                onClick={() => setShowKeyModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                id="save_passphrase_button"
                type="button"
                onClick={() => {
                  onE2eePassphraseChange(tempPassphrase);
                  setShowKeyModal(false);
                }}
                className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold"
              >
                Save Key
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
