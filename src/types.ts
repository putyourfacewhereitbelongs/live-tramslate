export interface AppLanguage {
  code: string;
  displayName: string;
  nativeName: string;
  flagEmoji: string;
  placeholder: string;
}

export const SUPPORTED_LANGUAGES: AppLanguage[] = [
  {
    code: "en",
    displayName: "English",
    nativeName: "English",
    flagEmoji: "🇺🇸",
    placeholder: "Speak now in English...",
  },
  {
    code: "es",
    displayName: "Spanish",
    nativeName: "Español",
    flagEmoji: "🇪🇸",
    placeholder: "Hable ahora en español...",
  },
  {
    code: "hi",
    displayName: "Hindi",
    nativeName: "हिन्दी",
    flagEmoji: "🇮🇳",
    placeholder: "अब हिन्दी में बोलें...",
  },
];

export type SubtitleContrast =
  | "HIGH_CONTRAST_YELLOW" // Yellow on Black
  | "CYAN_ON_NAVY"         // Cyan on Navy
  | "HIGH_CONTRAST_WHITE"  // White on Black
  | "SOFT_AMBER";          // Warm Amber

export interface SubtitleContrastOption {
  id: SubtitleContrast;
  label: string;
  bgHex: string;
  textHex: string;
}

export const SUBTITLE_CONTRAST_OPTIONS: SubtitleContrastOption[] = [
  {
    id: "HIGH_CONTRAST_YELLOW",
    label: "Yellow on Black",
    bgHex: "#000000",
    textHex: "#FFEB3B",
  },
  {
    id: "CYAN_ON_NAVY",
    label: "Cyan on Navy",
    bgHex: "#0D1B2A",
    textHex: "#00E5FF",
  },
  {
    id: "HIGH_CONTRAST_WHITE",
    label: "White on Black",
    bgHex: "#121212",
    textHex: "#FFFFFF",
  },
  {
    id: "SOFT_AMBER",
    label: "Warm Amber",
    bgHex: "#211A13",
    textHex: "#FFB74D",
  },
];

export type SubtitleFontStyle = "SANS_SERIF" | "MONOSPACE" | "DYSLEXIC_FRIENDLY";

export interface SubtitleConfig {
  fontSizeSp: number;
  contrastMode: SubtitleContrast;
  fontStyle: SubtitleFontStyle;
  speakerTtsEnabled: boolean;
  autoScroll: boolean;
}

export type TranscriptionProviderId =
  | "SAMSUNG_DEFAULT_LIVE"
  | "GOOGLE_SPEECH"
  | "WHISPER_LIVE"
  | "WEB_SPEECH_NATIVE";

export interface TranscriptionProviderInfo {
  id: TranscriptionProviderId;
  name: string;
  subName: string;
  packageId: string;
  componentName: string;
  description: string;
  isDeviceDefault: boolean;
  latencyRating: string;
  offlineSupported: boolean;
  activeStatusText: string;
}

export const TRANSCRIPTION_PROVIDERS: TranscriptionProviderInfo[] = [
  {
    id: "SAMSUNG_DEFAULT_LIVE",
    name: "Samsung Default Live Transcription",
    subName: "Samsung On-Device Neural Voice Service",
    packageId: "com.samsung.android.bixby.agent",
    componentName: "com.samsung.android.bixby.voiceinput.VoiceInputService",
    description: "Samsung's device-native continuous live speech transcription service. Bypasses cloud latency with on-device NPU processing.",
    isDeviceDefault: true,
    latencyRating: "Ultra-Low (15-40ms)",
    offlineSupported: true,
    activeStatusText: "Samsung Live Transcription Service Connected (On-Device)",
  },
  {
    id: "GOOGLE_SPEECH",
    name: "Google Speech Recognition",
    subName: "Android Speech Services",
    packageId: "com.google.android.googlequicksearchbox",
    componentName: "android.speech.RecognitionService",
    description: "Standard Google voice input service provider.",
    isDeviceDefault: false,
    latencyRating: "Standard (80-150ms)",
    offlineSupported: true,
    activeStatusText: "Google Speech Recognition Service Connected",
  },
  {
    id: "WHISPER_LIVE",
    name: "Faster-Whisper Tiny (INT8)",
    subName: "Local Quantized Neural Model",
    packageId: "com.aistudio.whisperlive.internal",
    componentName: "FasterWhisperEngine",
    description: "Quantized on-device Faster-Whisper transformer engine.",
    isDeviceDefault: false,
    latencyRating: "Fast (60-120ms)",
    offlineSupported: true,
    activeStatusText: "Faster-Whisper Local INT8 Active",
  },
  {
    id: "WEB_SPEECH_NATIVE",
    name: "Browser Web Speech API",
    subName: "Samsung Internet / Chromium Speech Engine",
    packageId: "com.sec.android.app.sbrowser",
    componentName: "webkitSpeechRecognition",
    description: "Device browser native live speech-to-text listener.",
    isDeviceDefault: false,
    latencyRating: "Native (40-90ms)",
    offlineSupported: false,
    activeStatusText: "Browser Speech Recognizer Active",
  },
];

export interface TranslationResult {
  translatedText: string;
  latencyMs: number;
  isOffline: boolean;
  modelName: string;
  confidence: number;
  pronunciation: string;
}

export interface TranscriptTurn {
  id: string;
  sessionId: string;
  timestamp: number;
  speaker: string;
  sourceText: string;
  translatedText: string;
  latencyMs: number;
  isOffline: boolean;
  confidence: number;
}

export interface TranscriptSession {
  id: string;
  sessionTitle: string;
  startTime: number;
  endTime: number;
  sourceLanguage: string;
  targetLanguage: string;
  turnCount: number;
  isEncrypted: boolean;
  plainSummary: string;
  turns: TranscriptTurn[];
}

export interface SyncDevice {
  id: string;
  deviceName: string;
  platform: string;
  lastSyncTimestamp: number;
  isCurrent: boolean;
  syncStatus: string;
}

export interface OfflineModelInfo {
  id: string;
  name: string;
  description: string;
  sizeMb: number;
  isDownloaded: boolean;
  downloadProgress: number;
  isDownloading: boolean;
  quantization: string;
}

export interface TrillChatMessage {
  id: string;
  sender: string;
  text: string;
  isUser: boolean;
  timestamp: number;
}

export type LatencyMode = "REALTIME_INSTANT" | "HYBRID" | "CLOUD_ONLY";
export type BackgroundStyle = "PSP_WAVES" | "AURORA" | "COSMIC" | "SUBTLE" | "OFF";
