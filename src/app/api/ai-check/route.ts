import { connection } from "next/server";
import { GEMINI_MODEL, generateReply, listModels, GeminiError } from "@/lib/ai/gemini";

// Диагностика только для локальной разработки: проверяет ключ, модель и один реальный запрос.
export async function GET() {
  await connection();
  if (process.env.NODE_ENV === "production") return new Response("Not found", { status: 404 });
  const out: Record<string, unknown> = { model: GEMINI_MODEL, keyPresent: Boolean(process.env.GEMINI_API_KEY) };
  try {
    const models = await listModels();
    out.modelsAvailable = models.length;
    out.modelFound = models.includes(GEMINI_MODEL);
    out.sampleModels = models.filter((m) => m.startsWith("gemini")).slice(0, 25);
  } catch (e) {
    out.listError = e instanceof GeminiError ? e.code : "unknown";
  }
  try {
    out.testReply = await generateReply("Қысқа жауап бер.", [{ role: "user", text: "Сәлем!" }]);
    out.ok = true;
  } catch (e) {
    out.ok = false;
    out.testError = e instanceof GeminiError ? `${e.code}: ${e.message}` : "unknown";
  }
  return Response.json(out);
}
