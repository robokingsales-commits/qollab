"use client";

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { formatKRW } from "@/lib/utils";
import { preparePortonePayment } from "@/lib/adapters/payment-adapter";
import { ShieldCheck, CreditCard, Lock, Ticket } from "lucide-react";

function CheckoutContent() {
  const router = useRouter();

  const [buyerName, setBuyerName] = useState("최도승");
  const [buyerPhone, setBuyerPhone] = useState("010-1234-5678");
  const [payMethod, setPayMethod] = useState<"KAKAO_PAY" | "NAVER_PAY" | "CARD">("KAKAO_PAY");
  const [processing, setProcessing] = useState(false);

  const orderNo = `QOLLAB-${Date.now()}`;
  const totalAmount = 49000;

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    try {
      const payload = await preparePortonePayment({
        orderId: `ord_${orderNo}`,
        orderNo,
        orderName: "성수 힐링 데이 결합 바우처 패키지",
        totalAmount,
        buyerName,
        buyerPhone,
        easyPayMethod: payMethod,
      });

      const res = await fetch("/api/payments/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentId: payload.paymentId,
          orderId: `ord_${orderNo}`,
          amount: totalAmount,
          slots: [
            { package_slot_id: "slot-demo-1", store_id: "store-demo-1", settle_amount: 19600 },
            { package_slot_id: "slot-demo-2", store_id: "store-demo-2", settle_amount: 29400 },
          ],
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert("결제 및 바우처 발급이 성공적으로 완료되었습니다!");
        router.push("/my-vouchers");
      } else {
        alert("결제 처리 중 오류가 발생했습니다: " + data.error);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Payment error";
      alert("결제 요청 에러: " + message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900">주문 / 원클릭 결제</h1>
        <p className="text-sm text-gray-500 mt-1">
          포트원 및 토스페이먼츠 간편결제로 결제 후 바우처가 즉시 발급됩니다.
        </p>
      </div>

      <form onSubmit={handlePayment} className="space-y-6">
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200 space-y-4">
          <h3 className="font-bold text-gray-900 text-lg border-b border-gray-100 pb-3 flex items-center space-x-2">
            <Ticket className="h-5 w-5 text-indigo-600" />
            <span>주문 정보</span>
          </h3>

          <div className="flex items-center justify-between text-sm">
            <div>
              <h4 className="font-bold text-gray-900">
                성수 힐링 데이 (유기농 두피 스파 & 루프탑 카페 패키지)
              </h4>
              <p className="text-xs text-gray-500 mt-0.5">성수 루프탑 카페 + 성수 아틀리에 헤어</p>
            </div>
            <span className="font-extrabold text-indigo-600 text-lg">
              {formatKRW(totalAmount)}
            </span>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200 space-y-4">
          <h3 className="font-bold text-gray-900 text-lg border-b border-gray-100 pb-3">
            구매자 정보 (알림톡 발송용)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                이름 *
              </label>
              <input
                type="text"
                required
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                휴대폰 번호 (알림톡 수신) *
              </label>
              <input
                type="text"
                required
                value={buyerPhone}
                onChange={(e) => setBuyerPhone(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200 space-y-4">
          <h3 className="font-bold text-gray-900 text-lg border-b border-gray-100 pb-3 flex items-center space-x-2">
            <CreditCard className="h-5 w-5 text-indigo-600" />
            <span>결제 수단 선택 (Portone Adapter)</span>
          </h3>

          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setPayMethod("KAKAO_PAY")}
              className={`p-4 rounded-xl border font-bold text-xs flex flex-col items-center justify-center space-y-2 transition ${
                payMethod === "KAKAO_PAY"
                  ? "bg-yellow-50 border-amber-400 text-amber-900 ring-2 ring-amber-400/30"
                  : "bg-gray-50 border-gray-200 text-gray-700"
              }`}
            >
              <span className="text-base">카카오페이</span>
            </button>

            <button
              type="button"
              onClick={() => setPayMethod("NAVER_PAY")}
              className={`p-4 rounded-xl border font-bold text-xs flex flex-col items-center justify-center space-y-2 transition ${
                payMethod === "NAVER_PAY"
                  ? "bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-500/30"
                  : "bg-gray-50 border-gray-200 text-gray-700"
              }`}
            >
              <span className="text-base">네이버페이</span>
            </button>

            <button
              type="button"
              onClick={() => setPayMethod("CARD")}
              className={`p-4 rounded-xl border font-bold text-xs flex flex-col items-center justify-center space-y-2 transition ${
                payMethod === "CARD"
                  ? "bg-indigo-50 border-indigo-600 text-indigo-900 ring-2 ring-indigo-500/30"
                  : "bg-gray-50 border-gray-200 text-gray-700"
              }`}
            >
              <span className="text-base">신용/체크카드</span>
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={processing}
          className="w-full flex items-center justify-center space-x-2 rounded-2xl bg-indigo-600 py-4 text-base font-extrabold text-white shadow-xl hover:bg-indigo-500 disabled:opacity-50 transition"
        >
          <Lock className="h-5 w-5" />
          <span>{processing ? "결제 승인 중..." : `${formatKRW(totalAmount)} 원클릭 결제하기`}</span>
        </button>

        <div className="flex items-center justify-center space-x-1 text-xs text-gray-400">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          <span>포트원 / 토스페이먼츠 100% 보안 암호화 결제</span>
        </div>
      </form>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="py-12 text-center text-gray-500">로딩 중...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
