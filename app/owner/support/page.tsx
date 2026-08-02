"use client";

import { useState } from "react";
import { Headphones, CheckCircle, MessageSquare, PhoneCall, HelpCircle } from "lucide-react";

export default function BizSupportPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <div>
        <div className="inline-flex items-center space-x-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800 border border-amber-200">
          <Headphones className="h-3.5 w-3.5" />
          <span>BIZ 전담지원</span>
        </div>
        <h1 className="text-3xl font-black text-gray-900 mt-2">BIZ센터 (Biz Support Center)</h1>
        <p className="text-sm text-gray-500 mt-1">
          판매, 정산, 제휴 매장 마케팅 및 콜라보 파트너쉽과 관련된 모든 문의를 전담 처리합니다.
        </p>
      </div>

      {/* Quick BIZ Channels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-3xl bg-slate-900 p-6 text-white border border-slate-800 space-y-2">
          <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 w-fit">
            <PhoneCall className="h-5 w-5" />
          </div>
          <h3 className="font-extrabold text-base">BIZ 점주 핫라인</h3>
          <p className="text-xs text-slate-400">1588-9999 (BIZ 점주 전용 직통 24/7 지원)</p>
        </div>

        <div className="rounded-3xl bg-white p-6 border border-gray-200 shadow-sm space-y-2">
          <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600 w-fit">
            <MessageSquare className="h-5 w-5" />
          </div>
          <h3 className="font-extrabold text-base text-gray-900">1:1 파트너쉽 문의</h3>
          <p className="text-xs text-gray-500">매장 확장 및 브랜드 콜라보 기획 문의</p>
        </div>
      </div>

      {/* Form */}
      <div className="rounded-3xl bg-white p-6 border border-gray-200 shadow-sm space-y-4">
        <h2 className="text-xl font-extrabold text-gray-900">판매 및 정산 관련 문의 등록</h2>

        {submitted ? (
          <div className="rounded-2xl bg-emerald-50 p-6 text-center text-emerald-800 space-y-2 border border-emerald-200">
            <CheckCircle className="h-10 w-10 text-emerald-600 mx-auto" />
            <h3 className="font-extrabold text-base">BIZ 문의가 성공적으로 접수되었습니다!</h3>
            <p className="text-xs text-emerald-700">전담 BIZ 매니저가 빠른 시간 내 연락 드리겠습니다.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-gray-700 block mb-1">문의 분야</label>
              <select className="w-full rounded-xl border p-2.5 bg-gray-50 font-semibold text-gray-900">
                <option>판매 및 정산 관련 문의</option>
                <option>AI 콜라보 알고리즘 매칭 수정 요청</option>
                <option>신규 제휴 브랜드 매장 입점 제안</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-gray-700 block mb-1">문의 제목</label>
              <input type="text" required placeholder="내용 요약을 입력하세요" className="w-full rounded-xl border p-2.5" />
            </div>
            <div>
              <label className="font-bold text-gray-700 block mb-1">문의 상세 내용</label>
              <textarea rows={4} required placeholder="상세 문의 내용을 적어주세요" className="w-full rounded-xl border p-2.5" />
            </div>
            <button type="submit" className="rounded-xl bg-amber-500 px-6 py-3 font-extrabold text-white shadow hover:bg-amber-400 transition">
              BIZ센터 문의 접수
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
