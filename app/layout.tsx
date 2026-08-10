import type { Metadata } from "next";
import "./globals.css";
import AppLayoutShell from "@/components/AppLayoutShell";

export const metadata: Metadata = {
  title: "Qollab - Clean Monochrome Mobile Web/App",
  description: "Clean White & Black Mobile-First Dynamic Collaboration Platform.",
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

