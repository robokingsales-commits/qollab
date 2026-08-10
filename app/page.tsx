"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  Zap, 
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
  RotateCcw,
  Crosshair,
  MapPin,
  Search,
  Boxes,
  PieChart,
  Store,
  Headphones,
  Building2,
  User
} from "lucide-react";
import Header from "@/components/Header";
import Category3DIcon from "@/components/Category3DIcons";
import BusinessLandingPage from "@/components/BusinessLandingPage";
import LocationComboSearchModal from "@/components/LocationComboSearchModal";
import CustomPlaceModal, { DesignatedPlace } from "@/components/CustomPlaceModal";
import CartDrawer from "@/components/CartDrawer";
import BottomNavBar from "@/components/BottomNavBar";
import { subscribeCart } from "@/lib/services/cart-service";
import {
  getPersonalizedQuickFilters,
  recordSearch,
  recordPackageView,
  recordCategoryClick,
  resetUserActivityDB,
  injectSamplePetBeerDB,
  QuickFilterItem,
} from "@/lib/services/recommendation-service";
import {
  getNeighborhoodPersonaPackages,
  getBrandPersonaPackages,
  PersonaPackageItem,
} from "@/lib/data/personaPackages";

const getPackageThumbnailInfo = (pkg: PersonaPackageItem) => {
  const text = `${pkg.store} ${pkg.category} ${pkg.title} ${pkg.product}`.toLowerCase();
  
  if (text.includes("베스킨") || text.includes("아이스크림") || text.includes("디저트")) {
    return {
      image: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=600&q=80",
      phrase: "달콤 시원 디저트 콤보",
      badgeColor: "bg-pink-600/90 text-white",
    };
  }
  if (text.includes("투썸") || text.includes("스타벅스") || text.includes("감성커피") || text.includes("아메리카노") || text.includes("카페") || text.includes("라떼")) {
    return {
      image: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=600&q=80",
      phrase: "카페 & 프리미엄 케이크 팩",
      badgeColor: "bg-amber-600/90 text-white",
    };
  }
  if (text.includes("cgv") || text.includes("영화") || text.includes("팝콘")) {
    return {
      image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80",
      phrase: "주말 영화 & 팝콘 핫딜",
      badgeColor: "bg-purple-600/90 text-white",
    };
  }
  if (text.includes("스파") || text.includes("헤어") || text.includes("뷰티") || text.includes("두피")) {
    return {
      image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80",
      phrase: "1:1 힐링 뷰티 케어 콤보",
      badgeColor: "bg-rose-600/90 text-white",
    };
  }
  if (text.includes("맥주") || text.includes("술") || text.includes("안주") || text.includes("호프")) {
    return {
      image: "https://images.unsplash.com/photo-1535958636474-b021ee887b13?auto=format&fit=crop&w=600&q=80",
      phrase: "퇴근길 수제맥주 & 안주 팩",
      badgeColor: "bg-amber-700/90 text-white",
    };
  }
  if (text.includes("펫") || text.includes("애견") || text.includes("강아지") || text.includes("반려")) {
    return {
      image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80",
      phrase: "댕댕이 힐링 케어 콤보",
      badgeColor: "bg-orange-600/90 text-white",
    };
  }
  if (text.includes("헬스") || text.includes("피트니스") || text.includes("운동")) {
    return {
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80",
      phrase: "에너지 피트니스 패키지",
      badgeColor: "bg-emerald-600/90 text-white",
    };
  }

  return {
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80",
    phrase: "우리동네 인기 핫딜 결합",
    badgeColor: "bg-[#071D49]/90 text-white",
  };
};

