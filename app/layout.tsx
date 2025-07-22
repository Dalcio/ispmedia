import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CursorProvider } from "@/contexts/cursor-context";
import CustomCursor from "@/components/ui/custom-cursor";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ISPmedia - Stream Your World",
  description:
    "A modern music streaming platform with social features, playlists, and artist discovery.",
  keywords: ["music", "streaming", "playlist", "artists", "songs", "audio"],
  authors: [{ name: "ISPmedia Team" }],
  creator: "ISPmedia",
  metadataBase: new URL("http://localhost:3000"),
  openGraph: {
    type: "website",
    title: "ISPmedia - Stream Your World",
    description:
      "A modern music streaming platform with social features, playlists, and artist discovery.",
    siteName: "ISPmedia",
  },
  twitter: {
    card: "summary_large_image",
    title: "ISPmedia - Stream Your World",
    description:
      "A modern music streaming platform with social features, playlists, and artist discovery.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        suppressHydrationWarning={false}
        className={`${inter.variable} font-sans antialiased bg-dark text-white min-h-screen`}
      >
        <CursorProvider>
          <CustomCursor />
          <div className="relative min-h-screen bg-gradient-dark">{children}</div>
        </CursorProvider>
      </body>
    </html>
  );
}
