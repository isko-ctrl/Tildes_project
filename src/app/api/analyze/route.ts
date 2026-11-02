import { isCharacterId } from "@/lib/ai/characters";
import { generateReply, GeminiError } from "@/lib/ai/gemini";
import { MESSAGES_KK } from "@/lib/ai/errors";
import { ANALYZE_SYSTEM, parseAnalysis } from "@/lib/ai/analyze";

const bad = (message: string) => Response.json({ error: message }, { status: 400 });

export async function POST(req: Request) {
  let body: unknown;
  try { body = await req.json(); } catch { return bad("Сұраныс форматы қате."); }
  const { characterId, messages } = (body ?? {}) as { characterId?: unknown; messages?: unknown };
  if (!isCharacterId(characterId)) return bad("Кейіпкер табылмады.");
  if (!Array.isArray(messages) || messages.length === 0) return bad("Талдау үшін әңгіме жоқ.");

  const lines: string[] = [];
  const userTexts: string[] = [];
  for (const m of messages.slice(-24)) {
    const role = (m as { role?: unknown })?.role;
    const text = (m as { content?: unknown })?.content;
    if ((role !== "user" && role !== "model") || typeof text !== "string" || !text.trim()) return bad("Хабарлама қате.");
    if (role === "user" && text.length > 600) return bad("Хабарлама тым ұзын.");
    lines.push(`${role === "user" ? "Қолданушы" : "Кейіпкер"}: ${text.trim()}`);
    if (role === "user") userTexts.push(text.trim());
  }
  if (userTexts.length === 0) return bad("Талдау үшін қолданушы хабарламасы керек.");

  try {
    const raw = await generateReply(ANALYZE_SYSTEM, [{ role: "user", text: lines.join("\n") }], { json: true, temperature: 0.2 });
    return Response.json({ corrections: parseAnalysis(raw, userTexts) });
  } catch (e) {
    const code = e instanceof GeminiError ? e.code : "bad_response";
    return Response.json({ error: MESSAGES_KK[code], code }, { status: code === "quota" ? 429 : 502 });
  }
}
