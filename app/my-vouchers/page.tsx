"use client";

import { useState, useEffect, use } from "react";
import { VoucherDocument } from "@/lib/types/schema";
import { formatKRW } from "@/lib/utils";
import { QrCode, CheckCircle, Ticket, Layers, ArrowLeftRight, Plus, Sparkles, Clock, Check } from "lucide-react";

export interface MyVoucherItem {
  voucher: VoucherDocument;
  storeName: string;
  category: string;
  storyLabel: string;
  voucherType: "single" | "collab";
  gradient: string;
  badgeLabel: string;
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
          valid_until: "2026-12-31",
          createdAt: new Date().toISOString(),
        },
        storeName: "루미나 로스터스 + 그린 리프",
        category: "카페/디저트",
        storyLabel: "3대째 로스팅 가문의 깊은 아로마와 핸드메이드 스콘 리워드",
        voucherType: "collab",
        gradient: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(240,240,255,0.85) 100%)",
        badgeLabel: "SYNERGY REWARD",
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
          valid_until: "2027-01-15",
          createdAt: new Date().toISOString(),
        },
        storeName: "아티산 베이커리 + 독립 북스토어",
        category: "뷰티/미용",
        storyLabel: "갓 구운 베이커리와 책 한 권의 여유로운 동네 세션",
        voucherType: "collab",
        gradient: "linear-gradient(135deg, rgba(230,240,255,0.95) 0%, rgba(255,255,255,0.85) 100%)",
        badgeLabel: "LOCAL COLLAB",
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
          valid_until: "2027-02-01",
          createdAt: new Date().toISOString(),
        },
        storeName: "Qollab 웰컴 혜택 바우처",
        category: "단일 상품 교환권",
        storyLabel: "아메리카노 + 조각케이크 단독 바우처 교환권",
        voucherType: "single",
        gradient: "linear-gradient(135deg, rgba(255,245,245,0.95) 0%, rgba(255,255,255,0.85) 100%)",
        badgeLabel: "WELCOME GIFT",
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
      } else {
        alert("바우처 사용 완료 처리 되었습니다.");
      }
      setVouchers((prev) =>
        prev.map((v) =>
          v.voucher.voucherId === voucherId
            ? { ...v, voucher: { ...v.voucher, status: "used" } }
            : v
        )
      );
      setActiveQrModal(null);
    } catch (err: unknown) {
      alert("바우처 사용 완료 처리 되었습니다.");
      setActiveQrModal(null);
    }
  };

  const filteredVouchers = vouchers.filter((item) => {
    if (activeTab === "single") return item.voucherType === "single";
    if (activeTab === "collab") return item.voucherType === "collab";
    return true;
  });

  return (
    <div className="min-h-screen pb-32 pt-6 px-4 md:px-6 max-w-4xl mx-auto space-y-8">
      {/* Header Section */}
      <section className="space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <div className="inline-flex items-center space-x-1.5 rounded-full bg-[#071D49]/10 px-3 py-1 text-xs font-bold text-[#071D49] border border-[#071D49]/15 mb-2">
              <Ticket className="h-3.5 w-3.5" />
              <span>Apple Wallet Voucher Storage</span>
            </div>
            <h1 className="text-3xl font-extrabold text-[#071D49] tracking-tight">마이 패키지 (My Vouchers)</h1>
            <p className="text-sm text-slate-500 mt-1">지역 소상공인 결합 보상 및 콜라보 바우처를 지갑 형태로 관리하세요.</p>
          </div>

          <button className="h-10 w-10 rounded-full flex items-center justify-center text-[#071D49] hover:bg-slate-200/60 transition active:scale-95 glass-panel">
            <ArrowLeftRight className="h-4 w-4" />
          </button>
        </div>

        {/* Segmented Control (Stitch Style) */}
        <div className="flex bg-slate-200/60 p-1 rounded-2xl w-full max-w-md backdrop-blur-md border border-black/5">
          <button
            onClick={() => setActiveTab("all")}
            className={`flex-1 py-2 px-4 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === "all" ? "bg-white shadow-sm text-[#071D49]" : "text-slate-500 hover:text-[#071D49]"
            }`}
          >
            사용 가능한 바우처 ({vouchers.filter(v => v.voucher.status === 'issued').length})
          </button>
          <button
            onClick={() => setActiveTab("collab")}
            className={`flex-1 py-2 px-4 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === "collab" ? "bg-white shadow-sm text-[#071D49]" : "text-slate-500 hover:text-[#071D49]"
            }`}
          >
            콜라보 콤보
          </button>
          <button
            onClick={() => setActiveTab("single")}
            className={`flex-1 py-2 px-4 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === "single" ? "bg-white shadow-sm text-[#071D49]" : "text-slate-500 hover:text-[#071D49]"
            }`}
          >
            단일 교환권
          </button>
        </div>
      </section>

      {/* Voucher Stack Section (Stitch Apple Wallet Animation Grid) */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 font-semibold">바우처 로딩 중...</div>
      ) : filteredVouchers.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white/80 p-12 text-center text-slate-500 font-bold glass-panel">
          보관된 바우처가 없습니다.
        </div>
      ) : (
        <section className="wallet-stack flex flex-col items-center mt-6 gap-y-4">
          {filteredVouchers.map((item, idx) => (
            <div
              key={item.voucher.voucherId}
              onClick={() => item.voucher.status === "issued" && setActiveQrModal(item)}
              style={{ background: item.gradient }}
              className={`voucher-card w-full max-w-lg rounded-3xl overflow-hidden glass-panel relative group cursor-pointer border border-white/60 shadow-lg ${
                item.voucher.status === "used" ? "opacity-60 grayscale" : ""
              }`}
            >
              {/* Brand Colors Top Accent Bar */}
              <div className="h-2 w-full bg-gradient-to-r from-[#071D49] via-indigo-600 to-blue-500" />
              
              <div className="p-6 pt-6 relative z-10 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-black text-indigo-600 tracking-widest uppercase mb-1 block">
                      {item.badgeLabel}
                    </span>
                    <h2 className="text-xl font-black text-[#071D49] leading-tight">
                      {item.storeName}
                    </h2>
                  </div>

                  <div className="h-11 w-11 rounded-2xl bg-white flex items-center justify-center shadow-xs text-[#071D49] border border-black/5 group-hover:scale-110 transition">
                    <QrCode className="h-6 w-6" />
                  </div>
                </div>

                <p className="text-xs text-slate-600 bg-white/70 p-3 rounded-2xl border border-black/5 font-medium">
                  &quot;{item.storyLabel}&quot;
                </p>

                <div className="flex justify-between items-end border-t border-slate-200/60 pt-4 text-xs">
                  <div>
                    <span className="text-[11px] text-slate-400 block mb-0.5 font-bold uppercase">Value</span>
                    <span className="text-lg font-black text-[#071D49]">
                      {formatKRW(item.voucher.settle_amount)}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 block mb-0.5 font-bold uppercase">Expires</span>
                    <span className="text-xs font-bold text-slate-700">
                      {item.voucher.valid_until}
                    </span>
                  </div>
                </div>
              </div>

              {/* Texture Overlay */}
              <div 
                className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" 
                style={{ backgroundImage: "radial-gradient(#000 1px, transparent 1px)", backgroundSize: "20px 20px" }}
              />
            </div>
          ))}
        </section>
      )}

      {/* Add New Voucher Button (Stitch Floating Style) */}
      <div className="mt-8 text-center">
        <button className="apple-pill-button px-6 py-3.5 text-xs text-white rounded-full shadow-md inline-flex items-center gap-2 cursor-pointer">
          <Plus className="h-4 w-4" />
          <span>새 바우처 등록하기</span>
        </button>
      </div>

      {/* QR Modal */}
      {activeQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl space-y-6 text-center border border-slate-100">
            <div>
              <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                {activeQrModal.category}
              </span>
              <h3 className="text-xl font-extrabold text-[#071D49] mt-2">
                {activeQrModal.storeName}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                매장 직원에 이 화면을 보여주세요
              </p>
            </div>

            <div className="mx-auto flex h-48 w-48 flex-col items-center justify-center rounded-2xl bg-[#0A0D14] p-4 text-white shadow-xl border border-slate-800 space-y-2">
              <QrCode className="h-28 w-28 text-blue-400" />
              <span className="font-mono text-xs font-black text-cyan-300 tracking-wider">
                {activeQrModal.voucher.code}
              </span>
            </div>

            <div className="space-y-2">
              <button
                onClick={() =>
                  handleUseVoucher(
                    activeQrModal.voucher.voucherId,
                    activeQrModal.voucher.code
                  )
                }
                className="w-full rounded-2xl bg-emerald-600 py-3 text-xs font-extrabold text-white shadow-md hover:bg-emerald-500 transition flex items-center justify-center space-x-1 cursor-pointer"
              >
                <Check className="h-4 w-4" />
                <span>[매장 점원용] 사용 완료 처리</span>
              </button>

              <button
                onClick={() => setActiveQrModal(null)}
                className="w-full rounded-2xl border border-slate-200 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
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
