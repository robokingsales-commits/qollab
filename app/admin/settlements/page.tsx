"use client";

import { useState, useEffect } from "react";
import { SettlementDocument } from "@/lib/types/schema";
import { formatKRW } from "@/lib/utils";
import { CheckCircle, RefreshCw } from "lucide-react";

export default function AdminSettlementsPage() {
  const [settlements, setSettlements] = useState<SettlementDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sampleAdminSettlements: SettlementDocument[] = [
      {
        settlementId: "stl-demo-2026-07-W4",
        store_id: "store-demo-1",
        period_start: "2026-07-21",
        period_end: "2026-07-27",
        voucher_count: 14,
        gross_amount: 274400,
        net_amount: 246960,
        status: "agreed",
        createdAt: new Date().toISOString(),
      },
      {
        settlementId: "stl-demo-2026-07-W3",
        store_id: "store-demo-2",
        period_start: "2026-07-14",
        period_end: "2026-07-20",
        voucher_count: 22,
        gross_amount: 431200,
        net_amount: 388080,
        status: "paid",
        createdAt: new Date().toISOString(),
      },
    ];
    setSettlements(sampleAdminSettlements);
    setLoading(false);
  }, []);

  const handleExecutePayout = (settlementId: string) => {
    setSettlements((prev) =>
      prev.map((s) => (s.settlementId === settlementId ? { ...s, status: "paid" } : s))
    );
    alert("입금 처리 지급 완료가 승인되었습니다.");
  };

  const handleGenerateBatch = () => {
    alert("전체 매장 대상 주간 정산 명세서 자동 생성 및 알림톡 발송이 완료되었습니다!");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">어드민 정산 집계 및 지급 센터</h1>
          <p className="text-sm text-gray-500">
            전체 입점 매장의 정산 내역 집계, 알림톡 일괄 발송 및 입금 처리
          </p>
        </div>

        <button
          onClick={handleGenerateBatch}
          className="flex items-center space-x-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-500 transition"
        >
          <RefreshCw className="h-4 w-4" />
          <span>주간 정산 일괄 집계 실행</span>
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-gray-500">로딩 중...</div>
      ) : (
        <div className="space-y-4">
          {settlements.map((item) => (
            <div
              key={item.settlementId}
              className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200 space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    매장 ID: {item.store_id} ({item.period_start} ~ {item.period_end})
                  </h3>
                  <p className="text-xs text-gray-500">정산 ID: {item.settlementId}</p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-extrabold ${
                    item.status === "paid"
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                      : item.status === "agreed"
                      ? "bg-indigo-100 text-indigo-800 border border-indigo-200"
                      : "bg-amber-100 text-amber-800 border border-amber-200"
                  }`}
                >
                  {item.status === "paid"
                    ? "지급 완료"
                    : item.status === "agreed"
                    ? "점주 승인 (입금 준비)"
                    : "점주 확인 대기"}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-600">
                <div>
                  <span className="font-semibold text-gray-900">바우처 수량:</span> {item.voucher_count}건
                </div>
                <div>
                  <span className="font-semibold text-gray-900">총 정산액:</span> {formatKRW(item.gross_amount)}
                </div>
                <div>
                  <span className="font-semibold text-gray-900">수수료 (10%):</span> -{formatKRW(item.gross_amount - item.net_amount)}
                </div>
                <div>
                  <span className="font-bold text-indigo-600">최종 지급액:</span>{" "}
                  <span className="text-sm font-extrabold">{formatKRW(item.net_amount)}</span>
                </div>
              </div>

              {item.status === "agreed" && (
                <div className="flex justify-end pt-3 border-t border-gray-100">
                  <button
                    onClick={() => handleExecutePayout(item.settlementId)}
                    className="flex items-center space-x-1.5 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow hover:bg-emerald-500 transition"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>지급 완료 (계좌 입금 확정 처리)</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
