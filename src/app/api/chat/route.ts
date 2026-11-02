import { characters, isCharacterId } from "@/lib/ai/characters";
import { generateReply, GeminiError, type Turn } from "@/lib/ai/gemini";
import { MESSAGES_KK } from "@/lib/ai/errors";

const MAX_USER_CHARS = 600;
const MAX_HISTORY = 12;


function bad(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}

export async function POST(req: Request) {
  let body: unknown;
  try { body = await req.json(); } catch { return bad("Сұраныс форматы қате."); }
  const { characterId, messages } = (body ?? {}) as { characterId?: unknown; messages?: unknown };

  if (!isCharacterId(characterId)) return bad("Кейіпкер табылмады.");
  if (!Array.isArray(messages) || messages.length === 0) return bad("Хабарлама жоқ.");

  const turns: Turn[] = [];
  for (const m of messages.slice(-MAX_HISTORY)) {
    const role = (m as { role?: unknown })?.role;
    const text = (m as { content?: unknown })?.content;
    if ((role !== "user" && role !== "model") || typeof text !== "string") return bad("Хабарлама қате.");
    const t = text.trim();
    if (!t || (role === "user" && t.length > MAX_USER_CHARS)) return bad(`Хабарлама ${MAX_USER_CHARS} таңбадан аспауы керек.`);
    turns.push({ role, text: t });
  }
  while (turns.length && turns[0].role !== "user") turns.shift();
  if (turns.length === 0 || turns[turns.length - 1].role !== "user") return bad("Соңғы хабарлама қолданушыдан болуы керек.");

  try {
    const reply = await generateReply(characters[characterId].persona, turns);
    return Response.json({ reply });
  } catch (e) {
    const code = e instanceof GeminiError ? e.code : "bad_response";
    return Response.json({ error: MESSAGES_KK[code], code }, { status: code === "quota" ? 429 : 502 });
  }
}
