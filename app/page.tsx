"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  Zap, 
  Bell, 
  Utensils, 
  Tag, 
  Heart, 
  Scissors, 
  Activity, 
  Dog, 
  Home as HomeIcon, 
  Plane, 
  ChevronRight, 
  ChevronLeft, 
  Plus, 
  ShoppingBag,
  Building2,
  Ticket
} from "lucide-react";
import { calculateVIMSCTScore } from "@/lib/domain/vim-matching";
import { formatKRW } from "@/lib/utils";
import BottomNavBar from "@/components/BottomNavBar";

export default function Home() {
  const [mode, setMode] = useState<"consumer" | "biz">("consumer");
  const [promptInput, setPromptInput] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);

  // 7 Rolling Advertisement Banners
  const rollingBanners = [
    {
      id: 1,
      title: "[전국 어디서나] CGV 영화관람권 2매 + 베스킨라빈스 파인트",
      sub: "주말 영화 & 디저트 초특가 결합 패키지",
      discount: "45% OFF",
      price: 24900,
      origPrice: 45000,
      tag: "전국 브랜드 핫딜",
      bgGradient: "from-blue-900 via-indigo-900 to-slate-900",
    },
    {
      id: 2,
      title: "[전국 매장] 투썸플레이스 케이크 + 스타벅스 아메리카노 콤보",
      sub: "오피스 라이프를 위한 메가 프리미엄 카페 결합권",
      discount: "40% OFF",
      price: 18500,
      origPrice: 31000,
      tag: "전국 브랜드 핫딜",
      bgGradient: "from-indigo-950 via-purple-900 to-slate-900",
    },
    {
      id: 3,
      title: "[올리브영 X 롭스] K-뷰티 인기 스킨케어 1+1 기획 세트",
      sub: "전국 어디서나 교환 가능한 전용 바우처",
      discount: "50% OFF",
      price: 29000,
      origPrice: 58000,
      tag: "전국 브랜드 핫딜",
      bgGradient: "from-emerald-950 via-teal-900 to-slate-900",
    },
    {
      id: 4,
      title: "[메가박스 X 던킨] 팝콘콤보 + 도넛 6개입 시그니처 팩",
      sub: "문화 체험과 디저트의 완벽한 얼라이언스",
      discount: "42% OFF",
      price: 21000,
      origPrice: 36000,
      tag: "전국 브랜드 핫딜",
      bgGradient: "from-amber-950 via-rose-950 to-slate-900",
    },
    {
      id: 5,
      title: "[전국 파리바게뜨 X 뚜레쥬르] 베이커리 브런치 통합 교환권",
      sub: "전국 3천개 매장 어디서나 자유 결제",
      discount: "38% OFF",
      price: 15500,
      origPrice: 25000,
      tag: "전국 브랜드 핫딜",
      bgGradient: "from-purple-950 via-pink-900 to-slate-900",
    },
    {
      id: 6,
      title: "[교보문고 X 왓챠 1개월] 도서 1권 + OTT 자유 이용권",
      sub: "휴식과 감성을 충전하는 프리미엄 문화 패키지",
      discount: "48% OFF",
      price: 19800,
      origPrice: 38000,
      tag: "전국 브랜드 핫딜",
      bgGradient: "from-slate-900 via-indigo-900 to-blue-950",
    },
    {
      id: 7,
      title: "[GS25 X CU] 편의점 프리미엄 수제맥주 4캔 + 스낵 모음전",
      sub: "전국 어디서나 편하게 즐기는 홈술 콜라보",
      discount: "46% OFF",
      price: 13900,
      origPrice: 26000,
      tag: "전국 브랜드 핫딜",
      bgGradient: "from-zinc-900 via-stone-900 to-slate-900",
    },
  ];

  // Auto-slide carousel effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % rollingBanners.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [rollingBanners.length]);

  // Categories list matching design image
  const categories = [
    { name: "미식 & 코스", icon: Utensils, href: "/packages?cat=gourmet", color: "text-amber-400 bg-amber-400/10" },
    { name: "브랜드 & 제품", icon: Tag, href: "/packages?cat=brand", color: "text-indigo-400 bg-indigo-400/10" },
    { name: "데이트 & 놀거리", icon: Heart, href: "/packages?cat=date", color: "text-rose-400 bg-rose-400/10" },
    { name: "뷰티 & 케어", icon: Scissors, href: "/packages?cat=beauty", color: "text-purple-400 bg-purple-400/10" },
    { name: "헬스 & 웰니스", icon: Activity, href: "/packages?cat=health", color: "text-emerald-400 bg-emerald-400/10" },
    { name: "펫 & 패밀리", icon: Dog, href: "/packages?cat=pet", color: "text-orange-400 bg-orange-400/10" },
    { name: "생활 & 서비스", icon: HomeIcon, href: "/packages?cat=living", color: "text-blue-400 bg-blue-400/10" },
    { name: "여행", icon: Plane, href: "/packages?cat=travel", color: "text-cyan-400 bg-cyan-400/10" },
  ];

  // Section 1: 우리동네 베스트 콜라보 packages
  const neighborhoodPackages = [
    {
      id: "pkg-local-1",
      title: "성수 힐링 일일 패키지 (카페 + 1:1 두피 스파)",
      subtitle: "성수 루프탑 로스터리 카페 + 성수 아틀리에 헤어",
      region: "서울 성동구 성수동",
      price: 49000,
      origPrice: 85000,
      discount: "42%",
      vimScore: 95,
      sales: "342개 판매 완료",
    },
    {
      id: "pkg-local-2",
      title: "성수 수제맥주 & 타파스 + 클래식 아날로그 재즈바",
      subtitle: "뚝섬 크래프트 비어 파일럿 + 성수 재즈클럽 레코드",
      region: "서울 성동구 성수동",
      price: 39000,
      origPrice: 68000,
      discount: "43%",
      vimScore: 92,
      sales: "289개 판매 완료",
    },
  ];

  // Section 2: 브랜드 콜라보 packages
  const brandPackages = [
    {
      id: "pkg-brand-1",
      title: "CGV 영화 2매 + 투썸플레이스 스페셜 케이크 세트",
      subtitle: "전국 CGV 극장 및 전국 투썸플레이스 어디서나 사용 가능",
      region: "전국 브랜드",
      price: 26000,
      origPrice: 48000,
      discount: "46%",
      vimScore: 97,
      sales: "1,204개 판매 완료",
    },
    {
      id: "pkg-brand-2",
      title: "올리브영 프리미엄 바우처 + 스벅 시즌 음료 2잔",
      subtitle: "뷰티와 프리미엄 카페의 인지도 1위 모바일 조합",
      region: "전국 브랜드",
      price: 31000,
      origPrice: 55000,
      discount: "44%",
      vimScore: 96,
      sales: "958개 판매 완료",
    },
  ];

  // Section 3: 새로운 콜라보 packages
  const newPackages = [
    {
      id: "pkg-new-1",
      title: "연남동 브런치 갤러리 카페 + 가죽 공예 클래스 체험",
      subtitle: "연남 아뜰리에 + 어반 크래프트 스튜디오",
      region: "서울 마포구 연남동",
      price: 54000,
      origPrice: 90000,
      discount: "40%",
      vimScore: 90,
      sales: "신규 출시",
    },
    {
      id: "pkg-new-2",
      title: "강남 럭셔리 필라테스 유휴시간 + 유기농 샐러드 바우처",
      subtitle: "센트럴 피트니스 + 그린 샐러드 역삼점",
      region: "서울 강남구 역삼동",
      price: 42000,
      origPrice: 75000,
      discount: "44%",
      vimScore: 91,
      sales: "신규 출시",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0C0C0E] text-white pb-24">
      {/* 1. Header & Mode Switcher Row */}
      <div className="sticky top-0 z-30 bg-[#121215]/95 backdrop-blur-md border-b border-slate-800/80 px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl font-black tracking-wider text-white">QOLLAB</span>
            <span className="rounded-md bg-indigo-500/20 px-2 py-0.5 text-[10px] font-extrabold text-indigo-400 border border-indigo-500/30">
              V.I.M
            </span>
          </div>

          <div className="flex items-center space-x-3">
            {/* Mode Switcher Toggle */}
            <div className="flex items-center space-x-2 bg-slate-900 p-1 rounded-full border border-slate-800">
              <span className="text-[11px] font-extrabold text-slate-300 pl-2">BIZ</span>
              <button
                onClick={() => setMode(mode === "consumer" ? "biz" : "consumer")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  mode === "biz" ? "bg-amber-500" : "bg-slate-700"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    mode === "biz" ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Notification Bell */}
            <button className="relative rounded-full bg-slate-900 p-2 text-slate-300 hover:text-white border border-slate-800">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-rose-500 text-[9px] font-extrabold text-white">
                2
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 space-y-8">
        {/* 2. AI Package Recommendation Prompt Card (White Card) */}
        <div className="rounded-3xl bg-white p-4 sm:p-5 shadow-2xl text-slate-900 space-y-3">
          <div className="flex items-center space-x-2 text-xs font-bold text-indigo-600">
            <Sparkles className="h-4 w-4" />
            <span>AI 자연어 V.I.M 얼라이언스 패키지 추천</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <input
              type="text"
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              placeholder="예: 이번주 토요일 성수동 데이트 코스 5만원 이하 추천해줘"
              className="w-full rounded-2xl bg-gray-100 px-4 py-3 text-xs text-slate-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-gray-200 font-medium"
            />
            <button className="w-full sm:w-auto shrink-0 flex items-center justify-center space-x-1.5 rounded-2xl bg-emerald-600 px-5 py-3 text-xs font-black text-white shadow-md hover:bg-emerald-500 transition">
              <Zap className="h-4 w-4" />
              <span>AI 패키지 추천</span>
            </button>
          </div>
        </div>

        {/* 3. 추천 패키지 광고 (7개 롤링 카루셀 Banner) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold px-1">
            <span className="flex items-center gap-1 text-amber-400">
              <Sparkles className="h-3.5 w-3.5" />
              추천 패키지 광고 (7개 롤링)
            </span>
            <span>{currentSlide + 1} / {rollingBanners.length}</span>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-slate-800 shadow-2xl">
            <div
              className={`relative bg-gradient-to-r ${rollingBanners[currentSlide].bgGradient} p-6 text-white min-h-[160px] flex flex-col justify-between transition-all duration-700`}
            >
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="rounded-full bg-amber-400 text-slate-950 font-black text-[10px] px-2.5 py-0.5">
                    {rollingBanners[currentSlide].tag}
                  </span>
                  <span className="text-xs font-extrabold text-rose-400 bg-rose-500/20 px-2 py-0.5 rounded-full border border-rose-500/30">
                    {rollingBanners[currentSlide].discount}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-white leading-snug">
                  {rollingBanners[currentSlide].title}
                </h3>
                <p className="text-xs text-slate-300">
                  {rollingBanners[currentSlide].sub}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/10">
                <div>
                  <span className="text-xs text-slate-400 line-through mr-2">
                    {rollingBanners[currentSlide].origPrice.toLocaleString()}원
                  </span>
                  <span className="text-xl font-black text-amber-400">
                    {rollingBanners[currentSlide].price.toLocaleString()}원
                  </span>
                </div>

                <Link
                  href="/packages/pkg-brand-1"
                  className="flex items-center space-x-1 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur px-3.5 py-1.5 text-xs font-bold text-white transition border border-white/20"
                >
                  <span>구입하기</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Carousel Arrow Controls */}
            <button
              onClick={() =>
                setCurrentSlide((prev) => (prev === 0 ? rollingBanners.length - 1 : prev - 1))
              }
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-1.5 text-white hover:bg-black/70 transition"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() =>
                setCurrentSlide((prev) => (prev + 1) % rollingBanners.length)
              }
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-1.5 text-white hover:bg-black/70 transition"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            {/* Slide Indicators Dots */}
            <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 space-x-1">
              {rollingBanners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-1.5 rounded-full transition-all ${
                    currentSlide === idx ? "w-5 bg-amber-400" : "w-1.5 bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 4. 카테고리 그리드 (8대 지정 카테고리 & 퀵 필스) */}
        <div className="rounded-3xl bg-[#141417] p-5 border border-slate-800 space-y-4">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            카테고리 패키지 탐색
          </div>

          <div className="grid grid-cols-4 gap-3 text-center">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.name}
                  href={cat.href}
                  className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-900 border border-slate-800/80 hover:bg-slate-850 hover:border-slate-700 transition space-y-2 group"
                >
                  <div className={`p-2.5 rounded-2xl ${cat.color} group-hover:scale-110 transition-transform`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-200 group-hover:text-amber-400 transition leading-tight">
                    {cat.name}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Quick Category Pills */}
          <div className="flex items-center space-x-2 pt-2 border-t border-slate-800 text-xs overflow-x-auto pb-1">
            <span className="text-slate-500 font-bold shrink-0">추천 퀵 필터:</span>
            <Link href="/packages?cat=hospital" className="shrink-0 rounded-xl bg-slate-900 px-3 py-1.5 text-slate-300 border border-slate-800 hover:text-white font-bold">
              🏥 병원
            </Link>
            <Link href="/packages?cat=beauty" className="shrink-0 rounded-xl bg-slate-900 px-3 py-1.5 text-slate-300 border border-slate-800 hover:text-white font-bold">
              💈 뷰티
            </Link>
            <Link href="/packages?cat=openmarket" className="shrink-0 rounded-xl bg-slate-900 px-3 py-1.5 text-slate-300 border border-slate-800 hover:text-white font-bold">
              🛍️ 오픈마켓
            </Link>
          </div>
        </div>

        {/* 5. 섹션 1: 우리동네 베스트 콜라보 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <span>우리동네 베스트 콜라보</span>
                <span className="rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] px-2 py-0.5 font-bold">
                  BEST
                </span>
              </h2>
              <p className="text-xs text-slate-400">우리 동네에서 가장 인기 높은 알선 패키지 모음</p>
            </div>
            <Link
              href="/packages?category=local"
              className="flex items-center space-x-1 rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-bold text-amber-400 hover:bg-slate-800 border border-slate-800 transition"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>패키지 더보기</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {neighborhoodPackages.map((pkg) => (
              <div key={pkg.id} className="rounded-3xl bg-[#141417] p-5 border border-slate-800 space-y-3 hover:border-amber-500/40 transition">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                    V.I.M {pkg.vimScore}점
                  </span>
                  <span className="text-xs text-slate-400">{pkg.sales}</span>
                </div>
                <h3 className="font-extrabold text-white text-base leading-snug">{pkg.title}</h3>
                <p className="text-xs text-indigo-400 font-semibold">• {pkg.subtitle}</p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <div>
                    <span className="text-xs text-slate-500 line-through mr-1.5">{pkg.origPrice.toLocaleString()}원</span>
                    <span className="text-lg font-black text-amber-400">{pkg.price.toLocaleString()}원</span>
                  </div>
                  <Link href="/packages/pkg-demo-1" className="rounded-xl bg-amber-500 px-3.5 py-2 text-xs font-black text-slate-950 hover:bg-amber-400">
                    상세보기
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 6. 섹션 2: 브랜드 콜라보 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <span>브랜드 콜라보</span>
                <span className="rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-[10px] px-2 py-0.5 font-bold">
                  BRAND
                </span>
              </h2>
              <p className="text-xs text-slate-400">전국 어디서나 이용 가능한 메가 브랜드 패키지</p>
            </div>
            <Link
              href="/packages?category=brand"
              className="flex items-center space-x-1 rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-bold text-indigo-400 hover:bg-slate-800 border border-slate-800 transition"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>패키지 더보기</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {brandPackages.map((pkg) => (
              <div key={pkg.id} className="rounded-3xl bg-[#141417] p-5 border border-slate-800 space-y-3 hover:border-indigo-500/40 transition">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                    {pkg.region}
                  </span>
                  <span className="text-xs text-slate-400">{pkg.sales}</span>
                </div>
                <h3 className="font-extrabold text-white text-base leading-snug">{pkg.title}</h3>
                <p className="text-xs text-emerald-400 font-semibold">• {pkg.subtitle}</p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <div>
                    <span className="text-xs text-slate-500 line-through mr-1.5">{pkg.origPrice.toLocaleString()}원</span>
                    <span className="text-lg font-black text-indigo-400">{pkg.price.toLocaleString()}원</span>
                  </div>
                  <Link href="/packages/pkg-brand-1" className="rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-black text-white hover:bg-indigo-500">
                    상세보기
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 7. 섹션 3: 새로운 콜라보 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <span>새로운 콜라보</span>
                <span className="rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] px-2 py-0.5 font-bold">
                  NEW
                </span>
              </h2>
              <p className="text-xs text-slate-400">새롭게 등록된 다양한 맞춤형 콜라보 패키지</p>
            </div>
            <Link
              href="/packages?sort=new"
              className="flex items-center space-x-1 rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-bold text-emerald-400 hover:bg-slate-800 border border-slate-800 transition"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>패키지 더보기</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {newPackages.map((pkg) => (
              <div key={pkg.id} className="rounded-3xl bg-[#141417] p-5 border border-slate-800 space-y-3 hover:border-emerald-500/40 transition">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                    신규 핫딜
                  </span>
                  <span className="text-xs text-slate-400">{pkg.region}</span>
                </div>
                <h3 className="font-extrabold text-white text-base leading-snug">{pkg.title}</h3>
                <p className="text-xs text-amber-400 font-semibold">• {pkg.subtitle}</p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <div>
                    <span className="text-xs text-slate-500 line-through mr-1.5">{pkg.origPrice.toLocaleString()}원</span>
                    <span className="text-lg font-black text-emerald-400">{pkg.price.toLocaleString()}원</span>
                  </div>
                  <Link href="/packages/pkg-demo-2" className="rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-black text-white hover:bg-emerald-500">
                    상세보기
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 8. Bottom Sticky Navigation Bar */}
      <BottomNavBar mode={mode} />
    </div>
  );
}
