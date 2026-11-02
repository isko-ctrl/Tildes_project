import type { GeminiErrorCode } from "./gemini";

export const MESSAGES_KK: Record<GeminiErrorCode, string> = {
  no_key: "Серверде Gemini кілті бапталмаған. .env.local файлын тексер.",
  auth: "Gemini кілті қабылданбады. Кілттің дұрыстығын тексер.",
  model: "Таңдалған Gemini моделі қолжетімсіз. GEMINI_MODEL мәнін өзгерт.",
  quota: "Gemini лимиті уақытша таусылды. Біраз күтіп, қайталап көр.",
  timeout: "Жауап ұзақ келмеді. Қайталап көр.",
  network: "Gemini серверіне қосыла алмадық. Интернетті тексер.",
  blocked: "Бұл хабарламаға жауап бере алмаймын. Басқаша жазып көр.",
  bad_response: "ИИ жауабын алу мүмкін болмады. Қайталап көр.",
};
