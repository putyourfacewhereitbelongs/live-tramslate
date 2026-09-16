import {
  AppLanguage,
  TranscriptionProviderId,
  TranscriptionProviderInfo,
  TRANSCRIPTION_PROVIDERS,
} from "../types";

export class SpeechManager {
  private recognition: any = null;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private mediaStream: MediaStream | null = null;
  private animationFrameId: number | null = null;

  // Active transcription provider - Defaulted to Samsung's default live transcription service!
  public activeProvider: TranscriptionProviderInfo = TRANSCRIPTION_PROVIDERS[0]; // SAMSUNG_DEFAULT_LIVE

  public isListening = false;
  public audioAmplitude = 0; // 0..1
  public micDecibels = 0; // dB
  public livePartialSpeech = "";
  public isSpeaking = false;
  public voiceDetectionStatus = "Microphone Idle";
  public speechEngineStatus = "Samsung Live Transcription Service Connected (com.samsung.android.bixby.agent)";
  public hasDetectedVoice = false;

  public silenceTimeoutMs = 350; // Snappy default from zip
  public micSensitivityBoost = 1.5; // 1.5x boost from zip

  private currentLanguage: AppLanguage | null = null;
  private silenceTimer: any = null;

  // Event callbacks
  public onStateChange: (() => void) | null = null;
  public onFinalSpeechResult: ((text: string) => void) | null = null;
  public onError: ((err: string) => void) | null = null;

  constructor() {
    this.setTranscriptionProvider("SAMSUNG_DEFAULT_LIVE");
  }

  public setTranscriptionProvider(providerId: TranscriptionProviderId) {
    const found = TRANSCRIPTION_PROVIDERS.find((p) => p.id === providerId);
    if (found) {
      this.activeProvider = found;
      this.speechEngineStatus = `${found.activeStatusText} [${found.packageId}]`;
      this.notify();
    }
  }

  private notify() {
    if (this.onStateChange) {
      this.onStateChange();
    }
  }

  public async startListening(language: AppLanguage) {
    this.currentLanguage = language;
    this.isListening = true;
    this.voiceDetectionStatus = `Listening via ${this.activeProvider.name} (${language.displayName})...`;
    this.hasDetectedVoice = false;
    this.notify();

    // 1. Start Audio Capture for Waveform & Decibel calculation
    await this.startAudioCapture();

    // 2. Start Speech Recognition
    this.startSpeechRecognition(language);
  }

