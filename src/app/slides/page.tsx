"use client";
import { useState } from "react";
import SlidePlayer from "@/components/lessons/SlidePlayer";
import { slideDecks } from "@/lib/lessons/slides";
import { useLearning } from "@/lib/learning/useLearning";

export default function SlidesPage() {
  const [openId, setOpenId] = useState<string | null>(null);
  const { s } = useLearning();
  const open = slideDecks.find((d) => d.id === openId);
  return (
    <main className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
      {open ? <SlidePlayer key={open.id} deck={open} onExit={() => setOpenId(null)} /> : (
        <>
          <h1 className="text-3xl font-extrabold tracking-tight text-navy">Презентациялар</h1>
          <p className="mt-1 text-muted">Грамматика мен сөздік қысқа слайдтармен.</p>
          <ul className="mt-5 space-y-3">
            {slideDecks.map((d, i) => (
              <li key={d.id}>
                <button onClick={() => setOpenId(d.id)} className="lift flex w-full items-center gap-4 rounded-3xl bg-white p-5 text-left ring-1 ring-navy/10">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-navy text-lg font-bold text-white">{s?.done[`slides:${d.id}`] ? "✓" : i + 1}</span>
                  <span><span className="block text-lg font-bold text-navy">{d.title}</span><span className="block text-sm text-muted">{d.subtitle} · {d.slides.length} слайд</span></span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  );
}
