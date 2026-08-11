import type { Metadata } from "next";
import "./globals.css";
import AppLayoutShell from "@/components/AppLayoutShell";

export const metadata: Metadata = {
  metadataBase: new URL("https://qollab.life"),
  title: "Qollab",
  description: "More Together, More Savings",
  openGraph: {
    title: "Qollab",
    description: "More Together, More Savings",
    url: "https://qollab.life",
    siteName: "Qollab",
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="scroll-smooth">
      <body className="bg-black text-white font-sans antialiased min-h-screen w-full selection:bg-[#FFEE00] selection:text-black">
        <AppLayoutShell>{children}</AppLayoutShell>
      </body>
    </html>
  );
}

