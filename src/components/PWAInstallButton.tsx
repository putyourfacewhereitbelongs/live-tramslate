import React, { useState } from 'react';
import { Download, Share, PlusSquare, X, Smartphone } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'header' | 'banner' | 'settings';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'header' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  // If already running as standalone PWA, hide install triggers
  if (isInstalled) {
    if (variant === 'settings') {
      return (
        <div id="pwa-installed-status" className="flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-2 rounded-xl">
          <Smartphone className="w-4 h-4 text-emerald-400" />
          <span>App is installed as PWA on this device</span>
        </div>
      );
    }
    return null;
  }

  const handleInstallClick = async () => {
    setIsInstalling(true);
    try {
      await install();
    } finally {
      setIsInstalling(false);
    }
  };

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    if (variant === 'settings') {
      return (
        <button
          id="btn-pwa-install-settings"
          onClick={handleInstallClick}
          disabled={isInstalling}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-95 text-white font-medium py-2.5 px-4 rounded-xl text-xs shadow-lg shadow-emerald-950/40 border border-emerald-400/30 transition-all cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>{isInstalling ? 'Installing...' : 'Install Trill as Native App (PWA)'}</span>
        </button>
      );
    }

    return (
      <button
        id="btn-pwa-install-header"
        onClick={handleInstallClick}
        disabled={isInstalling}
        title="Install Trill as standalone app"
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 hover:text-emerald-200 border border-emerald-500/30 text-xs font-medium transition cursor-pointer active:scale-95"
      >
        <Download className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Install App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        {variant === 'settings' ? (
          <button
            id="btn-pwa-ios-settings"
            onClick={() => setShowIOSGuide(true)}
            className="w-full flex items-center justify-center gap-2 bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 py-2.5 px-4 rounded-xl text-xs font-medium transition cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Install on iPhone / iPad (iOS)</span>
          </button>
        ) : (
          <button
            id="btn-pwa-ios-header"
            onClick={() => setShowIOSGuide(true)}
            title="Install on iPhone / iPad"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/70 hover:bg-slate-800 text-slate-300 border border-slate-700/60 text-xs font-medium transition cursor-pointer active:scale-95"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Install PWA</span>
          </button>
        )}

        {showIOSGuide && (
          <div
            id="modal-pwa-ios-guide"
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in"
          >
            <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100 relative">
              <button
                id="btn-close-ios-guide"
                onClick={() => setShowIOSGuide(false)}
                className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
                <Smartphone className="w-6 h-6" />
              </div>

              <h3 className="text-base font-semibold text-slate-100">
                Install Trill on iPhone or iPad
              </h3>
              <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                Add Trill Translate to your home screen for full-screen offline translation and quick access.
              </p>

              <div className="mt-4 space-y-3 text-xs bg-slate-950/50 p-3.5 rounded-xl border border-slate-800">
                <div className="flex items-start gap-2.5">
                  <div className="p-1 rounded bg-slate-800 text-sky-400 mt-0.5">
                    <Share className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-200">Step 1:</span> Tap the <strong className="text-sky-400">Share</strong> button in Safari toolbar.
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="p-1 rounded bg-slate-800 text-emerald-400 mt-0.5">
                    <PlusSquare className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-200">Step 2:</span> Scroll down and tap <strong className="text-emerald-400">Add to Home Screen</strong>.
                  </div>
                </div>
              </div>

              <button
                id="btn-confirm-ios-guide"
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 py-2.5 text-xs font-semibold text-white shadow-lg shadow-emerald-950/30 transition cursor-pointer"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback for browsers when beforeinstallprompt is not triggered yet or not supported
  if (variant === 'settings') {
    return (
      <div id="pwa-settings-ready" className="text-xs text-slate-400 bg-slate-900/40 border border-slate-800/60 p-3 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-emerald-400" />
          <span>PWA Service Worker Active & Ready</span>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">
          Cached
        </span>
      </div>
    );
  }

  return null;
};
