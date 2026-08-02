"use client";

import { useState, useEffect, use } from "react";
import { SettlementDocument } from "@/lib/types/schema";
import { formatKRW } from "@/lib/utils";
import { DollarSign, CheckCircle2, ShieldCheck, FileText, Send, PieChart, Store, Layers } from "lucide-react";

interface SettlementExt extends SettlementDocument {
  settlementType: "single" | "collab";
  packageName?: string;
}

interface PageProps {
  searchParams?: Promise<{ type?: string }>;
}

export default function OwnerSettlementsPage({ searchParams }: PageProps) {
  const resolvedParams = searchParams ? use(searchParams) : undefined;
  const initialType = resolvedParams?.type === "collab" ? "collab" : "all";

  const [settlements, setSettlements] = useState<SettlementExt[]>([]);
  const [activeTab, setActiveTab] = useState<string>(initialType);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sampleSettlements: SettlementExt[] = [
      {
        settlementId: "stl-demo-2026-07-W4",
        store_id: "store-demo-1",
        period_start: "2026-07-21",
        period_end: "2026-07-27",
        voucher_count: 14,
        gross_amount: 274400,
        net_amount: 246960,
        status: "notified",
        settlementType: "collab",
        packageName: "성수 힐링 일일 패키지 (카페 + 헤어스파)",
        createdAt: new Date().toISOString(),
      },
      {
        settlementId: "stl-demo-2026-07-W3",
        store_id: "store-demo-1",
        period_start: "2026-07-14",
        period_end: "2026-07-20",
        voucher_count: 22,
        gross_amount: 431200,
        net_amount: 388080,
        status: "paid",
        settlementType: "single",
        packageName: "성수 루프탑 로스터리 1인 시그니처 콤보",
        createdAt: new Date().toISOString(),
      },
    ];
    setSettlements(sampleSettlements);
    setLoading(false);
  }, []);

  const handleAgreeSettlement = (settlementId: string) => {
    setSettlements((prev) =>
      prev.map((s) => (s.settlementId === settlementId ? { ...s, status: "agreed" } : s))
    );
    alert("정산 내역 승인이 완료되었습니다. 지정된 주간 정산일에 계좌로 입금됩니다.");
  };

  const filteredSettlements = settlements.filter((s) => {
    if (activeTab === "single") return s.settlementType === "single";
    if (activeTab === "collab") return s.settlementType === "collab";
    return true;
  });

  const getStatusStep = (status: SettlementDocument["status"]) => {
    switch (status) {
      case "notified":
        return (
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800 border border-amber-200">
            정산 내역 확인 대기중 (알림톡 발송 완료)
          </span>
        );
      case "agreed":
        return (
          <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-800 border border-indigo-200">
            점주 승인 완료 (입금 대기)
          </span>
        );
      case "paid":
        return (
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-200">
            계좌 입금 완료
          </span>
        );
      default:
        return (
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-700">
            정산 작성중
          </span>
        );
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Title & Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800 border border-amber-200">
            <PieChart className="h-3.5 w-3.5" />
            <span>BIZ 정산 센터</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 mt-2">정산 센터 (Settlement Center)</h1>
          <p className="text-sm text-gray-500 mt-1">
            단일 매장 자체 패키지 정산 및 다른 매장/제품과 콜라보한 패키지의 슬롯별 정산 내역을 조회합니다.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center space-x-2 bg-gray-100 p-1.5 rounded-2xl border border-gray-200 text-xs font-bold shadow-inner">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === "all" ? "bg-amber-500 text-white shadow-sm" : "text-gray-600"
            }`}
          >
            전체 정산
          </button>
          <button
            onClick={() => setActiveTab("single")}
            className={`flex items-center space-x-1 px-4 py-2 rounded-xl transition ${
              activeTab === "single" ? "bg-amber-500 text-white shadow-sm" : "text-gray-600"
            }`}
          >
            <Store className="h-3.5 w-3.5" />
            <span>단일 매장 자체 정산</span>
          </button>
          <button
            onClick={() => setActiveTab("collab")}
            className={`flex items-center space-x-1 px-4 py-2 rounded-xl transition ${
              activeTab === "collab" ? "bg-amber-500 text-white shadow-sm" : "text-gray-600"
            }`}
          >
            <Layers className="h-3.5 w-3.5 text-indigo-200" />
            <span>콜라보 패키지 정산</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-3xl bg-slate-900 p-6 text-white shadow-xl space-y-3 border border-slate-800">
          <div className="flex items-center justify-between text-amber-300 text-xs font-bold">
            <span>이번주 예정 정산금</span>
            <DollarSign className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-amber-400">
            {formatKRW(settlements[0]?.net_amount || 0)}
          </div>
          <p className="text-xs text-slate-400">
            총 {settlements[0]?.voucher_count || 0}건의 바우처 사용 완료 (수수료 차감 완료)
          </p>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm border border-gray-200 space-y-3">
          <div className="flex items-center justify-between text-gray-500 text-xs font-bold">
            <span>누적 입금 완료 금액</span>
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-black text-gray-900">
            {formatKRW(settlements.filter((s) => s.status === "paid").reduce((acc, cur) => acc + cur.net_amount, 0))}
          </div>
          <p className="text-xs text-gray-400">정상 지급 완료된 이력 건수</p>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm border border-gray-200 space-y-3">
          <div className="flex items-center justify-between text-gray-500 text-xs font-bold">
            <span>알림톡 승인 연결</span>
            <Send className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="text-sm font-bold text-gray-900">매주 월요일 09:00 정산 알림톡</div>
          <p className="text-xs text-gray-400">원클릭 주간 정산 승인 프로세스 지원</p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
          <FileText className="h-5 w-5 text-amber-600" />
          <span>주간 정산 명세서 목록 ({filteredSettlements.length}건)</span>
        </h3>

        {loading ? (
          <div className="py-12 text-center text-gray-500">정산 목록 로딩 중...</div>
        ) : filteredSettlements.length === 0 ? (
          <div className="rounded-3xl bg-white p-8 text-center text-xs text-gray-500 border border-gray-200 font-bold">
            선택된 유형의 정산 내역이 없습니다.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSettlements.map((item) => (
              <div
                key={item.settlementId}
                className="rounded-3xl bg-white p-6 shadow-sm border border-gray-200 space-y-4 hover:shadow-md transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4">
                  <div>
                    <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-md ${
                      item.settlementType === "collab"
                        ? "bg-indigo-100 text-indigo-800 border border-indigo-200"
                        : "bg-amber-100 text-amber-800 border border-amber-200"
                    }`}>
                      {item.settlementType === "collab" ? "콜라보 패키지 정산" : "단일 매장 자체 정산"}
                    </span>
                    <h4 className="text-lg font-bold text-gray-900 mt-1">
                      {item.packageName || `정산 기간: ${item.period_start} ~ ${item.period_end}`}
                    </h4>
                    <p className="text-xs text-gray-400">정산 ID: {item.settlementId} | 기간: {item.period_start} ~ {item.period_end}</p>
                  </div>
                  <div>{getStatusStep(item.status)}</div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-600">
                  <div>
                    <span className="block font-semibold text-gray-400">사용 완료 바우처</span>
                    <span className="text-sm font-bold text-gray-900">{item.voucher_count}건</span>
                  </div>
                  <div>
                    <span className="block font-semibold text-gray-400">총 정산액 (Gross)</span>
                    <span className="text-sm font-bold text-gray-900">{formatKRW(item.gross_amount)}</span>
                  </div>
                  <div>
                    <span className="block font-semibold text-gray-400">플랫폼 수수료</span>
                    <span className="text-sm font-bold text-rose-500">
                      -{formatKRW(item.gross_amount - item.net_amount)} (10%)
                    </span>
                  </div>
                  <div>
                    <span className="block font-semibold text-indigo-600">실지급 예정액 (Net)</span>
                    <span className="text-base font-black text-indigo-600">
                      {formatKRW(item.net_amount)}
                    </span>
                  </div>
                </div>

                {item.status === "notified" && (
                  <div className="flex justify-end pt-3 border-t border-gray-100">
                    <button
                      onClick={() => handleAgreeSettlement(item.settlementId)}
                      className="flex items-center space-x-2 rounded-xl bg-amber-500 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-amber-400 transition"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      <span>정산 내역 동의 및 승인하기</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
