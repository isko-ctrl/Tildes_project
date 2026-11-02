"use client";
import { useLearning } from "@/lib/learning/useLearning";
import { DAILY_GOAL, todayXpOf } from "@/lib/learning/store";

export default function Stats() {
  const { s } = useLearning();
  if (!s) return <div className="mt-10 h-40" aria-hidden />;
  const todayXp = todayXpOf(s);
  const pct = Math.min(100, Math.round((todayXp / DAILY_GOAL) * 100));
  const items = [
    ["Жалпы тәжірибе ұпайы", s.xp], ["Күн қатарынан", s.streak], ["Әңгіме", s.conversations],
    ["Сөздікте", s.vocab.length], ["Қайталау", s.reviews],
  ] as const;
  return (
    <section aria-labelledby="ach" className="mt-12">
      <h2 id="ach" className="text-xl font-bold text-navy">Сенің жетістігің</h2>
      <div className="mt-4 rounded-2xl bg-white p-4 ring-1 ring-navy/10">
        <div className="flex justify-between text-sm font-semibold text-navy">
          <span>Бүгінгі мақсат</span><span>{todayXp}/{DAILY_GOAL} XP</span>
        </div>
        <div className="mt-2 h-3 overflow-hidden rounded-full bg-cyan/20" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
          <div className="h-full rounded-full bg-gold" style={{ width: `${pct}%` }} />
        </div>
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {items.map(([label, value]) => (
          <div key={label} className="rounded-2xl bg-white p-3 ring-1 ring-navy/10">
            <dd className="text-2xl font-bold text-brand">{value}</dd>
            <dt className="text-xs text-muted">{label}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}
