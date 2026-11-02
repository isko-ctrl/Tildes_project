"use client";
import { useState } from "react";
import LessonPlayer from "@/components/lessons/LessonPlayer";
import { lessons } from "@/lib/lessons/data";
import { useLearning } from "@/lib/learning/useLearning";
import { lessonDone } from "@/lib/learning/store";

export default function LessonsPage() {
  const [openId, setOpenId] = useState<string | null>(null);
  const { s } = useLearning();
  const open = lessons.find((l) => l.id === openId);
  const doneCount = s ? lessons.filter((l) => lessonDone(s, l.id)).length : 0;

  return (
    <main className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
      {open ? (
        <LessonPlayer key={open.id} lesson={open} onExit={() => setOpenId(null)} />
      ) : (
        <>
          <h1 className="text-3xl font-extrabold tracking-tight text-navy">Сабақтар</h1>
          <p className="mt-1 text-muted">Бастапқы деңгей (A1). Аяқталды: {doneCount} / {lessons.length}</p>
          <ol className="mt-8 flex flex-col items-center gap-7 pb-6">
            {lessons.map((l, i) => {
              const r = s?.lessons[l.id];
              const done = s ? lessonDone(s, l.id) : false;
              const dx = [0, 52, 78, 52, 0, -52, -78, -52][i % 8];
              return (
                <li key={l.id} style={{ transform: `translateX(${dx}px)` }}>
                  <button onClick={() => setOpenId(l.id)} aria-label={`${l.title} сабағын ашу`} className="group flex flex-col items-center text-center">
                    <span className={`lift grid h-20 w-20 place-items-center rounded-full text-2xl font-extrabold text-white shadow-xl ${done ? "bg-emerald-600 shadow-emerald-600/30" : "bg-brand shadow-brand/30"}`}>
                      {done ? "✓" : i + 1}
                    </span>
                    <span className="mt-2 block max-w-40 font-bold text-navy">{l.title}</span>
                    <span className="block max-w-40 text-xs text-muted">{r ? `${r.best}/${r.total}` : l.subtitle}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </>
      )}
    </main>
  );
}
