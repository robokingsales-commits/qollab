"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Store, 
  TrendingUp, 
  Bell, 
  Boxes, 
  CheckCircle, 
  XCircle, 
  Sparkles,
  ArrowUpRight,
  Clock
} from "lucide-react";
import { formatKRW } from "@/lib/utils";

export default function BizDashboardPage() {
  const [storeStatus, setStoreStatus] = useState<"active" | "paused">("active");

  const [pendingProposals, setPendingProposals] = useState([
    {
      id: "prop-101",
      fromStore: "성수 아틀리에 헤어 스튜디오",
      category: "뷰티/미용",
      proposedPackage: "성수 힐링 데이 (루프탑 커피 + 1:1 두피 스파)",
      estimatedRevenue: 147000,
      createdAt: "10분 전",
    },
    {
      id: "prop-102",
      fromStore: "성수 갤러리 베이커리",
      category: "디저트/전시",
      proposedPackage: "성수 감성 아카데미 (에스프레소 + 핸드메이드 빵)",
      estimatedRevenue: 98000,
      createdAt: "1시간 전",
    },
  ]);

  const handleProposalAction = (id: string, action: "accept" | "reject") => {
    alert(`콜라보 제안(${id})이 ${action === "accept" ? "수락" : "거절"}되었습니다!`);
    setPendingProposals(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Top Banner & Header */}
      <div className="rounded-3xl bg-slate-900 p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
        <div>
          <div className="inline-flex items-center space-x-2 rounded-full bg-amber-500/20 px-3 py-1 text-xs font-bold text-amber-400 border border-amber-500/30">
            <LayoutDashboard className="h-3.5 w-3.5" />
            <span>BIZ 회원 전용 상단 고정 대쉬보드</span>
          </div>
          <h1 className="text-3xl font-black mt-2">성수 루프탑 로스터리 점주 대쉬보드</h1>
          <p className="text-xs text-slate-400 mt-1">
            실시간 매출 현황과 입수된 콜라보 제안을 확인하고 매장 상태를 관리하세요.
          </p>
        </div>

        {/* 내 매장 상태 토글 Switcher */}
        <div className="flex items-center space-x-3 bg-slate-950 p-3 rounded-2xl border border-slate-800">
          <div className="text-right">
            <span className="text-xs font-bold text-slate-300 block">내 매장 상태</span>
            <span className={`text-[11px] font-extrabold ${storeStatus === "active" ? "text-emerald-400" : "text-rose-400"}`}>
              {storeStatus === "active" ? "● 판매중 (유휴시간 매칭 가동)" : "○ 일시정지"}
            </span>
          </div>
          <button
            onClick={() => setStoreStatus(storeStatus === "active" ? "paused" : "active")}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition shadow ${
              storeStatus === "active"
                ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                : "bg-rose-600 hover:bg-rose-500 text-white"
            }`}
          >
            {storeStatus === "active" ? "일시정지 전환" : "판매 재개"}
          </button>
        </div>
      </div>

      {/* Real-time Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="rounded-3xl bg-white p-6 border border-gray-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500 font-bold">
            <span>오늘 발생 매출</span>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-gray-900">{formatKRW(392000)}</p>
          <span className="text-[11px] text-emerald-600 font-semibold">전일 대비 +18.4% 증가</span>
        </div>

        <div className="rounded-3xl bg-white p-6 border border-gray-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500 font-bold">
            <span>등록된 패키지 종류</span>
            <Boxes className="h-4 w-4 text-amber-600" />
          </div>
          <p className="text-2xl font-black text-gray-900">4 개</p>
          <span className="text-[11px] text-gray-400">자체 2개 / 콜라보 2개</span>
        </div>

        <div className="rounded-3xl bg-white p-6 border border-gray-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500 font-bold">
            <span>수락 대기 콜라보 제안</span>
            <Bell className="h-4 w-4 text-rose-500" />
          </div>
          <p className="text-2xl font-black text-rose-600">{pendingProposals.length} 건</p>
          <span className="text-[11px] text-rose-500 font-semibold">즉시 확인 및 승인 필요</span>
        </div>

        <div className="rounded-3xl bg-white p-6 border border-gray-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500 font-bold">
            <span>V.I.M 매칭 파트너 점수</span>
            <Sparkles className="h-4 w-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-black text-indigo-600">94.8 점</p>
          <span className="text-[11px] text-indigo-600 font-semibold">최상위 5% 최우수 콜라보 매장</span>
        </div>
      </div>

      {/* Pending Collab Proposal Notifications Section */}
      <div className="rounded-3xl bg-white p-6 border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-rose-500 animate-pulse" />
            <h2 className="text-xl font-extrabold text-gray-900">수락 대기 중인 콜라보 제안 알림</h2>
          </div>
          <span className="text-xs text-gray-400">AI V.I.M 기반 자동 매칭 제안</span>
        </div>

        {pendingProposals.length === 0 ? (
          <div className="py-8 text-center text-xs text-gray-500 bg-gray-50 rounded-2xl">
            현재 대기 중인 콜라보 제안이 없습니다.
          </div>
        ) : (
          <div className="space-y-4">
            {pendingProposals.map((prop) => (
              <div
                key={prop.id}
                className="flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl bg-amber-50/50 border border-amber-200 gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-md">
                      {prop.category}
                    </span>
                    <span className="text-xs font-bold text-gray-900">{prop.fromStore}</span>
                    <span className="text-[11px] text-gray-400 flex items-center gap-0.5">
                      <Clock className="h-3 w-3" /> {prop.createdAt}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-gray-900 text-base">{prop.proposedPackage}</h3>
                  <p className="text-xs text-gray-600">
                    예상 수수료 차감 후 예상 매출: <span className="font-bold text-indigo-600">{formatKRW(prop.estimatedRevenue)}</span>
                  </p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => handleProposalAction(prop.id, "accept")}
                    className="flex items-center space-x-1 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-extrabold text-white shadow hover:bg-emerald-500 transition"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>제안 수락</span>
                  </button>
                  <button
                    onClick={() => handleProposalAction(prop.id, "reject")}
                    className="flex items-center space-x-1 rounded-xl bg-gray-200 px-3 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-300 transition"
                  >
                    <XCircle className="h-4 w-4" />
                    <span>거절</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Navigation to other BIZ sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/owner/packages/new"
          className="rounded-3xl bg-indigo-950 p-6 text-white border border-indigo-800 shadow-md hover:brightness-110 transition space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-300">패키지 센터</span>
            <ArrowUpRight className="h-5 w-5 text-indigo-400 group-hover:translate-x-1 transition" />
          </div>
          <h3 className="text-lg font-black">AI 자동 추천 패키지 생성</h3>
          <p className="text-xs text-indigo-200">AI가 매장 유휴시간을 분석하여 초특가 패키지를 생성합니다.</p>
        </Link>

        <Link
          href="/owner/settlements"
          className="rounded-3xl bg-slate-900 p-6 text-white border border-slate-800 shadow-md hover:brightness-110 transition space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400">정산 센터</span>
            <ArrowUpRight className="h-5 w-5 text-amber-400 group-hover:translate-x-1 transition" />
          </div>
          <h3 className="text-lg font-black">자체 & 콜라보 패키지 정산</h3>
          <p className="text-xs text-slate-300">슬롯별 저장된 정산 스냅샷 내역을 한눈에 조회합니다.</p>
        </Link>

        <Link
          href="/owner/stores"
          className="rounded-3xl bg-slate-900 p-6 text-white border border-slate-800 shadow-md hover:brightness-110 transition space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400">매장 및 상품 설정</span>
            <ArrowUpRight className="h-5 w-5 text-emerald-400 group-hover:translate-x-1 transition" />
          </div>
          <h3 className="text-lg font-black">매장 정보 & 상품 관리</h3>
          <p className="text-xs text-slate-300">매장 기본 정보 수정 및 콜라보 가능 상품을 관리합니다.</p>
        </Link>
      </div>
    </div>
  );
}
