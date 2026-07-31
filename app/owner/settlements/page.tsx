"use client";

import { useState, useEffect } from "react";
import { SettlementDocument } from "@/lib/types/schema";
import { formatKRW } from "@/lib/utils";
import { DollarSign, CheckCircle2, ShieldCheck, FileText, Send } from "lucide-react";

export default function OwnerSettlementsPage() {
  const [settlements, setSettlements] = useState<SettlementDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sampleSettlements: SettlementDocument[] = [
      {
        settlementId: "stl-demo-2026-07-W4",
        store_id: "store-demo-1",
        period_start: "2026-07-21",
        period_end: "2026-07-27",
        voucher_count: 14,
        gross_amount: 274400,
        net_amount: 246960,
        status: "notified",
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
      case "disputed":
        return (
          <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-800 border border-rose-200">
            정산 이의 제기중
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
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900">정산 센터 (캐시노트 스타일)</h1>
        <p className="text-sm text-gray-500 mt-1">
          사용 처리된 바우처의 정산 내역 확인 및 주간 정산금 승인/입금 상태 조회
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-3xl bg-gradient-to-br from-indigo-900 to-slate-900 p-6 text-white shadow-xl space-y-3">
          <div className="flex items-center justify-between text-indigo-300 text-xs font-bold">
            <span>이번주 예정 정산금</span>
            <DollarSign className="h-4 w-4" />
          </div>
          <div className="text-3xl font-black text-amber-400">
            {formatKRW(settlements[0]?.net_amount || 0)}
          </div>
          <p className="text-xs text-indigo-200">
            총 {settlements[0]?.voucher_count || 0}건의 바우처 사용 완료 (수수료 10% 차감 후)
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
          <p className="text-xs text-gray-400">솔라피 알림톡을 통한 원클릭 승인 지원</p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
          <FileText className="h-5 w-5 text-indigo-600" />
          <span>주간 정산 명세서 목록</span>
        </h3>

        {loading ? (
          <div className="py-12 text-center text-gray-500">정산 목록 로딩 중...</div>
        ) : (
          <div className="space-y-4">
            {settlements.map((item) => (
              <div
                key={item.settlementId}
                className="rounded-3xl bg-white p-6 shadow-sm border border-gray-200 space-y-4 hover:shadow-md transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4">
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">
                      정산 기간: {item.period_start} ~ {item.period_end}
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">정산 ID: {item.settlementId}</p>
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
                      className="flex items-center space-x-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-500 transition"
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
