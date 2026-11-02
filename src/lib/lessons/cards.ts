import { v, type T, type Vocab } from "./langs";

export interface Deck { id: string; title: string; subtitle: string; cards: Vocab[] }
const list = (rows: T[]) => rows.map(v);

export const decks: Deck[] = [
  { id: "tuster", title: "Түстер", subtitle: "Қызыл, көк, жасыл", cards: list([
    ["қызыл", "красный", "red", "빨간색", "kırmızı"], ["көк", "синий", "blue", "파란색", "mavi"], ["жасыл", "зелёный", "green", "초록색", "yeşil"],
    ["сары", "жёлтый", "yellow", "노란색", "sarı"], ["ақ", "белый", "white", "흰색", "beyaz"], ["қара", "чёрный", "black", "검은색", "siyah"],
  ]) },
  { id: "apta", title: "Апта күндері", subtitle: "Дүйсенбіден жексенбіге дейін", cards: list([
    ["дүйсенбі", "понедельник", "Monday", "월요일", "Pazartesi"], ["сейсенбі", "вторник", "Tuesday", "화요일", "Salı"], ["сәрсенбі", "среда", "Wednesday", "수요일", "Çarşamba"],
    ["бейсенбі", "четверг", "Thursday", "목요일", "Perşembe"], ["жұма", "пятница", "Friday", "금요일", "Cuma"], ["сенбі", "суббота", "Saturday", "토요일", "Cumartesi"],
    ["жексенбі", "воскресенье", "Sunday", "일요일", "Pazar"],
  ]) },
  { id: "januar", title: "Жануарлар", subtitle: "Мысық, жылқы, түйе", cards: list([
    ["мысық", "кошка", "cat", "고양이", "kedi"], ["ит", "собака", "dog", "개", "köpek"], ["жылқы", "лошадь", "horse", "말", "at"],
    ["қой", "овца", "sheep", "양", "koyun"], ["түйе", "верблюд", "camel", "낙타", "deve"], ["құс", "птица", "bird", "새", "kuş"],
  ]) },
  { id: "mezgil", title: "Жыл мезгілдері", subtitle: "Көктем, жаз, күз, қыс", cards: list([
    ["көктем", "весна", "spring", "봄", "ilkbahar"], ["жаз", "лето", "summer", "여름", "yaz"], ["күз", "осень", "autumn", "가을", "sonbahar"], ["қыс", "зима", "winter", "겨울", "kış"],
  ]) },
  { id: "uy", title: "Үй және заттар", subtitle: "Үй, есік, терезе", cards: list([
    ["үй", "дом", "house", "집", "ev"], ["есік", "дверь", "door", "문", "kapı"], ["терезе", "окно", "window", "창문", "pencere"],
    ["үстел", "стол", "table", "탁자", "masa"], ["орындық", "стул", "chair", "의자", "sandalye"], ["кітап", "книга", "book", "책", "kitap"],
  ]) },
];
