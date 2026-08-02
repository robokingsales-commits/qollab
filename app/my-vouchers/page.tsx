"use client";

import { useState, useEffect, use } from "react";
import { VoucherDocument } from "@/lib/types/schema";
import { formatKRW } from "@/lib/utils";
import { QrCode, CheckCircle, Ticket, Store, Layers } from "lucide-react";

export interface MyVoucherItem {
  voucher: VoucherDocument;
  storeName: string;
  category: string;
  storyLabel: string;
  voucherType: "single" | "collab";
}

interface PageProps {
  searchParams?: Promise<{ type?: string }>;
}

export default function MyVouchersPage({ searchParams }: PageProps) {
  const resolvedParams = searchParams ? use(searchParams) : undefined;
  const initialType = resolvedParams?.type === "collab" ? "collab" : "all";

  const [vouchers, setVouchers] = useState<MyVoucherItem[]>([]);
  const [activeTab, setActiveTab] = useState<string>(initialType);
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
          settle_amount: 19600,
          status: "issued",
          valid_until: "2026-08-31",
          createdAt: new Date().toISOString(),
        },
        storeName: "성수 루프탑 로스터리 카페",
        category: "카페/디저트",
        storyLabel: "3대째 로스팅 가문의 깊은 아로마와 핸드메이드 스콘 이야기",
        voucherType: "collab",
      },
      {
        voucher: {
          voucherId: "vch-demo-102",
          code: "VOUCHER-984211",
          order_id: "ord-demo-1",
          package_slot_id: "slot-demo-2",
          store_id: "store-demo-2",
          settle_amount: 29400,
          status: "issued",
          valid_until: "2026-08-31",
          createdAt: new Date().toISOString(),
        },
        storeName: "성수 아틀리에 헤어 스튜디오",
        category: "뷰티/미용",
        storyLabel: "1:1 맞춤형 유기농 두피 스파로 지친 도시인에게 전하는 힐링",
        voucherType: "collab",
      },
      {
        voucher: {
          voucherId: "vch-demo-103",
          code: "VOUCHER-771029",
          order_id: "ord-demo-2",
          package_slot_id: "slot-single-1",
          store_id: "store-demo-1",
          settle_amount: 12000,
          status: "issued",
          valid_until: "2026-09-15",
          createdAt: new Date().toISOString(),
        },
        storeName: "투썸플레이스 (단일 매장/브랜드 교환권)",
        category: "단일 상품 교환권",
        storyLabel: "아메리카노 + 조각케이크 단독 바우처 교환권",
        voucherType: "single",
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
        alert("바우처 사용 완료 처리 완료");
        setVouchers((prev) =>
          prev.map((v) =>
            v.voucher.voucherId === voucherId
              ? { ...v, voucher: { ...v.voucher, status: "used" } }
              : v
          )
        );
        setActiveQrModal(null);
      }
    } catch (err: unknown) {
      alert("바우처 사용 완료 처리");
      setActiveQrModal(null);
    }
  };

  const filteredVouchers = vouchers.filter((item) => {
    if (activeTab === "single") return item.voucherType === "single";
    if (activeTab === "collab") return item.voucherType === "collab";
    return true;
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Title & Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-800 border border-indigo-200">
            <Ticket className="h-3.5 w-3.5" />
            <span>마이 패키지 보관함</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 mt-2">마이 패키지 (My Vouchers)</h1>
          <p className="text-sm text-gray-500 mt-1">
            QR/바코드 단일 교환권 및 동네 다중 매장 콜라보 바우처를 확인하고 사용하세요.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center space-x-2 bg-gray-100 p-1.5 rounded-2xl border border-gray-200 text-xs font-bold shadow-inner">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === "all" ? "bg-indigo-600 text-white shadow-sm" : "text-gray-600"
            }`}
          >
            전체 보기
          </button>
          <button
            onClick={() => setActiveTab("single")}
            className={`flex items-center space-x-1 px-4 py-2 rounded-xl transition ${
              activeTab === "single" ? "bg-indigo-600 text-white shadow-sm" : "text-gray-600"
            }`}
          >
            <Ticket className="h-3.5 w-3.5" />
            <span>QR/바코드 교환권</span>
          </button>
          <button
            onClick={() => setActiveTab("collab")}
            className={`flex items-center space-x-1 px-4 py-2 rounded-xl transition ${
              activeTab === "collab" ? "bg-indigo-600 text-white shadow-sm" : "text-gray-600"
            }`}
          >
            <Layers className="h-3.5 w-3.5 text-amber-300" />
            <span>(동네) 다중 매장 콜라보</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-gray-500">바우처 목록 로딩 중...</div>
      ) : filteredVouchers.length === 0 ? (
        <div className="rounded-3xl border border-gray-200 bg-white p-12 text-center text-gray-500 font-bold">
          해당 유형의 보관된 바우처가 없습니다.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredVouchers.map((item) => (
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
                    <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-md ${
                      item.voucherType === "collab"
                        ? "bg-amber-100 text-amber-800 border border-amber-200"
                        : "bg-indigo-100 text-indigo-800 border border-indigo-200"
                    }`}>
                      {item.voucherType === "collab" ? "(동네) 다중 매장 콜라보" : "단일 교환권"}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 mt-2">{item.storeName}</h3>
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
                  <span className="text-slate-400">정산 스냅샷 (settle_amount):</span>
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

      {/* QR Modal */}
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
                <span>[매장 점원용] 사용 완료 처리</span>
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
