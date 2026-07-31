"use client";

import { useState, useEffect } from "react";
import { StoreDocument } from "@/lib/types/schema";
import { formatKRW } from "@/lib/utils";
import { CheckCircle, XCircle, Sparkles } from "lucide-react";

export default function AdminStoresPage() {
  const [pendingStores, setPendingStores] = useState<StoreDocument[]>([]);
  const [rejectReasonMap, setRejectReasonMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const samplePending: StoreDocument[] = [
      {
        storeId: "store-pending-101",
        owner_id: "owner-user-99",
        name: "성수 아틀리에 헤어 스튜디오",
        category: "뷰티/미용",
        subcategory: "헤어케어 & 두피스파",
        region: "서울 성동구 성수동",
        avg_ticket: 55000,
        capacity: 8,
        idle_slots: "화~목 11:00~14:00",
        status: "pending",
        lat: 37.545,
        lng: 127.057,
        story_label: "1:1 맞춤형 유기농 두피 스파로 지친 도시인에게 전하는 힐링 케어 스토리",
        createdAt: new Date().toISOString(),
      },
      {
        storeId: "store-pending-102",
        owner_id: "owner-user-100",
        name: "뚝섬 크래프트 비어 파일럿",
        category: "식당/맛집",
        subcategory: "수제맥주 & 타파스",
        region: "서울 성동구 성수동",
        avg_ticket: 28000,
        capacity: 35,
        idle_slots: "일~목 17:00~19:00",
        status: "pending",
        lat: 37.542,
        lng: 127.051,
        story_label: "독자적 효모로 양조하는 성수 수제맥주의 참맛과 스페인 타파스의 만남",
        createdAt: new Date().toISOString(),
      },
    ];
    setPendingStores(samplePending);
    setLoading(false);
  }, []);

  const handleApprove = (storeId: string) => {
    setPendingStores((prev) => prev.filter((s) => s.storeId !== storeId));
    alert("매장 승인이 완료되었습니다.");
  };

  const handleReject = (storeId: string) => {
    const reason = rejectReasonMap[storeId] || "입점 기준 미달";
    setPendingStores((prev) => prev.filter((s) => s.storeId !== storeId));
    alert(`매장이 반려 처리 되었습니다. (사유: ${reason})`);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">어드민 매장 입점 심사</h1>
        <p className="text-sm text-gray-500">
          신규 입점 신청 매장의 카테고리, 유휴 슬롯 및 로컬 스토리 라벨 심사
        </p>
      </div>

      {loading ? (
        <div className="py-12 text-center text-gray-500">로딩 중...</div>
      ) : pendingStores.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center text-gray-500">
          대기 중인 매장 입점 신청 건이 없습니다.
        </div>
      ) : (
        <div className="space-y-4">
          {pendingStores.map((store) => (
            <div
              key={store.storeId}
              className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200 space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-semibold text-indigo-600">
                    {store.category} &gt; {store.subcategory}
                  </span>
                  <h3 className="text-xl font-bold text-gray-900">{store.name}</h3>
                  <p className="text-xs text-gray-500">Owner ID: {store.owner_id}</p>
                </div>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                  승인 대기중
                </span>
              </div>

              <div className="rounded-xl bg-amber-50 p-3 border border-amber-200 flex items-start space-x-2">
                <Sparkles className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-900 font-medium">
                  <span className="font-bold">로컬 스토리 라벨:</span> &quot;{store.story_label}&quot;
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-600">
                <div>
                  <span className="font-semibold text-gray-900">지역:</span> {store.region}
                </div>
                <div>
                  <span className="font-semibold text-gray-900">평균 객단가:</span> {formatKRW(store.avg_ticket)}
                </div>
                <div>
                  <span className="font-semibold text-gray-900">수용 수량:</span> {store.capacity}석
                </div>
                <div>
                  <span className="font-semibold text-gray-900">유휴 슬롯:</span> {store.idle_slots}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-gray-100">
                <input
                  type="text"
                  placeholder="반려 사유 입력 (반려 시 필수)"
                  value={rejectReasonMap[store.storeId] || ""}
                  onChange={(e) =>
                    setRejectReasonMap({ ...rejectReasonMap, [store.storeId]: e.target.value })
                  }
                  className="w-full sm:w-80 rounded-xl border border-gray-300 px-3 py-1.5 text-xs text-gray-900 focus:outline-none focus:border-rose-500"
                />

                <div className="flex items-center space-x-3 w-full sm:w-auto">
                  <button
                    onClick={() => handleReject(store.storeId)}
                    className="flex-1 sm:flex-none flex items-center justify-center space-x-1 rounded-xl bg-rose-50 border border-rose-200 px-4 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 transition"
                  >
                    <XCircle className="h-4 w-4" />
                    <span>반려</span>
                  </button>

                  <button
                    onClick={() => handleApprove(store.storeId)}
                    className="flex-1 sm:flex-none flex items-center justify-center space-x-1 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow hover:bg-emerald-500 transition"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>입점 승인</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
