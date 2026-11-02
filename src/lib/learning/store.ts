import type { Lang } from "@/lib/lessons/langs";
// Деректер қолданушының браузерінде (localStorage) сақталады. Барлық логика таза функциялар.
export interface Mistake {
  id: string; original: string; corrected: string; explanation: string; category: string; createdAt: string; vocabId?: string;
}
export interface VocabItem {
  id: string; phrase: string; meaning: string; prompt: string; createdAt: string; step: number; dueAt: string; kind?: "translate";
}
export interface State {
  xp: number; streak: number; longestStreak: number; lastDate: string | null;
  conversations: number; reviews: number; todayDate: string; todayXp: number;
  mistakes: Mistake[]; vocab: VocabItem[]; xpEvents: string[];
  lessons: Record<string, { best: number; total: number }>;
  lang: Lang; done: Record<string, boolean>;
}

export const DAILY_GOAL = 30;
const KEY = "tildes:v1";
const STEPS_DAYS = [0, 1, 3, 7, 14];
const MIN10 = 10 * 60 * 1000;

export const emptyState = (): State => ({
  xp: 0, streak: 0, longestStreak: 0, lastDate: null, conversations: 0, reviews: 0,
  todayDate: "", todayXp: 0, mistakes: [], vocab: [], xpEvents: [], lessons: {}, lang: "ru", done: {},
});

const dayKey = (d = new Date()) => d.toLocaleDateString("en-CA");
const uid = () => (globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`);

export function load(): State {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...emptyState(), ...JSON.parse(raw) } : emptyState();
  } catch { return emptyState(); }
}
export function save(s: State) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* сақтау мүмкін емес */ } }

/** XP бір оқиғаға бір рет қана беріледі (key бойынша). */
export function awardXp(s: State, key: string, amount: number, now = new Date()): number {
  if (s.xpEvents.includes(key)) return 0;
  s.xpEvents.push(key);
  const today = dayKey(now);
  const yesterday = dayKey(new Date(now.getTime() - 86_400_000));
  if (s.todayDate !== today) { s.todayDate = today; s.todayXp = 0; }
  s.xp += amount; s.todayXp += amount;
  if (s.lastDate !== today) s.streak = s.lastDate === yesterday ? s.streak + 1 : 1;
  s.lastDate = today;
  s.longestStreak = Math.max(s.longestStreak, s.streak);
  return amount;
}

export function addMistakes(s: State, items: { original: string; corrected: string; explanation_kk: string; category: string }[]): Mistake[] {
  const added: Mistake[] = [];
  for (const it of items) {
    const dup = s.mistakes.find((m) => m.original === it.original && m.corrected === it.corrected);
    if (dup) { added.push(dup); continue; }
    const m: Mistake = { id: uid(), original: it.original, corrected: it.corrected, explanation: it.explanation_kk, category: it.category, createdAt: new Date().toISOString() };
    s.mistakes.unshift(m); added.push(m);
  }
  return added;
}

export function saveToVocab(s: State, mistakeId: string, now = new Date()): VocabItem | null {
  const m = s.mistakes.find((x) => x.id === mistakeId);
  if (!m) return null;
  const existing = s.vocab.find((v) => v.phrase === m.corrected);
  if (existing) { m.vocabId = existing.id; return existing; }
  const v: VocabItem = { id: uid(), phrase: m.corrected, meaning: m.explanation, prompt: m.original, createdAt: now.toISOString(), step: 0, dueAt: now.toISOString() };
  s.vocab.unshift(v); m.vocabId = v.id;
  return v;
}

export function deleteVocab(s: State, id: string) {
  s.vocab = s.vocab.filter((v) => v.id !== id);
  for (const m of s.mistakes) if (m.vocabId === id) delete m.vocabId;
}

export const dueCards = (s: State, now = new Date()) =>
  s.vocab.filter((v) => new Date(v.dueAt) <= now).sort((a, b) => a.dueAt.localeCompare(b.dueAt));

const normAnswer = (t: string) => t.toLowerCase().replace(/[.,!?;:"«»()]/g, "").replace(/\s+/g, " ").trim();
export const isCorrect = (answer: string, phrase: string) => normAnswer(answer) === normAnswer(phrase);

export type Outcome = "wrong" | "hard" | "easy";
/** wrong: 10 минуттан кейін қайта; hard: ертең; easy: келесі аралыққа өтеді. */
export function gradeCard(s: State, id: string, outcome: Outcome, now = new Date()): number {
  const v = s.vocab.find((x) => x.id === id);
  if (!v) return 0;
  let gained = 0;
  if (outcome === "wrong") {
    v.step = 0; v.dueAt = new Date(now.getTime() + MIN10).toISOString();
  } else {
    if (outcome === "easy") v.step = Math.min(v.step + 1, STEPS_DAYS.length - 1);
    const days = outcome === "hard" ? 1 : Math.max(STEPS_DAYS[v.step], 1);
    v.dueAt = new Date(now.getTime() + days * 86_400_000).toISOString();
    gained = awardXp(s, `rev:${id}:${now.getTime()}`, 5, now);
  }
  s.reviews += 1;
  return gained;
}

export const todayXpOf = (s: State, now = new Date()) => (s.todayDate === dayKey(now) ? s.todayXp : 0);

/** Сабақта қателескен сөз қайталау карточкасына түседі (қазақша жазу жаттығуы). */
export function addTranslateVocab(s: State, kk: string, ru: string, now = new Date()) {
  if (s.vocab.some((v) => v.phrase === kk)) return;
  s.vocab.unshift({ id: uid(), phrase: kk, meaning: ru, prompt: ru, kind: "translate", createdAt: now.toISOString(), step: 0, dueAt: now.toISOString() });
}

export const LESSON_PASS = 0.6;
export const lessonDone = (s: State, id: string) => {
  const r = s.lessons[id];
  return Boolean(r && r.best / r.total >= LESSON_PASS);
};

/** XP (15) сабақ бірінші рет өткенде ғана беріледі; қате сөздер сөздікке түседі. */
export function completeLesson(s: State, id: string, correct: number, total: number, wrong: { kk: string; ru: string }[], now = new Date()): number {
  const prev = s.lessons[id];
  s.lessons[id] = { best: Math.max(prev?.best ?? 0, correct), total };
  for (const w of wrong) addTranslateVocab(s, w.kk, w.ru, now);
  return correct / total >= LESSON_PASS ? awardXp(s, `lesson:${id}`, 15, now) : 0;
}

/** Карточка жиынтығы / презентация аяқталғанда: белгі + XP (бір рет). */
export function completeActivity(s: State, key: string, xp: number, now = new Date()): number {
  s.done[key] = true;
  return awardXp(s, key, xp, now);
}
