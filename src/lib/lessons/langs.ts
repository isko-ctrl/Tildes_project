export type Lang = "ru" | "en" | "ko" | "tr";
export const LANGS: { id: Lang; name: string }[] = [
  { id: "ru", name: "Русский" }, { id: "en", name: "English" }, { id: "ko", name: "한국어" }, { id: "tr", name: "Türkçe" },
];
export type Gloss = Partial<Record<Lang, string>> & { ru: string };
export interface Vocab extends Gloss { kk: string; en: string; ko: string; tr: string }
export type T = [kk: string, ru: string, en: string, ko: string, tr: string];
export const v = ([kk, ru, en, ko, tr]: T): Vocab => ({ kk, ru, en, ko, tr });
/** Таңдалған тілдегі аударма; жоқ болса ағылшынша, содан кейін орысша. */
export const gloss = (g: Gloss, lang: Lang) => g[lang] ?? g.en ?? g.ru;
