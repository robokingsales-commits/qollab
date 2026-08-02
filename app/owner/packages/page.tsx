"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Boxes, 
  Sparkles, 
  Plus, 
  Store, 
  PieChart, 
  CheckCircle, 
  XCircle, 
  ChevronRight,
  TrendingUp,
  BarChart3
} from "lucide-react";
import { formatKRW } from "@/lib/utils";

export default function PackageCenterPage() {
  const [activeTab, setActiveTab] = useState<"active" | "proposals" | "stats">("active");

  const [activePackages] = useState([
    {
      id: "pkg-owner-1",
      title: "성수 루프탑 로스터리 1인 시그니처 콤보",
      type: "자체 상품 묶음",
      price: 19600,
      salesCount: 42,
      totalRevenue: 823200,
      status: "진행 중",
    },
    {
      id: "pkg-owner-2",
      title: "성수 힐링 일일 패키지 (카페 + 1:1 두피 스파)",
      type: "직접 지정 콜라보",
      price: 49000,
      salesCount: 28,
      totalRevenue: 1372000,
      partner: "성수 아틀리에 헤어 스튜디오",
      status: "진행 중",
    },
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800 border border-amber-200">
            <Boxes className="h-3.5 w-3.5" />
            <span>BIZ 패키지 센터</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 mt-2">패키지 센터 (Package Center)</h1>
          <p className="text-sm text-gray-500 mt-1">
            AI 자동 추천 생성, 자체 상품 묶음, 직접 지정 콜라보 패키지를 등록하고 판매 성과를 분석하세요.
          </p>
        </div>

        <Link
          href="/owner/packages/new"
          className="flex items-center space-x-2 rounded-2xl bg-amber-500 hover:bg-amber-400 px-5 py-3 text-xs font-black text-white shadow-lg transition"
        >
          <Plus className="h-4 w-4" />
          <span>신규 패키지 만들기</span>
        </Link>
      </div>

      {/* Package Creation Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/owner/packages/new?mode=ai"
          className="rounded-3xl bg-gradient-to-br from-indigo-900 to-slate-900 p-6 text-white border border-indigo-700 shadow-md hover:scale-[1.02] transition space-y-3"
        >
          <div className="p-3 rounded-2xl bg-indigo-600/30 w-fit text-indigo-300 border border-indigo-500/30">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">추천 방식 1</span>
            <h3 className="text-xl font-black text-white">AI 자동 추천 생성</h3>
            <p className="text-xs text-indigo-200 mt-1 leading-relaxed">
              매장의 유휴시간 데이터와 인근 매장 수요를 분석하여 AI가 최적의 결합 패키지 및 가격을 자동 생성합니다.
            </p>
          </div>
          <div className="pt-2 flex items-center text-xs font-bold text-indigo-300">
            <span>AI 추천 빌더 실행</span>
            <ChevronRight className="h-4 w-4 ml-1" />
          </div>
        </Link>

        <Link
          href="/owner/packages/new?mode=self"
          className="rounded-3xl bg-white p-6 border border-gray-200 shadow-sm hover:border-amber-400 transition space-y-3"
        >
          <div className="p-3 rounded-2xl bg-amber-50 text-amber-600 w-fit">
            <Boxes className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">추천 방식 2</span>
            <h3 className="text-xl font-black text-gray-900">자체 상품 묶음</h3>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              우리 매장 내부의 인기 메뉴나 서비스를 자체 묶어 바우처 패키지로 출시합니다.
            </p>
          </div>
          <div className="pt-2 flex items-center text-xs font-bold text-amber-600">
            <span>자체 상품 구성하기</span>
            <ChevronRight className="h-4 w-4 ml-1" />
          </div>
        </Link>

        <Link
          href="/owner/packages/new?mode=collab"
          className="rounded-3xl bg-white p-6 border border-gray-200 shadow-sm hover:border-emerald-400 transition space-y-3"
        >
          <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 w-fit">
            <Store className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">추천 방식 3</span>
            <h3 className="text-xl font-black text-gray-900">직접 지정 콜라보</h3>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              제휴를 맺을 인근 매장을 직접 지정하여 1:1 맞춤형 교환권 콜라보 제안을 발송합니다.
            </p>
          </div>
          <div className="pt-2 flex items-center text-xs font-bold text-emerald-600">
            <span>콜라보 지정하기</span>
            <ChevronRight className="h-4 w-4 ml-1" />
          </div>
        </Link>
      </div>

      {/* Package Management Tabs & Lists */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 border-b border-gray-200 pb-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab("active")}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === "active"
                ? "bg-amber-500 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900 bg-gray-100"
            }`}
          >
            진행 중인 패키지 ({activePackages.length})
          </button>
          <button
            onClick={() => setActiveTab("proposals")}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === "proposals"
                ? "bg-amber-500 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900 bg-gray-100"
            }`}
          >
            받은 콜라보 제안 (2)
          </button>
          <button
            onClick={() => setActiveTab("stats")}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === "stats"
                ? "bg-amber-500 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900 bg-gray-100"
            }`}
          >
            판매 통계 및 성과 분석
          </button>
        </div>

        {activeTab === "active" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activePackages.map((pkg) => (
              <div key={pkg.id} className="rounded-3xl bg-white p-6 border border-gray-200 shadow-sm space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-extrabold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                      {pkg.type}
                    </span>
                    <h3 className="text-lg font-black text-gray-900 mt-2">{pkg.title}</h3>
                    {pkg.partner && (
                      <p className="text-xs text-indigo-600 font-bold mt-1">파트너: {pkg.partner}</p>
                    )}
                  </div>
                  <span className="rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1">
                    {pkg.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded-2xl text-xs">
                  <div>
                    <span className="text-gray-400 block">총 누적 판매:</span>
                    <span className="font-extrabold text-gray-900">{pkg.salesCount} 건</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">누적 매출:</span>
                    <span className="font-extrabold text-indigo-600">{formatKRW(pkg.totalRevenue)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "proposals" && (
          <div className="rounded-3xl bg-white p-6 border border-gray-200 shadow-sm space-y-3">
            <h3 className="font-extrabold text-gray-900 text-sm">받은 콜라보 제안 수락 또는 거절</h3>
            <p className="text-xs text-gray-500">인근 매장 또는 AI 시스템에서 발송한 콜라보 매칭 요청입니다.</p>
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs flex items-center justify-between">
              <div>
                <span className="font-bold text-amber-900">성수 아틀리에 헤어 스튜디오</span>
                <p className="text-gray-700 font-medium">제안: 루프탑 핸드드립 + 1:1 유기농 헤어 두피 스파</p>
              </div>
              <div className="flex space-x-2">
                <button className="bg-emerald-600 text-white font-bold px-3 py-1.5 rounded-xl text-xs">수락</button>
                <button className="bg-gray-200 text-gray-700 font-bold px-3 py-1.5 rounded-xl text-xs">거절</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "stats" && (
          <div className="rounded-3xl bg-white p-6 border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 text-indigo-600">
              <BarChart3 className="h-5 w-5" />
              <h3 className="font-extrabold text-gray-900 text-base">패키지별 판매 통계 및 성과 분석</h3>
            </div>
            <div className="rounded-2xl bg-slate-900 p-5 text-white text-xs space-y-3">
              <p className="text-slate-300">• 이번 달 가장 많은 전환을 일으킨 패키지: <span className="text-amber-400 font-bold">성수 힐링 일일 패키지</span></p>
              <p className="text-slate-300">• 콜라보를 통한 평균 유휴시간 소진율: <span className="text-emerald-400 font-bold">+64.2%</span></p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
