"use client";

import { useState } from "react";
import Link from "next/link";
import { User, QrCode, CreditCard, Heart, Settings, ShieldCheck, ChevronRight, Sparkles, HelpCircle } from "lucide-react";

export default function MyPage() {
  const [userProfile] = useState({
    name: "홍길동",
    email: "user@qollab.co.kr",
    level: "Qollab VIP 파트너",
    savings: 142000,
    voucherCount: 3,
  });

  return (
    <div className="min-h-screen bg-slate-50 text-[#111111] pb-24">
      {/* Header Banner */}
      <div className="bg-[#071D49] text-white pt-8 pb-16 px-4 rounded-b-3xl shadow-lg relative overflow-hidden">
        <div className="max-w-xl mx-auto space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 p-0.5 shadow-md">
              <div className="w-full h-full bg-[#071D49] rounded-full flex items-center justify-center">
                <User className="w-7 h-7 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-black">{userProfile.name} 님</h1>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  {userProfile.level}
                </span>
              </div>
              <p className="text-xs text-slate-300">{userProfile.email}</p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 space-y-1">
              <span className="text-[10px] text-slate-300 font-semibold">Qollab 누적 절약 금액</span>
              <p className="text-base font-black text-amber-300">₩{userProfile.savings.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 space-y-1">
              <span className="text-[10px] text-slate-300 font-semibold">보유 중인 바우처</span>
              <p className="text-base font-black text-white">{userProfile.voucherCount}개</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="max-w-xl mx-auto px-4 -mt-8 space-y-4 relative z-10">
        {/* Vault Navigation Card */}
        <Link
          href="/my-vouchers"
          className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-md flex items-center justify-between hover:shadow-lg transition group"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-extrabold text-[#071D49]">내 QR 바우처 보관함 (One-QR Vault)</p>
              <p className="text-xs text-slate-500">구매한 패키지 결제 QR 코드 확인 및 매장 사용</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
        </Link>

        {/* Menu Options List */}
        <div className="rounded-2xl bg-white border border-slate-200/80 p-2 shadow-sm divide-y divide-slate-100">
          <Link href="/orders" className="p-3.5 flex items-center justify-between hover:bg-slate-50 rounded-xl transition">
            <div className="flex items-center space-x-3 text-slate-700">
              <CreditCard className="w-5 h-5 text-slate-500" />
              <span className="text-xs font-bold">결제 내역 및 이력 관리</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </Link>

          <Link href="/favorites" className="p-3.5 flex items-center justify-between hover:bg-slate-50 rounded-xl transition">
            <div className="flex items-center space-x-3 text-slate-700">
              <Heart className="w-5 h-5 text-slate-500" />
              <span className="text-xs font-bold">관심 꿀조합 찜목록</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </Link>

          <Link href="/support" className="p-3.5 flex items-center justify-between hover:bg-slate-50 rounded-xl transition">
            <div className="flex items-center space-x-3 text-slate-700">
              <HelpCircle className="w-5 h-5 text-slate-500" />
              <span className="text-xs font-bold">고객센터 및 FAQ</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </Link>

          <Link href="/settings" className="p-3.5 flex items-center justify-between hover:bg-slate-50 rounded-xl transition">
            <div className="flex items-center space-x-3 text-slate-700">
              <Settings className="w-5 h-5 text-slate-500" />
              <span className="text-xs font-bold">계정 및 알림 설정</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </Link>
        </div>
      </div>
    </div>
  );
}
