import React, { useState, useEffect, useRef } from "react";
import { AppLanguage } from "../types";
import { SpeechManager } from "../services/SpeechManager";
import { TranslationEngine } from "../services/TranslationEngine";
import { Camera, Volume2, X, RefreshCw, Sparkles, SwitchCamera } from "lucide-react";

interface CameraTranslateScreenProps {
  speechManager: SpeechManager;
  translationEngine: TranslationEngine;
  sourceLang: AppLanguage;
  targetLang: AppLanguage;
}

interface SampleSign {
  text: string;
  category: string;
}

export const CameraTranslateScreen: React.FC<CameraTranslateScreenProps> = ({
  speechManager,
  translationEngine,
  sourceLang,
  targetLang,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [hasCamera, setHasCamera] = useState<boolean | null>(null);
  const [autoRead, setAutoRead] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState<{
    original: string;
    translated: string;
    pronunciation: string;
  } | null>(null);

  const sampleSigns: SampleSign[] = [
    { text: "Peligro No Pasar", category: "Warning" },
    { text: "Hospital de Emergencia", category: "Medical" },
    { text: "Salida de Emergencia", category: "Exit" },
    { text: "सावधान रहें", category: "Hindi Alert" },
    { text: "Tacos de Pescado con Guacamole", category: "Menu" },
    { text: "Water Drinking Station", category: "Transit" },
  ];

  useEffect(() => {
    let stream: MediaStream | null = null;
    const startCamera = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setHasCamera(false);
          return;
        }
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setHasCamera(true);
        }
      } catch (err) {
        setHasCamera(false);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const handleProcessDetectedText = async (text: string) => {
    if (!text.trim() || isProcessing) return;
    setIsProcessing(true);
    try {
      const res = await translationEngine.translate(text, sourceLang, targetLang);
      setSelectedBlock({
        original: text,
        translated: res.translatedText,
        pronunciation: res.pronunciation,
      });

      if (autoRead && res.translatedText) {
        speechManager.speakText(res.translatedText, targetLang);
      }
    } catch (_) {}
    setIsProcessing(false);
  };

  return (
    <div
      id="camera_translate_screen"
      className="relative flex-1 w-full bg-black flex flex-col justify-between overflow-hidden min-h-[80vh]"
    >
      {/* Video Feed / Virtual Lens */}
      <div className="absolute inset-0 flex items-center justify-center bg-slate-950">
        {hasCamera ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center text-slate-400 gap-3">
            <Camera className="w-16 h-16 text-slate-600" />
            <span className="text-base font-bold text-white">Camera Preview Ready</span>
            <p className="text-xs text-slate-400 max-w-sm">
              Use sample signs below to test instant OCR recognition and translation overlay, or enable camera access in your browser.
            </p>
          </div>
        )}

        {/* Viewfinder Overlay Frame */}
        <div className="absolute inset-x-8 inset-y-24 border-2 border-teal-400/40 rounded-3xl pointer-events-none flex flex-col justify-between p-4">
          <div className="flex justify-between items-start">
            <div className="w-6 h-6 border-t-2 border-l-2 border-teal-400 rounded-tl" />
            <div className="w-6 h-6 border-t-2 border-r-2 border-teal-400 rounded-tr" />
          </div>
          <div className="flex justify-between items-end">
            <div className="w-6 h-6 border-b-2 border-l-2 border-teal-400 rounded-bl" />
            <div className="w-6 h-6 border-b-2 border-r-2 border-teal-400 rounded-br" />
          </div>
        </div>
      </div>

      {/* Top Header Controls Bar */}
      <div className="relative z-20 m-4 rounded-2xl bg-black/70 backdrop-blur-md border border-white/10 p-3 flex items-center justify-between text-xs text-white">
        <div>
          <span className="font-extrabold tracking-wider text-teal-400 uppercase block">
            Camera OCR Translate
          </span>
          <span className="text-slate-300">
            {sourceLang.displayName} ➔ {targetLang.displayName} • Clean Lens
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-300">Auto-Read</span>
          <input
            id="camera_auto_read_switch"
            type="checkbox"
            checked={autoRead}
            onChange={(e) => setAutoRead(e.target.checked)}
            className="w-4 h-4 accent-teal-400"
          />
        </div>
      </div>

      {/* Bottom Docked Results & Sample Signs */}
      <div className="relative z-20 bg-slate-950/90 backdrop-blur-xl border-t border-slate-800 rounded-t-3xl p-4 flex flex-col gap-3">
        {selectedBlock && (
          <div
            id="camera_docked_result_card"
            className="bg-slate-900 border border-teal-500/50 rounded-2xl p-4 shadow-xl flex flex-col gap-1.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-widest text-teal-400 uppercase">
                OCR Translation
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => speechManager.speakText(selectedBlock.translated, targetLang)}
                  className="p-1.5 rounded-lg bg-teal-500/20 text-teal-300 hover:bg-teal-500/30"
                  title="Read Aloud"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedBlock(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <h3 className="text-base font-bold text-white leading-snug">
              {selectedBlock.translated}
            </h3>

            {selectedBlock.pronunciation && (
              <span className="text-xs font-mono text-amber-300">
                {selectedBlock.pronunciation}
              </span>
            )}

            <span className="text-[11px] text-slate-400 italic">
              Scanned: "{selectedBlock.original}"
            </span>
          </div>
        )}

        <div>
          <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block mb-2">
            Sample Street Signs (Instant Scan Test)
          </span>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {sampleSigns.map((s) => (
              <button
                key={s.text}
                type="button"
                onClick={() => handleProcessDetectedText(s.text)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap border transition-all ${
                  selectedBlock?.original === s.text
                    ? "bg-teal-500 text-slate-950 font-bold border-teal-400"
                    : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800"
                }`}
              >
                {s.text}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
