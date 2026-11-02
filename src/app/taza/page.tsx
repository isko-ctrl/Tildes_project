"use client";
import { useState } from "react";
import type { TazaIssue } from "@/lib/ai/taza";

const SAMPLE = "Астана — Қазақстанның астанасы болып табылады. Біз жаңа жобаны жүзеге асыру үстіндеміз.";
const MAX = 1500;

export default function TazaPage() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [res, setRes] = useState<{ issues: TazaIssue[]; clean: string } | null>(null);
  const [copied, setCopied] = useState(false);

  async function check() {
    if (!text.trim() || loading) return;
    setLoading(true); setError(null); setRes(null); setCopied(false);
    try {
      const r = await fetch("/api/taza", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text }) });
      const data = await r.json().catch(() => ({}));
      if (!r.ok || !Array.isArray(data.issues)) setError(data.error ?? "Белгісіз қате. Қайталап көр.");
      else setRes(data);
    } catch { setError("Серверге қосыла алмадық. Интернетті тексер."); }
    finally { setLoading(false); }
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="text-4xl font-extrabold tracking-tight text-navy">Таза қазақша</h1>
      <p className="mt-2 text-lg text-muted">Мәтіндегі калька мен русизмді тауып, табиғи қазақша нұсқасын ұсынады.</p>
      <textarea value={text} onChange={(e) => setText(e.target.value)} maxLength={MAX} rows={6} aria-label="Мәтін"
        placeholder="Мәтініңді осында қой…" className="mt-6 w-full rounded-3xl bg-white p-4 text-lg ring-1 ring-navy/20 focus:ring-2 focus:ring-cyan" />
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button onClick={check} disabled={loading || !text.trim()} className="rounded-full bg-brand px-7 py-3 text-lg font-bold text-white transition active:scale-95 disabled:opacity-40">
          {loading ? "Тексеріп жатырмын…" : "Тексеру"}
        </button>
        <button onClick={() => setText(SAMPLE)} className="rounded-full bg-white px-5 py-3 font-semibold text-navy ring-1 ring-navy/15">Мысал қою</button>
        <span className="ml-auto text-sm text-muted">{text.length}/{MAX}</span>
      </div>
      {error && <p role="alert" className="mt-5 rounded-2xl bg-red-50 p-4 text-red-900 ring-1 ring-red-200">{error}</p>}
      {res && (
        <section aria-label="Нәтиже" className="slide-in mt-6 space-y-3">
          {res.issues.length === 0 && <p className="rounded-2xl bg-emerald-50 p-4 text-emerald-900">Калька мен русизм табылмады. Мәтін таза көрінеді!</p>}
          {res.issues.map((i, k) => (
            <article key={k} className="rounded-2xl bg-white p-4 ring-1 ring-navy/10">
              <span className="rounded-full bg-cyan/20 px-3 py-1 text-xs font-bold text-navy">{i.type}</span>
              <p className="mt-3 text-red-800 line-through decoration-red-300">{i.original}</p>
              <p className="mt-1 text-lg font-bold text-emerald-800">{i.suggestion}</p>
              <p className="mt-2 text-muted">{i.reason_kk}</p>
            </article>
          ))}
          {res.issues.length > 0 && (
            <div className="rounded-2xl bg-gold/20 p-4">
              <p className="font-bold text-navy">Таза мәтін</p>
              <p className="mt-2 whitespace-pre-wrap text-ink">{res.clean}</p>
              <button onClick={async () => { try { await navigator.clipboard.writeText(res.clean); setCopied(true); } catch { /* буфер жоқ */ } }}
                className="mt-3 rounded-full bg-navy px-5 py-2 font-bold text-white">{copied ? "Көшірілді ✓" : "Көшіру"}</button>
            </div>
          )}
        </section>
      )}
    </main>
  );
}
