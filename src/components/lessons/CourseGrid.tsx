"use client";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import { lessons } from "@/lib/lessons/data";
import { decks } from "@/lib/lessons/cards";
import { slideDecks } from "@/lib/lessons/slides";
import { characters } from "@/lib/ai/characters";
import { useLearning } from "@/lib/learning/useLearning";
import { lessonDone } from "@/lib/learning/store";

export default function CourseGrid() {
  const { s } = useLearning();
  const items = [
    { href: "/lessons", title: "Сабақтар", desc: "Жаттығулары бар A1 сабақтары", total: lessons.length, done: s ? lessons.filter((l) => lessonDone(s, l.id)).length : 0, tone: "from-brand to-cyan text-white" },
    { href: "/cards", title: "Карточкалар", desc: "Аударып, сөзді жатта", total: decks.length, done: s ? decks.filter((d) => s.done[`cards:${d.id}`]).length : 0, tone: "from-gold to-amber-300 text-navy" },
    { href: "/slides", title: "Презентациялар", desc: "Грамматика қысқа слайдтармен", total: slideDecks.length, done: s ? slideDecks.filter((d) => s.done[`slides:${d.id}`]).length : 0, tone: "from-navy to-brand text-white" },
    { href: "/dialog", title: "AI әңгіме", desc: "Кейіпкерлермен сөйлесу", total: Object.keys(characters).length, done: null, tone: "from-cyan to-brand text-white" },
    { href: "/taza", title: "Таза қазақша", desc: "Калька мен русизмді тап", total: null, done: null, tone: "from-amber-200 to-gold text-navy" },
  ];
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {items.map((it, i) => (
        <li key={it.href} className={i === 4 ? "sm:col-span-2" : ""}>
          <Reveal delay={i * 70}>
            <Link href={it.href} className={`lift block rounded-[28px] bg-gradient-to-br p-6 ${it.tone}`}>
              <span className="text-2xl font-bold tracking-tight">{it.title}</span>
              <span className="mt-1 block opacity-90">{it.desc}</span>
              {it.total !== null && (
                <span className="mt-4 inline-block rounded-full bg-white/25 px-3 py-1 text-sm font-semibold">
                  {it.done === null ? `${it.total} кейіпкер` : `${it.done} / ${it.total} аяқталды`}
                </span>
              )}
            </Link>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
