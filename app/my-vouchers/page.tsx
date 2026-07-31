"use client";

import { useState, useEffect } from "react";
import { VoucherDocument } from "@/lib/types/schema";
import { formatKRW } from "@/lib/utils";
import { QrCode, CheckCircle } from "lucide-react";

export interface MyVoucherItem {
  voucher: VoucherDocument;
  storeName: string;
  category: string;
  storyLabel: string;
}

export default function MyVouchersPage() {
  const [vouchers, setVouchers] = useState<MyVoucherItem[]>([]);
  const [activeQrModal, setActiveQrModal] = useState<MyVoucherItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sampleVouchers: MyVoucherItem[] = [
      {
        voucher: {
          voucherId: "vch-demo-101",
          code: "VOUCHER-984210",
          order_id: "ord-demo-1",
          package_slot_id: "slot-demo-1",
          store_id: "store-demo-1",
          settle_amount: 19600, // SNAPSHOT SAVED
          status: "issued",
          valid_until: "2026-08-31",
          createdAt: new Date().toISOString(),
        },
        storeName: "성수 루프탑 로스터리 카페",
        category: "카페/디저트",
        storyLabel: "3대째 로스팅 가문의 깊은 아로마와 핸드메이드 스콘 이야기",
      },
      {
        voucher: {
          voucherId: "vch-demo-102",
          code: "VOUCHER-984211",
          order_id: "ord-demo-1",
          package_slot_id: "slot-demo-2",
          store_id: "store-demo-2",
          settle_amount: 29400, // SNAPSHOT SAVED
          status: "issued",
          valid_until: "2026-08-31",
          createdAt: new Date().toISOString(),
        },
        storeName: "성수 아틀리에 헤어 스튜디오",
        category: "뷰티/미용",
        storyLabel: "1:1 맞춤형 유기농 두피 스파로 지친 도시인에게 전하는 힐링",
      },
    ];
    setVouchers(sampleVouchers);
    setLoading(false);
  }, []);

  const handleUseVoucher = async (voucherId: string, code: string) => {
    try {
      const res = await fetch("/api/vouchers/use", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voucherId, code }),
      });
      const data = await res.json();
      if (data.success) {
        alert("원자적 db.runTransaction()을 통해 바우처 사용 처리가 완료되었습니다!");
        setVouchers((prev) =>
          prev.map((v) =>
            v.voucher.voucherId === voucherId
              ? { ...v, voucher: { ...v.voucher, status: "used" } }
              : v
          )
        );
        setActiveQrModal(null);
      } else {
        alert("바우처 사용 실패: " + data.error);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Voucher use error";
      alert("바우처 사용 실패: " + message);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900">내 보관함 (결합 바우처)</h1>
        <p className="text-sm text-gray-500 mt-1">
          매장 방문 시 바우처 QR/바코드를 제시하여 즉시 사용하실 수 있습니다.
        </p>
      </div>

      {loading ? (
        <div className="py-12 text-center text-gray-500">바우처 목록 로딩 중...</div>
      ) : vouchers.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center text-gray-500">
          보관된 바우처가 없습니다.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {vouchers.map((item) => (
            <div
              key={item.voucher.voucherId}
              className={`rounded-3xl bg-white p-6 shadow-sm border transition ${
                item.voucher.status === "used"
                  ? "border-gray-200 opacity-60 bg-gray-50"
                  : "border-indigo-200 hover:shadow-md"
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-semibold text-indigo-600">
                      {item.category}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900">{item.storeName}</h3>
                  </div>

                  {item.voucher.status === "issued" ? (
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-extrabold text-emerald-800 border border-emerald-200">
                      사용 가능
                    </span>
                  ) : (
                    <span className="rounded-full bg-gray-200 px-3 py-1 text-xs font-bold text-gray-700">
                      사용 완료
                    </span>
                  )}
                </div>

                <p className="text-xs text-amber-900 bg-amber-50 p-2.5 rounded-xl border border-amber-200 font-medium italic">
                  &quot;{item.storyLabel}&quot;
                </p>

                <div className="rounded-xl bg-slate-900 p-3 text-white flex items-center justify-between text-xs">
                  <span className="text-slate-400">정산 스냅샷 (vouchers.settle_amount):</span>
                  <span className="font-extrabold text-amber-400">
                    {formatKRW(item.voucher.settle_amount)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                  <span>유효기간: ~{item.voucher.valid_until}</span>
                  <span className="font-mono font-bold text-gray-700">{item.voucher.code}</span>
                </div>

                {item.voucher.status === "issued" && (
                  <button
                    onClick={() => setActiveQrModal(item)}
                    className="w-full flex items-center justify-center space-x-2 rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white shadow-md hover:bg-indigo-500 transition"
                  >
                    <QrCode className="h-4 w-4" />
                    <span>QR 바코드 제시 및 사용하기</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl space-y-6 text-center">
            <div>
              <span className="text-xs font-semibold text-indigo-600">
                {activeQrModal.category}
              </span>
              <h3 className="text-xl font-extrabold text-gray-900 mt-1">
                {activeQrModal.storeName}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                매장 직원에 이 화면을 보여주세요
              </p>
            </div>

            <div className="mx-auto flex h-48 w-48 flex-col items-center justify-center rounded-2xl bg-slate-900 p-4 text-white shadow-inner border border-slate-800 space-y-2">
              <QrCode className="h-28 w-28 text-indigo-400" />
              <span className="font-mono text-sm font-extrabold text-amber-400 tracking-wider">
                {activeQrModal.voucher.code}
              </span>
            </div>

            <div className="space-y-3">
              <button
                onClick={() =>
                  handleUseVoucher(
                    activeQrModal.voucher.voucherId,
                    activeQrModal.voucher.code
                  )
                }
                className="w-full rounded-xl bg-emerald-600 py-3 text-xs font-extrabold text-white shadow-lg hover:bg-emerald-500 transition flex items-center justify-center space-x-1"
              >
                <CheckCircle className="h-4 w-4" />
                <span>[매장 점원용] 원자적 트랜잭션 사용 처리</span>
              </button>

              <button
                onClick={() => setActiveQrModal(null)}
                className="w-full rounded-xl border border-gray-300 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
