"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StoreDocument } from "@/lib/types/schema";
import { recommendRiderStoresForAnchor, createPackageWithSlots } from "@/lib/services/package-service";
import { formatKRW, calculateSlotAmounts } from "@/lib/utils";
import { Sparkles, Calculator, Package, Store } from "lucide-react";

export default function NewPackagePlanningPage() {
  const router = useRouter();

  const anchorStore: StoreDocument = {
    storeId: "store-demo-1",
    owner_id: "owner-1",
    name: "성수 루프탑 로스터리 카페",
    category: "카페/디저트",
    subcategory: "핸드드립 & 디저트",
    region: "서울 성동구 성수동",
    avg_ticket: 14000,
    capacity: 40,
    idle_slots: "평일 14:00~17:00",
    status: "active",
    lat: 37.5445,
    lng: 127.056,
    story_label: "3대째 로스팅 가문의 깊은 아로마와 핸드메이드 스콘 이야기",
    createdAt: new Date().toISOString(),
  };

  const candidateRiders: StoreDocument[] = [
    {
      storeId: "store-rider-101",
      owner_id: "owner-2",
      name: "성수 아틀리에 헤어 스튜디오",
      category: "뷰티/미용",
      subcategory: "헤어케어 & 두피스파",
      region: "서울 성동구 성수동",
      avg_ticket: 55000,
      capacity: 8,
      idle_slots: "화~목 11:00~14:00",
      status: "active",
      lat: 37.545,
      lng: 127.057,
      story_label: "1:1 맞춤형 유기농 두피 스파로 지친 도시인에게 전하는 힐링",
      createdAt: new Date().toISOString(),
    },
    {
      storeId: "store-rider-102",
      owner_id: "owner-3",
      name: "뚝섬 힐링 요가 클래스",
      category: "액티비티/체험",
      subcategory: "싱잉볼 & 힐링요가",
      region: "서울 성동구 성수동",
      avg_ticket: 30000,
      capacity: 12,
      idle_slots: "평일 15:00~17:00",
      status: "active",
      lat: 37.543,
      lng: 127.054,
      story_label: "싱잉볼의 울림 속에서 찾는 진정한 마음의 평화",
      createdAt: new Date().toISOString(),
    },
  ];

  const [selectedRiderId, setSelectedRiderId] = useState<string>(candidateRiders[0].storeId);
  const [title, setTitle] = useState("성수 힐링 데이 (스파 & 루프탑 카페 패키지)");
  const [salePrice, setSalePrice] = useState(49000);
  const anchorRatio = 0.4;
  const riderRatio = 0.6;
  const [submitting, setSubmitting] = useState(false);

  const selectedRiderStore = candidateRiders.find((r) => r.storeId === selectedRiderId)!;
  const listTotal = anchorStore.avg_ticket + selectedRiderStore.avg_ticket;

  const slotAmounts = calculateSlotAmounts(salePrice, [anchorRatio, riderRatio]);
  const recommendedRiders = recommendRiderStoresForAnchor(anchorStore, candidateRiders);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createPackageWithSlots({
        title,
        region: anchorStore.region,
        headcount: 2,
        list_total: listTotal,
        sale_price: salePrice,
        fee_rate: 0.1,
        stock: 50,
        valid_from: "2026-08-01",
        valid_to: "2026-08-31",
        slots: [
          {
            store_id: anchorStore.storeId,
            slot_role: "anchor",
            list_value: anchorStore.avg_ticket,
            contribution: anchorRatio,
          },
          {
            store_id: selectedRiderStore.storeId,
            slot_role: "rider",
            list_value: selectedRiderStore.avg_ticket,
            contribution: riderRatio,
          },
        ],
      });
      alert("V.I.M 패키지 결합 기획 및 초대가 완료되었습니다!");
      router.push("/packages");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Package error";
      alert("패키지 결합 중 오류가 발생했습니다: " + message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">V.I.M 콜라보 패키지 기획</h1>
        <p className="text-sm text-gray-500">
          내 매장(앵커)을 기준으로 최적의 유휴 시간 라이더 매장을 자동 추천받아 결합 패키지를 생성합니다.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200 space-y-4">
          <div className="flex items-center space-x-2 text-indigo-600 font-bold">
            <Store className="h-5 w-5" />
            <span>[앵커 매장] {anchorStore.name}</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-gray-600">
            <div>
              <span className="font-semibold">카테고리:</span> {anchorStore.category}
            </div>
            <div>
              <span className="font-semibold">유휴시간:</span> {anchorStore.idle_slots}
            </div>
            <div>
              <span className="font-semibold">기본 객단가:</span> {formatKRW(anchorStore.avg_ticket)}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-gray-900 flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-amber-500" />
            <span>V.I.M 6축 AI 엔진 추천 라이더 매장 목록</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendedRiders.map(({ store, vimScore }) => (
              <div
                key={store.storeId}
                onClick={() => setSelectedRiderId(store.storeId)}
                className={`cursor-pointer rounded-2xl p-5 border transition-all ${
                  selectedRiderId === store.storeId
                    ? "bg-indigo-50/50 border-indigo-600 ring-2 ring-indigo-500/20"
                    : "bg-white border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-semibold text-indigo-600">{store.category}</span>
                    <h4 className="font-bold text-gray-900">{store.name}</h4>
                  </div>
                  <span className="rounded-full bg-indigo-600 px-3 py-1 text-xs font-bold text-white">
                    V.I.M {vimScore}점
                  </span>
                </div>

                <p className="text-xs text-amber-800 bg-amber-50 p-2 rounded-lg mt-3 border border-amber-200">
                  &quot;{store.story_label}&quot;
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500 mt-3 pt-2 border-t border-gray-100">
                  <span>유휴: {store.idle_slots}</span>
                  <span className="font-semibold text-gray-900">{formatKRW(store.avg_ticket)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200 space-y-6">
          <div className="flex items-center space-x-2 text-gray-900 font-bold border-b border-gray-100 pb-3">
            <Calculator className="h-5 w-5 text-indigo-600" />
            <span>패키지 판매가 및 정산 금액 분배 설정</span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                패키지 제목 *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-3.5 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  정가 합계 (List Total)
                </label>
                <input
                  type="text"
                  disabled
                  value={formatKRW(listTotal)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2 text-sm text-gray-700 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  패키지 결합 판매가 (KRW 정수) *
                </label>
                <input
                  type="number"
                  required
                  value={salePrice}
                  onChange={(e) => setSalePrice(Number(e.target.value))}
                  className="w-full rounded-xl border border-gray-300 px-3.5 py-2 text-sm text-gray-900 font-bold focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="rounded-xl bg-slate-900 p-4 text-white space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                정산 금액 스냅샷 분배 미리보기 (Math.round + Anchor 잔여금 처리)
              </h4>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800">
                  <span>[앵커 슬롯] {anchorStore.name} (40% + Remainder)</span>
                  <span className="font-extrabold text-amber-400">
                    {formatKRW(slotAmounts[0])}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800">
                  <span>[라이더 슬롯] {selectedRiderStore.name} (60%)</span>
                  <span className="font-extrabold text-indigo-400">
                    {formatKRW(slotAmounts[1])}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center space-x-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg hover:bg-indigo-500 disabled:opacity-50"
            >
              <Package className="h-4 w-4" />
              <span>{submitting ? "생성 및 제안 중..." : "결합 패키지 기획 및 제안 발송"}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
