import React, { useState, useRef, useEffect } from "react";
import { AppLanguage, TrillChatMessage } from "../types";
import { SpeechManager } from "../services/SpeechManager";
import { TranslationEngine } from "../services/TranslationEngine";
import {
  Bot,
  Send,
  Volume2,
  Copy,
  Sparkles,
  Check,
  Loader2,
} from "lucide-react";

interface TrillAiScreenProps {
  speechManager: SpeechManager;
  translationEngine: TranslationEngine;
  targetLang: AppLanguage;
}

export const TrillAiScreen: React.FC<TrillAiScreenProps> = ({
  speechManager,
  translationEngine,
  targetLang,
}) => {
  const [messages, setMessages] = useState<TrillChatMessage[]>([
    {
      id: "msg_init",
      sender: "Trill AI",
      text: "👋 Hello! I am **Trill AI**, your multilingual language assistant created by Brian.\n\nAsk me anything about phrases, dictionary pronunciations (like \\bway-nohs DEE-ahs\\), cultural etiquette, or travel communication tips!",
      isUser: false,
      timestamp: Date.now(),
    },
  ]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  const quickPrompts = [
    "How do I order food politely in Spanish?",
    "When do I use 'Tú' vs 'Usted'?",
    "Dictionary pronunciation of 'Buenos días'",
    "Essential travel phrases for airport & hotel",
    "Hindi polite greetings & etiquette",
  ];

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    const q = textToSend.trim();
    if (!q || isLoading) return;

    const userMsg: TrillChatMessage = {
      id: `user_${Date.now()}`,
      sender: "You",
      text: q,
      isUser: true,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setQuery("");
    setIsLoading(true);

    const historyPairs: [string, string][] = messages.slice(1).reduce(
      (acc: [string, string][], cur, idx, arr) => {
        if (cur.isUser && arr[idx + 1] && !arr[idx + 1].isUser) {
          acc.push([cur.text, arr[idx + 1].text]);
        }
        return acc;
      },
      []
    );

    const reply = await translationEngine.chatWithTrillAi(q, historyPairs);

    const aiMsg: TrillChatMessage = {
      id: `ai_${Date.now()}`,
      sender: "Trill AI",
      text: reply,
      isUser: false,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, aiMsg]);
    setIsLoading(false);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div
      id="trill_ai_screen"
      className="flex flex-col flex-1 max-w-3xl mx-auto w-full pb-20 pt-2 px-3 sm:px-4 h-[calc(100vh-8rem)] text-slate-100"
    >
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-950/70 via-slate-900 to-indigo-950/70 border border-slate-800 rounded-2xl p-3 mb-2 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 to-indigo-500 flex items-center justify-center text-slate-950 shadow-md">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white">Trill AI Assistant</h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                ONLINE
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Multilingual Partner • Creation by Brian Cross
            </p>
          </div>
        </div>
      </div>

      {/* Quick Starter Chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 shrink-0">
        {quickPrompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => handleSendMessage(prompt)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/70 text-xs whitespace-nowrap transition-all shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{prompt}</span>
          </button>
        ))}
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 my-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.isUser ? "items-end" : "items-start"}`}
          >
            <span className="text-[10px] text-slate-500 font-bold mb-1 px-1">
              {msg.sender}
            </span>
            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs leading-relaxed shadow-md ${
                msg.isUser
                  ? "bg-teal-600 text-white rounded-br-none"
                  : "bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none"
              }`}
            >
              <div className="whitespace-pre-line space-y-2">{msg.text}</div>
            </div>

            {!msg.isUser && (
              <div className="flex items-center gap-2 mt-1 px-1 text-slate-400">
                <button
                  type="button"
                  onClick={() => speechManager.speakText(msg.text.replace(/[*#]/g, ""), targetLang)}
                  className="p-1 rounded hover:bg-slate-800 hover:text-white transition-colors"
                  title="Speak Response"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleCopy(msg.id, msg.text)}
                  className="p-1 rounded hover:bg-slate-800 hover:text-white transition-colors"
                  title="Copy Text"
                >
                  {copiedId === msg.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-slate-400 text-xs p-2">
            <Loader2 className="w-4 h-4 animate-spin text-teal-400" />
            <span>Trill AI is formulating answer & pronunciations...</span>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(query);
        }}
        className="flex items-center gap-2 shrink-0 bg-slate-900/90 border border-slate-800 rounded-2xl p-2"
      >
        <input
          id="trill_ai_input_field"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask Trill AI about phrases or pronunciations..."
          className="flex-1 bg-transparent px-3 py-2 text-xs text-white placeholder-slate-500 outline-none"
        />
        <button
          id="trill_ai_send_button"
          type="submit"
          disabled={!query.trim() || isLoading}
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
            query.trim() && !isLoading
              ? "bg-teal-500 text-slate-950 hover:bg-teal-400 font-bold"
              : "bg-slate-800 text-slate-500 cursor-not-allowed"
          }`}
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
