import ChatClient from "@/components/dialog/ChatClient";

export const metadata = { title: "Әңгіме — Тілдес" };

export default function DialogPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 pb-4 pt-4 sm:px-6">
      <ChatClient />
    </main>
  );
}
