"use client";

import { useState } from "react";
import { HelpCircle, MessageSquare, PhoneCall, FileText, ChevronDown, CheckCircle } from "lucide-react";

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [submitted, setSubmitted] = useState(false);

  const faqs = [
    {
      q: "Qollab 결합 바우처는 어떻게 사용하나요?",
      a: "구매하신 결합 바우처는 '마이 패키지' 보관함에 보관되며, 매장 방문 시 제시하실 수 있는 QR/바코드가 자동 생성됩니다. 각 참여 매장에서 QR/바코드를 보여주시면 담당 점원이 확인 후 즉시 사용 처리됩니다."
    },
    {
      q: "미사용 바우처는 환불이 가능한가요?",
      a: "네! 유효기간 내 미사용한 바우처는 마이페이지 구매내역에서 100% 취소 및 환불 요청이 가능합니다."
    },
    {
      q: "동네 패키지와 브랜드 패키지의 차이는 무엇인가요?",
      a: "우리 동네 패키지는 특정 지역(예: 성수동, 강남역 등) 내 위치한 개인/단일 매장 간의 콜라보 묶음 상품이며, 브랜드 패키지는 전국 프랜차이즈나 온/오프라인 브랜드 상품이 결합된 전국 어디서나 사용 가능한 패키지입니다."
    },
  ];

  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      <div>
        <div className="inline-flex items-center space-x-2 rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-800 border border-indigo-200">
          <HelpCircle className="h-3.5 w-3.5" />
          <span>고객센터 & 이용안내</span>
        </div>
        <h1 className="text-3xl font-black text-gray-900 mt-2">고객센터 (Customer Support)</h1>
        <p className="text-sm text-gray-500 mt-1">
          Qollab 서비스 이용에 대해 궁금하신 점을 확인하시거나 1:1 문의를 등록해주세요.
        </p>
      </div>

      {/* Quick Contact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-3xl bg-white p-5 border border-gray-200 shadow-sm space-y-2">
          <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600 w-fit">
            <MessageSquare className="h-5 w-5" />
          </div>
          <h3 className="font-extrabold text-gray-900 text-sm">1:1 온라인 문의</h3>
          <p className="text-xs text-gray-500">24시간 접수, 운영시간 내 순차 답변</p>
        </div>

        <div className="rounded-3xl bg-white p-5 border border-gray-200 shadow-sm space-y-2">
          <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600 w-fit">
            <PhoneCall className="h-5 w-5" />
          </div>
          <h3 className="font-extrabold text-gray-900 text-sm">고객센터 전화상담</h3>
          <p className="text-xs text-gray-500">1588-0000 (평일 09:00 ~ 18:00)</p>
        </div>

        <div className="rounded-3xl bg-white p-5 border border-gray-200 shadow-sm space-y-2">
          <div className="p-2.5 rounded-2xl bg-purple-50 text-purple-600 w-fit">
            <FileText className="h-5 w-5" />
          </div>
          <h3 className="font-extrabold text-gray-900 text-sm">서비스 이용약관</h3>
          <p className="text-xs text-gray-500">전자상거래 및 소비자보호 규정</p>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="space-y-4">
        <h2 className="text-xl font-extrabold text-gray-900">자주 묻는 질문 (FAQ)</h2>
        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between p-4 text-left font-bold text-sm text-gray-900 hover:bg-gray-50 transition"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${openFaq === idx ? "rotate-180" : ""}`} />
              </button>
              {openFaq === idx && (
                <div className="p-4 bg-gray-50 border-t border-gray-100 text-xs text-gray-600 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 1:1 Inquiry Form */}
      <div className="rounded-3xl bg-white p-6 border border-gray-200 shadow-sm space-y-4">
        <h2 className="text-xl font-extrabold text-gray-900">1:1 고객 문의하기</h2>
        
        {submitted ? (
          <div className="rounded-2xl bg-emerald-50 p-6 text-center text-emerald-800 space-y-2 border border-emerald-200">
            <CheckCircle className="h-10 w-10 text-emerald-600 mx-auto" />
            <h3 className="font-extrabold text-base">문의가 성공적으로 접수되었습니다!</h3>
            <p className="text-xs text-emerald-700">등록하신 이메일/휴대폰으로 빠르게 답변 드리겠습니다.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmitInquiry} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-gray-700 block mb-1">문의 유형</label>
              <select className="w-full rounded-xl border p-2.5 bg-gray-50 font-semibold">
                <option>바우처 사용 및 결제 관련</option>
                <option>패키지 구성 문의</option>
                <option>기타 고객 의견</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-gray-700 block mb-1">문의 제목</label>
              <input type="text" required placeholder="제목을 입력해 주세요" className="w-full rounded-xl border p-2.5" />
            </div>
            <div>
              <label className="font-bold text-gray-700 block mb-1">문의 내용</label>
              <textarea rows={4} required placeholder="상세한 내용을 적어주시면 신속하게 답변 드리겠습니다." className="w-full rounded-xl border p-2.5" />
            </div>
            <button type="submit" className="rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white shadow hover:bg-indigo-500 transition">
              문의 접수하기
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
