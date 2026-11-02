import type { Mistake } from "@/lib/learning/store";

export default function CorrectionCard({ m, onSave }: { m: Mistake; onSave: () => void }) {
  return (
    <article className="rounded-2xl bg-white p-4 ring-1 ring-navy/10">
      <span className="rounded-full bg-cyan/20 px-3 py-1 text-xs font-bold text-navy">{m.category}</span>
      <p className="mt-3 text-red-800 line-through decoration-red-300">{m.original}</p>
      <p className="mt-1 text-lg font-bold text-emerald-800">{m.corrected}</p>
      <p className="mt-2 text-muted">{m.explanation}</p>
      <button onClick={onSave} disabled={Boolean(m.vocabId)}
        className="mt-3 rounded-full bg-brand px-5 py-2 text-sm font-bold text-white disabled:bg-emerald-700 disabled:opacity-90">
        {m.vocabId ? "Сөздікке сақталды ✓" : "Сөздікке сақтау"}
      </button>
    </article>
  );
}
