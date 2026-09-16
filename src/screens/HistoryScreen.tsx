import React, { useState } from "react";
import { TranscriptSession } from "../types";
import {
  Lock,
  Search,
  Share2,
  Trash2,
  Plus,
  FileText,
  Download,
  X,
} from "lucide-react";

interface HistoryScreenProps {
  sessions: TranscriptSession[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onCreateSession: (title: string) => void;
  onDeleteSession: (id: string) => void;
  e2eeFingerprint: string;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onCreateSession,
  onDeleteSession,
  e2eeFingerprint,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExport, setSelectedExport] = useState<TranscriptSession | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  const filtered = sessions.filter((s) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.sessionTitle.toLowerCase().includes(q) ||
      s.plainSummary.toLowerCase().includes(q) ||
      s.sourceLanguage.toLowerCase().includes(q) ||
      s.targetLanguage.toLowerCase().includes(q)
    );
  });

  const exportAsText = (session: TranscriptSession): string => {
    let out = `=========================================\n`;
    out += `Trill Live Transcript: ${session.sessionTitle}\n`;
    out += `Date: ${new Date(session.startTime).toLocaleString()}\n`;
    out += `Pair: ${session.sourceLanguage.toUpperCase()} ➔ ${session.targetLanguage.toUpperCase()}\n`;
    out += `E2EE Encrypted: AES-256-GCM\n`;
    out += `Turns: ${session.turns?.length || 0}\n`;
    out += `=========================================\n\n`;
    session.turns?.forEach((t, i) => {
      const time = new Date(t.timestamp).toLocaleTimeString();
      out += `[${time}] #${i + 1} ${t.speaker}:\n`;
      out += `  Original: ${t.sourceText}\n`;
      out += `  Translated: ${t.translatedText}\n`;
      out += `  Latency: ${t.latencyMs}ms\n\n`;
    });
    return out;
  };

  const exportAsMarkdown = (session: TranscriptSession): string => {
    let out = `# 📜 Trill Live Transcript: ${session.sessionTitle}\n\n`;
    out += `**Date:** ${new Date(session.startTime).toLocaleString()}  \n`;
    out += `**Language Pair:** \`${session.sourceLanguage.toUpperCase()} ➔ ${session.targetLanguage.toUpperCase()}\`  \n`;
    out += `**Security:** AES-256 E2E Encrypted  \n\n`;
    out += `| Time | Speaker | Original | Translation | Latency |\n`;
    out += `|---|---|---|---|---|\n`;
    session.turns?.forEach((t) => {
      const time = new Date(t.timestamp).toLocaleTimeString();
      const orig = t.sourceText.replace(/\|/g, "/");
      const trans = t.translatedText.replace(/\|/g, "/");
      out += `| ${time} | ${t.speaker} | ${orig} | ${trans} | ${t.latencyMs}ms |\n`;
    });
    return out;
  };

  const exportAsSrt = (session: TranscriptSession): string => {
    let out = "";
    session.turns?.forEach((t, i) => {
      const startMs = i * 3000;
      const endMs = startMs + 3000;
      const fmt = (ms: number) => {
        const h = Math.floor(ms / 3600000);
        const m = Math.floor((ms % 3600000) / 60000);
        const s = Math.floor((ms % 60000) / 1000);
        const rem = ms % 1000;
        return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")},${String(rem).padStart(3, "0")}`;
      };
      out += `${i + 1}\n${fmt(startMs)} --> ${fmt(endMs)}\n${t.translatedText}\n\n`;
    });
    return out;
  };

  const triggerDownload = (content: string, filename: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    setSelectedExport(null);
  };

  return (
    <div
      id="history_screen"
      className="flex flex-col flex-1 max-w-3xl mx-auto w-full pb-24 pt-2 px-3 sm:px-4 text-slate-100"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Session Transcripts
          </h1>
          <p className="text-xs text-slate-400">
            All notes stored locally with AES-256 E2E Encryption
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs font-bold">
          <Lock className="w-3.5 h-3.5 text-teal-400" />
          <span>{sessions.length} Sessions</span>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative mb-3">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          id="search_history_input"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search transcripts, notes, phrases..."
          className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-teal-500"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Session List */}
      <div className="flex-1 space-y-2.5 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <p className="text-sm font-semibold">No saved transcripts found</p>
            <p className="text-xs text-slate-500 mt-1">
              Record speech or test phrases in the Live tab to log conversations.
            </p>
          </div>
        ) : (
          filtered.map((session) => {
            const isCurrent = session.id === activeSessionId;
            return (
              <div
                key={session.id}
                id={`session_card_${session.id}`}
                className={`p-4 rounded-2xl border transition-all ${
                  isCurrent
                    ? "bg-teal-950/30 border-teal-500/40 shadow-md"
                    : "bg-slate-900/60 border-slate-800 hover:bg-slate-900/90"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    {isCurrent && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    )}
                    <h3 className="font-bold text-sm text-slate-100 truncate">
                      {session.sessionTitle}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      id={`export_session_${session.id}`}
                      type="button"
                      onClick={() => setSelectedExport(session)}
                      className="p-1.5 rounded-lg hover:bg-slate-800 text-teal-400"
                      title="Export Notes"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button
                      id={`delete_session_${session.id}`}
                      type="button"
                      onClick={() => onDeleteSession(session.id)}
                      className="p-1.5 rounded-lg hover:bg-slate-800 text-rose-400"
                      title="Delete Session"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                  <span>{new Date(session.startTime).toLocaleString()}</span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-800 text-teal-300 font-bold font-mono uppercase">
                    {session.sourceLanguage} ➔ {session.targetLanguage}
                  </span>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2">
                  {session.plainSummary || "No turns recorded yet"}
                </p>
              </div>
            );
          })
        )}
      </div>

      {/* Floating Action Button */}
      <button
        id="new_session_fab"
        type="button"
        onClick={() => setShowNewModal(true)}
        className="fixed right-6 bottom-20 w-12 h-12 rounded-full bg-teal-500 hover:bg-teal-400 text-slate-950 flex items-center justify-center shadow-2xl transition-all active:scale-95 z-30"
        title="Start New Session"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* New Session Modal */}
      {showNewModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl flex flex-col gap-4 text-slate-100">
            <h3 className="font-bold text-base">Start New Conversation Session</h3>
            <p className="text-xs text-slate-400">
              The current conversation will be encrypted and saved to history.
            </p>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Travel Inquiries, Hospital Consult"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white outline-none"
            />
            <div className="flex justify-end gap-2 mt-2">
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                id="confirm_new_session_button"
                type="button"
                onClick={() => {
                  onCreateSession(newTitle || `Session #${Date.now().toString().slice(-4)}`);
                  setShowNewModal(false);
                  setNewTitle("");
                }}
                className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold"
              >
                Start Session
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Format Modal */}
      {selectedExport && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl flex flex-col gap-4 text-slate-100">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-base">Export Conversation Notes</h3>
              <button
                type="button"
                onClick={() => setSelectedExport(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Select a format to download or share your transcript notes:
            </p>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  const txt = exportAsText(selectedExport);
                  triggerDownload(txt, `${selectedExport.sessionTitle}.txt`, "text/plain");
                }}
                className="w-full p-3 rounded-2xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700 flex items-center gap-3 text-left transition-all"
              >
                <FileText className="w-5 h-5 text-teal-400 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-white block">Plain Text (.txt)</span>
                  <span className="text-[10px] text-slate-400">
                    Clean readable conversation log with timestamps
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  const md = exportAsMarkdown(selectedExport);
                  triggerDownload(md, `${selectedExport.sessionTitle}.md`, "text/markdown");
                }}
                className="w-full p-3 rounded-2xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700 flex items-center gap-3 text-left transition-all"
              >
                <Download className="w-5 h-5 text-indigo-400 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-white block">Markdown Notes (.md)</span>
                  <span className="text-[10px] text-slate-400">
                    Formatted markdown table with E2EE metadata
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  const srt = exportAsSrt(selectedExport);
                  triggerDownload(srt, `${selectedExport.sessionTitle}.srt`, "application/x-subrip");
                }}
                className="w-full p-3 rounded-2xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700 flex items-center gap-3 text-left transition-all"
              >
                <Download className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-white block">SubRip Subtitle (.srt)</span>
                  <span className="text-[10px] text-slate-400">
                    Standard subtitle file for video players
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
