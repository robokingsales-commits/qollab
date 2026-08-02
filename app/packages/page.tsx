"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { PackageDocument } from "@/lib/types/schema";
import { formatKRW } from "@/lib/utils";
import { MapPin, Zap, ArrowRight, ShoppingBag, Globe, Store } from "lucide-react";

export interface PackageCardData {
  packageData: PackageDocument;
  vimScore: number;
  categoryType: "local" | "brand";
  stores: {
    name: string;
    category: string;
    story_label: string;
  }[];
}

interface PageProps {
  searchParams: Promise<{ category?: string; search?: string }>;
}

export default function PackagesExplorerPage({ searchParams }: PageProps) {
  const resolvedParams = use(searchParams);
  const initialCategory = resolvedParams?.category === "brand" ? "brand" : "all";

  const [packages, setPackages] = useState<PackageCardData[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const samplePackages: PackageCardData[] = [
      {
        packageData: {
          packageId: "pkg-demo-1",
          title: "성수 힐링 데이 (유기농 두피 스파 & 루프탑 카페 패키지)",
          region: "서울 성동구 성수동 (우리 동네)",
          headcount: 2,
          list_total: 69000,
          sale_price: 49000,
          fee_rate: 0.1,
          stock: 35,
          valid_from: "2026-08-01",
          valid_to: "2026-08-31",
          status: "open",
          createdAt: new Date().toISOString(),
        },
        vimScore: 94,
        categoryType: "local",
        stores: [
          {
            name: "성수 루프탑 로스터리 카페",
            category: "카페/디저트",
            story_label: "3대째 로스팅 가문의 깊은 아로마와 핸드메이드 스콘 이야기",
          },
          {
            name: "성수 아틀리에 헤어 스튜디오",
            category: "뷰티/미용",
            story_label: "1:1 맞춤형 유기농 두피 스파로 지친 도시인에게 전하는 힐링",
          },
        ],
      },
      {
        packageData: {
          packageId: "pkg-demo-2",
          title: "성수 나이트 라이프 (수제맥주 & 타파스 + 클래식 바)",
          region: "서울 성동구 성수동 (우리 동네)",
          headcount: 2,
          list_total: 58000,
          sale_price: 39000,
          fee_rate: 0.1,
          stock: 20,
          valid_from: "2026-08-01",
          valid_to: "2026-08-31",
          status: "open",
          createdAt: new Date().toISOString(),
        },
        vimScore: 91,
        categoryType: "local",
        stores: [
          {
            name: "뚝섬 크래프트 비어 파일럿",
            category: "식당/맛집",
            story_label: "독자적 효모로 양조하는 성수 수제맥주의 참맛과 스페인 타파스의 만남",
          },
          {
            name: "성수 재즈클럽 레코드",
            category: "액티비티/체험",
            story_label: "아날로그 바이닐과 하이엔드 음향으로 듣는 오리지널 재즈 라이브",
          },
        ],
      },
      {
        packageData: {
          packageId: "pkg-brand-1",
          title: "[브랜드 패키지] 전국 어디서나! CGV 영화관람권 + 투썸플레이스 아메리카노 2잔",
          region: "전국 어디서나 사용 가능 (브랜드 패키지)",
          headcount: 2,
          list_total: 32000,
          sale_price: 23000,
          fee_rate: 0.08,
          stock: 100,
          valid_from: "2026-08-01",
          valid_to: "2026-12-31",
          status: "open",
          createdAt: new Date().toISOString(),
        },
        vimScore: 96,
        categoryType: "brand",
        stores: [
          {
            name: "CGV 전국 영화관",
            category: "문화/영화",
            story_label: "전국 CGV에서 언제든지 이용 가능한 메가 브랜드 패키지",
          },
          {
            name: "투썸플레이스 전국 매장",
            category: "카페/음료",
            story_label: "프리미엄 원두 커피와 디저트를 경험할 수 있는 전국 바우처",
          },
        ],
      },
    ];
    setPackages(samplePackages);
    setLoading(false);
  }, []);

  const filteredPackages = packages.filter((pkg) => {
    if (activeCategory === "local") return pkg.categoryType === "local";
    if (activeCategory === "brand") return pkg.categoryType === "brand";
    return true;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Title & Category Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-800 border border-indigo-200">
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>추천 패키지 탐색</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 mt-2">추천 패키지 (Recommended Packages)</h1>
          <p className="text-sm text-gray-500 mt-1">
            우리 동네 매장 패키지와 전국 어디서나 구매할 수 있는 브랜드 패키지를 살펴보세요.
          </p>
        </div>

        {/* Tab Switchers: 전체 / 우리 동네 / 브랜드 패키지 */}
        <div className="flex items-center space-x-2 bg-gray-100 p-1.5 rounded-2xl border border-gray-200 shadow-inner text-xs font-bold">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-4 py-2 rounded-xl transition ${
              activeCategory === "all"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            전체 패키지
          </button>
          <button
            onClick={() => setActiveCategory("local")}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl transition ${
              activeCategory === "local"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Store className="h-3.5 w-3.5 text-amber-300" />
            <span>우리 동네 패키지</span>
          </button>
          <button
            onClick={() => setActiveCategory("brand")}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl transition ${
              activeCategory === "brand"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Globe className="h-3.5 w-3.5 text-emerald-300" />
            <span>브랜드 패키지 (전국 구매)</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-gray-500">패키지 목록 로딩 중...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredPackages.map(({ packageData, vimScore, categoryType, stores }) => {
            const discountPercent = Math.round(
              ((packageData.list_total - packageData.sale_price) / packageData.list_total) * 100
            );

            return (
              <div
                key={packageData.packageId}
                className="group relative rounded-3xl bg-white p-6 shadow-sm border border-gray-200 hover:shadow-xl hover:border-indigo-300 transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-3 py-1 text-xs font-extrabold text-white shadow-sm flex items-center space-x-1">
                      <Zap className="h-3 w-3" />
                      <span>V.I.M {vimScore}점</span>
                    </span>

                    <div className="flex items-center space-x-1 text-xs font-semibold text-gray-500">
                      <MapPin className="h-3.5 w-3.5 text-gray-400" />
                      <span>{packageData.region}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-md ${
                      categoryType === "brand" 
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-200" 
                        : "bg-amber-100 text-amber-800 border border-amber-200"
                    }`}>
                      {categoryType === "brand" ? "전국 브랜드 패키지" : "우리 동네 패키지"}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition">
                    {packageData.title}
                  </h3>

                  <div className="space-y-2 rounded-2xl bg-gray-50 p-4 border border-gray-100">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                      포함된 상품 및 매장 조합
                    </div>
                    {stores.map((s, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`h-2 w-2 rounded-full ${
                              idx === 0 ? "bg-indigo-600" : "bg-amber-500"
                            }`}
                          />
                          <span className="font-bold text-gray-900">{s.name}</span>
                          <span className="text-gray-400">({s.category})</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <p className="text-xs text-amber-900 bg-amber-50 p-3 rounded-xl border border-amber-200 font-medium italic">
                    &quot;{stores[0].story_label}&quot;
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2 text-xs text-gray-400 line-through">
                      <span>정가 {formatKRW(packageData.list_total)}</span>
                      <span className="font-bold text-rose-500">{discountPercent}% OFF</span>
                    </div>
                    <div className="text-2xl font-black text-indigo-600">
                      {formatKRW(packageData.sale_price)}
                    </div>
                  </div>

                  <Link
                    href={`/packages/pkg-demo-1`}
                    className="flex items-center space-x-2 rounded-2xl bg-gray-900 px-5 py-3 text-xs font-bold text-white shadow-md group-hover:bg-indigo-600 transition"
                  >
                    <span>상세보기</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
