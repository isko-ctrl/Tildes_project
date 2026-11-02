import { v, type T, type Lang, type Vocab, gloss } from "./langs";
export type { Vocab };

export type Exercise =
  | { kind: "choice"; prompt: string; options: string[]; answer: number; vocab?: Vocab }
  | { kind: "type"; prompt: string; answer: string; vocab: Vocab };
export interface Lesson { id: string; title: string; subtitle: string; vocab: Vocab[]; extra?: Exercise[] }

const num = (d: number, kk: string, ru: string, en: string, ko: string, tr: string): Vocab =>
  v([kk, `${d} (${ru})`, `${d} (${en})`, `${d} (${ko})`, `${d} (${tr})`]);
const list = (rows: T[]) => rows.map(v);

export const lessons: Lesson[] = [
  {
    id: "salemdesu", title: "Сәлемдесу", subtitle: "Сәлем, рахмет, көріскенше",
    vocab: list([
      ["Сәлем", "Привет", "Hi", "안녕", "Selam"], ["Сәлеметсіз бе", "Здравствуйте", "Hello", "안녕하세요", "Merhaba"],
      ["Қалайсың", "Как дела (у тебя)", "How are you", "잘 지내?", "Nasılsın"], ["Жақсы", "Хорошо", "Good", "좋아요", "İyi"],
      ["Рахмет", "Спасибо", "Thank you", "감사합니다", "Teşekkürler"], ["Көріскенше", "До свидания", "Goodbye", "안녕히 가세요", "Hoşça kal"],
    ]),
    extra: [{ kind: "choice", prompt: "«Қалайсың?» деп сұраса, қалай жауап бересің?", options: ["Жақсы, рахмет", "Көріскенше", "Сенің атың кім?", "Мен студентпін"], answer: 0 }],
  },
  {
    id: "tanysu", title: "Таныстыру", subtitle: "Атың кім? Қайдансың?",
    vocab: list([
      ["Менің атым", "Меня зовут", "My name is", "제 이름은", "Benim adım"], ["Сенің атың кім?", "Как тебя зовут?", "What is your name?", "이름이 뭐예요?", "Adın ne?"],
      ["Мен студентпін", "Я студент", "I am a student", "저는 학생이에요", "Ben öğrenciyim"], ["Танысқаныма қуаныштымын", "Рад знакомству", "Nice to meet you", "만나서 반갑습니다", "Tanıştığımıza memnun oldum"],
      ["Қайдансың?", "Откуда ты?", "Where are you from?", "어디에서 왔어요?", "Nerelisin?"], ["Мен Қызылордалықпын", "Я из Кызылорды", "I am from Kyzylorda", "저는 크즐오르다 출신이에요", "Ben Kızılordalıyım"],
    ]),
    extra: [{ kind: "choice", prompt: "«Сенің атың кім?» дегенге жауап қайсы?", options: ["Менің атым Айгүл", "Рахмет", "Көріскенше", "Сәлем"], answer: 0 }],
  },
  {
    id: "sandar", title: "Сандар 1–10", subtitle: "Бірден онға дейін",
    vocab: [
      num(1, "бір", "один", "one", "하나", "bir"), num(2, "екі", "два", "two", "둘", "iki"), num(3, "үш", "три", "three", "셋", "üç"),
      num(4, "төрт", "четыре", "four", "넷", "dört"), num(5, "бес", "пять", "five", "다섯", "beş"), num(6, "алты", "шесть", "six", "여섯", "altı"),
      num(7, "жеті", "семь", "seven", "일곱", "yedi"), num(8, "сегіз", "восемь", "eight", "여덟", "sekiz"), num(9, "тоғыз", "девять", "nine", "아홉", "dokuz"),
      num(10, "он", "десять", "ten", "열", "on"),
    ],
  },
  {
    id: "otbasy", title: "Отбасы", subtitle: "Ата, әже, әке, ана",
    vocab: list([
      ["ата", "дедушка", "grandfather", "할아버지", "dede"], ["әже", "бабушка", "grandmother", "할머니", "nine"], ["әке", "отец", "father", "아버지", "baba"], ["ана", "мать", "mother", "어머니", "anne"],
      ["аға", "старший брат", "older brother", "형 / 오빠", "ağabey"], ["іні", "младший брат", "younger brother", "남동생", "küçük erkek kardeş"],
      ["апа", "старшая сестра", "older sister", "누나 / 언니", "abla"], ["қарындас", "младшая сестра", "younger sister", "여동생", "küçük kız kardeş"],
    ]),
  },
  {
    id: "tamak", title: "Тамақ пен сусын", subtitle: "Нан, су, шай",
    vocab: list([
      ["нан", "хлеб", "bread", "빵", "ekmek"], ["су", "вода", "water", "물", "su"], ["шай", "чай", "tea", "차", "çay"], ["сүт", "молоко", "milk", "우유", "süt"],
      ["ет", "мясо", "meat", "고기", "et"], ["алма", "яблоко", "apple", "사과", "elma"],
      ["Маған шай беріңіз", "Дайте мне чай", "Tea, please", "차 한 잔 주세요", "Bana çay verir misiniz?"], ["Дәмді екен", "Вкусно", "It is delicious", "맛있어요", "Lezzetli"],
    ]),
    extra: [{ kind: "choice", prompt: "Шай ішкің келсе, не дейсің?", options: ["Маған шай беріңіз", "Көріскенше", "Танысқаныма қуаныштымын", "Вокзал қайда?"], answer: 0 }],
  },
  {
    id: "qala", title: "Қала", subtitle: "Көше, дүкен, вокзал",
    vocab: list([
      ["көше", "улица", "street", "거리", "sokak"], ["дүкен", "магазин", "shop", "가게", "mağaza"], ["мектеп", "школа", "school", "학교", "okul"], ["автобус", "автобус", "bus", "버스", "otobüs"],
      ["Қайда?", "Где?", "Where?", "어디?", "Nerede?"], ["Вокзалға қалай барамын?", "Как добраться до вокзала?", "How do I get to the station?", "기차역에 어떻게 가요?", "İstasyona nasıl giderim?"],
    ]),
    extra: [{ kind: "choice", prompt: "Вокзалды сұрау үшін не дейсің?", options: ["Вокзал қайда?", "Рахмет", "Сәлем", "Мен студентпін"], answer: 0 }],
  },
];

/** Сөздерден жаттығу жасайды: алдымен таңдау, соңында 3 жазба жаттығу. */
export function buildExercises(l: Lesson, lang: Lang = "ru"): Exercise[] {
  const n = l.vocab.length;
  const out: Exercise[] = [];
  l.vocab.slice(0, Math.min(6, n)).forEach((w, i) => {
    const options = [1, 2, 3].map((k) => l.vocab[(i + k) % n].kk);
    const pos = i % 4;
    options.splice(pos, 0, w.kk);
    out.push({ kind: "choice", prompt: `«${gloss(w, lang)}» қазақша қалай?`, options, answer: pos, vocab: w });
  });
  l.vocab.slice(-3).forEach((w) => out.push({ kind: "type", prompt: `Қазақша жаз: «${gloss(w, lang)}»`, answer: w.kk, vocab: w }));
  return [...out, ...(l.extra ?? [])];
}
