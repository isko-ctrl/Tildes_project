"use client";
import Link from "next/link";
import CorrectionCard from "@/components/dialog/CorrectionCard";
import { useLearning } from "@/lib/learning/useLearning";
import { saveToVocab } from "@/lib/learning/store";

export default function MistakesPage() {
  const { s, mutate } = useLearning();
  return (
    <main className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
      <h1 className="text-2xl font-bold text-navy">Қате ізі</h1>
      <p className="mt-1 text-muted">Әңгімелеріңдегі нақты қателер мен түсіндірмелер.</p>
      <div className="mt-5 space-y-3">
        {s && s.mistakes.length === 0 && (
          <div className="rounded-2xl bg-gold/20 p-5 text-navy">
            Әзірге қате жоқ. Әңгіме жүргізіп, «Әңгімемді талдау» батырмасын бас.{" "}
            <Link href="/dialog" className="font-bold underline">Әңгіме бастау</Link>
          </div>
        )}
        {s?.mistakes.map((m) => (
          <CorrectionCard key={m.id} m={m} onSave={() => mutate((d) => saveToVocab(d, m.id))} />
        ))}
      </div>
    </main>
  );
}
