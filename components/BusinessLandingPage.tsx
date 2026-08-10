"use client";

import { useState } from "react";
import Link from "next/link";
import { Play } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

interface BusinessLandingPageProps {
  onExploreApp?: () => void;
}

export default function BusinessLandingPage({ onExploreApp }: BusinessLandingPageProps) {
  // Course Builder Selection State
  const [selectedCourses, setSelectedCourses] = useState<string[]>([
    "cinema",
    "fashion",
    "cafe",
    "fitness"
  ]);

  // Video State
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const toggleCourse = (id: string) => {
    setSelectedCourses((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#FFEE00] selection:text-black relative overflow-x-hidden antialiased">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* 0. HEADER NAVIGATION                                          */}
      {/* ───────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl sm:text-2xl md:text-3xl font-black tracking-tighter text-white font-sans lowercase">
              qollab
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8 text-xs sm:text-sm font-bold text-slate-300">
            <a href="#section-hero" className="text-[#00FF66] font-extrabold border-b-2 border-[#00FF66] pb-1">플랫폼</a>
            <a href="#section-course" className="hover:text-white transition">코스형 패키지</a>
            <a href="#section-ai-vim" className="hover:text-white transition">AI 매칭</a>
            <a href="#section-milestones" className="hover:text-white transition">스토어</a>
          </nav>

          {/* Action Button */}
          <button
            onClick={() => {
              if (onExploreApp) {
                onExploreApp();
              } else {
                window.location.href = "/packages";
              }
            }}
            className="bg-[#00FF66] hover:bg-[#00e65c] text-black font-extrabold px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm transition-all shadow-md cursor-pointer shrink-0"
          >
            앱 시작하기
          </button>
        </div>
      </header>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 1: HERO (MORE TOGETHER, MORE SAVINGS.)                */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section id="section-hero" className="pt-10 sm:pt-16 lg:pt-20 pb-12 sm:pb-20 lg:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left relative">
        <div className="space-y-3 sm:space-y-4 max-w-4xl">
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.95] text-white font-mono uppercase">
            MORE TOGETHER,<br />
            MORE SAVINGS.
          </h1>
          <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight pt-1 sm:pt-2">
            따로 사면 정가, 묶으면 묶을수록 커지는 할인!
          </h2>
        </div>

        <div className="w-full flex justify-center my-6 lg:my-10">
          <div className="w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl border border-white/10">
            <video 
              src="/0811.mp4" 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="w-full h-auto object-cover"
            />
          </div>
        </div>

        <div className="max-w-4xl mb-10 sm:mb-16">
          <p className="text-xs sm:text-sm md:text-base text-slate-400 max-w-2xl leading-relaxed">
            브랜드와 가게를 콜라보할수록 할인 혜택은 더욱 커집니다. 비싼 광고비와 수수료 대신, 무한한 시너지로 함께 성장하는 콜라보 플랫폼 Qollab.
          </p>
        </div>

        {/* 4-Step Flow with Green Connecting Arrows */}
        <div className="mt-10 sm:mt-16 flex flex-col lg:flex-row items-center lg:items-stretch justify-between gap-4 lg:gap-2 relative">
          {/* Step 1 */}
          <div className="w-full lg:flex-1 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-white/10 p-4 sm:p-5 flex flex-col justify-between shadow-xl group hover:border-white/30 transition-all">
            <div className="aspect-[4/3] rounded-xl overflow-hidden relative mb-3 sm:mb-4">
              <img
                src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80"
                alt="헤어숍"
                className="w-full h-full object-cover filter grayscale contrast-125 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute bottom-2 left-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">ELEVATED RITUALS</div>
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <span className="text-[10px] font-bold text-slate-400 block">1단계</span>
              <h3 className="text-base sm:text-lg font-black text-white">헤어 숍</h3>
              <span className="inline-block px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-bold">
                정가
              </span>
            </div>
          </div>

          {/* Green Connecting Arrow 1 */}
          <div className="flex items-center justify-center text-[#00FF66] py-0.5 lg:py-0 lg:px-0.5 shrink-0 opacity-80">
            <span className="hidden lg:block text-sm font-bold">➔</span>
            <span className="lg:hidden text-xs font-bold">↓</span>
          </div>

          {/* Step 2 */}
          <div className="w-full lg:flex-1 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-white/10 p-4 sm:p-5 flex flex-col justify-between shadow-xl group hover:border-[#00FF66]/40 transition-all">
            <div className="aspect-[4/3] rounded-xl overflow-hidden relative mb-3 sm:mb-4">
              <img
                src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80"
                alt="영화 관람"
                className="w-full h-full object-cover filter grayscale contrast-125 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40" />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <span className="text-[10px] font-bold text-slate-400 block">2단계</span>
              <h3 className="text-base sm:text-lg font-black text-white">영화 관람</h3>
              <span className="inline-block px-2.5 py-0.5 rounded-md bg-emerald-950 border border-[#00FF66]/40 text-[#00FF66] text-[10px] font-bold">
                -20% 할인
              </span>
            </div>
          </div>

          {/* Green Connecting Arrow 2 */}
          <div className="flex items-center justify-center text-[#00FF66] py-0.5 lg:py-0 lg:px-0.5 shrink-0 opacity-80">
            <span className="hidden lg:block text-sm font-bold">➔</span>
            <span className="lg:hidden text-xs font-bold">↓</span>
          </div>

          {/* Step 3 */}
          <div className="w-full lg:flex-1 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-white/10 p-4 sm:p-5 flex flex-col justify-between shadow-xl group hover:border-[#00FF66]/40 transition-all">
            <div className="aspect-[4/3] rounded-xl overflow-hidden relative mb-3 sm:mb-4">
              <img
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80"
                alt="맛집 외식"
                className="w-full h-full object-cover filter grayscale contrast-125 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40" />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <span className="text-[10px] font-bold text-slate-400 block">3단계</span>
              <h3 className="text-base sm:text-lg font-black text-white">맛집 외식</h3>
              <span className="inline-block px-2.5 py-0.5 rounded-md bg-emerald-950 border border-[#00FF66]/40 text-[#00FF66] text-[10px] font-bold">
                -30% 추가 할인
              </span>
            </div>
          </div>

          {/* Green Connecting Arrow 3 */}
          <div className="flex items-center justify-center text-[#00FF66] py-0.5 lg:py-0 lg:px-0.5 shrink-0 opacity-80">
            <span className="hidden lg:block text-sm font-bold">➔</span>
            <span className="lg:hidden text-xs font-bold">↓</span>
          </div>

          {/* Step 4: MAX Glowing Neon Purple Box with Monochrome Grayscale Image */}
          <div className="w-full lg:flex-1 rounded-2xl bg-gradient-to-b from-purple-950/90 to-slate-950 neon-purple-glow p-4 sm:p-5 flex flex-col justify-between shadow-2xl relative">
            <div className="aspect-[4/3] rounded-xl overflow-hidden relative mb-3 sm:mb-4">
              <img
                src="https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=600&q=80"
                alt="카페 디저트"
                className="w-full h-full object-cover filter grayscale contrast-125"
              />
              <div className="absolute inset-0 bg-purple-950/30 mix-blend-multiply" />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <span className="text-[10px] font-bold text-purple-300 block">4단계 · MAX</span>
              <h3 className="text-base sm:text-lg font-black text-white">카페 디저트</h3>
              <span className="inline-block px-3 py-1 rounded-full bg-purple-600 text-white text-xs font-black shadow-lg">
                ~40% 폭풍 할인 (MAX)
              </span>
            </div>
          </div>
        </div>

        {/* Sub Caption: Border Removed & Text Color White */}
        <div className="mt-6 sm:mt-8 flex items-center space-x-2 text-xs font-bold text-white px-0 py-1 w-full sm:w-fit">
          <span className="shrink-0">💡</span>
          <span className="leading-snug text-white">상품을 추가할 때마다 패키지에 담긴 모든 상품의 가격이 다 함께 내려갑니다.</span>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 2: BUILD YOUR OWN COURSE.                             */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section id="section-course" className="py-16 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
        <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white font-mono uppercase mb-10 sm:mb-14 text-left leading-[0.95]">
          BUILD YOUR<br />
          OWN COURSE.
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end relative">
          {/* Glowing Green Connector Arrow pointing from vertical center of Cafe card (Row 2) to Smartphone UI */}
          <div className="hidden lg:flex items-center absolute left-[56.5%] top-[50%] -translate-y-1/2 z-30 pointer-events-none">
            <div className="w-14 lg:w-20 h-[2px] bg-gradient-to-r from-[#00FF66]/20 via-[#00FF66] to-[#00FF66] shadow-[0_0_10px_#00FF66]" />
            <div className="w-0 h-0 border-y-[4px] border-y-transparent border-l-[7px] border-l-[#00FF66] drop-shadow-[0_0_6px_#00FF66] -ml-0.5" />
          </div>

          {/* Left 6 Interactive Course Grid (3 Rows) */}
          <div className="lg:col-span-7 grid grid-cols-2 gap-3 sm:gap-4 relative">
            {[
              { id: "cinema", title: "영화관", img: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80", connector: "+" },
              { id: "fashion", title: "패션 / 의류", img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80" },
              { id: "gourmet", title: "맛집 / 외식", img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80", connector: "+" },
              { id: "cafe", title: "카페 / 디저트", img: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80" },
              { id: "beauty", title: "뷰티 / 헤어", img: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80", connector: "+" },
              { id: "fitness", title: "헬스 / 피트니스", img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80" },
            ].map((item) => {
              const isSelected = selectedCourses.includes(item.id);
              return (
                <div key={item.id} className="relative">
                  <div
                    onClick={() => toggleCourse(item.id)}
                    className={`relative rounded-2xl aspect-[4/3] overflow-hidden cursor-pointer border-2 transition-all group ${
                      isSelected ? "border-[#00FF66] shadow-[0_0_20px_rgba(0,255,102,0.3)] scale-[1.02]" : "border-white/10 hover:border-white/30"
                    }`}
                  >
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-full h-full object-cover filter grayscale contrast-125 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                    
                    {/* Check Circle Badge */}
                    <div className={`absolute top-2.5 sm:top-3 right-2.5 sm:right-3 w-5 sm:w-6 h-5 sm:h-6 rounded-full flex items-center justify-center text-xs font-bold transition-transform ${
                      isSelected ? "bg-[#00FF66] text-black scale-110" : "bg-black/60 text-white border border-white/20"
                    }`}>
                      {isSelected ? "✓" : "+"}
                    </div>

                    <div className="absolute bottom-2.5 sm:bottom-3 left-2.5 sm:left-3 text-xs sm:text-base font-black text-white">
                      {item.title}
                    </div>
                  </div>

                  {/* Red Box: Connector Button (+) on boundary line between left and right cards */}
                  {item.connector && (
                    <div className="absolute -right-3 sm:-right-4 top-1/2 -translate-y-1/2 z-20 w-6 sm:w-7 h-6 sm:h-7 rounded-full bg-[#00FF66] text-black font-black flex items-center justify-center text-xs sm:text-sm shadow-[0_0_12px_rgba(0,255,102,0.8)] border border-black pointer-events-none">
                      {item.connector}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Mobile Phone Mockup Section (Slimmer Mockup with Generous Top, Left & Right Spacing) */}
          <div className="lg:col-span-5 flex flex-col justify-end items-center lg:items-center text-left h-full px-2 sm:px-4">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight mb-6 sm:mb-8 text-center lg:text-left w-full">
              내가 직접 만드는<br />
              <span className="text-[#00FF66]">나만의 꿀조합 콜라보!</span>
            </h3>

            {/* Smartphone White UI Shell Mockup (Slimmer max-w-[250px] for elegant margins on top, left & right) */}
            <div className="w-full max-w-[240px] sm:max-w-[255px] aspect-[9/18] rounded-[2.8rem] bg-white text-slate-900 p-3.5 sm:p-4 shadow-2xl border-4 border-slate-200 flex flex-col justify-between mx-auto shrink-0 mt-4">
              {/* Top Notch Dynamic Island Capsule */}
              <div className="w-14 h-2.5 bg-black rounded-full mx-auto mb-1 shrink-0" />

              <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 shrink-0">
                <span className="text-[10px] font-bold text-slate-800">반가워요, 김콜라님 👋</span>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              {/* QOLLAB PASS Active Switch Bar */}
              <div className="bg-black text-white p-2 sm:p-2.5 rounded-xl flex items-center justify-between shadow-md shrink-0">
                <div>
                  <span className="text-[8px] font-bold text-slate-400 block">QOLLAB PASS</span>
                  <span className="text-[10px] font-black text-[#00FF66]">Active</span>
                </div>
                <div className="w-8 h-4 bg-[#00FF66] rounded-full flex items-center justify-end p-0.5 shadow-inner">
                  <div className="w-3 h-3 rounded-full bg-black" />
                </div>
              </div>

              {/* My Package Item Cards with Green Left Accent Bar */}
              <div className="space-y-1.5 pt-0.5 text-left flex-1 flex flex-col justify-center">
                <span className="text-[9.5px] font-bold text-slate-600 block">나의 꿀조합 패키지</span>

                <div className="p-1.5 sm:p-2 rounded-lg bg-slate-50 border border-slate-100 border-l-3 border-l-[#00FF66] flex items-center justify-between shadow-xs">
                  <div>
                    <span className="text-[7.5px] text-slate-400 block font-semibold">[나이키]</span>
                    <p className="text-[9.5px] font-bold text-slate-900 leading-tight">나이키 스니커 20% OFF</p>
                    <p className="text-[8px] text-slate-400 line-through">₩189,000</p>
                  </div>
                  <span className="text-[9.5px] font-black text-slate-900 shrink-0 ml-1">₩151,200</span>
                </div>

                <div className="p-1.5 sm:p-2 rounded-lg bg-slate-50 border border-slate-100 border-l-3 border-l-[#00FF66] flex items-center justify-between shadow-xs">
                  <div>
                    <span className="text-[7.5px] text-slate-400 block font-semibold">[CGV]</span>
                    <p className="text-[9.5px] font-bold text-slate-900 leading-tight">CGV 영화관람권 15% OFF</p>
                    <p className="text-[8px] text-slate-400 line-through">₩15,000</p>
                  </div>
                  <span className="text-[9.5px] font-black text-slate-900 shrink-0 ml-1">₩12,750</span>
                </div>

                <div className="p-1.5 sm:p-2 rounded-lg bg-slate-50 border border-slate-100 border-l-3 border-l-[#00FF66] flex items-center justify-between shadow-xs">
                  <div>
                    <span className="text-[7.5px] text-slate-400 block font-semibold">[베스킨라빈스]</span>
                    <p className="text-[9.5px] font-bold text-slate-900 leading-tight">파인트 10% OFF</p>
                    <p className="text-[8px] text-slate-400 line-through">₩9,800</p>
                  </div>
                  <span className="text-[9.5px] font-black text-slate-900 shrink-0 ml-1">₩8,820</span>
                </div>
              </div>

              {/* Total Saved Button */}
              <button
                onClick={onExploreApp}
                className="w-full bg-[#00FF66] text-black font-extrabold py-2 rounded-full text-[9.5px] flex items-center justify-between px-2.5 shadow-md hover:bg-[#00e65c] transition cursor-pointer shrink-0 mt-1"
              >
                <span>총 혜택 절감액: ₩48,500</span>
                <span className="font-black">➔</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Quote */}
        <p className="mt-12 sm:mt-16 text-center text-slate-400 text-xs sm:text-sm font-semibold leading-relaxed">
          &apos;소비자는 직접 묶어 더 싸게 사고, 사장님과 브랜드는 손님이 늘어나 모두가 이득입니다.&apos;
        </p>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 3: PROBLEM STATEMENT (BRIGHT YELLOW BACKGROUND)       */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="bg-[#FFEE00] text-black py-16 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-10 sm:space-y-12 text-center">
          {/* Red Box: 50s Korean Merchant Disappointed Photo Banner */}
          <div className="rounded-2xl sm:rounded-3xl overflow-hidden relative shadow-2xl max-w-4xl mx-auto border-3 sm:border-4 border-black aspect-[16/9] sm:aspect-[21/9] min-h-[240px]">
            <img
              src="/images/korean_merchant_disappointed.png"
              alt="실망하고 있는 한국인 50대 사장님"
              className="w-full h-full object-cover filter contrast-125 brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30" />
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4 sm:p-6 text-white space-y-2 sm:space-y-3">
              <h3 className="text-xl sm:text-3xl lg:text-4xl font-black tracking-tight drop-shadow-lg leading-tight">
                &quot;배달·광고 수수료만 30%...<br />팔수록 남는 게 없다&quot;
              </h3>
              <p className="text-xs sm:text-base text-[#FFEE00] font-black max-w-xl drop-shadow-md">
                음식값 20,000원 주문 시 수수료·광고비·배달비로 6,500원 지출 (실질 부담률 32.4%)
              </p>
              <span className="text-[9px] sm:text-xs text-slate-300 font-bold opacity-90">[출처: 중소기업뉴스 / 연합뉴스 소상공인 배달 앱 수수료 실태 조사 보도 자료]</span>
            </div>
          </div>

          {/* Section 3 Big Headline */}
          <div className="space-y-3 sm:space-y-4 pt-2 sm:pt-4">
            <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter font-mono uppercase leading-[0.95]">
              ZERO AD SPEND.<br />
              MAXIMUM SYNERGY.
            </h2>
            <p className="text-sm sm:text-lg lg:text-xl font-extrabold max-w-3xl mx-auto leading-relaxed text-black">
              비싼 출혈 경쟁은 끝났습니다. AI 알고리즘이 만든 상권 무한 시너지 생태계 Qollab.
            </p>
          </div>

          {/* SECTION 4: 2 Bento Cards with Very Subtle Warm Yellow Tone (bg-[#F8E300]) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 text-left max-w-5xl mx-auto pt-2 sm:pt-4">
            {/* Card 1 */}
            <div className="bg-[#F8E300] rounded-2xl sm:rounded-3xl p-5 sm:p-7 border-none shadow-md space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="text-lg sm:text-2xl font-black text-black">AI V.I.M 가치-인센티브 매칭 엔진</h3>
                <p className="text-xs sm:text-sm text-slate-900 leading-relaxed font-extrabold">
                  고객 동선과 지출 성향을 분석하여 매장 간 서로의 고객을 교차 유입(Cross-Sharing)시키는 최적의 결합 인센티브를 자동 설계합니다.
                </p>
              </div>
              <div className="rounded-xl sm:rounded-2xl overflow-hidden aspect-[16/9] shadow-md bg-black border-none">
                <img
                  src="/images/qollab_vim_hand_mockup.png"
                  alt="AI V.I.M Engine"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-[#F8E300] rounded-2xl sm:rounded-3xl p-5 sm:p-7 border-none shadow-md space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="text-lg sm:text-2xl font-black text-black">PRISM 교차 상권 시너지 연산 Matrix</h3>
                <p className="text-xs sm:text-sm text-slate-900 leading-relaxed font-extrabold">
                  독자적 시너지 연산 알고리즘이 광고비 0원으로 단골 고객이 끊임없이 순환하는 고효율 상권 네트워크를 형성합니다.
                </p>
              </div>
              <div className="rounded-xl sm:rounded-2xl overflow-hidden aspect-[16/9] shadow-md bg-black border-none">
                <img
                  src="/images/qollab_prism_matrix_display.png"
                  alt="PRISM Matrix"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>




          {/* SECTION 6: 3 Grid Black Cards placed inside Bright Yellow Background matching Reference Image 2 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 text-left max-w-5xl mx-auto pt-6 sm:pt-8">
            {/* Card 1 */}
            <div className="rounded-2xl sm:rounded-3xl bg-black p-6 sm:p-7 flex flex-col justify-end min-h-[220px] sm:min-h-[250px] relative overflow-hidden shadow-2xl border-none">
              <img
                src="/images/qollab_prism_matrix_display.png"
                alt="AI 자동 매칭"
                className="absolute inset-0 w-full h-full object-cover opacity-25 filter contrast-150"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
              <div className="relative z-20 space-y-1.5 text-left">
                <span className="text-3xl sm:text-4xl font-black text-white tracking-tighter block font-mono">
                  3초 만에
                </span>
                <p className="text-xs font-extrabold text-[#00FF66] flex items-center">
                  <span className="w-2 h-2 rounded-xs bg-[#00FF66] mr-1.5 inline-block" />
                  AI 자동 매칭
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="rounded-2xl sm:rounded-3xl bg-black p-6 sm:p-7 flex flex-col justify-end min-h-[220px] sm:min-h-[250px] relative overflow-hidden shadow-2xl border-none">
              <img
                src="/images/qollab_card2_zero_wallet_bg.png"
                alt="고정 광고비 0원"
                className="absolute inset-0 w-full h-full object-cover opacity-35 filter contrast-125"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
              <div className="relative z-20 space-y-1.5 text-left">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#00FF66] text-black text-[10px] font-black mb-1 shadow-md">
                  매장수수료 단 3.5%
                </span>
                <span className="text-3xl sm:text-4xl font-black text-[#00FF66] tracking-tighter block font-mono">
                  ZERO
                </span>
                <p className="text-xs font-extrabold text-white">고정 광고비 0원!</p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="rounded-2xl sm:rounded-3xl bg-black p-6 sm:p-7 flex flex-col justify-end min-h-[220px] sm:min-h-[250px] relative overflow-hidden shadow-2xl border-none">
              <img
                src="/images/qollab_vim_hand_mockup.png"
                alt="실시간 복합 정산"
                className="absolute inset-0 w-full h-full object-cover opacity-30 filter contrast-125"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
              <div className="relative z-20 space-y-1.5 text-left">
                <span className="text-3xl sm:text-4xl font-black text-white tracking-tighter block font-mono">
                  100%
                </span>
                <p className="text-xs font-extrabold text-[#00FF66]">실시간 복합 정산</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 7: YELLOW BANNER CTA                                  */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="bg-[#FFEE00] text-black pb-16 sm:pb-20 pt-4 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-5 sm:space-y-6">
          <p className="text-sm sm:text-xl font-black leading-snug">
            지금은 혼자만의 영업은 끝났습니다. AI 시너지 알고리즘과 함께 무한한 매출의 장을 열어보세요.
          </p>
          <button
            onClick={onExploreApp}
            className="bg-black hover:bg-slate-900 text-white font-extrabold px-6 sm:px-8 py-3.5 sm:py-4 rounded-full text-xs sm:text-sm shadow-xl transition-all cursor-pointer inline-flex items-center space-x-2"
          >
            <span>📱 QR 코드 스캔하고 퀵스타트 시작하기</span>
          </button>
        </div>
      </section>


      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 8: MERCHANT TESTIMONIALS                              */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-black">
        <div className="space-y-3 sm:space-y-4 max-w-3xl mb-10 sm:mb-12 text-center mx-auto">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            부천 상권에서 먼저 경험한<br />사장님과 손님들의 진짜 이야기
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            광고비 부담을 줄이고 손님 유입과 매출이 늘어난 사장님들의 실제 검증된 Qollab 추천 리뷰.
          </p>
        </div>

        {/* 2 Merchant Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Merchant 1 (Image 1: Bakery Owner) */}
          <div className="rounded-2xl sm:rounded-3xl bg-slate-900 border border-white/10 overflow-hidden flex flex-col justify-between">
            <div className="aspect-[16/9] sm:aspect-[4/3] w-full overflow-hidden">
              <img
                src="/images/review_1_bakery.jpg"
                alt="박미자 님 베이커리 사장님"
                className="w-full h-full object-cover filter contrast-110"
              />
            </div>
            <div className="p-5 sm:p-6 space-y-2.5 sm:space-y-3">
              <span className="text-[10px] sm:text-[11px] text-slate-400 block font-bold">박미자 님 (58세, 부천 중동 베이커리)</span>
              <h3 className="text-base sm:text-lg font-black text-[#00FF66]">
                평일 매출 +168% | 고정 광고비 0원
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                &quot;배달 앱 깃발 광고를 안 셌는데도 서사배고 오신 손님들이 영수증을 들고 카페 메뉴를 무료로 찾아왔어요. 순이익률이 25%나 뛰었습니다.&quot;
              </p>
            </div>
          </div>

          {/* Merchant 2 (Image 2: Galbi Restaurant Owner) */}
          <div className="rounded-2xl sm:rounded-3xl bg-slate-900 border border-white/10 overflow-hidden flex flex-col justify-between">
            <div className="aspect-[16/9] sm:aspect-[4/3] w-full overflow-hidden">
              <img
                src="/images/review_2_galbi.jpg"
                alt="김성훈 님 숯불갈비 사장님"
                className="w-full h-full object-cover filter contrast-110"
              />
            </div>
            <div className="p-5 sm:p-6 space-y-2.5 sm:space-y-3">
              <span className="text-[10px] sm:text-[11px] text-slate-400 block font-bold">김성훈 님 (47세, 부천 상동 숯불갈비)</span>
              <h3 className="text-base sm:text-lg font-black text-[#00FF66]">
                피크 타임 +42% | 수수료 단 3.5%
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                &quot;30% 넘는 수수료 떼이다가 실제 결제된 금액 3.5% 정산받으니 숨통이 틉니다. 텅 비었던 유휴 시간에 손님이 많아져 매출 신장에 최고예요.&quot;
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 9: CUSTOMER REVIEWS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 pt-6 sm:pt-8">
          {/* Customer 1 (Image 3: Korean Male Customer) */}
          <div className="rounded-2xl sm:rounded-3xl bg-slate-900 border border-white/10 overflow-hidden flex flex-col justify-between">
            <div className="aspect-[16/9] sm:aspect-[4/3] w-full overflow-hidden">
              <img
                src="/images/review_3_man.jpg"
                alt="이현우 님 직장인 고객"
                className="w-full h-full object-cover filter contrast-110"
              />
            </div>
            <div className="p-5 sm:p-6 space-y-2.5 sm:space-y-3">
              <span className="text-[10px] sm:text-[11px] text-slate-400 block font-bold">이현우 님 (28세, 부천 중동 직장인)</span>
              <h3 className="text-base sm:text-lg font-black text-purple-400">
                데이트 코스 중 38% (18,200원) 절감
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                &quot;주말마다 데이트 코스 짜는 스트레스가 컸는데, 영화-식사-카페를 모을수록 할인이 커지니까 안 쓸 이유가 없더라고요.&quot;
              </p>
            </div>
          </div>

          {/* Customer 2 (Image 4: Korean Female Customer) */}
          <div className="rounded-2xl sm:rounded-3xl bg-slate-900 border border-white/10 overflow-hidden flex flex-col justify-between">
            <div className="aspect-[16/9] sm:aspect-[4/3] w-full overflow-hidden">
              <img
                src="/images/review_4_woman.jpg"
                alt="정주연 님 대학생 고객"
                className="w-full h-full object-cover filter contrast-110"
              />
            </div>
            <div className="p-5 sm:p-6 space-y-2.5 sm:space-y-3">
              <span className="text-[10px] sm:text-[11px] text-slate-400 block font-bold">정주연 님 (23세, 부천 상동 대학생)</span>
              <h3 className="text-base sm:text-lg font-black text-purple-400">
                일상 패키지 중 32% (24,500원) 절감
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                &quot;집 근처 원래 가던 셀프 사진관 매장 혜택까지 한번에 결합되니 정말 알차요. 친구들에게도 적극 추천하고 있습니다!&quot;
              </p>
            </div>
          </div>
        </div>


      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 10: CAPITALISM VISION & 3 PILLARS                      */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-black border-t border-white/10">
        <div className="space-y-3 sm:space-y-4 max-w-6xl mb-10 sm:mb-14 text-center mx-auto flex flex-col items-center">
          <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-snug sm:leading-tight text-center">
            200년 자본주의의 무한 경쟁을 끝내고,<br />데이터 기반 협업의 시대를 엽니다.
          </h2>
          <p className="text-xs sm:text-base text-[#00FF66] font-bold text-center">
            경쟁에서 살아남는 게 아닙니다. Qollab의 AI 상권 매칭으로 함께 시장을 300% 키웁니다.
          </p>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-3xl text-center mx-auto">
            대한민국 800만 소상공인과 글로벌 커머스를 잇는 세상에 없던 새로운 협업 운영체제(OS). 무한 경쟁으로 소모되던 마케팅 비용을 없애고, 유휴수요를 자극하는 새로운 구매동력을 창출합니다.
          </p>
        </div>

        {/* 3 Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="rounded-2xl sm:rounded-3xl bg-[#141416] border border-white/10 p-5 sm:p-8 space-y-3 sm:space-y-4 flex flex-col justify-between items-center text-center">
            <div className="space-y-2 text-center">
              <h3 className="text-lg sm:text-2xl font-black text-white font-mono">CAC -&gt; 0원</h3>
              <p className="text-xs font-bold text-[#00FF66] leading-snug">
                LTV/CAC 77.8배<br />(글로벌 최상위 유닛 이코노믹스)
              </p>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed text-center">
              상권 내 고객을 서로 교차 유입시키는 자생적 그로스 사이클 구조로 외부 마케팅 비용을 제로화했습니다. 점당 바이럴로 CAC는 매년 43% 절감됩니다.
            </p>
          </div>

          <div className="rounded-2xl sm:rounded-3xl bg-[#141416] border border-white/10 p-5 sm:p-8 space-y-3 sm:space-y-4 flex flex-col justify-between items-center text-center">
            <div className="space-y-2 text-center">
              <h3 className="text-lg sm:text-2xl font-black text-white font-mono">3중 무적 혜자</h3>
              <p className="text-xs font-bold text-[#00FF66] leading-snug">
                기존 대기업 플랫폼이 절대 따라올 수 없는<br />수익구조의 함정
              </p>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed text-center">
              수수료 30%에 의존하는 기존 배달앱에 공통된 Qollab의 3.5% 상생 모델을 모방하는 순간 기존 매출의 90%가 파괴되므로 진입이 구조적으로 불가능합니다.
            </p>
          </div>

          <div className="rounded-2xl sm:rounded-3xl bg-[#141416] border border-white/10 p-5 sm:p-8 space-y-3 sm:space-y-4 flex flex-col justify-between items-center text-center">
            <div className="space-y-2 text-center">
              <h3 className="text-lg sm:text-2xl font-black text-purple-400 font-mono">TAM $18.6조</h3>
              <p className="text-xs font-bold text-[#00FF66] leading-snug">
                3.5%는 임대료일 뿐, 진짜 엔진은<br />V.I.M 매칭 피 (마진 85%+)
              </p>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed text-center">
              3.5% 결제 수수료는 손익분기 유지용 임대료입니다. AI 기반 매출 증분 유통 시 발생하는 V.I.M 매칭 피와 SaaS 데이터 B2B로 Y5 매출 5,000억·영업이익 1,200억을 달성합니다.
            </p>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 11: QOLLAB MILESTONE (ROADMAP)                         */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section id="section-milestones" className="py-16 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-black border-t border-white/10">
        <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-white font-mono uppercase mb-12 sm:mb-16 leading-snug sm:leading-tight text-center">
          QOLLAB MILESTONE: 로컬 상권에서<br />글로벌 커머스 OS로 (2030 IPO 1조원+)
        </h2>

        {/* Timeline Roadmap matching exact user reference image */}
        <div className="relative">
          {/* Horizon Timeline Line */}
          <div className="absolute top-4 sm:top-5 left-10 right-10 h-[1px] bg-slate-800 hidden sm:block z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-6 relative z-10">
            {[
              {
                step: "1",
                stage: <>Stage 1: 로컬 거점 검증 &amp;<br />전국 확장</>,
                desc: "부천 PoC 8종 완료 -> 서울 주요 핫플레이스(성수, 강남, 홍대) 및 전국 8대도시 소상공인 인프라 구축.",
                circleStyle: "border-2 border-[#00FF66] text-[#00FF66] bg-black",
                titleColor: "text-[#00FF66]"
              },
              {
                step: "2",
                stage: <>Stage 2: 대형 브랜드 &amp;<br />이종 플랫폼 결합</>,
                desc: "나이키, CGV, 대형 F&B 프랜차이즈 연동 -> 다브랜드 꿀조합 패키지 유통 생태계 완성.",
                circleStyle: "border-2 border-slate-400 text-slate-200 bg-black",
                titleColor: "text-white"
              },
              {
                step: "3",
                stage: <>Stage 3: AI 데이터 API B2B<br />모듈화 &amp; 아시아 진출</>,
                desc: "지자체·금융사 대상 PRISM 결합 데이터 API 판매 -> 일본 도쿄·오사카 및 동남아 4개 도시 직진출.",
                circleStyle: "border-2 border-slate-400 text-slate-200 bg-black",
                titleColor: "text-white"
              },
              {
                step: "4",
                stage: <>Stage 4: 글로벌 스마트시티<br />커머스 OS &amp; IPO</>,
                desc: "UN/ISO 국제 표준화 선정 -> 100개 도시 글로벌 확장 및 기업가치 1조원+ IPO 달성.",
                circleStyle: "border-2 border-purple-500 text-purple-400 bg-black",
                titleColor: "text-purple-400"
              }
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center text-center space-y-3">
                <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full font-bold flex items-center justify-center text-xs sm:text-sm ${item.circleStyle}`}>
                  {item.step}
                </div>
                <h3 className={`text-xs sm:text-sm md:text-base font-black leading-snug text-center ${item.titleColor}`}>
                  {item.stage}
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed text-center">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 12: CTA BUTTONS SECTION                                */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 px-4 text-center bg-black border-t border-white/10">
        <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 flex flex-col items-center">
          <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white leading-snug sm:leading-tight text-center">
            경쟁의 시대는 끝났습니다. 지금 Qollab과 함께<br />협업의 시대로 들어오십시오.
          </h2>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full">
            <button
              onClick={onExploreApp}
              className="w-full sm:w-auto bg-[#00FF66] hover:bg-[#00e65c] text-black font-extrabold px-6 sm:px-8 py-3.5 sm:py-4 rounded-full text-xs sm:text-sm shadow-xl transition-all cursor-pointer flex items-center justify-center space-x-2"
            >
              <span>💚 파트너십 / 제휴 입점 신청하기</span>
            </button>
            <button
              onClick={onExploreApp}
              className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white font-extrabold px-6 sm:px-8 py-3.5 sm:py-4 rounded-full text-xs sm:text-sm border border-white/20 transition-all cursor-pointer flex items-center justify-center space-x-2"
            >
              <span>📊 Investor Deck (IR 자본금 &amp; 로드맵) 요청</span>
            </button>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 13: WHITE CLEAN FOOTER                                */}
      {/* ───────────────────────────────────────────────────────────── */}
      <footer className="bg-white text-black py-12 sm:py-16 px-4 sm:px-6 lg:px-8 text-left border-t border-slate-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-10 sm:mb-12">
          {/* Brand Info */}
          <div className="space-y-3 sm:space-y-4 sm:col-span-2 md:col-span-1">
            <span className="text-xl sm:text-2xl font-black tracking-tighter text-black font-mono">
              QOLLAB
            </span>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              AI 기반 로컬 상권 그로스 패키징 마켓 플랫폼.
            </p>
            <div className="flex items-center space-x-3 pt-1">
              <div className="bg-white p-1 rounded-lg border border-slate-300 shadow-sm flex items-center justify-center shrink-0">
                <QRCodeSVG
                  value="https://qollab.co.kr"
                  size={58}
                  bgColor="#FFFFFF"
                  fgColor="#000000"
                  level="M"
                />
              </div>
              <div className="text-left">
                <p className="text-xs font-black text-slate-900 leading-tight">📱 Qollab 앱 바로가기</p>
              </div>
            </div>
          </div>

          {/* Nav Column 1 */}
          <div className="space-y-2 text-xs">
            <h4 className="font-extrabold text-slate-900 mb-2 sm:mb-3">플랫폼</h4>
            <p className="text-slate-600 hover:text-black cursor-pointer">코스형 패키지 안내</p>
            <p className="text-slate-600 hover:text-black cursor-pointer">AI V.I.M 매칭 엔진</p>
            <p className="text-slate-600 hover:text-black cursor-pointer">PRISM 상권 연산 시너지</p>
            <p className="text-slate-600 hover:text-black cursor-pointer">입점점 스토리 &amp; 도큐</p>
          </div>

          {/* Nav Column 2 */}
          <div className="space-y-2 text-xs">
            <h4 className="font-extrabold text-slate-900 mb-2 sm:mb-3">파트너 &amp; 투자</h4>
            <p className="text-slate-600 hover:text-black cursor-pointer">소상공인 입점 신청 (광고비 0원)</p>
            <p className="text-slate-600 hover:text-black cursor-pointer">제휴 및 브랜드 콜라보 문의</p>
            <p className="text-slate-600 hover:text-black cursor-pointer">IR 자료 (Investor Deck) 요청</p>
            <p className="text-slate-600 hover:text-black cursor-pointer">B2B 데이터 API 솔루션</p>
          </div>

          {/* Nav Column 3 */}
          <div className="space-y-2 text-xs">
            <h4 className="font-extrabold text-slate-900 mb-2 sm:mb-3">고객지원 &amp; 기업정보</h4>
            <p className="text-slate-800 font-bold">📞 고객센터: 1588-2040</p>
            <p className="text-slate-600">support@qollab.life</p>
            <p className="text-slate-600 hover:text-black cursor-pointer">자주 묻는 질문 (FAQ)</p>
            <p className="text-slate-600 hover:text-black cursor-pointer">뉴스룸</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 sm:pt-8 border-t border-slate-200 text-xs text-slate-600 space-y-3">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 font-medium">
            <p><span className="font-bold text-slate-800">상호:</span> 카피바라하늘</p>
            <span className="hidden sm:inline text-slate-300">|</span>
            <p><span className="font-bold text-slate-800">대표자:</span> 최도승</p>
            <span className="hidden sm:inline text-slate-300">|</span>
            <p><span className="font-bold text-slate-800">사업자 등록번호:</span> 593-73-00603</p>
          </div>
          <p className="font-medium"><span className="font-bold text-slate-800">주소:</span> 경기도 부천시 원미구 부일로 232 사회적경제센터 소셜랩 4층 015호</p>
          <div className="pt-2 flex items-center gap-3">
            <span className="font-bold text-slate-900 text-xs">단비기업 사업비로 제작됨</span>
            <img src="/bucheon-se-logo.png" alt="부천시사회적경제센터" className="h-7 sm:h-8 object-contain" />
          </div>

          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[10px] sm:text-[10.5px] text-slate-500">
            <p>© 2026 QOLLAB Inc. All rights reserved.</p>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <a href="#" className="hover:underline">개인정보처리방침</a>
              <a href="#" className="hover:underline">이용약관</a>
              <a href="#" className="hover:underline">위치기반서비스 이용약관</a>
              <a href="#" className="hover:underline">소상공인 상생 협약</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
