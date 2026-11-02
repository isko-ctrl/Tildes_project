export const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-1.5-flash";

export type GeminiErrorCode = string;

export interface Turn {
  role: string;
  text: string;
}

export class GeminiError extends Error {
  status?: number;
  code?: string;
  details?: unknown;
  constructor(message: string, status?: number, code?: string, details?: unknown) {
    super(message);
    this.name = "GeminiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export async function listModels(): Promise<string[]> {
  return [GEMINI_MODEL];
}

export async function generateReply(promptOrTurns: any, systemInstruction?: any, options?: any): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new GeminiError("GEMINI_API_KEY is missing", 400, "MISSING_KEY");
  }

  // Если передана система вторым аргументом, а options на её месте или наоборот
  let sysInst = systemInstruction;
  if (typeof sysInst !== "string" && options && typeof options === "string") {
    sysInst = options;
  }

  let promptText = "";
  if (Array.isArray(promptOrTurns)) {
    promptText = promptOrTurns.map((t: any) => `${t.role || "user"}: ${t.text || ""}`).join("\n");
  } else if (typeof promptOrTurns === "object" && promptOrTurns !== null) {
    promptText = JSON.stringify(promptOrTurns);
  } else {
    promptText = String(promptOrTurns || "");
  }

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(apiKey.startsWith("AQ") 
        ? { "Authorization": `Bearer ${apiKey}` }
        : { "x-goog-api-key": apiKey }
      )
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: promptText }] }],
      systemInstruction: typeof sysInst === "string" ? { parts: [{ text: sysInst }] } : undefined
    })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new GeminiError(data.error?.message || "Gemini API Error", response.status, data.error?.status || "API_ERROR", data);
  }

  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}
