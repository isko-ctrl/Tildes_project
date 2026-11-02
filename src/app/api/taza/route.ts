import { generateReply, GeminiError } from "@/lib/ai/gemini";
import { MESSAGES_KK } from "@/lib/ai/errors";
import { TAZA_SYSTEM, parseTaza } from "@/lib/ai/taza";

const MAX = 1500;
const bad = (m: string) => Response.json({ error: m }, { status: 400 });

export async function POST(req: Request) {
  let body: unknown;
  try { body = await req.json(); } catch { return bad("Сұраныс форматы қате."); }
  const text = (body as { text?: unknown })?.text;
  if (typeof text !== "string" || !text.trim()) return bad("Мәтін жазыңыз.");
  if (text.length > MAX) return bad(`Мәтін ${MAX} таңбадан аспауы керек.`);
  try {
    const raw = await generateReply(TAZA_SYSTEM, [{ role: "user", text }], { json: true, temperature: 0.2 });
    return Response.json(parseTaza(raw, text));
  } catch (e) {
    const code = e instanceof GeminiError ? e.code : "bad_response";
    return Response.json({ error: MESSAGES_KK[code], code }, { status: code === "quota" ? 429 : 502 });
  }
}
