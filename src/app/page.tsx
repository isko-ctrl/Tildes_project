import Image from "next/image";
import Link from "next/link";
import CourseGrid from "@/components/lessons/CourseGrid";
import Stats from "@/components/progress/Stats";
import Reveal from "@/components/ui/Reveal";

const steps = [
  { title: "Сөйлесу", text: "AI-кейіпкермен қазақша әңгімелес." },
  { title: "Қате ізі", text: "Әңгіме талданып, қателеріңді түсіндіреді." },
  { title: "Жеке сөздік", text: "Пайдалы фразаларды өз сөздігіңе сақта." },
  { title: "Қайталау", text: "Сақталған сөздерді қысқа жаттығумен бекіт." },
  { title: "Прогресс", text: "Күн сайынғы жетістігіңді көр." },
];

export default function Home() {
  return (
    <main className="overflow-x-clip">
      <section className="relative mx-auto max-w-5xl px-5 pb-16 pt-10 text-center sm:px-8 sm:pt-16">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="blob absolute -left-10 top-10 h-64 w-64 rounded-full bg-cyan/30 blur-3xl" />
          <div className="blob absolute -right-10 top-40 h-72 w-72 rounded-full bg-gold/30 blur-3xl [animation-delay:-6s]" />
        </div>
        <Image src="/logo.png" alt="Тілдес — қазақша үйрен. Қазақша сөйлес." width={420} height={420} priority unoptimized
          className="float mx-auto h-auto w-56 sm:w-72" />
        <h1 className="mx-auto mt-2 max-w-3xl text-balance text-4xl font-extrabold leading-[1.05] tracking-tight text-navy sm:text-6xl">
          Қазақ тілін <span className="bg-gradient-to-r from-brand to-cyan bg-clip-text text-transparent">сөйлесіп</span> үйрен
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-muted sm:text-xl">
          Тілдес сенің әңгімеңдегі қателерді жеке оқу материалына айналдырады.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/lessons" className="rounded-full bg-brand px-8 py-4 text-lg font-bold text-white shadow-xl shadow-brand/30 transition hover:-translate-y-0.5 active:scale-95">Сабақ бастау</Link>
          <Link href="/dialog" className="rounded-full bg-gold px-8 py-4 text-lg font-bold text-navy transition hover:-translate-y-0.5 active:scale-95">Әңгіме бастау</Link>
        </div>
      </section>

      <section aria-labelledby="how" className="mx-auto max-w-5xl px-5 py-12 sm:px-8">
        <Reveal><h2 id="how" className="text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">Тілдес қалай жұмыс істейді</h2></Reveal>
        <ol className="mt-8 grid gap-4 sm:grid-cols-5">
          {steps.map((s, i) => (
            <li key={s.title}>
              <Reveal delay={i * 90} className="h-full">
                <div className="h-full rounded-3xl bg-white p-5 ring-1 ring-navy/10">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-brand text-sm font-bold text-white">{i + 1}</span>
                  <h3 className="mt-3 text-lg font-bold text-navy">{s.title}</h3>
                  <p className="mt-1 text-sm text-muted">{s.text}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="course" className="mx-auto max-w-5xl px-5 py-12 sm:px-8">
        <Reveal><h2 id="course" className="text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">Курс</h2></Reveal>
        <div className="mt-8"><CourseGrid /></div>
      </section>

      <div className="mx-auto max-w-5xl px-5 pb-20 sm:px-8"><Stats /></div>
    </main>
  );
}
