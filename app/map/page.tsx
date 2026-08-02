"use client";

import { useState, use } from "react";
import Link from "next/link";
import { MapPin, Navigation, Home, Building, Sparkles, Filter, Ticket, ChevronRight } from "lucide-react";
import PackageItineraryMap from "@/components/PackageItineraryMap";

interface PageProps {
  searchParams: Promise<{ preset?: string }>;
}

export default function MapPage({ searchParams }: PageProps) {
  const resolvedParams = use(searchParams);
  const initialPreset = resolvedParams?.preset === "home_work" ? "home_work" : "current";

  const [activePreset, setActivePreset] = useState<"current" | "home_work">(initialPreset);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<"home" | "company">("home");

  const homePackages = [
    {
      id: "pkg-home-1",
      title: "성수 힐링 일일 패키지 (카페 + 헤어스파)",
      neighborhood: "서울 성동구 성수동 (집 동네)",
      price: 49800,
      originalPrice: 85000,
      discount: "41%",
      stores: ["성수 루프탑 로스터리 Cafe", "성수 아틀리에 헤어"],
      lat: 37.5445,
      lng: 127.0560,
    },
    {
      id: "pkg-home-2",
      title: "성수 디저트 & 요가 필라테스 유휴시간 패키지",
      neighborhood: "서울 성동구 성수동 (집 동네)",
      price: 38000,
      originalPrice: 65000,
      discount: "41%",
      stores: ["베이커리 카페 성수", "센트럴 필라테스"],
      lat: 37.5480,
      lng: 127.0520,
    },
  ];

  const companyPackages = [
    {
      id: "pkg-comp-1",
      title: "강남 퇴근길 힐링 피트니스 & 샐러드 바",
      neighborhood: "서울 강남구 역삼동 (회사 동네)",
      price: 42000,
      originalPrice: 70000,
      discount: "40%",
      stores: ["강남 시그니처 짐", "그린보울 샐러드 카페"],
      lat: 37.5000,
      lng: 127.0360,
    },
    {
      id: "pkg-comp-2",
      title: "강남 점심시간 초스피드 네일 & 핸드드립 커피",
      neighborhood: "서울 강남구 역삼동 (회사 동네)",
      price: 35000,
      originalPrice: 58000,
      discount: "39%",
      stores: ["역삼 네일 라운지", "에스프레소 바 역삼"],
      lat: 37.5015,
      lng: 127.0385,
    },
  ];

  const currentLocPackages = [
    {
      id: "pkg-curr-1",
      title: "현위치 기준 (내 주변 500m) 다중 매장 콜라보 바우처",
      neighborhood: "현재 위치 (GPS 인식 주변)",
      price: 32000,
      originalPrice: 55000,
      discount: "42%",
      stores: ["어반 라이프 카페", "릴렉스 마사지 앤 스파"],
      lat: 37.5445,
      lng: 127.0560,
    },
    {
      id: "pkg-curr-2",
      title: "현재 위치 추천: 브런치 & 전시회 관람 콤보",
      neighborhood: "현재 위치 (GPS 인식 주변)",
      price: 45000,
      originalPrice: 80000,
      discount: "43%",
      stores: ["갤러리 아뜰리에", "파인다이닝 라운지"],
      lat: 37.5460,
      lng: 127.0580,
    },
  ];

  const displayPackages = 
    activePreset === "current" 
      ? currentLocPackages 
      : selectedNeighborhood === "home" 
        ? homePackages 
        : companyPackages;

  const mapWaypoints = displayPackages.map(p => ({
    lat: p.lat,
    lng: p.lng,
    title: p.title,
    subtitle: p.stores.join(" + ")
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-200">
            <MapPin className="h-3.5 w-3.5" />
            <span>동네지도 패키지 탐색</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 mt-2">동네지도 (Neighborhood Map)</h1>
          <p className="text-sm text-gray-500 mt-1">
            등록한 동네(집/회사) 또는 현재 위치를 기반으로 주변의 V.I.M 초특가 콜라보 패키지를 지도에서 확인하세요.
          </p>
        </div>

        {/* Preset Selector Buttons */}
        <div className="flex items-center space-x-2 bg-gray-100 p-1.5 rounded-2xl border border-gray-200 shadow-inner">
          <button
            onClick={() => setActivePreset("home_work")}
            className={`flex items-center space-x-1.5 rounded-xl px-4 py-2 text-xs font-bold transition ${
              activePreset === "home_work"
                ? "bg-emerald-600 text-white shadow-md"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Home className="h-4 w-4" />
            <span>집 / 회사 동네</span>
          </button>
          <button
            onClick={() => setActivePreset("current")}
            className={`flex items-center space-x-1.5 rounded-xl px-4 py-2 text-xs font-bold transition ${
              activePreset === "current"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Navigation className="h-4 w-4" />
            <span>현재 위치 기반</span>
          </button>
        </div>
      </div>

      {/* Sub-selector for Home / Work if home_work active */}
      {activePreset === "home_work" && (
        <div className="flex items-center space-x-3 bg-emerald-50/80 p-3 rounded-2xl border border-emerald-200 text-xs">
          <span className="font-extrabold text-emerald-900 flex items-center gap-1">
            <Filter className="h-4 w-4 text-emerald-600" />
            <span>선택 동네:</span>
          </span>
          <button
            onClick={() => setSelectedNeighborhood("home")}
            className={`rounded-xl px-3 py-1.5 font-bold transition ${
              selectedNeighborhood === "home"
                ? "bg-emerald-700 text-white shadow-sm"
                : "bg-white text-emerald-800 border border-emerald-200"
            }`}
          >
            <Home className="h-3.5 w-3.5 inline mr-1" />
            집 (서울 성동구 성수동)
          </button>
          <button
            onClick={() => setSelectedNeighborhood("company")}
            className={`rounded-xl px-3 py-1.5 font-bold transition ${
              selectedNeighborhood === "company"
                ? "bg-emerald-700 text-white shadow-sm"
                : "bg-white text-emerald-800 border border-emerald-200"
            }`}
          >
            <Building className="h-3.5 w-3.5 inline mr-1" />
            회사 (서울 강남구 역삼동)
          </button>
        </div>
      )}

      {/* Map & List Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Interactive Map */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-emerald-600" />
              <span>실시간 지도 패키지 위치 핀</span>
            </h3>
            <span className="text-xs text-gray-400">
              핀을 클릭하면 매장 패키지 경로를 확인할 수 있습니다
            </span>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-2 shadow-sm overflow-hidden min-h-[420px]">
            <PackageItineraryMap
              waypoints={mapWaypoints}
              className="h-[400px] w-full rounded-2xl"
            />
          </div>
        </div>

        {/* Package Card List */}
        <div className="space-y-4">
          <h3 className="font-bold text-gray-900 text-sm flex items-center justify-between">
            <span>등록된 동네 패키지 ({displayPackages.length}개)</span>
            <span className="text-xs text-indigo-600 font-semibold">V.I.M 매칭 완료</span>
          </h3>

          <div className="space-y-4">
            {displayPackages.map((pkg) => (
              <div
                key={pkg.id}
                className="rounded-3xl bg-white p-5 border border-gray-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    {pkg.neighborhood}
                  </span>
                  <span className="text-xs font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                    {pkg.discount} OFF
                  </span>
                </div>

                <h4 className="font-extrabold text-gray-900 text-base leading-tight">
                  {pkg.title}
                </h4>

                <div className="rounded-xl bg-gray-50 p-2.5 text-xs text-gray-600 space-y-1">
                  <p className="font-bold text-gray-700">콜라보 구성 매장:</p>
                  <p className="text-indigo-600 font-semibold">• {pkg.stores.join("\n• ")}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div>
                    <span className="text-xs text-gray-400 line-through mr-1.5">
                      {pkg.originalPrice.toLocaleString()}원
                    </span>
                    <span className="text-lg font-black text-indigo-600">
                      {pkg.price.toLocaleString()}원
                    </span>
                  </div>
                  <Link
                    href={`/packages/pkg-demo-1`}
                    className="flex items-center space-x-1 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white shadow hover:bg-indigo-500 transition"
                  >
                    <Ticket className="h-3.5 w-3.5" />
                    <span>상세보기</span>
                    <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
