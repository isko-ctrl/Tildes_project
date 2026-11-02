"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import CorrectionCard from "./CorrectionCard";
import { useLearning } from "@/lib/learning/useLearning";
import { addMistakes, awardXp, saveToVocab } from "@/lib/learning/store";

type Role = "user" | "model";
interface Msg { role: Role; content: string }
type CharId = "aje" | "taxi" | "student" | "korkyt" | "barista" | "akimat";

const CHARS: { id: CharId; name: string; tagline: string; hint: string }[] = [
  { id: "aje", name: "AI-Әже", tagline: "Күнделікті әңгіме", hint: "Мысалы: Сәлеметсіз бе, әже!" },
  { id: "taxi", name: "Алматы таксисі", tagline: "Қаладағы жағдайлар", hint: "Мысалы: Сәлем, вокзалға барамыз ба?" },
  { id: "student", name: "Студент дос", tagline: "Құрдастармен сөйлесу", hint: "Мысалы: Сәлем, қалайсың?" },
  { id: "korkyt", name: "Қорқыт ата", tagline: "Дана қария (білім беру бейнесі)", hint: "Мысалы: Сәлеметсіз бе, ата! Күй туралы айтып беріңіз." },
  { id: "barista", name: "Бариста", tagline: "Кофехана: тапсырыс беру", hint: "Мысалы: Сәлеметсіз бе, бір шай бере аласыз ба?" },
  { id: "akimat", name: "Әкімдік маманы", tagline: "Ресми тіл: анықтама, кезек", hint: "Мысалы: Сәлеметсіз бе, анықтама алғым келеді." },
];
const MAX = 600;

