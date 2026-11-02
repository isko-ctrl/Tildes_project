import type { Metadata, Viewport } from "next";
import "./globals.css";
import Nav from "@/components/layout/Nav";

export const metadata: Metadata = {
  title: "Тілдес — қазақша үйрен, қазақша сөйлес",
  description:
    "Тілдес — қазақ тілін AI-кейіпкерлермен сөйлесіп үйренетін платформа.",
};

export const viewport: Viewport = { themeColor: "#fff9ed" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="kk">
      <body className="min-h-screen antialiased">
        <Nav />
        {children}
      </body>
    </html>
  );
}
