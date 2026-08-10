"use client";

import { usePathname } from "next/navigation";
import BottomNavBar from "@/components/BottomNavBar";

export default function AppLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  if (isHomePage) {
    return (
      <div className="w-full min-h-screen bg-black flex flex-col text-white">
        <main className="flex-1 flex flex-col min-h-full w-full">{children}</main>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-[430px] min-h-screen bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)] sm:my-4 sm:rounded-[36px] overflow-hidden flex flex-col border border-[rgba(0,0,0,0.06)] pb-16">
      <main className="flex-1 flex flex-col min-h-full">{children}</main>
      <BottomNavBar />
    </div>
  );
}

