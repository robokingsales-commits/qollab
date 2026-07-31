"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { StoreDocument } from "@/lib/types/schema";
import { formatKRW } from "@/lib/utils";
import { Store, Plus, Clock, MapPin, Tag, Sparkles } from "lucide-react";

export default function OwnerStoresPage() {
  const [stores, setStores] = useState<StoreDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sampleStores: StoreDocument[] = [
      {
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
      },
      {
        storeId: "store-demo-2",
        owner_id: "owner-1",
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
        story_label: "1:1 맞춤형 유기농 두피 스파로 지친 도시인에게 전하는 힐링",
        createdAt: new Date().toISOString(),
      },
    ];
    setStores(sampleStores);
    setLoading(false);
  }, []);

  const getStatusBadge = (status: StoreDocument["status"]) => {
    switch (status) {
      case "active":
        return (
          <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 border border-emerald-200">
            승인 (영업중)
          </span>
        );
      case "pending":
        return (
          <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800 border border-amber-200">
            승인 대기중
          </span>
        );
      case "suspended":
        return (
          <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-800 border border-gray-200">
            일시 중단
          </span>
        );
      case "rejected":
        return (
          <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-semibold text-rose-800 border border-rose-200">
            반려됨
          </span>
        );
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">내 매장 관리</h1>
          <p className="text-sm text-gray-500">
            등록된 매장 및 유휴 시간 slots 정보 관리
          </p>
        </div>

        <Link
          href="/owner/stores/new"
          className="flex items-center space-x-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 transition"
        >
          <Plus className="h-4 w-4" />
          <span>신규 매장 등록</span>
        </Link>
      </div>

      {loading ? (
        <div className="py-12 text-center text-gray-500">로딩 중...</div>
      ) : stores.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center space-y-4">
          <Store className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900">등록된 매장이 없습니다.</h3>
          <p className="text-sm text-gray-500">
            신규 매장을 등록하고 V.I.M 기반 결합 패키지를 제안받아보세요!
          </p>
          <Link
            href="/owner/stores/new"
            className="inline-flex items-center space-x-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"
          >
            <span>매장 등록하기</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stores.map((store) => (
            <div
              key={store.storeId}
              className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200 space-y-4 relative hover:shadow-md transition"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-semibold text-indigo-600">
                    {store.category} &gt; {store.subcategory}
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 mt-0.5">
                    {store.name}
                  </h3>
                </div>
                {getStatusBadge(store.status)}
              </div>

              <div className="rounded-xl bg-amber-50 p-3 border border-amber-200 flex items-start space-x-2">
                <Sparkles className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-900 font-medium leading-relaxed">
                  <span className="font-bold">로컬 스토리 라벨:</span> &quot;{store.story_label}&quot;
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs text-gray-600 pt-2 border-t border-gray-100">
                <div className="flex items-center space-x-1.5">
                  <MapPin className="h-3.5 w-3.5 text-gray-400" />
                  <span className="truncate">{store.region}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Clock className="h-3.5 w-3.5 text-gray-400" />
                  <span>유휴: {store.idle_slots}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Tag className="h-3.5 w-3.5 text-gray-400" />
                  <span>평균 객단가: {formatKRW(store.avg_ticket)}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Store className="h-3.5 w-3.5 text-gray-400" />
                  <span>수용 수량: {store.capacity}석</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
