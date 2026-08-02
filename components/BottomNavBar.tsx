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
  Headphones
} from "lucide-react";

interface BottomNavBarProps {
  mode: "consumer" | "biz";
}

export default function BottomNavBar({ mode }: BottomNavBarProps) {
  const pathname = usePathname();

  if (mode === "consumer") {
    const consumerNavItems = [
      { label: "홈", href: "/", icon: Home },
      { label: "검색", href: "/packages", icon: Search },
      { label: "마이 패키지", href: "/my-vouchers", icon: Ticket },
      { label: "동네지도", href: "/map", icon: MapPin },
      { label: "마이페이지", href: "/mypage", icon: User },
    ];

    return (
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 border-t border-slate-800 backdrop-blur-md py-2 px-3 shadow-2xl">
        <div className="mx-auto flex max-w-lg items-center justify-around">
          {consumerNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center space-y-1 text-[11px] font-bold transition ${
                  isActive ? "text-indigo-400 font-black scale-105" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <div className={`p-1.5 rounded-xl ${isActive ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30" : ""}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  // BIZ Mode Navigation Items
  const bizNavItems = [
    { label: "홈", href: "/owner/dashboard", icon: Home },
    { label: "검색", href: "/packages", icon: Search },
    { label: "패키지센터", href: "/owner/packages", icon: Boxes },
    { label: "정산", href: "/owner/settlements", icon: PieChart },
    { label: "BIZ센터", href: "/owner/support", icon: Headphones },
    { label: "마이페이지", href: "/owner/account", icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 border-t border-amber-900/50 backdrop-blur-md py-2 px-3 shadow-2xl">
      <div className="mx-auto flex max-w-lg items-center justify-around">
        {bizNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center space-y-1 text-[10px] font-bold transition ${
                isActive ? "text-amber-400 font-black scale-105" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <div className={`p-1.5 rounded-xl ${isActive ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" : ""}`}>
                <Icon className="h-5 w-5" />
              </div>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