export default function ChatClient() {
  const [char, setChar] = useState<CharId>("aje");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const convId = useRef<string | null>(null);
  const { s: learn, mutate } = useLearning();
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisIds, setAnalysisIds] = useState<string[] | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const current = CHARS.find((c) => c.id === char)!;

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading, error]);

  async function request(history: Msg[]) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ characterId: char, messages: history }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.reply) {
        setError(data.error ?? "Белгісіз қате. Қайталап көр.");
        return;
      }
      setMessages([...history, { role: "model", content: data.reply }]);
    } catch {
      setError("Серверге қосыла алмадық. Интернетті тексер.");
    } finally {
      setLoading(false);
    }
  }

  function send() {
    const t = text.trim();
    if (!t || loading || t.length > MAX) return;
    const next = [...messages, { role: "user" as const, content: t }];
    setMessages(next);
    setText("");
    request(next);
  }

  function pick(id: CharId) {
    if (id === char || loading || analyzing) return;
    setChar(id);
    setMessages([]);
    setError(null);
    setAnalysisIds(null);
    setAnalysisError(null);
    convId.current = null;
  }

  async function analyze() {
    convId.current ??= globalThis.crypto?.randomUUID?.() ?? String(Date.now());
    if (!convId.current) convId.current = crypto.randomUUID();
    setAnalyzing(true);
    setAnalysisError(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ characterId: char, messages }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !Array.isArray(data.corrections)) {
        setAnalysisError(data.error ?? "Талдау сәтсіз аяқталды. Қайталап көр.");
        return;
      }
      const ids = mutate((d) => {
        const added = addMistakes(d, data.corrections);
        if (awardXp(d, `conv:${convId.current}`, 20) > 0) d.conversations += 1;
        return added.map((m) => m.id);
      });
      setAnalysisIds(ids);
    } catch {
      setAnalysisError("Серверге қосыла алмадық. Интернетті тексер.");
    } finally {
      setAnalyzing(false);
    }
  }

  const canAnalyze = !loading && messages.some((m) => m.role === "user") && messages[messages.length - 1]?.role === "model";
  const analysisMistakes = (analysisIds ?? []).map((id) => learn?.mistakes.find((m) => m.id === id)).filter(Boolean);

  return (
    <div className="flex min-h-[calc(100dvh-5rem)] flex-col">
      <div role="tablist" aria-label="Кейіпкер таңда" className="flex gap-2 overflow-x-auto pb-3">
        {CHARS.map((c) => (
          <button
            key={c.id}
            role="tab"
            aria-selected={c.id === char}
            onClick={() => pick(c.id)}
            className={`shrink-0 rounded-2xl px-4 py-2 text-left transition ${
              c.id === char ? "bg-navy text-white" : "bg-white text-navy ring-1 ring-navy/15"
            }`}
          >
            <span className="block text-sm font-bold">{c.name}</span>
            <span className={`block text-xs ${c.id === char ? "text-white/75" : "text-muted"}`}>{c.tagline}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 space-y-3 py-3" aria-live="polite">
        {messages.length === 0 && (
          <p className="rounded-2xl bg-gold/20 p-4 text-navy">
            {current.name} сенің бірінші хабарламаңды күтіп тұр. Қазақша жазып көр. <span className="text-muted">{current.hint}</span>
          </p>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <p className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 ${
              m.role === "user" ? "rounded-br-md bg-brand text-white" : "rounded-bl-md bg-white text-ink ring-1 ring-navy/10"
            }`}>
              {m.content}
            </p>
          </div>
        ))}
        {loading && <p className="text-sm text-muted">{current.name} жазып жатыр…</p>}
        {error && (
          <div role="alert" className="rounded-2xl bg-red-50 p-4 text-red-900 ring-1 ring-red-200">
            <p>{error}</p>
            {messages.length > 0 && messages[messages.length - 1].role === "user" && (
              <button onClick={() => request(messages)} className="mt-2 rounded-full bg-red-900 px-4 py-1.5 text-sm font-semibold text-white">
                Қайталау
              </button>
            )}
          </div>
        )}
        {analysisError && (
          <p role="alert" className="rounded-2xl bg-red-50 p-4 text-red-900 ring-1 ring-red-200">{analysisError}</p>
        )}
        {analysisIds && (
          <section aria-label="Талдау нәтижесі" className="space-y-3 pt-2">
            <h2 className="text-lg font-bold text-navy">Қате ізі</h2>
            {analysisMistakes.length === 0 && (
              <p className="rounded-2xl bg-emerald-50 p-4 text-emerald-900">Нақты қате табылмады. Жарайсың! +20 XP</p>
            )}
            {analysisMistakes.map((m) => m && (
              <CorrectionCard key={m.id} m={m} onSave={() => mutate((d) => saveToVocab(d, m.id))} />
            ))}
            <Link href="/dictionary" className="inline-block font-semibold text-brand underline">Жеке сөздікке өту</Link>
          </section>
        )}
        <div ref={endRef} />
      </div>

      <div className="sticky bottom-0 -mx-1 bg-cream/95 px-1 pb-3 pt-2 backdrop-blur">
        {canAnalyze && (
          <button onClick={analyze} disabled={analyzing}
            className="mb-2 w-full rounded-2xl bg-gold px-4 py-3 font-bold text-navy disabled:opacity-60">
            {analyzing ? "Талдап жатырмын…" : "Әңгімемді талдау"}
          </button>
        )}
        <div className="flex items-end gap-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            maxLength={MAX}
            rows={1}
            placeholder="Қазақша жаз…"
            aria-label="Хабарлама"
            className="max-h-32 min-h-12 flex-1 resize-none rounded-2xl bg-white px-4 py-3 ring-1 ring-navy/20 focus:ring-2 focus:ring-cyan"
          />
          <button
            onClick={send}
            disabled={loading || !text.trim()}
            className="h-12 rounded-2xl bg-brand px-5 font-bold text-white disabled:opacity-40"
          >
            Жіберу
          </button>
        </div>
        <p className="mt-1 text-right text-xs text-muted">{text.length}/{MAX}</p>
      </div>
    </div>
  );
}
