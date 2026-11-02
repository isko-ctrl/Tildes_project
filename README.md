# Тілдес
Қазақша үйрен. Қазақша сөйлес.

## Іске қосу (Windows PowerShell)
1. Жоба OneDrive-тан тыс болсын (мысалы, C:\dev\tildes).
2. `dir` — package.json көрінуі керек.
3. `.env.local` файлын құр (`.env.example` үлгісі бойынша), ең болмағанда: `GEMINI_API_KEY=...`
4. `npm install` (бірінші рет), содан `npm run dev` → http://localhost:3000
5. Gemini тексеру: http://localhost:3000/api/ai-check (тек dev режимінде)

.env.local өзгерген сайын серверді тоқтатып (Ctrl+C), қайта іске қос.
