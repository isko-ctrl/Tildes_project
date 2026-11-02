"use client";
import { useEffect, useState } from "react";
import type { SlideDeck } from "@/lib/lessons/slides";
import { gloss } from "@/lib/lessons/langs";
import { useLang, useLearning } from "@/lib/learning/useLearning";
import { completeActivity } from "@/lib/learning/store";

export default function SlidePlayer({ deck, onExit }: { deck: SlideDeck; onExit: () => void }) {
  const [lang] = useLang();
  const { mutate } = useLearning();
  const [i, setI] = useState(0);
  const [xp, setXp] = useState<number | null>(null);
  const total = deck.slides.length;
  const slide = deck.slides[i];
  const last = i === total - 1;

  function next() {
    if (!last) { setI(i + 1); return; }
    if (xp === null) setXp(mutate((d) => completeActivity(d, `slides:${deck.id}`, 10)));
  }
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setI((x) => Math.min(x + 1, total - 1));
      if (e.key === "ArrowLeft") setI((x) => Math.max(x - 1, 0));
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [total]);

  return (
    <section>
      <div className="flex items-center justify-between">
        <button onClick={onExit} className="text-sm font-semibold text-brand underline">← Презентациялар</button>
        <span className="text-sm text-muted">{deck.title}</span>
      </div>
      <article key={i} className="slide-in mt-5 min-h-[22rem] rounded-[28px] bg-white p-6 shadow-xl shadow-navy/10 ring-1 ring-navy/10 sm:p-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-navy">{slide.title}</h2>
        {slide.body && <p className="mt-4 text-lg leading-relaxed text-ink">{slide.body}</p>}
        {slide.items && (
          <ul className="mt-5 divide-y divide-navy/10 rounded-2xl bg-cream/70 ring-1 ring-navy/10">
            {slide.items.map((e) => (
              <li key={e.kk} className="flex items-baseline justify-between gap-4 px-4 py-3">
                <span className="font-bold text-navy">{e.kk}</span><span className="text-right text-muted">{gloss(e, lang)}</span>
              </li>
            ))}
          </ul>
        )}
        {slide.tip && <p className="mt-5 rounded-2xl bg-gold/25 p-4 font-semibold text-navy">{slide.tip}</p>}
      </article>
      <div className="mt-5 flex items-center justify-between">
        <button onClick={() => setI(Math.max(i - 1, 0))} disabled={i === 0} className="rounded-full bg-white px-5 py-2 font-bold text-navy ring-1 ring-navy/15 disabled:opacity-40">Артқа</button>
        <div className="flex gap-1.5" aria-hidden>{deck.slides.map((_, k) => <span key={k} className={`h-2 rounded-full transition-all ${k === i ? "w-6 bg-brand" : "w-2 bg-navy/20"}`} />)}</div>
        <button onClick={next} className="rounded-full bg-brand px-5 py-2 font-bold text-white transition active:scale-95">{last ? "Аяқтау" : "Келесі"}</button>
      </div>
      {xp !== null && <p role="status" className="mt-4 text-center font-bold text-emerald-800">Презентация аяқталды! {xp > 0 ? `+${xp} XP` : ""}</p>}
    </section>
  );
}
