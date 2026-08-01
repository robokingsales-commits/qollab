"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, User, Building2, LogOut, Ticket, Store, ShieldAlert, ChevronDown } from "lucide-react";
import { auth } from "@/lib/firebase/client";
import { onAuthStateChanged, signOut, User as FirebaseUser } from "firebase/auth";
import Cookies from "js-cookie";
import { UserRole } from "@/lib/types/schema";

export interface HeaderProps {
  initialMode?: "consumer" | "biz";
}

export default function Header({ initialMode = "consumer" }: HeaderProps) {
  const router = useRouter();
  const [mode, setMode] = useState<"consumer" | "biz">(initialMode);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const savedRole = (Cookies.get("qollab_user_role") as UserRole) || null;
    setRole(savedRole);

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      const activeRole = (Cookies.get("qollab_user_role") as UserRole) || "consumer";
      setRole(activeRole);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn("SignOut error:", e);
    }
    Cookies.remove("qollab_user_role");
    setUser(null);
    setRole(null);
    setUserMenuOpen(false);
    router.push("/");
    router.refresh();
  };

  const isLoggedIn = !!user || !!Cookies.get("qollab_user_role");
  const currentRole = role || (Cookies.get("qollab_user_role") as UserRole) || "consumer";

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
              <Link href="/packages" className="hover:text-indigo-600 font-semibold">
                패키지 탐색
              </Link>
              {isLoggedIn && (
                <Link href="/my-vouchers" className="hover:text-indigo-600 font-semibold flex items-center space-x-1 text-indigo-600">
                  <Ticket className="h-4 w-4" />
                  <span>내 바우처</span>
                </Link>
              )}
            </>
          ) : (
            <>
              <Link href="/owner/stores" className="hover:text-amber-600 font-semibold flex items-center space-x-1">
                <Store className="h-4 w-4" />
                <span>매장 관리</span>
              </Link>
              <Link href="/owner/packages/new" className="hover:text-amber-600 font-semibold">
                패키지 기획
              </Link>
              <Link href="/owner/settlements" className="hover:text-amber-600 font-semibold">
                정산 센터
              </Link>
            </>
          )}

          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-2 rounded-full border border-gray-200 bg-gray-50 p-1.5 pr-3 hover:bg-gray-100 transition"
              >
                {user?.photoURL ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.photoURL}
                    alt="User profile"
                    className="h-7 w-7 rounded-full object-cover border border-gray-300"
                  />
                ) : (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                    {user?.displayName?.[0] || user?.email?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
                <div className="text-left text-xs">
                  <p className="font-bold text-gray-900 leading-none">
                    {user?.displayName || user?.email?.split("@")[0] || "로그인 사용자"}
                  </p>
                  <span className="inline-block mt-0.5 text-[10px] font-bold text-indigo-600">
                    {currentRole === "owner"
                      ? "점주 회원"
                      : currentRole === "admin"
                      ? "관리자"
                      : "개인 회원"}
                  </span>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white p-2 shadow-xl border border-gray-100 space-y-1 text-xs">
                  <div className="px-3 py-2 border-b border-gray-100">
                    <p className="font-bold text-gray-900 truncate">
                      {user?.displayName || "내 계정"}
                    </p>
                    <p className="text-gray-400 truncate text-[11px]">
                      {user?.email || "인증 회원"}
                    </p>
                  </div>

                  <Link
                    href="/my-vouchers"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center space-x-2 rounded-xl px-3 py-2 text-gray-700 hover:bg-gray-50 transition font-semibold"
                  >
                    <Ticket className="h-4 w-4 text-indigo-600" />
                    <span>내 바우처 보기</span>
                  </Link>

                  {currentRole === "owner" && (
                    <Link
                      href="/owner/stores"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center space-x-2 rounded-xl px-3 py-2 text-gray-700 hover:bg-gray-50 transition font-semibold"
                    >
                      <Store className="h-4 w-4 text-amber-600" />
                      <span>내 매장 관리</span>
                    </Link>
                  )}

                  {currentRole === "admin" && (
                    <Link
                      href="/admin/stores"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center space-x-2 rounded-xl px-3 py-2 text-gray-700 hover:bg-gray-50 transition font-semibold"
                    >
                      <ShieldAlert className="h-4 w-4 text-slate-800" />
                      <span>어드민 시스템</span>
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 rounded-xl px-3 py-2 text-rose-600 hover:bg-rose-50 transition font-bold"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>로그아웃</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="rounded-lg bg-gray-900 px-4 py-2 text-xs font-semibold text-white hover:bg-gray-800 transition"
            >
              로그인 / 회원가입
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
