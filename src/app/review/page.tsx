"use client";
import Link from "next/link";
import { useState } from "react";
import { useLearning } from "@/lib/learning/useLearning";
import { dueCards, gradeCard, isCorrect, type Outcome } from "@/lib/learning/store";

export default function ReviewPage() {
  const { s, mutate } = useLearning();
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<boolean | null>(null);
  const [gained, setGained] = useState(0);

  if (!s) return <main className="mx-auto max-w-2xl px-4 py-6" />;
  const due = dueCards(s);
  const card = due[0];

  function grade(outcome: Outcome) {
    const xp = mutate((d) => gradeCard(d, card.id, outcome));
    setGained(xp);
    setAnswer("");
    setResult(null);
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
      <h1 className="text-2xl font-bold text-navy">Қайталау</h1>
      {s.vocab.length === 0 && (
        <p className="mt-5 rounded-2xl bg-gold/20 p-5 text-navy">
          Қайталайтын сөз жоқ. Алдымен әңгіме жүргізіп, қатені сөздікке сақта.{" "}
          <Link href="/dialog" className="font-bold underline">Әңгіме бастау</Link>
        </p>
      )}
      {s.vocab.length > 0 && !card && (
        <p className="mt-5 rounded-2xl bg-emerald-50 p-5 text-emerald-900">
          Бүгінге қайталайтын карточка қалмады. Жарайсың!{gained > 0 ? ` +${gained} XP` : ""}
        </p>
      )}
      {card && (
        <section className="mt-5 rounded-2xl bg-white p-5 ring-1 ring-navy/10">
          <p className="text-sm text-muted">Қалған карточка: {due.length}</p>
          <p className="mt-3 text-muted">{card.kind === "translate" ? "Қазақша қалай айтылады?" : "Мына фразаның дұрыс нұсқасын жаз:"}</p>
          <p className={`mt-1 text-xl font-bold ${card.kind === "translate" ? "text-navy" : "text-red-800"}`}>{card.prompt}</p>
          {result === null ? (
            <>
              <input value={answer} onChange={(e) => setAnswer(e.target.value)} aria-label="Жауап"
                onKeyDown={(e) => { if (e.key === "Enter" && answer.trim()) setResult(isCorrect(answer, card.phrase)); }}
                className="mt-4 w-full rounded-2xl bg-cream px-4 py-3 ring-1 ring-navy/20 focus:ring-2 focus:ring-cyan" placeholder="Жауабың…" />
              <button onClick={() => setResult(isCorrect(answer, card.phrase))} disabled={!answer.trim()}
                className="mt-3 rounded-full bg-brand px-6 py-3 font-bold text-white disabled:opacity-40">Тексеру</button>
            </>
          ) : (
            <div className="mt-4" role="status">
              <p className={`font-bold ${result ? "text-emerald-800" : "text-red-800"}`}>{result ? "Дұрыс!" : "Дұрыс емес."}</p>
              <p className="mt-1 text-lg font-bold text-navy">{card.phrase}</p>
              <p className="mt-1 text-muted">{card.meaning}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {result ? (
                  <>
                    <button onClick={() => grade("hard")} className="rounded-full bg-gold px-5 py-2 font-bold text-navy">Қиын болды</button>
                    <button onClick={() => grade("easy")} className="rounded-full bg-brand px-5 py-2 font-bold text-white">Оңай болды (+5 XP)</button>
                  </>
                ) : (
                  <button onClick={() => grade("wrong")} className="rounded-full bg-navy px-5 py-2 font-bold text-white">Түсіндім, кейін қайталаймын</button>
                )}
              </div>
            </div>
          )}
        </section>
      )}
    </main>
  );
}
