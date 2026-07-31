"use client";

import { useParams, useRouter } from "next/navigation";
import PackageItineraryMap from "@/components/PackageItineraryMap";
import { StoreDocument, PackageDocument } from "@/lib/types/schema";
import { formatKRW } from "@/lib/utils";
import { Sparkles, MapPin, Ticket, ShieldCheck, Zap, Clock, Store } from "lucide-react";

export default function PackageDetailPage() {
  const params = useParams();
  const router = useRouter();
  const packageId = params.packageId as string;

  const mockPackage: PackageDocument = {
    packageId: packageId || "pkg-demo-1",
    title: "성수 힐링 데이 (유기농 두피 스파 & 루프탑 카페 패키지)",
    region: "서울 성동구 성수동",
    headcount: 2,
    list_total: 69000,
    sale_price: 49000,
    fee_rate: 0.1,
    stock: 35,
    valid_from: "2026-08-01",
    valid_to: "2026-08-31",
    status: "open",
    createdAt: new Date().toISOString(),
  };

  const mockStoresWithItinerary: {
    store: StoreDocument;
    slotRole: "anchor" | "rider";
    orderIndex: number;
    travelTimeFromPrev?: string;
  }[] = [
    {
      orderIndex: 1,
      slotRole: "anchor",
      travelTimeFromPrev: undefined,
      store: {
        storeId: "store-demo-1",
        owner_id: "owner-1",
        name: "성수 루프탑 로스터리 카페",
        category: "카페/디저트",
        subcategory: "핸드드립 & 디저트",
        region: "서울 성동구 성수 1가",
        avg_ticket: 14000,
        capacity: 40,
        idle_slots: "14:00~16:00 이용 가능",
        status: "active",
        lat: 37.5445,
        lng: 127.056,
        story_label: "3대째 이어온 전설적인 핸드드립 아로마와 매일 아침 구워내는 프리미엄 프랑스산 스콘",
        createdAt: new Date().toISOString(),
      },
    },
    {
      orderIndex: 2,
      slotRole: "rider",
      travelTimeFromPrev: "도보 4분 (280m)",
      store: {
        storeId: "store-demo-2",
        owner_id: "owner-2",
        name: "성수 아틀리에 헤어 스튜디오",
        category: "뷰티/미용",
        subcategory: "헤어케어 & 두피스파",
        region: "서울 성동구 성수 1가",
        avg_ticket: 55000,
        capacity: 8,
        idle_slots: "16:00~18:00 이용 가능",
        status: "active",
        lat: 37.545,
        lng: 127.057,
        story_label: "1:1 퍼스널 퍼퓸 스파로 지친 도시인의 일상에 완벽한 피로 회복을 선물하는 뷰티 하우스",
        createdAt: new Date().toISOString(),
      },
    },
  ];

  const handleCheckout = () => {
    router.push(`/orders/checkout?packageId=${mockPackage.packageId}`);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <span className="rounded-full bg-indigo-600 px-3.5 py-1 text-xs font-black text-white shadow-sm flex items-center space-x-1">
            <Zap className="h-3.5 w-3.5" />
            <span>V.I.M Matching Score 94점</span>
          </span>
          <span className="text-xs font-semibold text-gray-500 flex items-center space-x-1">
            <MapPin className="h-3.5 w-3.5 text-indigo-500" />
            <span>{mockPackage.region}</span>
          </span>
        </div>

        <h1 className="text-3xl font-black text-gray-900 sm:text-4xl">
          {mockPackage.title}
        </h1>
        <p className="text-sm text-gray-500">
          유효기간: {mockPackage.valid_from} ~ {mockPackage.valid_to} (구매 후 30일 이내 자유 사용)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <PackageItineraryMap stores={mockStoresWithItinerary} />

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-amber-500" />
              <span>Goodsixty 로컬 상인 스토리 라벨</span>
            </h3>

            <div className="space-y-4">
              {mockStoresWithItinerary.map(({ store, slotRole }) => (
                <div
                  key={store.storeId}
                  className="rounded-2xl bg-gradient-to-br from-amber-50/80 to-orange-50/50 p-6 border border-amber-200/80 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900 flex items-center space-x-2">
                      <Store className="h-4 w-4 text-amber-600" />
                      <span>{store.name}</span>
                    </span>
                    <span className="rounded-md bg-amber-200/60 px-2 py-0.5 text-[11px] font-bold text-amber-800">
                      {slotRole === "anchor" ? "앵커 스토어" : "라이더 스토어"}
                    </span>
                  </div>

                  <p className="text-sm text-amber-950 font-medium leading-relaxed italic">
                    &quot;{store.story_label}&quot;
                  </p>

                  <div className="flex items-center space-x-4 text-xs text-amber-800 pt-2 border-t border-amber-200/50">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3.5 w-3.5 text-amber-600" />
                      <span>추천 시간: {store.idle_slots}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="sticky top-24 rounded-3xl bg-white p-6 shadow-xl border border-gray-200 space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <span className="text-xs font-semibold text-gray-400">결합 할인 바우처 수량</span>
              <div className="flex items-baseline space-x-2 mt-1">
                <span className="text-3xl font-black text-indigo-600">
                  {formatKRW(mockPackage.sale_price)}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  {formatKRW(mockPackage.list_total)}
                </span>
              </div>
              <span className="inline-block mt-2 rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-700">
                {Math.round(((mockPackage.list_total - mockPackage.sale_price) / mockPackage.list_total) * 100)}% 한정 할인
              </span>
            </div>

            <div className="space-y-3 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>구매 가능 잔여 수량</span>
                <span className="font-bold text-gray-900">{mockPackage.stock}개 남음</span>
              </div>
              <div className="flex justify-between">
                <span>이용 인원</span>
                <span className="font-bold text-gray-900">{mockPackage.headcount}인 기준</span>
              </div>
              <div className="flex justify-between">
                <span>정산 미사용 환불 guarantee</span>
                <span className="font-bold text-emerald-600">100% 미사용 환불가능</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full flex items-center justify-center space-x-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 py-4 text-base font-extrabold text-white shadow-lg hover:brightness-110 transition"
            >
              <Ticket className="h-5 w-5" />
              <span>원클릭 패키지 구매하기</span>
            </button>

            <div className="flex items-center justify-center space-x-1 text-xs text-gray-400 pt-2">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>포트원 / 토스페이먼츠 안심결제 지원</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
