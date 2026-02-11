import type { Metadata } from "next";
import { Inter, Noto_Serif_KR } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const notoserif = Noto_Serif_KR({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-noto-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "메모리픽스 - 영원한 기억",
  description: "소중한 사진을 고품질 영정사진으로 간직하세요.",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: "cover",
  },
};

import BottomNavigation from "@/components/BottomNavigation";
import { SettingsProvider } from "@/context/SettingsContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${inter.variable} ${notoserif.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#18181b" />
      </head>
      <body className="antialiased min-h-screen flex flex-col bg-zinc-50 text-zinc-900 selection:bg-zinc-200 selection:text-black pb-24">
        <SettingsProvider>
          <header className="fixed top-0 w-full p-4 flex justify-center items-center z-10 bg-white/80 backdrop-blur-sm border-b border-zinc-100">
            <h1 className="font-serif text-lg font-bold tracking-tight text-zinc-800">
              메모리픽스
            </h1>
          </header>

          <main className="flex-grow w-full max-w-md mx-auto px-4 pt-20 pb-4 flex flex-col items-center">
            {children}
          </main>

          <BottomNavigation />
        </SettingsProvider>
      </body>
    </html>
  );
}
