"use client";
import { useState } from "react";
import type { Deck } from "@/lib/lessons/cards";
import { gloss } from "@/lib/lessons/langs";
import { useLang, useLearning } from "@/lib/learning/useLearning";
import { addTranslateVocab, completeActivity } from "@/lib/learning/store";

export default function FlashDeck({ deck, onExit }: { deck: Deck; onExit: () => void }) {
  const [lang] = useLang();
  const { mutate } = useLearning();
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [again, setAgain] = useState(0);
  const [xp, setXp] = useState(0);
  const total = deck.cards.length;
  const c = deck.cards[i];

  function rate(known: boolean) {
    if (!known) { mutate((d) => addTranslateVocab(d, c.kk, gloss(c, lang))); setAgain((a) => a + 1); }
    setFlipped(false);
    if (i + 1 >= total) setXp(mutate((d) => completeActivity(d, `cards:${deck.id}`, 10)));
    setI(i + 1);
  }

  if (i >= total) {
    return (
      <section role="status" className="text-center">
        <h2 className="text-2xl font-bold text-navy">Жиынтық аяқталды!</h2>
        <p className="mt-3 text-5xl font-bold text-brand">{total - again} / {total}</p>
        {xp > 0 && <p className="mt-2 font-bold text-emerald-800">+{xp} XP</p>}
        {again > 0 && <p className="mt-3 text-muted">Қайталау керек сөздер «Қайталау» бөліміне қосылды: {again}.</p>}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button onClick={onExit} className="rounded-full bg-brand px-6 py-3 font-bold text-white transition active:scale-95">Басқа жиынтық</button>
          <button onClick={() => { setI(0); setAgain(0); setXp(0); }} className="rounded-full bg-gold px-6 py-3 font-bold text-navy transition active:scale-95">Қайта өту</button>
        </div>
      </section>
    );
  }
  return (
    <section>
      <div className="flex items-center gap-3">
        <button onClick={onExit} aria-label="Шығу" className="text-xl text-muted">✕</button>
        <div className="h-3 flex-1 overflow-hidden rounded-full bg-cyan/20"><div className="h-full rounded-full bg-gold transition-all duration-500" style={{ width: `${(i / total) * 100}%` }} /></div>
        <span className="text-sm text-muted">{i + 1}/{total}</span>
      </div>
      <button onClick={() => setFlipped((f) => !f)} aria-label="Карточканы аудару" className="mt-6 block w-full [perspective:1200px]">
        <div className={`relative h-60 w-full transition-transform duration-500 [transform-style:preserve-3d] ${flipped ? "[transform:rotateY(180deg)]" : ""}`}>
          <div className="absolute inset-0 grid place-items-center rounded-[28px] bg-white px-4 text-center shadow-xl shadow-navy/10 ring-1 ring-navy/10 [backface-visibility:hidden]">
            <span className="text-4xl font-extrabold text-navy">{c.kk}</span>
            <span className="absolute bottom-4 text-sm text-muted">Аудару үшін бас</span>
          </div>
          <div className="absolute inset-0 grid place-items-center rounded-[28px] bg-navy px-4 text-center text-white [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <span className="text-3xl font-bold">{gloss(c, lang)}</span>
          </div>
        </div>
      </button>
      {flipped && (
        <div className="slide-in mt-5 flex justify-center gap-3">
          <button onClick={() => rate(false)} className="rounded-full bg-gold px-6 py-3 font-bold text-navy transition active:scale-95">Қайталаймын</button>
          <button onClick={() => rate(true)} className="rounded-full bg-brand px-6 py-3 font-bold text-white transition active:scale-95">Білемін</button>
        </div>
      )}
    </section>
  );
}
