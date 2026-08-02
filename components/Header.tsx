"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Search, 
  User, 
  Building2, 
  LogOut, 
  Ticket, 
  Store, 
  ShieldAlert, 
  ChevronDown, 
  HelpCircle, 
  MapPin, 
  ShoppingBag, 
  PieChart, 
  Boxes, 
  LayoutDashboard, 
  UserPlus, 
  ArrowRightLeft, 
  Network,
  Headphones,
  Settings,
  ChevronRight,
  Menu
} from "lucide-react";
import { auth } from "@/lib/firebase/client";
import { onAuthStateChanged, signOut, User as FirebaseUser } from "firebase/auth";
import Cookies from "js-cookie";
import { UserRole } from "@/lib/types/schema";
import MenuTreeModal from "@/components/MenuTreeModal";

export interface HeaderProps {
  initialMode?: "consumer" | "biz";
}

export default function Header({ initialMode = "consumer" }: HeaderProps) {
  const router = useRouter();
  const [mode, setMode] = useState<"consumer" | "biz">(initialMode);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  
  // Dropdown states
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [signupMenuOpen, setSignupMenuOpen] = useState(false);
  const [consumerMainMenuOpen, setConsumerMainMenuOpen] = useState(false);
  const [bizMainMenuOpen, setBizMainMenuOpen] = useState(false);
  const [menuTreeModalOpen, setMenuTreeModalOpen] = useState(false);

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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/packages?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const isLoggedIn = !!user || !!Cookies.get("qollab_user_role");
  const currentRole = role || (Cookies.get("qollab_user_role") as UserRole) || "consumer";

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/95 backdrop-blur shadow-sm">
        {/* Top utility sub-bar */}
        <div className="bg-slate-900 px-4 py-1.5 text-xs text-slate-300 sm:px-6 lg:px-8 border-b border-slate-800">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setMenuTreeModalOpen(true)}
                className="flex items-center space-x-1.5 rounded-md bg-indigo-600/30 hover:bg-indigo-600 px-2.5 py-0.5 font-bold text-indigo-200 hover:text-white transition border border-indigo-500/30"
              >
                <Network className="h-3.5 w-3.5" />
                <span>전체 메뉴트리</span>
              </button>
              <span className="hidden text-slate-500 md:inline">|</span>
              <span className="hidden text-slate-400 md:inline">
                초개인화 V.I.M 얼라이언스 알선 플랫폼
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <Link
                href="/support"
                className="flex items-center space-x-1 text-slate-300 hover:text-white transition font-medium"
              >
                <HelpCircle className="h-3.5 w-3.5" />
                <span>고객센터</span>
              </Link>

              {/* 회원가입 / 전환 드롭다운 */}
              <div className="relative">
                <button
                  onClick={() => setSignupMenuOpen(!signupMenuOpen)}
                  onBlur={() => setTimeout(() => setSignupMenuOpen(false), 200)}
                  className="flex items-center space-x-1 text-emerald-400 hover:text-emerald-300 font-bold transition"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  <span>회원가입 / 전환</span>
                  <ChevronDown className="h-3 w-3" />
                </button>

                {signupMenuOpen && (
                  <div className="absolute right-0 mt-1.5 w-56 rounded-2xl bg-white p-2 shadow-2xl border border-gray-100 space-y-1 text-xs z-50 text-gray-800">
                    <div className="px-3 py-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                      가입 및 회원 전환
                    </div>
                    <Link
                      href="/auth/login"
                      className="block rounded-xl px-3 py-2 hover:bg-emerald-50 text-gray-800 font-semibold"
                    >
                      • 개인회원 / BIZ 회원 가입
                    </Link>
                    <Link
                      href="/onboarding"
                      className="flex items-center space-x-1.5 rounded-xl px-3 py-2 hover:bg-emerald-50 text-emerald-700 font-bold"
                    >
                      <ArrowRightLeft className="h-3.5 w-3.5" />
                      <span>• 개인회원 → BIZ 회원 전환</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Header Bar */}
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

            {/* Mode Switcher Buttons */}
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
                <span>개인회원 모드</span>
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
                <span>BIZ회원 모드</span>
              </button>
            </div>
          </div>

          {/* AI Search Bar */}
          <div className="hidden flex-1 max-w-xs lg:max-w-md mx-4 md:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  mode === "consumer"
                    ? "AI 검색: 예) 성수동 데이트 5만원 이하 추천"
                    : "AI 검색: 매장 유휴시간 및 콜라보 추천 탐색"
                }
                className="w-full rounded-full border border-gray-300 bg-gray-50 py-2 pl-9 pr-4 text-xs text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </form>
          </div>

          {/* Navigation Links based on Mode */}
          <div className="flex items-center space-x-4 text-xs font-medium text-gray-700">
            {mode === "consumer" ? (
              /* --- 개인회원 모드 메인 메뉴 --- */
              <div 
                className="relative"
                onMouseEnter={() => setConsumerMainMenuOpen(true)}
                onMouseLeave={() => setConsumerMainMenuOpen(false)}
              >
                <button
                  className="flex items-center space-x-1.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100 px-3.5 py-2 text-xs font-extrabold text-indigo-700 border border-indigo-200 shadow-sm transition"
                >
                  <Menu className="h-4 w-4 text-indigo-600" />
                  <span>개인회원 모드 메인 메뉴</span>
                  <ChevronDown className="h-3.5 w-3.5 text-indigo-400" />
                </button>

                {/* Mega Dropdown containing the 4 submenus */}
                {consumerMainMenuOpen && (
                  <div className="absolute right-0 sm:left-0 mt-1 w-[580px] rounded-3xl bg-white p-4 shadow-2xl border border-gray-200 z-50 grid grid-cols-2 gap-3 text-xs">
                    {/* 1. 추천 패키지 */}
                    <div className="rounded-2xl bg-gray-50 p-3.5 border border-gray-100 space-y-2 hover:border-indigo-300 transition">
                      <div className="flex items-center space-x-2 text-indigo-600 font-extrabold">
                        <ShoppingBag className="h-4 w-4" />
                        <span>추천 패키지</span>
                      </div>
                      <div className="space-y-1 pl-1">
                        <Link
                          href="/packages?category=local"
                          className="block text-gray-700 hover:text-indigo-600 font-semibold py-0.5 flex items-center justify-between"
                        >
                          <span>• 우리 동네 패키지</span>
                          <ChevronRight className="h-3 w-3 text-gray-400" />
                        </Link>
                        <Link
                          href="/packages?category=brand"
                          className="block text-gray-700 hover:text-indigo-600 font-semibold py-0.5 flex items-center justify-between"
                        >
                          <span>• 브랜드 패키지 (전국 구매)</span>
                          <ChevronRight className="h-3 w-3 text-gray-400" />
                        </Link>
                      </div>
                    </div>

                    {/* 2. 마이 패키지 */}
                    <div className="rounded-2xl bg-gray-50 p-3.5 border border-gray-100 space-y-2 hover:border-indigo-300 transition">
                      <div className="flex items-center space-x-2 text-indigo-600 font-extrabold">
                        <Ticket className="h-4 w-4" />
                        <span>마이 패키지</span>
                      </div>
                      <div className="space-y-1 pl-1">
                        <Link
                          href="/my-vouchers?type=single"
                          className="block text-gray-700 hover:text-indigo-600 font-semibold py-0.5 flex items-center justify-between"
                        >
                          <span>• QR/바코드 교환권</span>
                          <ChevronRight className="h-3 w-3 text-gray-400" />
                        </Link>
                        <Link
                          href="/my-vouchers?type=collab"
                          className="block text-gray-700 hover:text-indigo-600 font-semibold py-0.5 flex items-center justify-between"
                        >
                          <span>• (동네) 다중 매장 콜라보</span>
                          <ChevronRight className="h-3 w-3 text-gray-400" />
                        </Link>
                      </div>
                    </div>

                    {/* 3. 동네지도 */}
                    <div className="rounded-2xl bg-gray-50 p-3.5 border border-gray-100 space-y-2 hover:border-emerald-300 transition">
                      <div className="flex items-center space-x-2 text-emerald-600 font-extrabold">
                        <MapPin className="h-4 w-4" />
                        <span>동네지도</span>
                      </div>
                      <div className="space-y-1 pl-1">
                        <Link
                          href="/map?preset=home_work"
                          className="block text-gray-700 hover:text-emerald-600 font-semibold py-0.5 flex items-center justify-between"
                        >
                          <span>• 집 / 회사 동네 패키지</span>
                          <ChevronRight className="h-3 w-3 text-gray-400" />
                        </Link>
                        <Link
                          href="/map?preset=current"
                          className="block text-gray-700 hover:text-emerald-600 font-semibold py-0.5 flex items-center justify-between"
                        >
                          <span>• 현재 위치 기반 지도</span>
                          <ChevronRight className="h-3 w-3 text-gray-400" />
                        </Link>
                      </div>
                    </div>

                    {/* 4. 마이페이지 */}
                    <div className="rounded-2xl bg-gray-50 p-3.5 border border-gray-100 space-y-2 hover:border-purple-300 transition">
                      <div className="flex items-center space-x-2 text-purple-600 font-extrabold">
                        <User className="h-4 w-4" />
                        <span>마이페이지</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1 text-[11px] text-gray-700 font-semibold">
                        <Link href="/mypage?tab=orders" className="hover:text-purple-600 py-0.5">• 구매내역</Link>
                        <Link href="/mypage?tab=payments" className="hover:text-purple-600 py-0.5">• 결제수단</Link>
                        <Link href="/mypage?tab=returns" className="hover:text-purple-600 py-0.5">• 취소/반품</Link>
                        <Link href="/mypage?tab=reviews" className="hover:text-purple-600 py-0.5">• 상품리뷰</Link>
                        <Link href="/mypage?tab=profile" className="hover:text-purple-600 py-0.5">• 프로필관리</Link>
                        <Link href="/mypage?tab=favorites" className="hover:text-purple-600 py-0.5">• 즐겨찾기</Link>
                        <Link href="/mypage?tab=points" className="hover:text-purple-600 py-0.5">• 포인트</Link>
                        <Link href="/mypage?tab=account" className="hover:text-purple-600 py-0.5">• 계정변경</Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* --- BIZ회원 모드 메인 메뉴 --- */
              <div 
                className="relative"
                onMouseEnter={() => setBizMainMenuOpen(true)}
                onMouseLeave={() => setBizMainMenuOpen(false)}
              >
                <button
                  className="flex items-center space-x-1.5 rounded-2xl bg-amber-50 hover:bg-amber-100 px-3.5 py-2 text-xs font-extrabold text-amber-800 border border-amber-200 shadow-sm transition"
                >
                  <Menu className="h-4 w-4 text-amber-600" />
                  <span>BIZ회원 모드 메인 메뉴</span>
                  <ChevronDown className="h-3.5 w-3.5 text-amber-500" />
                </button>

                {/* Mega Dropdown containing the 6 BIZ submenus */}
                {bizMainMenuOpen && (
                  <div className="absolute right-0 sm:left-0 mt-1 w-[580px] rounded-3xl bg-white p-4 shadow-2xl border border-gray-200 z-50 grid grid-cols-2 gap-3 text-xs">
                    {/* 1. 대쉬보드 */}
                    <div className="rounded-2xl bg-amber-50/50 p-3 border border-amber-100 space-y-1">
                      <Link href="/owner/dashboard" className="flex items-center space-x-2 text-amber-800 font-extrabold hover:underline">
                        <LayoutDashboard className="h-4 w-4" />
                        <span>대쉬보드 (상단 고정)</span>
                      </Link>
                      <p className="text-[11px] text-gray-500">내 매장 상태, 실시간 매출, 수락 대기 알림</p>
                    </div>

                    {/* 2. 패키지 센터 */}
                    <div className="rounded-2xl bg-gray-50 p-3 border border-gray-100 space-y-1">
                      <Link href="/owner/packages" className="flex items-center space-x-2 text-gray-900 font-extrabold hover:underline">
                        <Boxes className="h-4 w-4 text-amber-600" />
                        <span>패키지 센터 (제품 등록)</span>
                      </Link>
                      <p className="text-[11px] text-gray-500">AI 패키지 생성, 자체 묶음, 통계 분석</p>
                    </div>

                    {/* 3. 정산 */}
                    <div className="rounded-2xl bg-gray-50 p-3 border border-gray-100 space-y-1">
                      <Link href="/owner/settlements" className="flex items-center space-x-2 text-gray-900 font-extrabold hover:underline">
                        <PieChart className="h-4 w-4 text-amber-600" />
                        <span>정산 센터</span>
                      </Link>
                      <p className="text-[11px] text-gray-500">단일 매장 자체 정산 & 콜라보 정산</p>
                    </div>

                    {/* 4. 매장 및 상품 설정 */}
                    <div className="rounded-2xl bg-gray-50 p-3 border border-gray-100 space-y-1">
                      <Link href="/owner/stores" className="flex items-center space-x-2 text-gray-900 font-extrabold hover:underline">
                        <Store className="h-4 w-4 text-amber-600" />
                        <span>매장 및 상품 설정</span>
                      </Link>
                      <p className="text-[11px] text-gray-500">매장 정보 수정, 콜라보 제품 관리</p>
                    </div>

                    {/* 5. 계정 */}
                    <div className="rounded-2xl bg-gray-50 p-3 border border-gray-100 space-y-1">
                      <Link href="/owner/account" className="flex items-center space-x-2 text-gray-900 font-extrabold hover:underline">
                        <Settings className="h-4 w-4 text-amber-600" />
                        <span>계정 관리</span>
                      </Link>
                      <p className="text-[11px] text-gray-500">사업자 정보 변경, 로그아웃, 계정 삭제</p>
                    </div>

                    {/* 6. BIZ센터 */}
                    <div className="rounded-2xl bg-gray-50 p-3 border border-gray-100 space-y-1">
                      <Link href="/owner/support" className="flex items-center space-x-2 text-gray-900 font-extrabold hover:underline">
                        <Headphones className="h-4 w-4 text-amber-600" />
                        <span>BIZ센터</span>
                      </Link>
                      <p className="text-[11px] text-gray-500">판매 및 매출 관련 1:1 전담 문의</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Profile User Menu Dropdown */}
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
                  <div className="text-left text-xs hidden sm:block">
                    <p className="font-bold text-gray-900 leading-none">
                      {user?.displayName || user?.email?.split("@")[0] || "회원"}
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
                  <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-white p-2 shadow-2xl border border-gray-100 space-y-1 text-xs z-50">
                    <div className="px-3 py-2 border-b border-gray-100">
                      <p className="font-bold text-gray-900 truncate">
                        {user?.displayName || "내 계정"}
                      </p>
                      <p className="text-gray-400 truncate text-[11px]">
                        {user?.email || "인증 회원"}
                      </p>
                    </div>

                    <Link
                      href="/mypage"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center space-x-2 rounded-xl px-3 py-2 text-gray-700 hover:bg-gray-50 transition font-semibold"
                    >
                      <User className="h-4 w-4 text-purple-600" />
                      <span>마이페이지</span>
                    </Link>

                    <Link
                      href="/my-vouchers"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center space-x-2 rounded-xl px-3 py-2 text-gray-700 hover:bg-gray-50 transition font-semibold"
                    >
                      <Ticket className="h-4 w-4 text-indigo-600" />
                      <span>내 바우처 보관함</span>
                    </Link>

                    {currentRole === "owner" && (
                      <Link
                        href="/owner/dashboard"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center space-x-2 rounded-xl px-3 py-2 text-gray-700 hover:bg-gray-50 transition font-semibold"
                      >
                        <Store className="h-4 w-4 text-amber-600" />
                        <span>BIZ 점주 대쉬보드</span>
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
                className="rounded-xl bg-gray-900 px-4 py-2 text-xs font-bold text-white hover:bg-gray-800 transition shadow-sm"
              >
                로그인 / 회원가입
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Menu Tree Interactive Visualizer Modal */}
      <MenuTreeModal
        isOpen={menuTreeModalOpen}
        onClose={() => setMenuTreeModalOpen(false)}
      />
    </>
  );
}
