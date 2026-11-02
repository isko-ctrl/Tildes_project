"use client";
import { useMemo, useState } from "react";
import { buildExercises, type Lesson, type Vocab } from "@/lib/lessons/data";
import { gloss } from "@/lib/lessons/langs";
import { useLang, useLearning } from "@/lib/learning/useLearning";
import { completeLesson, isCorrect, LESSON_PASS } from "@/lib/learning/store";

export default function LessonPlayer({ lesson, onExit }: { lesson: Lesson; onExit: () => void }) {
  const [lang] = useLang();
  const exercises = useMemo(() => buildExercises(lesson, lang), [lesson, lang]);
  const { mutate } = useLearning();
  const [step, setStep] = useState(-1); // -1: жаңа сөздер, exercises.length: нәтиже
  const [picked, setPicked] = useState<number | null>(null);
  const [typed, setTyped] = useState("");
  const [result, setResult] = useState<boolean | null>(null);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState<Vocab[]>([]);
  const [xp, setXp] = useState(0);
  const total = exercises.length;
  const ex = step >= 0 && step < total ? exercises[step] : null;

  function answer(ok: boolean) {
    if (result !== null || !ex) return;
    setResult(ok);
    if (ok) setCorrect((c) => c + 1);
    else if (ex.vocab) setWrong((w) => [...w, ex.vocab as Vocab]);
  }
  function next() {
    setPicked(null); setTyped(""); setResult(null);
    if (step + 1 >= total) {
      setXp(mutate((d) => completeLesson(d, lesson.id, correct, total, wrong.map((w) => ({ kk: w.kk, ru: gloss(w, lang) })))));
    }
    setStep(step + 1);
  }

  if (step === -1) {
    return (
      <section>
        <button onClick={onExit} className="text-sm font-semibold text-brand underline">← Сабақтар</button>
        <h2 className="mt-3 text-2xl font-bold text-navy">{lesson.title}</h2>
        <p className="mt-1 text-muted">Жаңа сөздер. Оқып шық, содан кейін жаттығуға өт.</p>
        <ul className="mt-4 divide-y divide-navy/10 rounded-2xl bg-white ring-1 ring-navy/10">
          {lesson.vocab.map((v) => (
            <li key={v.kk} className="flex items-baseline justify-between gap-4 px-4 py-3">
              <span className="font-bold text-navy">{v.kk}</span><span className="text-right text-muted">{gloss(v, lang)}</span>
            </li>
          ))}
        </ul>
        <button onClick={() => setStep(0)} className="mt-5 rounded-full bg-brand px-7 py-3 text-lg font-bold text-white">Жаттығуды бастау</button>
      </section>
    );
  }

  if (step >= total) {
    const passed = correct / total >= LESSON_PASS;
    return (
      <section role="status" className="text-center">
        <h2 className="text-2xl font-bold text-navy">{passed ? "Сабақ аяқталды!" : "Тағы бір рет көр"}</h2>
        <p className="mt-3 text-5xl font-bold text-brand">{correct} / {total}</p>
        {xp > 0 && <p className="mt-2 font-bold text-emerald-800">+{xp} XP</p>}
        {!passed && <p className="mt-2 text-muted">Сабақты өту үшін кемінде 60% дұрыс жауап керек.</p>}
        {wrong.length > 0 && <p className="mt-3 text-muted">Қателескен сөздер «Қайталау» бөліміне қосылды: {wrong.length}.</p>}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button onClick={onExit} className="rounded-full bg-brand px-6 py-3 font-bold text-white">Басқа сабақ</button>
          <button onClick={() => { setStep(-1); setCorrect(0); setWrong([]); setXp(0); }} className="rounded-full bg-gold px-6 py-3 font-bold text-navy">Қайта өту</button>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="flex items-center gap-3">
        <button onClick={onExit} aria-label="Сабақтан шығу" className="text-xl text-muted">✕</button>
        <div className="h-3 flex-1 overflow-hidden rounded-full bg-cyan/20" role="progressbar" aria-valuenow={step} aria-valuemin={0} aria-valuemax={total}>
          <div className="h-full rounded-full bg-gold transition-all" style={{ width: `${(step / total) * 100}%` }} />
        </div>
        <span className="text-sm text-muted">{step + 1}/{total}</span>
      </div>
      <h2 className="mt-6 text-xl font-bold text-navy">{ex!.prompt}</h2>

      {ex!.kind === "choice" ? (
        <div className="mt-5 grid gap-3">
          {ex!.options.map((o, i) => {
            const state = result === null ? "" : i === ex!.answer ? "ring-2 ring-emerald-600 bg-emerald-50" : i === picked ? "ring-2 ring-red-500 bg-red-50" : "opacity-60";
            return (
              <button key={o} disabled={result !== null} onClick={() => { setPicked(i); answer(i === ex!.answer); }}
                className={`rounded-2xl bg-white px-4 py-4 text-left text-lg font-semibold text-navy ring-1 ring-navy/15 ${state}`}>
                {o}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="mt-5">
          <input value={typed} onChange={(e) => setTyped(e.target.value)} disabled={result !== null} aria-label="Жауап"
            onKeyDown={(e) => { if (e.key === "Enter" && typed.trim() && result === null) answer(isCorrect(typed, ex!.answer)); }}
            className="w-full rounded-2xl bg-white px-4 py-4 text-lg ring-1 ring-navy/20 focus:ring-2 focus:ring-cyan" placeholder="Қазақша жаз…" />
          {result === null && (
            <button onClick={() => answer(isCorrect(typed, ex!.answer))} disabled={!typed.trim()}
              className="mt-3 rounded-full bg-brand px-6 py-3 font-bold text-white disabled:opacity-40">Тексеру</button>
          )}
        </div>
      )}

      {result !== null && (
        <div role="status" className={`mt-5 rounded-2xl p-4 ${result ? "bg-emerald-50 text-emerald-900" : "bg-red-50 text-red-900"}`}>
          <p className="font-bold">{result ? "Дұрыс!" : "Дұрыс емес."}</p>
          {!result && ex!.kind === "type" && <p className="mt-1">Дұрыс жауап: <b>{ex!.answer}</b></p>}
          <button onClick={next} className="mt-3 rounded-full bg-navy px-6 py-2 font-bold text-white">Жалғастыру</button>
        </div>
      )}
    </section>
  );
}
