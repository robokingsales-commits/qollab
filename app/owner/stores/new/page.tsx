"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createStore } from "@/lib/services/store-service";
import { Sparkles } from "lucide-react";

export default function NewStorePage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    category: "카페/디저트",
    subcategory: "루프탑 & 특색음료",
    region: "서울 성동구 성수동",
    avg_ticket: 15000,
    capacity: 20,
    idle_slots: "평일 14:00~17:00",
    lat: 37.5445,
    lng: 127.056,
    story_label: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createStore({
        owner_id: "owner-current-uid",
        ...formData,
        avg_ticket: Number(formData.avg_ticket),
        capacity: Number(formData.capacity),
        lat: Number(formData.lat),
        lng: Number(formData.lng),
      });
      alert("매장 등록 신청이 완료되었습니다! (관리자 승인 대기중)");
      router.push("/owner/stores");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Store error";
      alert("매장 등록 중 오류가 발생했습니다: " + message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-200 space-y-6">
        <div className="border-b border-gray-100 pb-4">
          <h1 className="text-2xl font-bold text-gray-900">신규 매장 등록 신청</h1>
          <p className="text-sm text-gray-500 mt-1">
            매장 기본 정보 및 Goodsixty 스타일 로컬 스토리 라벨을 작성해 주세요.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                매장명 *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="예: 성수 루프탑 로스터리"
                className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                카테고리 *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none bg-white"
              >
                <option value="카페/디저트">카페/디저트</option>
                <option value="뷰티/미용">뷰티/미용</option>
                <option value="식당/맛집">식당/맛집</option>
                <option value="액티비티/체험">액티비티/체험</option>
                <option value="라이프/힐링">라이프/힐링</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                서브 카테고리
              </label>
              <input
                type="text"
                value={formData.subcategory}
                onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                placeholder="예: 핸드드립 & 디저트"
                className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                지역 (동/구 단위) *
              </label>
              <input
                type="text"
                required
                value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                placeholder="예: 서울 성동구 성수동"
                className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                평균 객단가 (KRW) *
              </label>
              <input
                type="number"
                required
                value={formData.avg_ticket}
                onChange={(e) => setFormData({ ...formData, avg_ticket: Number(e.target.value) })}
                className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                수용 수량 (석/명) *
              </label>
              <input
                type="number"
                required
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                유휴 시간 (Idle Slots) *
              </label>
              <input
                type="text"
                required
                value={formData.idle_slots}
                onChange={(e) => setFormData({ ...formData, idle_slots: e.target.value })}
                placeholder="예: 평일 14:00~17:00"
                className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-indigo-700 flex items-center space-x-1">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Goodsixty 스타일 로컬 상인 스토리 라벨 *</span>
            </label>
            <textarea
              required
              rows={3}
              value={formData.story_label}
              onChange={(e) => setFormData({ ...formData, story_label: e.target.value })}
              placeholder="예: 3대째 로스팅 가문의 깊은 아로마와 매일 아침 직접 구워내는 핸드메이드 스콘 이야기"
              className="w-full rounded-xl border border-amber-300 bg-amber-50/50 p-3 text-sm text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 disabled:opacity-50"
            >
              {submitting ? "등록 중..." : "매장 등록 신청"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
