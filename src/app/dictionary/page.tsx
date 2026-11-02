"use client";
import Link from "next/link";
import { useLearning } from "@/lib/learning/useLearning";
import { deleteVocab, dueCards } from "@/lib/learning/store";

export default function DictionaryPage() {
  const { s, mutate } = useLearning();
  const due = s ? dueCards(s).length : 0;
  return (
    <main className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
      <h1 className="text-2xl font-bold text-navy">Жеке сөздік</h1>
      {s && s.vocab.length > 0 && (
        <Link href="/review" className="mt-3 inline-block rounded-full bg-brand px-6 py-3 font-bold text-white">
          Қайталауды бастау{due > 0 ? ` (${due})` : ""}
        </Link>
      )}
      <ul className="mt-5 space-y-3">
        {s && s.vocab.length === 0 && (
          <li className="rounded-2xl bg-gold/20 p-5 text-navy">
            Сөздігің бос. «Қате ізі» бөлімінде түзетілген фразаны «Сөздікке сақтау» арқылы қос.{" "}
            <Link href="/mistakes" className="font-bold underline">Қате ізіне өту</Link>
          </li>
        )}
        {s?.vocab.map((v) => (
          <li key={v.id} className="rounded-2xl bg-white p-4 ring-1 ring-navy/10">
            <p className="text-lg font-bold text-navy">{v.phrase}</p>
            <p className="mt-1 text-muted">{v.meaning}</p>
            {v.kind !== "translate" && <p className="mt-1 text-sm text-red-800 line-through decoration-red-300">{v.prompt}</p>}
            <button onClick={() => mutate((d) => deleteVocab(d, v.id))} className="mt-3 text-sm font-semibold text-red-800 underline">
              Өшіру
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
