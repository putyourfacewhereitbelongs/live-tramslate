import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Lazy initialization of Gemini client
let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// In-memory state for live broadcast mirroring (port 8082 style)
let currentLiveBroadcast = {
  original: "",
  translated: "",
  pronunciation: "",
  sourceLang: "English",
  targetLang: "Hindi",
  isListening: false,
  audioEnergy: 0,
  latencyMs: 2,
  transcriptionProvider: "Samsung Live Transcription Service (On-Device)",
  timestamp: Date.now(),
};

// --- API ROUTES ---

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    appName: "Trill Translate",
    transcriptionProvider: "Samsung Default Live Transcription Service",
    providerPackage: "com.samsung.android.bixby.agent",
    timestamp: Date.now(),
  });
});

app.get("/api/live", (_req, res) => {
  res.json(currentLiveBroadcast);
});

app.post("/api/live", (req, res) => {
  currentLiveBroadcast = {
    ...currentLiveBroadcast,
    ...req.body,
    timestamp: Date.now(),
  };
  res.json({ success: true, live: currentLiveBroadcast });
});

// Translation Endpoint
app.post("/api/translate", async (req, res) => {
  const { text, sourceLang, targetLang, fastModel } = req.body;
  if (!text || typeof text !== "string") {
    return res.status(400).json({ error: "Missing text to translate" });
  }

  const startTime = Date.now();
  const ai = getAiClient();
  let modelToUse = "gemini-3.1-flash-lite";
  if (fastModel && !fastModel.includes("gemini-2") && !fastModel.includes("gemini-1")) {
    modelToUse = fastModel;
  }

  if (!ai) {
    // Client fallback if no key provided
    return res.json({
      translatedText: text,
      latencyMs: 1,
      isOffline: true,
      modelName: "Local Offline Lexicon",
    });
  }

  try {
    const prompt = `Translate this text directly from ${sourceLang || "English"} to ${targetLang || "Hindi"}. Output only the translated text, no explanations, no quotes:\n${text}`;
    
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Gemini request timed out")), 12000)
    );

    const generatePromise = ai.models.generateContent({
      model: modelToUse,
      contents: prompt,
    });

    const response = (await Promise.race([generatePromise, timeoutPromise])) as any;
    const translatedText = response.text ? response.text.trim() : text;
    const latencyMs = Date.now() - startTime;

    res.json({
      translatedText,
      latencyMs,
      isOffline: false,
      modelName: modelToUse.replace("gemini-", "Gemini "),
    });
  } catch (error: any) {
    console.error("Gemini translate error/timeout:", error?.message || error);
    res.json({
      translatedText: text,
      latencyMs: Date.now() - startTime,
      isOffline: true,
      modelName: "Instant Offline Fallback",
    });
  }
});

// AI Linguistic Explanation Endpoint
app.post("/api/explain", async (req, res) => {
  const { sourceText, translatedText, sourceLang, targetLang } = req.body;
  const ai = getAiClient();

  if (!ai) {
    return res.json({
      explanation: `**Natural Meaning**: "${sourceText}" translates naturally to "${translatedText}" in ${targetLang}.\n\n**Register & Politeness**: Suitable for everyday natural conversations, public interactions, and clear communication.\n\n**Cultural Etiquette**: Respectful communication across cultures is enhanced with a polite tone and warm eye contact.`,
    });
  }

  try {
    const prompt = `You are Trill Translate's AI linguistic expert. Analyze this translation from ${sourceLang || "English"} to ${targetLang || "Hindi"}:
Original: "${sourceText}"
Translation: "${translatedText}"
Format your response cleanly with these concise sections:
- **Natural Meaning vs Literal**: (1 concise sentence)
- **Register & Tone**: (Formal vs Informal, when to use)
- **Cultural Nuance**: (Key social/cultural etiquette note)
- **Pronunciation Guide**: (Breakdown of syllable stress)`;

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Gemini explain timed out")), 12000)
    );

    const generatePromise = ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: prompt,
    });

    const response = (await Promise.race([generatePromise, timeoutPromise])) as any;

    res.json({
      explanation: response.text ? response.text.trim() : "Analysis unavailable.",
    });
  } catch (error: any) {
    console.error("Gemini explain error:", error);
    res.json({
      explanation: `**Natural Meaning**: "${sourceText}" translates directly to "${translatedText}".\n\n**Register & Tone**: Suitable for everyday communication.`,
    });
  }
});

