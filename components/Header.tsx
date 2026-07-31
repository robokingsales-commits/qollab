"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, User, Building2 } from "lucide-react";

export interface HeaderProps {
  initialMode?: "consumer" | "biz";
}

export default function Header({ initialMode = "consumer" }: HeaderProps) {
  const [mode, setMode] = useState<"consumer" | "biz">(initialMode);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-extrabold tracking-tight text-indigo-600">
              Qollab
            </span>
            <span className="rounded bg-indigo-100 px-1.5 py-0.5 text-xs font-semibold text-indigo-700">
              V.I.M
            </span>
          </Link>

          <div className="flex items-center rounded-full bg-gray-100 p-1 border border-gray-200 shadow-inner">
            <button
              onClick={() => setMode("consumer")}
              className={`flex items-center space-x-1.5 rounded-full px-3 py-1 text-xs font-bold transition-all ${
                mode === "consumer"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <User className="h-3.5 w-3.5" />
              <span>개인</span>
            </button>
            <button
              onClick={() => setMode("biz")}
              className={`flex items-center space-x-1.5 rounded-full px-3 py-1 text-xs font-bold transition-all ${
                mode === "biz"
                  ? "bg-amber-500 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Building2 className="h-3.5 w-3.5" />
              <span>Biz</span>
            </button>
          </div>
        </div>

        <div className="hidden flex-1 max-w-md mx-8 md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                mode === "consumer"
                  ? "어떤 패키지 경험을 찾으시나요? (예: 성수 카페 + 미용실)"
                  : "가게의 유휴 시간을 등록하고 콜라보 제안받기"
              }
              className="w-full rounded-full border border-gray-300 bg-gray-50 py-2 pl-9 pr-4 text-sm text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4 text-sm font-medium text-gray-700">
          {mode === "consumer" ? (
            <>
              <Link href="/packages" className="hover:text-indigo-600">
                패키지 탐색
              </Link>
              <Link href="/my-vouchers" className="hover:text-indigo-600">
                내 바우처
              </Link>
            </>
          ) : (
            <>
              <Link href="/owner/stores" className="hover:text-amber-600">
                매장 관리
              </Link>
              <Link href="/owner/packages/new" className="hover:text-amber-600">
                패키지 기획
              </Link>
              <Link href="/owner/settlements" className="hover:text-amber-600">
                정산 센터
              </Link>
            </>
          )}

          <Link
            href="/auth/login"
            className="rounded-lg bg-gray-900 px-4 py-2 text-xs font-semibold text-white hover:bg-gray-800 transition"
          >
            로그인 / 회원가입
          </Link>
        </div>
      </div>
    </header>
  );
}
