export const CATEGORIES = ["Грамматика", "Сөз тәртібі", "Сөз таңдау", "Емле", "Калька"] as const;

export interface Correction {
  original: string;
  corrected: string;
  explanation_kk: string;
  category: string;
}

export const ANALYZE_SYSTEM = `Сен қазақ тілі мұғалімісің. Төмендегі диалогта ТЕК "Қолданушы" жазған хабарламалардағы НАҚТЫ қателерді тап.
Ережелер:
1. Тек шынымен қате болған жерді көрсет: грамматика, сөз тәртібі, сөз таңдау, емле, орыс тілінен калька.
2. Табиғи, дұрыс сөйлемдерді және ауызекі нұсқаларды қате деп санама. Күмәнді болса, көрсетпе.
3. "original" — қолданушы жазған мәтіннің сөзбе-сөз үзіндісі.
4. "corrected" — түзетілген дұрыс нұсқа.
5. "explanation_kk" — қарапайым қазақ тілінде 1 қысқа сөйлем.
6. "category" — мына мәндердің бірі: ${CATEGORIES.join(", ")}.
7. Қате болмаса, corrections бос массив болсын. Ең көбі 5 қате.
Тек мына JSON форматында жауап бер:
{"corrections":[{"original":"...","corrected":"...","explanation_kk":"...","category":"..."}]}`;

const norm = (t: string) => t.toLowerCase().replace(/[.,!?;:"«»()]/g, "").replace(/\s+/g, " ").trim();

/** Разбирает ответ модели и отбрасывает всё, что нельзя подтвердить текстом пользователя. */
export function parseAnalysis(raw: string, userTexts: string[]): Correction[] {
  let data: unknown;
  try {
    data = JSON.parse(raw.replace(/^```(?:json)?\s*|\s*```$/g, "").trim());
  } catch {
    return [];
  }
  const list = (data as { corrections?: unknown })?.corrections;
  if (!Array.isArray(list)) return [];
  const haystack = userTexts.map(norm).join(" | ");
  const out: Correction[] = [];
  for (const c of list) {
    const { original, corrected, explanation_kk, category } = (c ?? {}) as Record<string, unknown>;
    if (![original, corrected, explanation_kk].every((v) => typeof v === "string" && v.trim() && v.length <= 300)) continue;
    const o = (original as string).trim(), k = (corrected as string).trim();
    if (norm(o) === norm(k) || !haystack.includes(norm(o))) continue;
    out.push({
      original: o,
      corrected: k,
      explanation_kk: (explanation_kk as string).trim(),
      category: CATEGORIES.includes(category as never) ? (category as string) : "Грамматика",
    });
    if (out.length === 5) break;
  }
  return out;
}
