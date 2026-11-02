"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LANGS, type Lang } from "@/lib/lessons/langs";
import { useLang } from "@/lib/learning/useLearning";

const links = [
  ["/", "Басты бет"], ["/course", "Курс"], ["/dialog", "Әңгіме"], ["/taza", "Таза қазақша"],
  ["/mistakes", "Қате ізі"], ["/dictionary", "Сөздік"], ["/review", "Қайталау"],
] as const;

export default function Nav() {
  const path = usePathname();
  const [lang, setLang] = useLang();
  return (
    <nav aria-label="Негізгі мәзір" className="sticky top-0 z-20 border-b border-navy/10 bg-cream/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-5xl items-center gap-2 px-3 py-2">
        <ul className="flex flex-1 gap-1 overflow-x-auto">
          {links.map(([href, label]) => {
            const active = href === "/" ? path === "/" : path.startsWith(href);
            return (
              <li key={href} className="shrink-0">
                <Link href={href} aria-current={active ? "page" : undefined}
                  className={`block rounded-full px-4 py-2 text-sm font-semibold transition ${active ? "bg-navy text-white" : "text-navy hover:bg-navy/10"}`}>
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
        <label className="shrink-0">
          <span className="sr-only">Аударма тілі</span>
          <select value={lang} onChange={(e) => setLang(e.target.value as Lang)}
            className="rounded-full bg-white px-3 py-2 text-sm font-semibold text-navy ring-1 ring-navy/15">
            {LANGS.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
          </select>
        </label>
      </div>
    </nav>
  );
}
