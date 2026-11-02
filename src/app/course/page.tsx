import CourseGrid from "@/components/lessons/CourseGrid";

export const metadata = { title: "Курс — Тілдес" };

export default function CoursePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="text-4xl font-extrabold tracking-tight text-navy">Курс</h1>
      <p className="mt-2 text-lg text-muted">Сабақтар, карточкалар, презентациялар және AI-тәжірибе — бәрі бір жерде.</p>
      <div className="mt-8"><CourseGrid /></div>
    </main>
  );
}
