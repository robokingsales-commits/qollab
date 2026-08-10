"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Search, 
  Ticket, 
  MapPin, 
  User, 
  Boxes, 
  PieChart, 
  Headphones,
  Store
} from "lucide-react";

interface BottomNavBarProps {
  mode?: "consumer" | "biz";
}

export default function BottomNavBar({ mode }: BottomNavBarProps) {
  const pathname = usePathname();
  const activeMode = mode || (pathname?.startsWith("/owner") ? "biz" : "consumer");

  if (activeMode === "consumer") {
    const consumerNavItems = [
      { label: "홈", href: "/", icon: Home },
      { label: "검색", href: "/packages", icon: Search },
      { label: "마이 패키지", href: "/my-vouchers", icon: Ticket },
      { label: "동네지도", href: "/map", icon: MapPin },
      { label: "마이페이지", href: "/mypage", icon: User },
    ];

    return (
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 bg-white/95 backdrop-blur-md border-t border-[rgba(0,0,0,0.08)] py-2 px-3 transition-all duration-300 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-around">
          {consumerNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center space-y-0.5 text-[10px] font-bold transition cursor-pointer ${
                  isActive ? "text-[#071D49]" : "text-[#6e6e73] hover:text-[#071D49]"
                }`}
              >
                <div className={`p-1 rounded-full transition-all ${isActive ? "bg-[#071D49] text-white scale-105 shadow-xs" : ""}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    );
  }

  // BIZ Mode Navigation Items (Dark Theme & BIZ Menu Tree)
  const bizNavItems = [
    { label: "대쉬보드", href: "/", icon: Home },
    { label: "패키지센터", href: "/owner/packages", icon: Boxes },
    { label: "정산", href: "/owner/settlements", icon: PieChart },
    { label: "매장설정", href: "/owner/stores", icon: Store },
    { label: "BIZ센터", href: "/owner/support", icon: Headphones },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 bg-[#0A0D14]/95 backdrop-blur-md border-t border-slate-800 py-2 px-3 text-slate-300 transition-all duration-300 shadow-[0_-4px_20px_rgba(0,0,0,0.4)]">
      <div className="flex items-center justify-around">
        {bizNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href === "/" && pathname === "/");
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center space-y-0.5 text-[10px] font-bold transition cursor-pointer ${
                isActive ? "text-blue-400 font-extrabold" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <div className={`p-1 rounded-full transition-all ${isActive ? "bg-blue-600 text-white scale-105 shadow-md ring-1 ring-blue-400/30" : ""}`}>
                <Icon className="h-4 w-4" />
              </div>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
