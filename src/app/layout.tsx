import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import NavBar from "@/components/NavBar";

export const metadata: Metadata = {
  title: "Calistenia — Programas de entrenamiento",
  description: "Programas de calistenia premium: functional training, park training y static skills.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-ink font-body text-bone antialiased">
        <Providers>
          <NavBar />
          <main className="pt-16">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
