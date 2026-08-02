"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  X, 
  Search, 
  HelpCircle, 
  UserPlus, 
  ShoppingBag, 
  MapPin, 
  Ticket, 
  User, 
  Building2, 
  Store, 
  Settings, 
  Headphones, 
  Sparkles, 
  ArrowRightLeft,
  ChevronRight,
  LayoutDashboard,
  Boxes,
  PieChart,
  LogIn
} from "lucide-react";

interface MenuTreeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MenuTreeModal({ isOpen, onClose }: MenuTreeModalProps) {
  const [activeTab, setActiveTab] = useState<"consumer" | "biz">("consumer");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-3xl bg-slate-900 border border-slate-800 text-white shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-5 bg-slate-950/60">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-white font-black shadow-lg">
              Q
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                <span>전체 메뉴트리 (Menu Tree)</span>
                <span className="rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-xs px-2.5 py-0.5 font-bold">
                  Qollab Interactive Architecture
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                원하시는 메뉴를 선택하시면 해당 라우트로 즉시 이동합니다.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Top Header Utilities Node Row */}
        <div className="bg-slate-950/30 px-6 py-4 border-b border-slate-800/80">
          <div className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
            공통 유틸리티 메뉴
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link
              href="/packages?search=ai"
              onClick={onClose}
              className="flex items-center justify-between rounded-2xl bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700/50 p-3.5 transition group"
            >
              <div className="flex items-center space-x-3">
                <div className="rounded-xl bg-indigo-600 p-2 text-white">
                  <Search className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-indigo-100">AI 검색</h4>
                  <p className="text-[11px] text-indigo-300">자연어 기반 V.I.M 매칭 검색</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-indigo-400 group-hover:translate-x-1 transition" />
            </Link>

            <Link
              href="/support"
              onClick={onClose}
              className="flex items-center justify-between rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 p-3.5 transition group"
            >
              <div className="flex items-center space-x-3">
                <div className="rounded-xl bg-slate-700 p-2 text-slate-200">
                  <HelpCircle className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-100">고객센터</h4>
                  <p className="text-[11px] text-slate-400">1:1 문의 / 이용안내 / FAQ</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition" />
            </Link>

            {/* 로그인 & 회원가입 분리 메뉴 */}
            <div className="rounded-2xl bg-slate-800/80 border border-slate-700 p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <Link
                  href="/auth/login"
                  onClick={onClose}
                  className="flex items-center space-x-1 text-slate-200 hover:text-white font-extrabold text-xs"
                >
                  <LogIn className="h-3.5 w-3.5 text-slate-400" />
                  <span>로그인</span>
                </Link>
                <Link
                  href="/onboarding"
                  onClick={onClose}
                  className="flex items-center space-x-1 text-indigo-400 hover:text-indigo-300 font-extrabold text-xs"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  <span>회원가입</span>
                </Link>
              </div>
              <div className="flex flex-col gap-1 text-[11px] border-t border-slate-700/60 pt-1.5">
                <Link
                  href="/onboarding?mode=general"
                  onClick={onClose}
                  className="text-slate-300 hover:text-indigo-400 flex items-center justify-between group py-0.5"
                >
                  <span>• 일반 회원가입</span>
                  <ChevronRight className="h-3 w-3 text-slate-500 group-hover:translate-x-1 transition" />
                </Link>
                <Link
                  href="/onboarding?mode=biz"
                  onClick={onClose}
                  className="text-slate-300 hover:text-amber-400 flex items-center justify-between group py-0.5"
                >
                  <span>• BIZ 회원가입</span>
                  <ChevronRight className="h-3 w-3 text-slate-500 group-hover:translate-x-1 transition" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="px-6 pt-5 flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab("consumer")}
              className={`flex items-center space-x-2 rounded-2xl px-5 py-2.5 text-sm font-bold transition-all ${
                activeTab === "consumer"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <User className="h-4 w-4" />
              <span>개인회원 모드 메인 메뉴</span>
            </button>
            <button
              onClick={() => setActiveTab("biz")}
              className={`flex items-center space-x-2 rounded-2xl px-5 py-2.5 text-sm font-bold transition-all ${
                activeTab === "biz"
                  ? "bg-amber-500 text-white shadow-lg shadow-amber-500/30"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <Building2 className="h-4 w-4" />
              <span>BIZ회원 모드 메인 메뉴</span>
            </button>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline-block">
            {activeTab === "consumer" ? "소비자 맞춤 추천 & 내 바우처 관리" : "점주 매장 관리 & 정산 및 패키지 센터"}
          </span>
        </div>

        {/* Main Tree Body */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6">
          {activeTab === "consumer" ? (
            /* Consumer Mode Tree Nodes */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* 1. 추천 패키지 */}
              <div className="rounded-3xl bg-slate-950 p-5 border border-slate-800 space-y-3 flex flex-col justify-between hover:border-indigo-500/50 transition">
                <div>
                  <div className="flex items-center space-x-2.5 text-indigo-400 mb-3">
                    <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                      <ShoppingBag className="h-5 w-5" />
                    </div>
                    <h3 className="font-extrabold text-base text-white">추천 패키지</h3>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-300">
                    <li className="p-2 rounded-xl bg-slate-900 border border-slate-800/80">
                      <Link
                        href="/packages?category=local"
                        onClick={onClose}
                        className="hover:text-indigo-400 flex items-center justify-between"
                      >
                        <span>• 우리 동네 패키지</span>
                        <ChevronRight className="h-3 w-3 text-slate-500" />
                      </Link>
                    </li>
                    <li className="p-2 rounded-xl bg-slate-900 border border-slate-800/80">
                      <Link
                        href="/packages?category=brand"
                        onClick={onClose}
                        className="hover:text-indigo-400 flex items-center justify-between"
                      >
                        <span className="leading-snug">
                          • 브랜드 패키지
                          <span className="block text-[10px] text-slate-400">전국 어디서나 구매 가능</span>
                        </span>
                        <ChevronRight className="h-3 w-3 text-slate-500 shrink-0" />
                      </Link>
                    </li>
                  </ul>
                </div>
                <Link
                  href="/packages"
                  onClick={onClose}
                  className="w-full text-center mt-3 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white font-bold text-xs transition"
                >
                  전체 추천 패키지 이동
                </Link>
              </div>

              {/* 2. 마이 패키지 */}
              <div className="rounded-3xl bg-slate-950 p-5 border border-slate-800 space-y-3 flex flex-col justify-between hover:border-indigo-500/50 transition">
                <div>
                  <div className="flex items-center space-x-2.5 text-indigo-400 mb-3">
                    <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                      <Ticket className="h-5 w-5" />
                    </div>
                    <h3 className="font-extrabold text-base text-white">마이 패키지</h3>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-300">
                    <li className="p-2 rounded-xl bg-slate-900 border border-slate-800/80">
                      <Link
                        href="/my-vouchers?type=single"
                        onClick={onClose}
                        className="hover:text-indigo-400 flex items-center justify-between"
                      >
                        <span>• QR/바코드 교환권</span>
                        <ChevronRight className="h-3 w-3 text-slate-500" />
                      </Link>
                    </li>
                    <li className="p-2 rounded-xl bg-slate-900 border border-slate-800/80">
                      <Link
                        href="/my-vouchers?type=collab"
                        onClick={onClose}
                        className="hover:text-indigo-400 flex items-center justify-between"
                      >
                        <span className="leading-snug">
                          • (동네) 다중 매장 콜라보 패키지
                          <span className="block text-[10px] text-slate-400">통합 바우처 관리</span>
                        </span>
                        <ChevronRight className="h-3 w-3 text-slate-500 shrink-0" />
                      </Link>
                    </li>
                  </ul>
                </div>
                <Link
                  href="/my-vouchers"
                  onClick={onClose}
                  className="w-full text-center mt-3 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white font-bold text-xs transition"
                >
                  내 바우처 보관함 이동
                </Link>
              </div>

              {/* 3. 동네지도 */}
              <div className="rounded-3xl bg-slate-950 p-5 border border-slate-800 space-y-3 flex flex-col justify-between hover:border-emerald-500/50 transition">
                <div>
                  <div className="flex items-center space-x-2.5 text-emerald-400 mb-3">
                    <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <h3 className="font-extrabold text-base text-white">동네지도</h3>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-300">
                    <li className="p-2 rounded-xl bg-slate-900 border border-slate-800/80">
                      <Link
                        href="/map?preset=home_work"
                        onClick={onClose}
                        className="hover:text-emerald-400 flex items-center justify-between"
                      >
                        <span className="leading-snug">
                          • 집 / 회사 동네 패키지
                          <span className="block text-[10px] text-slate-400">미리 등록한 동네 목록</span>
                        </span>
                        <ChevronRight className="h-3 w-3 text-slate-500 shrink-0" />
                      </Link>
                    </li>
                    <li className="p-2 rounded-xl bg-slate-900 border border-slate-800/80">
                      <Link
                        href="/map?preset=current"
                        onClick={onClose}
                        className="hover:text-emerald-400 flex items-center justify-between"
                      >
                        <span className="leading-snug">
                          • 현재 위치 기반 지도
                          <span className="block text-[10px] text-slate-400">주변 패키지 한눈에 보기</span>
                        </span>
                        <ChevronRight className="h-3 w-3 text-slate-500 shrink-0" />
                      </Link>
                    </li>
                  </ul>
                </div>
                <Link
                  href="/map"
                  onClick={onClose}
                  className="w-full text-center mt-3 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white font-bold text-xs transition"
                >
                  동네지도 탐색하기
                </Link>
              </div>

              {/* 4. 마이페이지 */}
              <div className="rounded-3xl bg-slate-950 p-5 border border-slate-800 space-y-3 flex flex-col justify-between hover:border-purple-500/50 transition">
                <div>
                  <div className="flex items-center space-x-2.5 text-purple-400 mb-3">
                    <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
                      <User className="h-5 w-5" />
                    </div>
                    <h3 className="font-extrabold text-base text-white">마이페이지</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-1.5 text-xs text-slate-300 max-h-48 overflow-y-auto pr-1">
                    {[
                      { name: "구매내역", tab: "orders" },
                      { name: "결제수단 등록", tab: "payments" },
                      { name: "취소/반품/교환 내역", tab: "returns" },
                      { name: "상품리뷰", tab: "reviews" },
                      { name: "프로필 관리", tab: "profile" },
                      { name: "즐겨찾기 알림 (영화/미용실)", tab: "favorites" },
                      { name: "포인트", tab: "points" },
                      { name: "배송주소지 설정", tab: "shipping" },
                      { name: "계정 정보 변경", tab: "account" },
                      { name: "회원탈퇴", tab: "withdraw" },
                    ].map((item) => (
                      <Link
                        key={item.tab}
                        href={`/mypage?tab=${item.tab}`}
                        onClick={onClose}
                        className="p-1.5 rounded-lg bg-slate-900 hover:bg-purple-950 hover:text-purple-300 flex items-center justify-between text-[11px] transition"
                      >
                        <span>• {item.name}</span>
                        <ChevronRight className="h-3 w-3 text-slate-600" />
                      </Link>
                    ))}
                  </div>
                </div>
                <Link
                  href="/mypage"
                  onClick={onClose}
                  className="w-full text-center mt-3 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white font-bold text-xs transition"
                >
                  마이페이지 메인 이동
                </Link>
              </div>
            </div>
          ) : (
            /* Biz Mode Tree Nodes */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* 1. 대쉬보드 */}
              <div className="rounded-3xl bg-slate-950 p-5 border border-slate-800 space-y-3 flex flex-col justify-between hover:border-amber-500/50 transition">
                <div>
                  <div className="flex items-center space-x-2.5 text-amber-400 mb-3">
                    <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                      <LayoutDashboard className="h-5 w-5" />
                    </div>
                    <h3 className="font-extrabold text-base text-white">대쉬보드 (상단 고정)</h3>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-300">
                    <li className="p-2 rounded-xl bg-slate-900 border border-slate-800/80">
                      <span className="font-bold text-amber-300">• 내 매장 상태</span>
                      <span className="block text-[10px] text-slate-400">판매중, 유휴 시간 등록 상태</span>
                    </li>
                    <li className="p-2 rounded-xl bg-slate-900 border border-slate-800/80">
                      <span className="font-bold text-amber-300">• 실시간 요약</span>
                      <span className="block text-[10px] text-slate-400">오늘 발생 매출 / 등록 패키지 종류</span>
                    </li>
                    <li className="p-2 rounded-xl bg-slate-900 border border-slate-800/80">
                      <span className="font-bold text-amber-300">• 수락 대기 콜라보 제안 알림</span>
                      <span className="block text-[10px] text-slate-400">실시간 매칭 요청 수신 목록</span>
                    </li>
                  </ul>
                </div>
                <Link
                  href="/owner/dashboard"
                  onClick={onClose}
                  className="w-full text-center mt-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-white font-bold text-xs transition"
                >
                  BIZ 대쉬보드 이동
                </Link>
              </div>

              {/* 2. 패키지 센터 */}
              <div className="rounded-3xl bg-slate-950 p-5 border border-slate-800 space-y-3 flex flex-col justify-between hover:border-amber-500/50 transition">
                <div>
                  <div className="flex items-center space-x-2.5 text-amber-400 mb-3">
                    <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                      <Boxes className="h-5 w-5" />
                    </div>
                    <h3 className="font-extrabold text-base text-white">패키지 센터 (제품 등록)</h3>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-300">
                    <li className="p-2 rounded-xl bg-slate-900 border border-slate-800/80">
                      <Link
                        href="/owner/packages/new"
                        onClick={onClose}
                        className="hover:text-amber-400 flex items-center justify-between"
                      >
                        <span className="leading-snug">
                          • 패키지 생성
                          <span className="block text-[10px] text-slate-400">
                            AI 자동 추천 / 자체 상품 묶음 / 직접 지정 콜라보
                          </span>
                        </span>
                        <ChevronRight className="h-3 w-3 text-slate-500 shrink-0" />
                      </Link>
                    </li>
                    <li className="p-2 rounded-xl bg-slate-900 border border-slate-800/80">
                      <Link
                        href="/owner/packages"
                        onClick={onClose}
                        className="hover:text-amber-400 flex items-center justify-between"
                      >
                        <span className="leading-snug">
                          • 생성된 패키지 관리
                          <span className="block text-[10px] text-slate-400">
                            진행 중 패키지 / 콜라보 수락·거절 / 판매 통계 & 성과 분석
                          </span>
                        </span>
                        <ChevronRight className="h-3 w-3 text-slate-500 shrink-0" />
                      </Link>
                    </li>
                  </ul>
                </div>
                <Link
                  href="/owner/packages"
                  onClick={onClose}
                  className="w-full text-center mt-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-white font-bold text-xs transition"
                >
                  패키지 센터 이동
                </Link>
              </div>

              {/* 3. 정산 */}
              <div className="rounded-3xl bg-slate-950 p-5 border border-slate-800 space-y-3 flex flex-col justify-between hover:border-amber-500/50 transition">
                <div>
                  <div className="flex items-center space-x-2.5 text-amber-400 mb-3">
                    <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                      <PieChart className="h-5 w-5" />
                    </div>
                    <h3 className="font-extrabold text-base text-white">정산 센터</h3>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-300">
                    <li className="p-2 rounded-xl bg-slate-900 border border-slate-800/80">
                      <Link
                        href="/owner/settlements?type=single"
                        onClick={onClose}
                        className="hover:text-amber-400 flex items-center justify-between"
                      >
                        <span className="leading-snug">
                          • 단일 매장 자체 패키지 정산
                          <span className="block text-[10px] text-slate-400">단독 상품 바우처 정산</span>
                        </span>
                        <ChevronRight className="h-3 w-3 text-slate-500 shrink-0" />
                      </Link>
                    </li>
                    <li className="p-2 rounded-xl bg-slate-900 border border-slate-800/80">
                      <Link
                        href="/owner/settlements?type=collab"
                        onClick={onClose}
                        className="hover:text-amber-400 flex items-center justify-between"
                      >
                        <span className="leading-snug">
                          • 다른 매장/제품 콜라보 패키지 정산
                          <span className="block text-[10px] text-slate-400">슬롯별 원자적 스냅샷 정산</span>
                        </span>
                        <ChevronRight className="h-3 w-3 text-slate-500 shrink-0" />
                      </Link>
                    </li>
                  </ul>
                </div>
                <Link
                  href="/owner/settlements"
                  onClick={onClose}
                  className="w-full text-center mt-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-white font-bold text-xs transition"
                >
                  정산 센터 이동
                </Link>
              </div>

              {/* 4. 매장 및 상품 설정 */}
              <div className="rounded-3xl bg-slate-950 p-5 border border-slate-800 space-y-3 flex flex-col justify-between hover:border-amber-500/50 transition">
                <div>
                  <div className="flex items-center space-x-2.5 text-amber-400 mb-3">
                    <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                      <Store className="h-5 w-5" />
                    </div>
                    <h3 className="font-extrabold text-base text-white">매장 및 상품 설정</h3>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-300">
                    <li className="p-2 rounded-xl bg-slate-900 border border-slate-800/80">
                      <Link
                        href="/owner/stores"
                        onClick={onClose}
                        className="hover:text-amber-400 flex items-center justify-between"
                      >
                        <span>• 매장 정보 입력 및 수정</span>
                        <ChevronRight className="h-3 w-3 text-slate-500" />
                      </Link>
                    </li>
                    <li className="p-2 rounded-xl bg-slate-900 border border-slate-800/80">
                      <Link
                        href="/owner/stores"
                        onClick={onClose}
                        className="hover:text-amber-400 flex items-center justify-between"
                      >
                        <span>• 콜라보 제품 입력, 수정, 삭제</span>
                        <ChevronRight className="h-3 w-3 text-slate-500" />
                      </Link>
                    </li>
                  </ul>
                </div>
                <Link
                  href="/owner/stores"
                  onClick={onClose}
                  className="w-full text-center mt-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-white font-bold text-xs transition"
                >
                  매장 관리 페이지 이동
                </Link>
              </div>

              {/* 5. 계정 */}
              <div className="rounded-3xl bg-slate-950 p-5 border border-slate-800 space-y-3 flex flex-col justify-between hover:border-amber-500/50 transition">
                <div>
                  <div className="flex items-center space-x-2.5 text-amber-400 mb-3">
                    <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                      <Settings className="h-5 w-5" />
                    </div>
                    <h3 className="font-extrabold text-base text-white">계정 (BIZ)</h3>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-300">
                    <li className="p-2 rounded-xl bg-slate-900 border border-slate-800/80">
                      <Link
                        href="/owner/account"
                        onClick={onClose}
                        className="hover:text-amber-400 flex items-center justify-between"
                      >
                        <span>• 사업자 정보 변경 / 계정 설정</span>
                        <ChevronRight className="h-3 w-3 text-slate-500" />
                      </Link>
                    </li>
                    <li className="p-2 rounded-xl bg-slate-900 border border-slate-800/80">
                      <Link
                        href="/owner/account?action=delete"
                        onClick={onClose}
                        className="hover:text-amber-400 flex items-center justify-between"
                      >
                        <span className="text-rose-400">• 계정 삭제 / 탈퇴</span>
                        <ChevronRight className="h-3 w-3 text-slate-500" />
                      </Link>
                    </li>
                  </ul>
                </div>
                <Link
                  href="/owner/account"
                  onClick={onClose}
                  className="w-full text-center mt-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-white font-bold text-xs transition"
                >
                  BIZ 계정 관리 이동
                </Link>
              </div>

              {/* 6. BIZ센터 */}
              <div className="rounded-3xl bg-slate-950 p-5 border border-slate-800 space-y-3 flex flex-col justify-between hover:border-amber-500/50 transition">
                <div>
                  <div className="flex items-center space-x-2.5 text-amber-400 mb-3">
                    <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                      <Headphones className="h-5 w-5" />
                    </div>
                    <h3 className="font-extrabold text-base text-white">BIZ센터</h3>
                  </div>
                  <p className="text-xs text-slate-300 bg-slate-900 p-3 rounded-xl border border-slate-800">
                    • 판매 및 매출, 입점, 콜라보 파트너쉽과 관련된 모든 문의를 전담 처리합니다.
                  </p>
                </div>
                <Link
                  href="/owner/support"
                  onClick={onClose}
                  className="w-full text-center mt-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-white font-bold text-xs transition"
                >
                  BIZ센터 문의하기
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="border-t border-slate-800 bg-slate-950/80 px-6 py-4 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-4 w-4 text-indigo-400" />
            <span>Qollab V.I.M Engine & Matching System applied.</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-800 px-4 py-2 font-bold text-slate-200 hover:bg-slate-700 transition"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
