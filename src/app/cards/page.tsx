"use client";
import { useState } from "react";
import FlashDeck from "@/components/lessons/FlashDeck";
import { decks } from "@/lib/lessons/cards";
import { useLearning } from "@/lib/learning/useLearning";

export default function CardsPage() {
  const [openId, setOpenId] = useState<string | null>(null);
  const { s } = useLearning();
  const open = decks.find((d) => d.id === openId);
  return (
    <main className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
      {open ? <FlashDeck key={open.id} deck={open} onExit={() => setOpenId(null)} /> : (
        <>
          <h1 className="text-3xl font-extrabold tracking-tight text-navy">Карточкалар</h1>
          <p className="mt-1 text-muted">Сөзді көр, аударманы ойла, карточканы аудар.</p>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {decks.map((d) => (
              <li key={d.id}>
                <button onClick={() => setOpenId(d.id)} className="lift w-full rounded-3xl bg-white p-5 text-left ring-1 ring-navy/10">
                  <span className="block text-lg font-bold text-navy">{d.title}</span>
                  <span className="block text-sm text-muted">{d.subtitle}</span>
                  <span className="mt-3 inline-block text-sm font-semibold text-brand">{d.cards.length} карточка{s?.done[`cards:${d.id}`] ? " · ✓" : ""}</span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  );
}
