import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ISPmedia - Plataforma de Streaming Musical",
  description:
    "Descubra, ouça e compartilhe música com a comunidade ISPmedia. Plataforma completa de streaming com funcionalidades sociais.",
  keywords: ["música", "streaming", "playlist", "artistas", "álbuns"],
  authors: [{ name: "Projeto Escolar ISPmedia" }],
  openGraph: {
    title: "ISPmedia - Plataforma de Streaming Musical",
    description:
      "Descubra, ouça e compartilhe música com a comunidade ISPmedia.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        suppressHydrationWarning={true}
        className={`${inter.variable} bg-zinc-950 text-white`}
      >
        <div className="min-h-screen bg-gradient-to-br from-dark to-dark-medium">
          <AuthProvider>
            <Navbar />
            <main className="pt-20">{children}</main>
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