export default function Home() {
  const [viewLanding, setViewLanding] = useState<boolean>(true);
  const [mode, setMode] = useState<"consumer" | "biz">("consumer");
  const [promptInput, setPromptInput] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);

  // Multi-step Location Radius Combo Modal State
  const [isComboModalOpen, setIsComboModalOpen] = useState(false);

  // Dual-mode Location Engine State: GPS vs. Pin (장소 지정)
  const [locationMode, setLocationMode] = useState<"gps" | "pin">("gps");
  const [isCustomPlaceModalOpen, setIsCustomPlaceModalOpen] = useState(false);
  const [savedPlaces, setSavedPlaces] = useState<DesignatedPlace[]>([
    {
      id: "place-1",
      nickname: "우리집",
      address: "서울시 강남구 테헤란로 123",
      iconType: "home",
    },
    {
      id: "place-2",
      nickname: "사무실",
      address: "경기도 부천시 원미구 중동 1100",
      iconType: "office",
    },
  ]);
  const [activePlaceId, setActivePlaceId] = useState<string | null>("place-2");

  // Selected Category / Quick Filter State for lower sections
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  // Section visible counts (2x2 = 4 items default)
  const [neighborhoodVisibleCount, setNeighborhoodVisibleCount] = useState<number>(4);
  const [brandVisibleCount, setBrandVisibleCount] = useState<number>(4);

  // Personalized Recommendation Quick Filters State
  const [quickFilterState, setQuickFilterState] = useState<{
    isPersonalized: boolean;
    filters: QuickFilterItem[];
    badgeText: string;
  }>({
    isPersonalized: false,
    filters: [],
    badgeText: "🔥 인기 핫딜 (Cold-Start)",
  });

  // Cart Drawer State
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeCart(() => {
      // Subscribe to cart changes
    });
    return () => unsubscribe();
  }, []);

  const refreshQuickFilters = useCallback(() => {
    const res = getPersonalizedQuickFilters();
    setQuickFilterState(res);
  }, []);

  useEffect(() => {
    refreshQuickFilters();
  }, [refreshQuickFilters]);

  const handleRecordSearch = (query: string) => {
    if (!query.trim()) return;
    recordSearch(query);
    refreshQuickFilters();
  };

  const handleClearDB = () => {
    resetUserActivityDB();
    setSelectedFilter(null);
    refreshQuickFilters();
  };

  const handleInjectSampleDB = () => {
    injectSamplePetBeerDB();
    refreshQuickFilters();
  };

  const handleAddPlace = (newPlace: Omit<DesignatedPlace, "id">) => {
    const created: DesignatedPlace = {
      ...newPlace,
      id: `place-${Date.now()}`,
    };
    setSavedPlaces((prev) => [...prev, created]);
    setActivePlaceId(created.id);
    setLocationMode("pin");
  };

  const handleDeletePlace = (id: string) => {
    setSavedPlaces((prev) => prev.filter((p) => p.id !== id));
    if (activePlaceId === id) {
      setActivePlaceId(savedPlaces.find((p) => p.id !== id)?.id || null);
    }
  };

  const activePlace = savedPlaces.find((p) => p.id === activePlaceId);

  const handleQuickFilterClick = (query: string) => {
    const cleanQuery = query.replace(/^[🔥✨🐶☕🎬💆🍷🥐🏖️🎟️💄✂️🍷🍺🎨🐾🐕]/g, "").trim();
    handleRecordSearch(cleanQuery || query);
    setPromptInput(cleanQuery || query);
    setSelectedFilter(cleanQuery || query);
    setNeighborhoodVisibleCount(4);
    setBrandVisibleCount(4);
  };

  const handleCategorySelect = (categoryName: string) => {
    recordCategoryClick(categoryName);
    refreshQuickFilters();
    setSelectedFilter(categoryName);
    setNeighborhoodVisibleCount(4);
    setBrandVisibleCount(4);
  };

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
      image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: 2,
      title: "[전국 매장] 투썸플레이스 케이크 + 스타벅스 아메리카노 콤보",
      sub: "오피스 라이프를 위한 메가 프리미엄 카페 결합권",
      discount: "40% OFF",
      price: 18500,
      origPrice: 31000,
      tag: "전국 브랜드 핫딜",
      image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: 3,
      title: "[올리브영 X 롭스] K-뷰티 인기 스킨케어 1+1 기획 세트",
      sub: "전국 어디서나 교환 가능한 전용 바우처",
      discount: "50% OFF",
      price: 29000,
      origPrice: 58000,
      tag: "전국 브랜드 핫딜",
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: 4,
      title: "[메가박스 X 던킨] 팝콘콤보 + 도넛 6개입 시그니처 팩",
      sub: "문화 체험과 디저트의 완벽한 얼라이언스",
      discount: "42% OFF",
      price: 21000,
      origPrice: 36000,
      tag: "전국 브랜드 핫딜",
      image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: 5,
      title: "[전국 파리바게뜨 X 뚜레쥬르] 베이커리 브런치 통합 교환권",
      sub: "전국 3천개 매장 어디서나 자유 결제",
      discount: "38% OFF",
      price: 15500,
      origPrice: 25000,
      tag: "전국 브랜드 핫딜",
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: 6,
      title: "[교보문고 X 왓챠 1개월] 도서 1권 + OTT 자유 이용권",
      sub: "휴식과 감성을 충전하는 프리미엄 문화 패키지",
      discount: "48% OFF",
      price: 19800,
      origPrice: 38000,
      tag: "전국 브랜드 핫딜",
      image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: 7,
      title: "[GS25 X CU] 편의점 프리미엄 수제맥주 4캔 + 스낵 모음전",
      sub: "전국 어디서나 편하게 즐기는 홈술 콜라보",
      discount: "46% OFF",
      price: 13900,
      origPrice: 26000,
      tag: "전국 브랜드 핫딜",
      image: "https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=1200&q=80",
    },
  ];

  // Auto-slide carousel effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % rollingBanners.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [rollingBanners.length]);

  // 8 Categories
  const categories = [
    { name: "미식 & 코스", icon: Utensils },
    { name: "브랜드 & 제품", icon: Tag },
    { name: "데이트 & 놀거리", icon: Heart },
    { name: "뷰티 & 케어", icon: Scissors },
    { name: "헬스 & 웰니스", icon: Activity },
    { name: "펫 & 패밀리", icon: Dog },
    { name: "생활 & 서비스", icon: HomeIcon },
    { name: "여행", icon: Plane },
  ];

  const neighborhoodPackages = getNeighborhoodPersonaPackages();
  const brandPackages = getBrandPersonaPackages();

  if (viewLanding) {
    return <BusinessLandingPage onExploreApp={() => setViewLanding(false)} />;
  }

  return (
    <div className={mode === "biz" ? "bg-[#0A0D14] text-slate-100 min-h-screen transition-colors duration-300 pb-20 select-none" : "bg-white text-[#111111] min-h-screen transition-colors duration-300 pb-20"}>
      {/* Top Banner to Return to Business Landing Page */}
      <div className="bg-gradient-to-r from-[#071D49] via-indigo-900 to-[#071D49] text-white px-4 py-2 text-xs font-bold flex items-center justify-between shadow-md">
        <span className="flex items-center gap-1.5 truncate">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse shrink-0" />
          <span>Qollab 비즈니스 소개 랜딩페이지 둘러보기</span>
        </span>
        <button
          onClick={() => setViewLanding(true)}
          className="px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[10.5px] transition shrink-0 cursor-pointer"
        >
          소개 랜딩페이지 보기 ➔
        </button>
      </div>

      {/* Top Header with Mode Switcher & Cart */}
      <Header mode={mode} onModeChange={setMode} />

      {/* Main Content Body */}
      {mode === "biz" ? (
        /* BIZ MEMBER MODE FULL DASHBOARD & MENU TREE UI (BLACK BACKGROUND) */
        <div className="px-4 py-4 space-y-5 max-w-2xl mx-auto">
          {/* 1. 대쉬보드 (Dashboard - 페이지 상단에 항상 위치) */}
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 space-y-4 shadow-xl backdrop-blur-md">
            {/* Header & Store Status */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-sm font-black text-white flex items-center gap-1.5">
                    <span>베스킨라빈스 부천중동점</span>
                    <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300">BIZ Partner</span>
                  </h2>
                  <p className="text-[10.5px] text-slate-400">사업자 번호: 124-88-90123 (대쉬보드 상단)</p>
                </div>
              </div>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
                판매중 (정상 운영)
              </span>
            </div>

            {/* 실시간 요약 (Real-time Summary Cards) */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-slate-950/80 border border-slate-800/80 p-2.5 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-slate-400">오늘 발생 매출</span>
                <p className="text-xs sm:text-sm font-black text-white">₩1,240,000</p>
                <span className="text-[9px] text-emerald-400 font-bold">▲ 18.4% 상승</span>
              </div>
              <div className="bg-slate-950/80 border border-slate-800/80 p-2.5 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-slate-400">등록된 패키지</span>
                <p className="text-xs sm:text-sm font-black text-white">12개</p>
                <span className="text-[9px] text-blue-400 font-bold">자체 5 / 콜라보 7</span>
              </div>
              <div className="bg-slate-950/80 border border-slate-800/80 p-2.5 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-slate-400">수락 대기 제안</span>
                <p className="text-xs sm:text-sm font-black text-amber-400">3건</p>
                <span className="text-[9px] text-amber-400 font-bold">● 신규 제안</span>
              </div>
            </div>

            {/* 수락 대기 중인 콜라보 제안 알림 (Collaboration Proposal Banner) */}
            <div className="bg-gradient-to-r from-blue-950/60 to-indigo-950/60 border border-blue-800/50 p-3 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-start space-x-2">
                <Sparkles className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-bold text-white">[메가MGC커피 중동점] 님으로부터 제안도착!</p>
                  <p className="text-[11px] text-slate-300">&quot;빅사이즈 아메리카노 + 파인트 아이스크림 결합 팩 (20% 할인)&quot;</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 shrink-0 self-end sm:self-auto">
                <button className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold shadow-xs cursor-pointer transition">
                  수락하기
                </button>
                <button className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold cursor-pointer transition">
                  거절
                </button>
              </div>
            </div>
          </div>

          {/* 2. 패키지 센터 (제품 등록 등) */}
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 space-y-3.5 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-white flex items-center space-x-1.5">
                <Boxes className="h-4 w-4 text-indigo-400" />
                <span>패키지 센터 (제품 등록 및 관리)</span>
              </h3>
              <Link href="/owner/packages/new" className="text-[11px] font-bold text-indigo-400 hover:underline">
                + 새 패키지 생성
              </Link>
            </div>

            {/* Submenu 1: 패키지 생성 3종 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <Link href="/owner/packages/new?mode=ai" className="p-3 rounded-xl bg-gradient-to-br from-indigo-950/60 to-purple-950/60 border border-indigo-800/50 hover:border-indigo-500 transition group">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">AI 추천</span>
                  <Sparkles className="h-3.5 w-3.5 text-indigo-400 group-hover:scale-110 transition" />
                </div>
                <p className="text-xs font-bold text-white">AI 자동 추천 생성</p>
                <p className="text-[10px] text-slate-400 mt-0.5">상권 빅데이터 기반 최적 조합 자동 생성</p>
              </Link>

              <Link href="/owner/packages/new?mode=bundle" className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-600 transition group">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">자체</span>
                  <Boxes className="h-3.5 w-3.5 text-slate-400 group-hover:scale-110 transition" />
                </div>
                <p className="text-xs font-bold text-white">자체 상품 묶음</p>
                <p className="text-[10px] text-slate-400 mt-0.5">내 매장 대표 메뉴 결합 패키지 단독 출시</p>
              </Link>

              <Link href="/owner/packages/new?mode=collab" className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-600 transition group">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">제안</span>
                  <Building2 className="h-3.5 w-3.5 text-blue-400 group-hover:scale-110 transition" />
                </div>
                <p className="text-xs font-bold text-white">직접 지정 콜라보</p>
                <p className="text-[10px] text-slate-400 mt-0.5">타 매장 선택 후 크로스 매칭 제안 전송</p>
              </Link>
            </div>

            {/* Submenu 2: 생성된 패키지 관리 & 성과 분석 */}
            <div className="pt-2 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold border-t border-slate-800/80 pt-3">
                <span>진행 중인 패키지 목록 (총 8개)</span>
                <Link href="/owner/packages" className="text-blue-400 hover:underline">전체 관리 & 판매 통계 분석 →</Link>
              </div>

              <div className="space-y-1.5">
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
                  <div className="min-w-0 pr-2">
                    <p className="text-xs font-bold text-white truncate">[베스킨라빈스 × 메가MGC커피] 파인트 + 아메리카노</p>
                    <p className="text-[10px] text-slate-400">판매 수량: 142개 | 누적 매출: ₩1,107,600</p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold shrink-0">판매 진행중</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
                  <div className="min-w-0 pr-2">
                    <p className="text-xs font-bold text-white truncate">[투썸플레이스 × 베스킨라빈스] 조각케이크 + 아이스크림</p>
                    <p className="text-[10px] text-slate-400">판매 수량: 98개 | 누적 매출: ₩764,400</p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold shrink-0">판매 진행중</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. 정산 (Settlement) */}
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-white flex items-center space-x-1.5">
                <PieChart className="h-4 w-4 text-emerald-400" />
                <span>정산 센터</span>
              </h3>
              <Link href="/owner/settlements" className="text-[11px] font-bold text-emerald-400 hover:underline">
                상세 정산 내역 →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400">단일 매장 자체 패키지 정산</span>
                <p className="text-sm font-black text-white">₩420,000</p>
                <p className="text-[9.5px] text-slate-500">입금 예정: 2026.08.10 (수수료 0% 적용)</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400">타 매장/제품 콜라보 패키지 정산</span>
                <p className="text-sm font-black text-white">₩820,000</p>
                <p className="text-[9.5px] text-slate-500">입금 예정: 2026.08.10 (자동 수익분배)</p>
              </div>
            </div>
          </div>

          {/* 4. 매장 및 상품 설정 */}
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 space-y-3 shadow-xl">
            <h3 className="text-xs font-black text-white flex items-center space-x-1.5">
              <Store className="h-4 w-4 text-amber-400" />
              <span>매장 및 상품 설정</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Link href="/owner/stores" className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-600 transition flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">매장 정보 입력 및 수정</p>
                  <p className="text-[10px] text-slate-400">상호명, 위치, 영업시간, 대표 사진 변경</p>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-500" />
              </Link>

              <Link href="/owner/stores/new" className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-600 transition flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">콜라보할 제품들의 입력/수정/삭제</p>
                  <p className="text-[10px] text-slate-400">콜라보 가능 제품 등록 및 상태 관리</p>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-500" />
              </Link>
            </div>
          </div>

          {/* 5 & 6. 계정 & BIZ 센터 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* 계정 */}
            <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 space-y-2.5 shadow-xl">
              <h3 className="text-xs font-black text-white flex items-center space-x-1.5">
                <User className="h-4 w-4 text-cyan-400" />
                <span>계정</span>
              </h3>
              <div className="space-y-1 text-xs">
                <Link href="/owner/account" className="block p-2 rounded-lg bg-slate-950/60 text-slate-300 hover:text-white hover:bg-slate-800/60 transition">
                  로그아웃 / 계정삭제 / 사업자 변경 등 →
                </Link>
                <button onClick={() => setMode("consumer")} className="w-full text-left p-2 rounded-lg bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition cursor-pointer">
                  개인 회원 모드로 전환
                </button>
              </div>
            </div>

            {/* BIZ 센터 */}
            <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 space-y-2.5 shadow-xl">
              <h3 className="text-xs font-black text-white flex items-center space-x-1.5">
                <Headphones className="h-4 w-4 text-purple-400" />
                <span>BIZ 센터 (판매 관련 질문 & 지원)</span>
              </h3>
              <p className="text-[10.5px] text-slate-400">판매와 관련된 모든 문의사항 및 1:1 상담 지원</p>
              <Link href="/owner/support" className="inline-block px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition">
                1:1 전담 매니저 문의하기
              </Link>
            </div>
          </div>
        </div>
      ) : (
        /* CONSUMER MEMBER MODE UI */
        <div className="px-4 py-4 space-y-6">
          {/* 1. Location-based DIY Combo Search Box (Outer outline/card container removed as requested) */}
          <div className="space-y-2.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              {/* Title (Red Box: "직접 만드는 최대 할인 콜라보") */}
              <div className="flex items-center space-x-1.5">
                <Sparkles className="h-4 w-4 text-[#071D49]" />
                <span className="text-xs font-black text-[#071D49]">
                  직접 만드는 최대 할인 콜라보
                </span>
              </div>

              {/* Location Switcher Controls (Borderless GPS, Pin & Plus Icons with Hover Tooltips) */}
              <div className="flex items-center space-x-1.5 self-start sm:self-auto">
                {/* GPS Icon Button */}
                <div className="relative group">
                  <button
                    onClick={() => setLocationMode("gps")}
                    className={`p-1.5 rounded-full transition-all cursor-pointer ${
                      locationMode === "gps"
                        ? "bg-[#071D49] text-white scale-105"
                        : "text-[#3B4A6B] hover:text-[#071D49] hover:bg-[#EEF3F8]"
                    }`}
                    aria-label="현재 위치"
                  >
                    <Crosshair className="h-4 w-4" />
                  </button>
                  {/* Tooltip on Hover */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:flex items-center px-2 py-1 bg-[#071D49] text-white text-[10px] font-bold rounded-md whitespace-nowrap z-30 shadow-md">
                    현재 위치
                  </div>
                </div>

                {/* Pin Icon Button */}
                <div className="relative group">
                  <button
                    onClick={() => setLocationMode("pin")}
                    className={`p-1.5 rounded-full transition-all cursor-pointer ${
                      locationMode === "pin"
                        ? "bg-[#071D49] text-white scale-105"
                        : "text-[#3B4A6B] hover:text-[#071D49] hover:bg-[#EEF3F8]"
                    }`}
                    aria-label="장소 지정"
                  >
                    <MapPin className="h-4 w-4" />
                  </button>
                  {/* Tooltip on Hover */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:flex items-center px-2 py-1 bg-[#071D49] text-white text-[10px] font-bold rounded-md whitespace-nowrap z-30 shadow-md">
                    {activePlace ? `장소 지정 (${activePlace.nickname})` : "장소 지정"}
                  </div>
                </div>

                {/* Plus Button right next to Pin */}
                <div className="relative group">
                  <button
                    onClick={() => setIsCustomPlaceModalOpen(true)}
                    className="p-1.5 rounded-full text-[#071D49] hover:bg-[#EEF3F8] hover:scale-110 transition-all cursor-pointer"
                    aria-label="장소 추가 및 관리"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  {/* Tooltip on Hover */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:flex items-center px-2 py-1 bg-[#071D49] text-white text-[10px] font-bold rounded-md whitespace-nowrap z-30 shadow-md">
                    장소 추가/관리
                  </div>
                </div>
              </div>
            </div>

            {/* Active Location Info Indicator Bar */}
            <div className="text-[10.5px] font-semibold px-2.5 py-1.5 rounded-xl bg-[#EEF3F8] text-[#3B4A6B] flex items-center justify-between border border-[#071D49]/10">
              {locationMode === "gps" ? (
                <span>📍 GPS 현재 위치: <strong>경기도 부천시 중동 (반경 1km)</strong></span>
              ) : (
                <span>
                  📌 지정 장소: <strong>{activePlace ? `${activePlace.nickname} (${activePlace.address})` : "미지정"}</strong>
                </span>
              )}
              <button
                onClick={() => setIsCustomPlaceModalOpen(true)}
                className="text-[#071D49] hover:underline font-bold text-[10.5px]"
              >
                [변경]
              </button>
            </div>

            {/* Search Input Form (Magnifier Icon Integrated Inside Input Field with No Background) */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (promptInput.trim()) {
                  handleRecordSearch(promptInput.trim());
                }
                setIsComboModalOpen(true);
              }}
              className="relative w-full flex items-center"
            >
              <input
                type="text"
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                placeholder="원하는 콜라보를 말해보세요"
                className="w-full rounded-xl bg-[#EEF3F8] pl-4 pr-11 py-3 text-xs sm:text-sm font-medium text-[#071D49] placeholder-[#64748B] border border-[#071D49]/10 focus:outline-none focus:ring-2 focus:ring-[#071D49] focus:bg-white transition-all cursor-pointer"
              />
              <button 
                type="submit"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 text-[#071D49] hover:text-[#071D49]/70 hover:scale-110 transition-all cursor-pointer bg-transparent border-none flex items-center justify-center"
                aria-label="검색"
              >
                <Search className="h-5 w-5" />
              </button>
            </form>
          </div>

          {/* User Requested Video with Stitch Design */}
          <div className="w-full flex justify-center my-4">
            <div className="w-full max-w-2xl rounded-2xl p-2 border-2 border-dashed border-gray-400 bg-gray-50 shadow-sm flex items-center justify-center">
              <div className="w-full rounded-xl overflow-hidden shadow-md bg-black">
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
          </div>

          {/* 2. Apple Bento Rolling Banner (16:9 Banner Aspect Ratio) */}
          <div className="relative w-full rounded-2xl overflow-hidden shadow-lg group bg-slate-900 aspect-16/9 max-h-56">
            <img
              src={rollingBanners[currentSlide].image}
              alt={rollingBanners[currentSlide].title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />
            
            {/* Top Badges */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
              <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-white/90 text-[#111111] backdrop-blur-md shadow-xs">
                {rollingBanners[currentSlide].tag}
              </span>
              <div className="flex items-center space-x-1.5">
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-black/60 text-white backdrop-blur-md">
                  {rollingBanners[currentSlide].discount}
                </span>
                <span className="text-[10px] font-bold text-white/80 px-2 py-0.5 rounded-md bg-black/40 backdrop-blur-md">
                  {currentSlide + 1} / {rollingBanners.length}
                </span>
              </div>
            </div>

            {/* Center Content */}
            <div className="absolute bottom-3 left-3 right-3 z-10 text-white space-y-1">
              <h2 className="text-xs sm:text-sm font-black leading-tight drop-shadow-md line-clamp-1">
                {rollingBanners[currentSlide].title}
              </h2>
              <p className="text-[10px] text-white/80 line-clamp-1">
                {rollingBanners[currentSlide].sub}
              </p>
              <div className="pt-1 flex items-center justify-between">
                <div className="flex items-baseline space-x-1.5">
                  <span className="text-[10px] line-through text-white/60">
                    {rollingBanners[currentSlide].origPrice.toLocaleString()}원
                  </span>
                  <span className="text-sm font-black text-amber-300">
                    {rollingBanners[currentSlide].price.toLocaleString()}원
                  </span>
                </div>
                <Link
                  href="/packages/pkg-demo-1"
                  className="apple-pill-button text-[10px] px-3 py-1 font-bold shadow-md cursor-pointer"
                >
                  구입하기 &gt;
                </Link>
              </div>
            </div>

            {/* Slider Navigation Controls */}
            <button
              onClick={() => setCurrentSlide((prev) => (prev - 1 + rollingBanners.length) % rollingBanners.length)}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/40 text-white hover:bg-black/70 transition cursor-pointer z-20"
              aria-label="이전 배너"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % rollingBanners.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/40 text-white hover:bg-black/70 transition cursor-pointer z-20"
              aria-label="다음 배너"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* 3. Combined Category Grid & Recommended Quick Filters (Single Unified Card Container) */}
          <div className="apple-bento-card p-3.5 space-y-3">
            {/* 8 Category Grid with 3D Icons */}
            <div className="grid grid-cols-4 gap-2">
              {categories.map((cat) => (
                <Link
                  key={cat.name}
                  href={`/packages?category=${encodeURIComponent(cat.name)}`}
                  className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-[#EEF3F8] transition group cursor-pointer"
                >
                  <Category3DIcon name={cat.name} className="h-8.5 w-8.5 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-[10.5px] font-extrabold text-[#071D49] mt-1.5 text-center leading-tight">
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>

            {/* Recommended Quick Filters Items */}
            <div className="pt-1 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold text-[#071D49] flex items-center gap-1">
                  <span>추천 퀵 필터:</span>
                  <span className="text-[10px] text-[#6e6e73] font-normal">🔥 가장 핫한 인기 추천 (Cold-Start)</span>
                </span>
                {selectedFilter && (
                  <button
                    onClick={() => setSelectedFilter(null)}
                    className="text-[10px] text-[#6e6e73] hover:text-[#111111] flex items-center gap-0.5 font-bold cursor-pointer"
                  >
                    <RotateCcw className="h-2.5 w-2.5" />
                    <span>초기화</span>
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-1.5">
                {[
                  "CGV 팝콘 콤보",
                  "성수동 루프탑 카페",
                  "1:1 두피 스파",
                  "수제맥주 & 타코",
                  "필라테스 1회권",
                  "와인바 치즈 플래터"
                ].map((keyword) => {
                  const isSelected = selectedFilter === keyword;
                  return (
                    <button
                      key={keyword}
                      onClick={() => {
                        if (isSelected) {
                          setSelectedFilter(null);
                        } else {
                          setSelectedFilter(keyword);
                          handleRecordSearch(keyword);
                        }
                      }}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full transition cursor-pointer flex items-center gap-1 ${
                        isSelected
                          ? "bg-[#071D49] text-white shadow-xs"
                          : "bg-[#f7f7f8] text-[#6e6e73] hover:bg-[#EEF3F8] hover:text-[#071D49]"
                      }`}
                    >
                      <span>🔥 {keyword}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 4. 우리동네 베스트 콜라보 */}
          {(() => {
            const filteredLocal = neighborhoodPackages.filter((pkg) => {
              if (!selectedFilter) return true;
              const q = selectedFilter.toLowerCase();
              return (
                pkg.title.toLowerCase().includes(q) ||
                pkg.subtitle.toLowerCase().includes(q) ||
                pkg.category.toLowerCase().includes(q) ||
                pkg.keywords.some((k) => k.toLowerCase().includes(q))
              );
            });
            const listToDisplay = filteredLocal.length > 0 ? filteredLocal : neighborhoodPackages;
            const visibleLocal = listToDisplay.slice(0, neighborhoodVisibleCount);

            return (
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-1">
                  <div>
                    <h2 className="text-sm font-black text-[#071D49] flex items-center gap-1.5">
                      <span>우리동네 베스트 콜라보</span>
                      <span className="rounded-full bg-[#071D49] text-white text-[9px] px-2 py-0.5 font-bold">
                        BEST
                      </span>
                    </h2>
                  </div>
                  <span className="text-[11px] font-bold text-[#3B4A6B]">
                    {listToDisplay.length}개 패키지
                  </span>
                </div>

                {/* 2x2 Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-stretch">
                  {visibleLocal.map((pkg) => {
                    const thumbInfo = getPackageThumbnailInfo(pkg);
                    return (
                      <div key={pkg.id} className="flex flex-col justify-between h-full group p-1.5 bg-transparent border-none shadow-none">
                        <div className="space-y-2 flex-1 flex flex-col">
                          {/* Package Thumbnail Image with Representative Key Phrase Overlay */}
                          <div className="relative w-full h-32 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                            <img
                              src={thumbInfo.image}
                              alt={pkg.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            
                            {/* Sleek Compact V.I.M Score Badge on Top Left */}
                            <div className="absolute top-1.5 left-1.5 bg-[#071D49]/90 backdrop-blur-xs text-white text-[9.5px] font-black px-1.5 py-0.5 rounded-full shadow-sm flex items-center space-x-0.5 border border-white/20">
                              <Zap className="h-2.5 w-2.5 text-amber-300 fill-amber-300" />
                              <span>V.I.M {pkg.vimScore}</span>
                            </div>

                            {/* Representative Key Phrase Overlay on Bottom Left */}
                            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md backdrop-blur-xs shadow-xs ${thumbInfo.badgeColor}`}>
                                {thumbInfo.phrase}
                              </span>
                            </div>
                          </div>

                          {/* Title Only */}
                          <h3 className="font-bold text-xs leading-snug text-[#071D49] line-clamp-2">
                            {pkg.title}
                          </h3>
                        </div>

                        {/* Footer Price & CTA */}
                        <div className="flex items-end justify-between gap-1 pt-2.5 mt-auto w-full border-t border-slate-100">
                          <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-1.5 min-w-0">
                            <span className="text-[9px] sm:text-[10px] line-through text-[#6e6e73] leading-tight">
                              {pkg.origPrice.toLocaleString()}원
                            </span>
                            <span className="text-xs sm:text-sm font-black text-[#071D49] leading-tight">
                              {pkg.price.toLocaleString()}원
                            </span>
                          </div>
                          <Link 
                            href="/packages/pkg-demo-1" 
                            onClick={() => {
                              recordPackageView({ id: pkg.id, title: pkg.title });
                              refreshQuickFilters();
                            }}
                            className="apple-pill-button text-[10px] px-2.5 py-1.5 font-bold shadow-2xs shrink-0 whitespace-nowrap"
                          >
                            상세보기
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* View More Expander Button */}
                <div className="pt-1 flex justify-end">
                  {neighborhoodVisibleCount < listToDisplay.length ? (
                    <button
                      onClick={() => setNeighborhoodVisibleCount((prev) => prev + 4)}
                      className="apple-bento-card px-4 py-1.5 text-xs font-bold text-[#071D49] shadow-xs hover:bg-[#EEF3F8] transition cursor-pointer flex items-center space-x-1"
                    >
                      <span>더보기+</span>
                    </button>
                  ) : (
                    <Link
                      href="/packages?category=local"
                      className="apple-pill-button text-xs px-4 py-1.5 shadow-2xs inline-flex items-center space-x-1"
                    >
                      <span>전체 탐색</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })()}

          {/* 5. 브랜드 콜라보 (Clean Borderless White Cards) */}
          {(() => {
            const filteredBrand = brandPackages.filter((pkg) => {
              if (!selectedFilter) return true;
              const q = selectedFilter.toLowerCase();
              return (
                pkg.title.toLowerCase().includes(q) ||
                pkg.subtitle.toLowerCase().includes(q) ||
                pkg.category.toLowerCase().includes(q) ||
                pkg.keywords.some((k) => k.toLowerCase().includes(q))
              );
            });
            const listToDisplay = filteredBrand.length > 0 ? filteredBrand : brandPackages;
            const visibleBrand = listToDisplay.slice(0, brandVisibleCount);

            return (
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-1">
                  <div>
                    <h2 className="text-sm font-black text-[#071D49] flex items-center gap-1.5">
                      <span>브랜드 콜라보</span>
                      <span className="rounded-full bg-[#071D49] text-white text-[9px] px-2 py-0.5 font-bold">
                        BRAND
                      </span>
                    </h2>
                  </div>
                  <span className="text-[11px] font-bold text-[#3B4A6B]">
                    {listToDisplay.length}개 패키지
                  </span>
                </div>

                {/* 2x2 Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-stretch">
                  {visibleBrand.map((pkg) => {
                    const thumbInfo = getPackageThumbnailInfo(pkg);
                    return (
                      <div key={pkg.id} className="flex flex-col justify-between h-full group p-1.5 bg-transparent border-none shadow-none">
                        <div className="space-y-2 flex-1 flex flex-col">
                          {/* Package Thumbnail Image with Representative Key Phrase Overlay */}
                          <div className="relative w-full h-32 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                            <img
                              src={thumbInfo.image}
                              alt={pkg.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            
                            {/* Sleek Compact V.I.M Score Badge on Top Left */}
                            <div className="absolute top-1.5 left-1.5 bg-[#071D49]/90 backdrop-blur-xs text-white text-[9.5px] font-black px-1.5 py-0.5 rounded-full shadow-sm flex items-center space-x-0.5 border border-white/20">
                              <Zap className="h-2.5 w-2.5 text-amber-300 fill-amber-300" />
                              <span>V.I.M {pkg.vimScore}</span>
                            </div>

                            {/* Representative Key Phrase Overlay on Bottom Left */}
                            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md backdrop-blur-xs shadow-xs ${thumbInfo.badgeColor}`}>
                                {thumbInfo.phrase}
                              </span>
                            </div>
                          </div>

                          {/* Title Only */}
                          <h3 className="font-bold text-xs leading-snug text-[#071D49] line-clamp-2">
                            {pkg.title}
                          </h3>
                        </div>

                        {/* Footer Price & CTA */}
                        <div className="flex items-end justify-between gap-1 pt-2.5 mt-auto w-full border-t border-slate-100">
                          <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-1.5 min-w-0">
                            <span className="text-[9px] sm:text-[10px] line-through text-[#6e6e73] leading-tight">
                              {pkg.origPrice.toLocaleString()}원
                            </span>
                            <span className="text-xs sm:text-sm font-black text-[#071D49] leading-tight">
                              {pkg.price.toLocaleString()}원
                            </span>
                          </div>
                          <Link 
                            href="/packages/pkg-demo-1" 
                            onClick={() => {
                              recordPackageView({ id: pkg.id, title: pkg.title });
                              refreshQuickFilters();
                            }}
                            className="apple-pill-button text-[10px] px-2.5 py-1.5 font-bold shadow-2xs shrink-0 whitespace-nowrap"
                          >
                            상세보기
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* View More Expander Button */}
                <div className="pt-1 flex justify-end">
                  {brandVisibleCount < listToDisplay.length ? (
                    <button
                      onClick={() => setBrandVisibleCount((prev) => prev + 4)}
                      className="apple-bento-card px-4 py-1.5 text-xs font-bold text-[#111111] border-none shadow-xs hover:bg-[#f7f7f8] transition cursor-pointer flex items-center space-x-1"
                    >
                      <span>더보기+</span>
                    </button>
                  ) : (
                    <Link
                      href="/packages?category=brand"
                      className="apple-pill-button text-xs px-4 py-1.5 shadow-2xs inline-flex items-center space-x-1"
                    >
                      <span>전체 탐색</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Modals & Drawers */}
      <LocationComboSearchModal
        isOpen={isComboModalOpen}
        onClose={() => setIsComboModalOpen(false)}
        initialKeyword={promptInput}
        mode={mode}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <CustomPlaceModal
        isOpen={isCustomPlaceModalOpen}
        onClose={() => setIsCustomPlaceModalOpen(false)}
        savedPlaces={savedPlaces}
        activePlaceId={activePlaceId}
        onSelectPlace={(place) => {
          setActivePlaceId(place.id);
          setLocationMode("pin");
        }}
        onAddPlace={handleAddPlace}
        onDeletePlace={handleDeletePlace}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />

      {/* Sticky Bottom Navigation Bar */}
      <BottomNavBar mode={mode} />
    </div>
  );
}
