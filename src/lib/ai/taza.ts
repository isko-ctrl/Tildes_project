export const TAZA_TYPES = ["калька", "русизм", "машиналық аударма", "стиль"] as const;

export interface TazaIssue { original: string; suggestion: string; reason_kk: string; type: string }

export const TAZA_SYSTEM = `Сен қазақ тілінің редакторысың. Берілген мәтіннен орыс тілінен калька (сөзбе-сөз аударма), қажетсіз русизм және машиналық аударма іздерін тап.
Ережелер:
1. Тек шынымен табиғи емес, қазақ тіліне жат жерлерді көрсет. Күмәнді болса, көрсетпе.
2. "original" — мәтіннен сөзбе-сөз алынған қысқа үзінді.
3. "suggestion" — табиғи қазақша нұсқа.
4. "reason_kk" — қарапайым қазақшамен 1 қысқа сөйлем.
5. "type" — мына мәндердің бірі: ${TAZA_TYPES.join(", ")}.
6. Ең көбі 8 ұсыныс. Мәтін таза болса, issues бос массив.
Тек мына JSON форматымен жауап бер:
{"issues":[{"original":"...","suggestion":"...","reason_kk":"...","type":"..."}]}`;

const norm = (t: string) => t.toLowerCase().replace(/\s+/g, " ").trim();

/** Модель жауабын тексереді: мәтінде жоқ үзінділерді тастайды. Таза мәтінді өзіміз жинаймыз. */
export function parseTaza(raw: string, input: string): { issues: TazaIssue[]; clean: string } {
  let data: unknown;
  try { data = JSON.parse(raw.replace(/^```(?:json)?\s*|\s*```$/g, "").trim()); } catch { return { issues: [], clean: input }; }
  const list = (data as { issues?: unknown })?.issues;
  if (!Array.isArray(list)) return { issues: [], clean: input };
  const issues: TazaIssue[] = [];
  let clean = input;
  for (const it of list) {
    const { original, suggestion, reason_kk, type } = (it ?? {}) as Record<string, unknown>;
    if (![original, suggestion, reason_kk].every((x) => typeof x === "string" && x.trim() && x.length <= 300)) continue;
    const o = (original as string).trim(), sg = (suggestion as string).trim();
    if (norm(o) === norm(sg) || !input.includes(o)) continue;
    issues.push({ original: o, suggestion: sg, reason_kk: (reason_kk as string).trim(), type: TAZA_TYPES.includes(type as never) ? (type as string) : "стиль" });
    clean = clean.replace(o, sg);
    if (issues.length === 8) break;
  }
  return { issues, clean };
}
