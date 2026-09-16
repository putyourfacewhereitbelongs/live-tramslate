import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      id="pwa-offline-indicator"
      className="fixed bottom-20 left-4 z-50 flex items-center gap-2 rounded-xl bg-amber-500/95 backdrop-blur-md border border-amber-400/40 px-3.5 py-2 text-xs font-medium text-slate-950 shadow-xl shadow-amber-950/20 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2"
    >
      <WifiOff className="w-4 h-4 text-slate-950 shrink-0" />
      <span>Offline Mode — Translation using local device dictionary & models</span>
      <span className="h-2 w-2 rounded-full bg-slate-950/60 animate-pulse ml-1" />
    </div>
  );
};