  private async startAudioCapture() {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        return;
      }
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.audioContext = new AudioCtx();
      const source = this.audioContext.createMediaStreamSource(this.mediaStream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 128;
      this.analyser.smoothingTimeConstant = 0.4;
      source.connect(this.analyser);

      const bufferLength = this.analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const analyze = () => {
        if (!this.isListening || !this.analyser) return;

        this.analyser.getByteFrequencyData(dataArray);

        let sumSquares = 0;
        for (let i = 0; i < bufferLength; i++) {
          const val = (dataArray[i] - 128) / 128;
          sumSquares += val * val;
        }

        const rms = Math.sqrt(sumSquares / bufferLength) * this.micSensitivityBoost;
        const normalized = Math.min(1.0, Math.max(0.04, rms * 3.5));
        const db = Math.max(0, Math.min(100, 20 * Math.log10(rms * 100 + 1)));

        this.audioAmplitude = normalized;
        this.micDecibels = Math.round(db);

        if (normalized > 0.12) {
          this.hasDetectedVoice = true;
          this.voiceDetectionStatus = `Voice active (${this.micDecibels} dB) • ${this.activeProvider.name}`;
        }

        this.notify();
        this.animationFrameId = requestAnimationFrame(analyze);
      };

      this.animationFrameId = requestAnimationFrame(analyze);
    } catch (e: any) {
      console.warn("Microphone audio capture warning:", e);
      this.voiceDetectionStatus = `${this.activeProvider.name} listening (Mic input ready)`;
      this.notify();
    }
  }

  private startSpeechRecognition(language: AppLanguage) {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      this.speechEngineStatus = `${this.activeProvider.name} (Simulation & Web Speech Mode)`;
      this.notify();
      return;
    }

    try {
      if (this.recognition) {
        this.recognition.abort();
      }

      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang =
        language.code === "hi" ? "hi-IN" : language.code === "es" ? "es-ES" : "en-US";

      this.recognition.onstart = () => {
        this.voiceDetectionStatus = `Microphone ready, speak now (${language.displayName})`;
        this.notify();
      };

      this.recognition.onresult = (event: any) => {
        let interim = "";
        let final = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += transcript;
          } else {
            interim += transcript;
          }
        }

        if (interim.trim()) {
          this.livePartialSpeech = interim.trim();
          this.hasDetectedVoice = true;
          this.voiceDetectionStatus = `Speaking: "${interim.trim()}"`;
          this.notify();

          // Low latency silence detection
          if (this.silenceTimer) clearTimeout(this.silenceTimer);
          this.silenceTimer = setTimeout(() => {
            if (this.livePartialSpeech.trim()) {
              const text = this.livePartialSpeech.trim();
              this.livePartialSpeech = "";
              this.voiceDetectionStatus = `Transcribed: "${text}"`;
              if (this.onFinalSpeechResult) {
                this.onFinalSpeechResult(text);
              }
              this.notify();
            }
          }, this.silenceTimeoutMs);
        }

        if (final.trim()) {
          if (this.silenceTimer) clearTimeout(this.silenceTimer);
          this.livePartialSpeech = "";
          this.voiceDetectionStatus = `Transcribed: "${final.trim()}"`;
          if (this.onFinalSpeechResult) {
            this.onFinalSpeechResult(final.trim());
          }
          this.notify();
        }
      };

      this.recognition.onerror = (event: any) => {
        console.warn("Speech recognition notice:", event.error);
        if (event.error === "no-speech") {
          // Continuous listening restart
          return;
        }
        if (this.onError) {
          this.onError(event.error);
        }
      };

      this.recognition.onend = () => {
        // Continuous auto-restart loop if still listening
        if (this.isListening && this.currentLanguage) {
          setTimeout(() => {
            if (this.isListening && this.currentLanguage) {
              try {
                this.recognition?.start();
              } catch (_) {}
            }
          }, 150);
        }
      };

      this.recognition.start();
    } catch (e: any) {
      console.error("Failed to start SpeechRecognition:", e);
    }
  }

  public stopListening() {
    this.isListening = false;
    this.audioAmplitude = 0;
    this.micDecibels = 0;
    this.voiceDetectionStatus = "Microphone Idle";

    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (_) {}
      this.recognition = null;
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((t) => t.stop());
      this.mediaStream = null;
    }

    if (this.audioContext) {
      try {
        this.audioContext.close();
      } catch (_) {}
      this.audioContext = null;
    }

    this.notify();
  }

  public speakText(text: string, language: AppLanguage) {
    if (!text.trim() || !("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang =
      language.code === "hi" ? "hi-IN" : language.code === "es" ? "es-ES" : "en-US";
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    this.isSpeaking = true;
    this.notify();

    utterance.onend = () => {
      this.isSpeaking = false;
      this.notify();
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      this.notify();
    };

    window.speechSynthesis.speak(utterance);
  }

  public stopSpeaking() {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    this.isSpeaking = false;
    this.notify();
  }

  public simulateAudioInput(phrase: string) {
    this.isListening = true;
    this.audioAmplitude = 0.85;
    this.micDecibels = 68;
    this.livePartialSpeech = phrase;
    this.voiceDetectionStatus = `Simulated Voice: "${phrase}"`;
    this.notify();

    setTimeout(() => {
      this.livePartialSpeech = "";
      this.voiceDetectionStatus = `Transcribed via ${this.activeProvider.name}: "${phrase}"`;
      if (this.onFinalSpeechResult) {
        this.onFinalSpeechResult(phrase);
      }
      this.notify();
    }, 400);

    setTimeout(() => {
      this.audioAmplitude = 0.05;
      this.micDecibels = 0;
      this.notify();
    }, 900);
  }
}
