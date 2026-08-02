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
  Settings
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
  const [activeNavDropdown, setActiveNavDropdown] = useState<string | null>(null);
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
                      href="/auth/login?tab=signup"
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
          <div className="hidden flex-1 max-w-md mx-6 md:block">
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
          <div className="flex items-center space-x-5 text-xs font-medium text-gray-700">
            {mode === "consumer" ? (
              <>
                {/* 1. 추천 패키지 */}
                <div 
                  className="relative"
                  onMouseEnter={() => setActiveNavDropdown("recommend")}
                  onMouseLeave={() => setActiveNavDropdown(null)}
                >
                  <Link 
                    href="/packages" 
                    className="flex items-center space-x-1 hover:text-indigo-600 font-bold py-2"
                  >
                    <ShoppingBag className="h-3.5 w-3.5 text-indigo-600" />
                    <span>추천 패키지</span>
                    <ChevronDown className="h-3 w-3 text-gray-400" />
                  </Link>

                  {activeNavDropdown === "recommend" && (
                    <div className="absolute left-0 mt-0 w-52 rounded-2xl bg-white p-2 shadow-2xl border border-gray-100 space-y-1 z-50">
                      <Link
                        href="/packages?category=local"
                        className="block rounded-xl px-3 py-2 hover:bg-indigo-50 font-semibold text-gray-800"
                      >
                        • 우리 동네 패키지
                      </Link>
                      <Link
                        href="/packages?category=brand"
                        className="block rounded-xl px-3 py-2 hover:bg-indigo-50 font-semibold text-gray-800"
                      >
                        • 브랜드 패키지 (전국 구매)
                      </Link>
                    </div>
                  )}
                </div>

                {/* 2. 마이 패키지 */}
                <div 
                  className="relative"
                  onMouseEnter={() => setActiveNavDropdown("mypackage")}
                  onMouseLeave={() => setActiveNavDropdown(null)}
                >
                  <Link 
                    href="/my-vouchers" 
                    className="flex items-center space-x-1 hover:text-indigo-600 font-bold py-2 text-indigo-600"
                  >
                    <Ticket className="h-3.5 w-3.5" />
                    <span>마이 패키지</span>
                    <ChevronDown className="h-3 w-3 text-indigo-400" />
                  </Link>

                  {activeNavDropdown === "mypackage" && (
                    <div className="absolute left-0 mt-0 w-60 rounded-2xl bg-white p-2 shadow-2xl border border-gray-100 space-y-1 z-50">
                      <Link
                        href="/my-vouchers?type=single"
                        className="block rounded-xl px-3 py-2 hover:bg-indigo-50 font-semibold text-gray-800"
                      >
                        • QR/바코드 교환권
                      </Link>
                      <Link
                        href="/my-vouchers?type=collab"
                        className="block rounded-xl px-3 py-2 hover:bg-indigo-50 font-semibold text-gray-800"
                      >
                        • QR/바코드: (동네) 다중 매장 콜라보
                      </Link>
                    </div>
                  )}
                </div>

                {/* 3. 동네지도 */}
                <div 
                  className="relative"
                  onMouseEnter={() => setActiveNavDropdown("map")}
                  onMouseLeave={() => setActiveNavDropdown(null)}
                >
                  <Link 
                    href="/map" 
                    className="flex items-center space-x-1 hover:text-emerald-600 font-bold py-2"
                  >
                    <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                    <span>동네지도</span>
                    <ChevronDown className="h-3 w-3 text-gray-400" />
                  </Link>

                  {activeNavDropdown === "map" && (
                    <div className="absolute left-0 mt-0 w-56 rounded-2xl bg-white p-2 shadow-2xl border border-gray-100 space-y-1 z-50">
                      <Link
                        href="/map?preset=home_work"
                        className="block rounded-xl px-3 py-2 hover:bg-emerald-50 font-semibold text-gray-800"
                      >
                        • 집 / 회사 동네 패키지
                      </Link>
                      <Link
                        href="/map?preset=current"
                        className="block rounded-xl px-3 py-2 hover:bg-emerald-50 font-semibold text-gray-800"
                      >
                        • 현재 위치 기반 지도
                      </Link>
                    </div>
                  )}
                </div>

                {/* 4. 마이페이지 */}
                <div 
                  className="relative"
                  onMouseEnter={() => setActiveNavDropdown("mypage")}
                  onMouseLeave={() => setActiveNavDropdown(null)}
                >
                  <Link 
                    href="/mypage" 
                    className="flex items-center space-x-1 hover:text-purple-600 font-bold py-2"
                  >
                    <User className="h-3.5 w-3.5 text-purple-600" />
                    <span>마이페이지</span>
                    <ChevronDown className="h-3 w-3 text-gray-400" />
                  </Link>

                  {activeNavDropdown === "mypage" && (
                    <div className="absolute right-0 mt-0 w-64 rounded-2xl bg-white p-2 shadow-2xl border border-gray-100 space-y-1 z-50 max-h-80 overflow-y-auto">
                      <Link href="/mypage?tab=orders" className="block rounded-xl px-3 py-1.5 hover:bg-purple-50 text-gray-800">
                        • 구매내역
                      </Link>
                      <Link href="/mypage?tab=payments" className="block rounded-xl px-3 py-1.5 hover:bg-purple-50 text-gray-800">
                        • 결제수단 등록
                      </Link>
                      <Link href="/mypage?tab=returns" className="block rounded-xl px-3 py-1.5 hover:bg-purple-50 text-gray-800">
                        • 취소/반품/교환 내역
                      </Link>
                      <Link href="/mypage?tab=reviews" className="block rounded-xl px-3 py-1.5 hover:bg-purple-50 text-gray-800">
                        • 상품리뷰
                      </Link>
                      <Link href="/mypage?tab=profile" className="block rounded-xl px-3 py-1.5 hover:bg-purple-50 text-gray-800">
                        • 프로필 관리
                      </Link>
                      <Link href="/mypage?tab=favorites" className="block rounded-xl px-3 py-1.5 hover:bg-purple-50 text-gray-800">
                        • 즐겨찾기 알림 (영화, 미용실 등)
                      </Link>
                      <Link href="/mypage?tab=points" className="block rounded-xl px-3 py-1.5 hover:bg-purple-50 text-gray-800">
                        • 포인트
                      </Link>
                      <Link href="/mypage?tab=shipping" className="block rounded-xl px-3 py-1.5 hover:bg-purple-50 text-gray-800">
                        • 배송주소지 설정
                      </Link>
                      <Link href="/mypage?tab=account" className="block rounded-xl px-3 py-1.5 hover:bg-purple-50 text-gray-800">
                        • 계정 정보 변경
                      </Link>
                      <button onClick={handleLogout} className="w-full text-left rounded-xl px-3 py-1.5 hover:bg-rose-50 text-rose-600 font-bold">
                        • 로그아웃
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* BIZ 회원 모드 메뉴 */
              <>
                {/* 1. 대쉬보드 */}
                <Link
                  href="/owner/dashboard"
                  className="flex items-center space-x-1 hover:text-amber-600 font-bold py-2 text-amber-700"
                >
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  <span>대쉬보드</span>
                </Link>

                {/* 2. 패키지 센터 */}
                <div 
                  className="relative"
                  onMouseEnter={() => setActiveNavDropdown("biz_packages")}
                  onMouseLeave={() => setActiveNavDropdown(null)}
                >
                  <Link 
                    href="/owner/packages" 
                    className="flex items-center space-x-1 hover:text-amber-600 font-bold py-2"
                  >
                    <Boxes className="h-3.5 w-3.5 text-amber-600" />
                    <span>패키지 센터</span>
                    <ChevronDown className="h-3 w-3 text-gray-400" />
                  </Link>

                  {activeNavDropdown === "biz_packages" && (
                    <div className="absolute left-0 mt-0 w-64 rounded-2xl bg-white p-2 shadow-2xl border border-gray-100 space-y-1 z-50">
                      <Link href="/owner/packages/new" className="block rounded-xl px-3 py-2 hover:bg-amber-50 font-semibold text-gray-800">
                        • 패키지 생성 (AI추천/자체/직접콜라보)
                      </Link>
                      <Link href="/owner/packages" className="block rounded-xl px-3 py-2 hover:bg-amber-50 font-semibold text-gray-800">
                        • 생성된 패키지 관리 & 통계 분석
                      </Link>
                    </div>
                  )}
                </div>

                {/* 3. 정산 */}
                <div 
                  className="relative"
                  onMouseEnter={() => setActiveNavDropdown("biz_settlements")}
                  onMouseLeave={() => setActiveNavDropdown(null)}
                >
                  <Link 
                    href="/owner/settlements" 
                    className="flex items-center space-x-1 hover:text-amber-600 font-bold py-2"
                  >
                    <PieChart className="h-3.5 w-3.5 text-amber-600" />
                    <span>정산</span>
                    <ChevronDown className="h-3 w-3 text-gray-400" />
                  </Link>

                  {activeNavDropdown === "biz_settlements" && (
                    <div className="absolute left-0 mt-0 w-60 rounded-2xl bg-white p-2 shadow-2xl border border-gray-100 space-y-1 z-50">
                      <Link href="/owner/settlements?type=single" className="block rounded-xl px-3 py-2 hover:bg-amber-50 font-semibold text-gray-800">
                        • 단일 매장 자체 패키지 정산
                      </Link>
                      <Link href="/owner/settlements?type=collab" className="block rounded-xl px-3 py-2 hover:bg-amber-50 font-semibold text-gray-800">
                        • 콜라보 패키지 정산
                      </Link>
                    </div>
                  )}
                </div>

                {/* 4. 매장 및 상품 설정 */}
                <Link
                  href="/owner/stores"
                  className="flex items-center space-x-1 hover:text-amber-600 font-bold py-2"
                >
                  <Store className="h-3.5 w-3.5 text-amber-600" />
                  <span>매장/상품 설정</span>
                </Link>

                {/* 5. 계정 */}
                <Link
                  href="/owner/account"
                  className="flex items-center space-x-1 hover:text-amber-600 font-bold py-2"
                >
                  <Settings className="h-3.5 w-3.5 text-amber-600" />
                  <span>계정</span>
                </Link>

                {/* 6. BIZ센터 */}
                <Link
                  href="/owner/support"
                  className="flex items-center space-x-1 hover:text-amber-600 font-bold py-2"
                >
                  <Headphones className="h-3.5 w-3.5 text-amber-600" />
                  <span>BIZ센터</span>
                </Link>
              </>
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