// Trill AI Chat Assistant Endpoint
app.post("/api/chat", async (req, res) => {
  const { query, history = [], fastCloudModel } = req.body;
  const ai = getAiClient();

  const getSmartFallback = (q: string) => {
    const lower = (q || "").toLowerCase();
    if (lower.includes("order") || lower.includes("food") || lower.includes("restaurant") || lower.includes("eat")) {
      return "🍽️ **Ordering Politely in Spanish & Hindi**:\n\n• **Spanish**: *\"Quisiera pedir... por favor\"* (\\kee-SYAY-rah pay-DEER... pohr fah-VOHR\\) - \"I would like to order... please.\"\n• **Hindi**: *\"कृपया मुझे यह दीजिए\"* (\\KRIP-yaa MUJHE yeh DEE-jee-ye\\) - \"Please give me this.\"\n\n*Tip*: In Spain, saying *\"¿Me cobras, por favor?\"* asks for the bill casually and politely.";
    } else if (lower.includes("tú") || lower.includes("tu") || lower.includes("usted")) {
      return "👥 **Tú vs. Usted (Spanish Registers)**:\n\n• **Tú (Informal)**: Used with friends, family, peers, children, and pets.\n• **Usted (Formal)**: Used with elders, doctors, police officers, store clerks, or business partners to show respect.\n\n*Example*: *\"¿Cómo estás?\"* (Tú) vs. *\"¿Cómo está usted?\"* (Usted).";
    } else if (lower.includes("thank") || lower.includes("gracias") || lower.includes("dhanyawad")) {
      return "🙏 **Expressing Gratitude**:\n\n• **Spanish**: *\"Muchas gracias\"* (\\MOO-chahs GRAH-syahs\\) - \"Thank you very much.\"\n• **Hindi**: *\"बहुत धन्यवाद\"* (\\bahut DHAN-yah-vaad\\) - \"Many thanks.\"\n• **French**: *\"Merci beaucoup\"* (\\mair-see boh-KOO\\).";
    }
    return "I am Trill AI, your multilingual language assistant created by Brian Cross! Ask me about phrase pronunciations, cultural etiquette, or travel tips.";
  };

  if (!ai) {
    return res.json({ reply: getSmartFallback(query) });
  }

  try {
    const systemPrompt = "You are Trill AI, an intelligent multilingual translation and language assistant in the Trill Translate app (created by Brian Cross). Provide instant translations, dictionary pronunciations (e.g. \\bway-nohs DEE-ahs\\), grammar breakdowns, cultural etiquette, and friendly advice. Keep replies concise, helpful, and formatted with bullet points or bold keys.";
    const contents: any[] = [
      { role: "user", parts: [{ text: `Instructions: ${systemPrompt}` }] },
      { role: "model", parts: [{ text: "Understood. I am Trill AI, ready to assist!" }] },
    ];

    if (Array.isArray(history)) {
      history.slice(-6).forEach(([userMsg, aiMsg]: [string, string]) => {
        contents.push({ role: "user", parts: [{ text: userMsg }] });
        contents.push({ role: "model", parts: [{ text: aiMsg }] });
      });
    }

    contents.push({ role: "user", parts: [{ text: query }] });

    const chatModel =
      fastCloudModel && !fastCloudModel.includes("gemini-2") && !fastCloudModel.includes("gemini-1")
        ? fastCloudModel
        : "gemini-3.1-flash-lite";

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Gemini chat timed out")), 15000)
    );

    const generatePromise = ai.models.generateContent({
      model: chatModel,
      contents,
    });

    const response = (await Promise.race([generatePromise, timeoutPromise])) as any;

    res.json({ reply: response.text ? response.text.trim() : getSmartFallback(query) });
  } catch (error: any) {
    console.error("Gemini chat handling error:", error?.message || error);
    res.json({ reply: getSmartFallback(query) });
  }
});

// Ollama Connection Test Proxy
app.post("/api/ollama/test", async (req, res) => {
  const { url } = req.body;
  if (!url || typeof url !== "string") {
    return res.status(400).json({ error: "Missing Ollama base URL" });
  }

  const cleanUrl = url.trim().replace(/\/+$/, "");
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    const fetchResp = await fetch(`${cleanUrl}/api/tags`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (fetchResp.ok) {
      const data = await fetchResp.json();
      const models = data?.models?.map((m: any) => m.name) || [];
      const modelListStr = models.length > 0 ? ` (${models.slice(0, 3).join(", ")})` : "";
      return res.json({
        success: true,
        message: `Online: ${models.length} models detected${modelListStr}`,
        models,
      });
    } else {
      return res.json({
        success: false,
        message: `HTTP ${fetchResp.status}: ${fetchResp.statusText}`,
      });
    }
  } catch (e: any) {
    return res.json({
      success: false,
      message: `Connection failed: ${e.message || "Timeout / Unreachable"}`,
    });
  }
});

// Ollama Generate Proxy
app.post("/api/ollama/generate", async (req, res) => {
  const { url, prompt, system, model } = req.body;
  if (!url) return res.status(400).json({ error: "Missing URL" });

  const cleanUrl = url.trim().replace(/\/+$/, "");
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const fetchResp = await fetch(`${cleanUrl}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: model || "qwen2.5:3b",
        prompt,
        system,
        stream: false,
        options: { temperature: 0.1, num_predict: 128 },
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!fetchResp.ok) {
      return res.status(fetchResp.status).json({ error: "Ollama generation failed" });
    }
    const data = await fetchResp.json();
    res.json({ text: (data.response || "").trim() });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Ollama call failed" });
  }
});

// --- VITE MIDDLEWARE SETUP ---
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
