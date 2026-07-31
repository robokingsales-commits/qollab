"use client";

import { useState } from "react";
import { Sparkles, Ticket, ShieldCheck, Zap } from "lucide-react";
import { calculateVIMSCTScore } from "@/lib/domain/vim-matching";
import { formatKRW } from "@/lib/utils";

export default function Home() {
  const [promptInput, setPromptInput] = useState("");
  
  const sampleVIMScore = calculateVIMSCTScore({
    v: 0.85,
    i: 0.90,
    m: 0.75,
    c: 0.88,
    s: 0.92,
    t: 0.95,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-950 via-indigo-900 to-purple-950 px-6 py-16 text-white shadow-2xl sm:px-12 sm:py-20">
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center space-x-2 rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-300 border border-indigo-500/30">
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI V.I.M Matching Engine v1.0</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            지역 매장의 유휴 시간을 <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-400 to-amber-300 bg-clip-text text-transparent">
              초개인화 초특가 패키지
            </span>
            로
          </h1>

          <p className="text-lg text-indigo-200">
            카페, 미용실, 맛집, 액티비티를 묶은 V.I.M 6축 알선 알고리즘 결합 바우처
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 bg-white/10 p-2 rounded-2xl backdrop-blur-md border border-white/20">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                placeholder="예: 이번주 토요일 성수동 데이트 코스 5만원 이하 추천해줘"
                className="w-full bg-transparent px-4 py-3 text-sm text-white placeholder-indigo-300 focus:outline-none"
              />
            </div>
            <button className="w-full sm:w-auto flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-indigo-500 to-amber-500 px-6 py-3 text-sm font-bold text-white shadow-lg hover:brightness-110 transition">
              <Zap className="h-4 w-4" />
              <span>AI 패키지 추천</span>
            </button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 space-y-3">
          <div className="flex items-center space-x-3 text-indigo-600">
            <Zap className="h-6 w-6" />
            <h3 className="font-bold text-gray-900">V.I.M Matching Score</h3>
          </div>
          <p className="text-3xl font-extrabold text-indigo-600">{sampleVIMScore}점 / 100점</p>
          <p className="text-xs text-gray-500">
            VIMSCT = 0.124*V + 0.199*I + 0.176*M + 0.146*C + 0.199*S + 0.156*T (Dynamic Weight Decay Active)
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 space-y-3">
          <div className="flex items-center space-x-3 text-amber-600">
            <Ticket className="h-6 w-6" />
            <h3 className="font-bold text-gray-900">Snapshot KRW Currency</h3>
          </div>
          <p className="text-3xl font-extrabold text-amber-600">{formatKRW(49800)}</p>
          <p className="text-xs text-gray-500">
            모든 금액은 KRW 정수(Math.round) 처리 및 잔여 금액 Anchor 슬롯 할당
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 space-y-3">
          <div className="flex items-center space-x-3 text-emerald-600">
            <ShieldCheck className="h-6 w-6" />
            <h3 className="font-bold text-gray-900">Role-Based Security</h3>
          </div>
          <p className="text-sm font-semibold text-emerald-700">Custom Claim Middleware Active</p>
          <p className="text-xs text-gray-500">
            /owner/* 및 /admin/* 역할 기반 Middleware 인가 및 Firestore Rules Custom Claim 검증 준비 완료
          </p>
        </div>
      </section>
    </div>
  );
}
