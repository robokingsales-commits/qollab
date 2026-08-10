"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { PackageDocument } from "@/lib/types/schema";
import { formatKRW } from "@/lib/utils";
import { MapPin, Zap, ArrowRight, ShoppingBag, Globe, Store, Star, Check, Plus, Layers } from "lucide-react";
import { recordPackageView } from "@/lib/services/recommendation-service";
import { PERSONA_PACKAGES_100 } from "@/lib/data/personaPackages";

export interface PackageCardData {
  packageData: PackageDocument;
  vimScore: number;
  categoryType: "local" | "brand";
  stores: {
    name: string;
    category: string;
    story_label: string;
  }[];
  thumbnail?: string;
  rating?: number;
}

interface PageProps {
  searchParams: Promise<{ category?: string; search?: string }>;
}

export default function PackagesExplorerPage({ searchParams }: PageProps) {
  const resolvedParams = use(searchParams);
  const initialCategory = resolvedParams?.category === "brand" ? "brand" : "all";

  const [packages, setPackages] = useState<PackageCardData[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [addedCombos, setAddedCombos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const brandBrands = ["베스킨라빈스", "투썸", "스타벅스", "감성커피", "더리터", "파리바게뜨", "뚜레쥬르", "설빙", "공차", "CGV", "롯데시네마", "CU", "GS25", "세븐일레븐"];
    
    const sampleImages = [
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80",
    ];

    const personaCardData: PackageCardData[] = PERSONA_PACKAGES_100.map((p, idx) => {
      const isBrand = brandBrands.some((b) => p.store.includes(b) || p.category.includes(b));
      return {
        packageData: {
          packageId: p.id,
          title: p.title,
          region: p.region,
          headcount: 2,
          list_total: p.origPrice,
          sale_price: p.price,
          fee_rate: 0.1,
          stock: 50,
          valid_from: "2026-08-01",
          valid_to: "2026-12-31",
          status: "open",
          createdAt: new Date().toISOString(),
        },
        vimScore: p.vimScore,
        categoryType: isBrand ? "brand" : "local",
        stores: [
          {
            name: p.store,
            category: p.category,
            story_label: p.subtitle,
          },
        ],
        thumbnail: sampleImages[idx % sampleImages.length],
        rating: +(4.5 + (idx % 5) * 0.1).toFixed(1),
      };
    });
    setPackages(personaCardData);
    setLoading(false);
  }, []);

  const toggleComboItem = (id: string) => {
    setAddedCombos(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const filteredPackages = packages.filter((p) => {
    if (activeCategory === "local") return p.categoryType === "local";
    if (activeCategory === "brand") return p.categoryType === "brand";
    return true;
  });

  return (
    <div className="min-h-screen pb-32 pt-6 px-4 md:px-6 max-w-7xl mx-auto space-y-8">
      {/* Header Section (Stitch Style) */}
      <section className="text-center md:text-left space-y-2">
        <div className="inline-flex items-center space-x-1.5 rounded-full bg-[#071D49]/10 px-3 py-1 text-xs font-bold text-[#071D49] border border-[#071D49]/15">
          <Layers className="h-3.5 w-3.5" />
          <span>DIY Combo Selection</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#071D49] tracking-tight">직접 만드는 콤보</h1>
        <p className="text-sm text-slate-500 max-w-2xl">
          함께하면 할인이 배가 되는 동네 상권 &amp; 브랜드 콤보 결합 상품을 둘러보세요.
        </p>
      </section>

      {/* Category Tabs (Apple Segmented Control Style) */}
      <div className="flex bg-slate-200/60 p-1.5 rounded-2xl w-full max-w-md backdrop-blur-md border border-black/5 text-xs font-extrabold shadow-inner">
        <button
          onClick={() => setActiveCategory("all")}
          className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer ${
            activeCategory === "all" ? "bg-white text-[#071D49] shadow-sm" : "text-slate-500 hover:text-[#071D49]"
          }`}
        >
          전체 보기 ({packages.length})
        </button>
        <button
          onClick={() => setActiveCategory("local")}
          className={`flex-1 flex items-center justify-center space-x-1 py-2.5 rounded-xl transition-all cursor-pointer ${
            activeCategory === "local" ? "bg-white text-[#071D49] shadow-sm" : "text-slate-500 hover:text-[#071D49]"
          }`}
        >
          <Store className="h-3.5 w-3.5" />
          <span>우리 동네 콜라보</span>
        </button>
        <button
          onClick={() => setActiveCategory("brand")}
          className={`flex-1 flex items-center justify-center space-x-1 py-2.5 rounded-xl transition-all cursor-pointer ${
            activeCategory === "brand" ? "bg-white text-[#071D49] shadow-sm" : "text-slate-500 hover:text-[#071D49]"
          }`}
        >
          <Globe className="h-3.5 w-3.5" />
          <span>전국 브랜드</span>
        </button>
      </div>

      {/* Bento Grid / Merchant List (Stitch Bento Card Design) */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 font-semibold">패키지 탐색 중...</div>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPackages.map((item) => {
            const isAdded = addedCombos.includes(item.packageData.packageId);
            const discountPercent = Math.round(
              ((item.packageData.list_total - item.packageData.sale_price) /
                item.packageData.list_total) *
                100
            );

            return (
              <article
                key={item.packageData.packageId}
                className={`glass-card flex flex-col group relative overflow-hidden transition-all duration-300 hover:shadow-lg border border-slate-200/80 rounded-3xl bg-white ${
                  isAdded ? "ring-2 ring-indigo-600 bg-indigo-50/20" : ""
                }`}
              >
                {/* Image Container */}
                <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={item.thumbnail}
                    alt={item.packageData.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Rating Tag */}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-black/5 flex items-center gap-1 shadow-xs">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-bold text-slate-800">{item.rating}</span>
                  </div>

                  {/* Discount Badge */}
                  <div className="absolute top-3 left-3 bg-[#071D49] text-white px-2.5 py-1 rounded-full text-[11px] font-black shadow-md">
                    {discountPercent}% OFF
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-5 flex flex-col flex-grow justify-between space-y-4">
                  <div>
                    <div className="flex items-center space-x-2 text-xs text-slate-400 font-semibold mb-1">
                      <MapPin className="h-3.5 w-3.5 text-indigo-500" />
                      <span>{item.packageData.region}</span>
                      <span>•</span>
                      <span>{item.stores[0]?.category}</span>
                    </div>

                    <Link
                      href={`/packages/${item.packageData.packageId}`}
                      onClick={() => recordPackageView({
                        id: item.packageData.packageId,
                        title: item.packageData.title,
                        category: item.categoryType,
                      })}
                      className="font-extrabold text-lg text-[#071D49] tracking-tight hover:underline line-clamp-1"
                    >
                      {item.packageData.title}
                    </Link>

                    <p className="text-xs text-slate-500 line-clamp-2 mt-1 font-medium">
                      {item.stores[0]?.story_label}
                    </p>
                  </div>

                  {/* Bottom Action & Price */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-400 line-through block">
                        {formatKRW(item.packageData.list_total)}
                      </span>
                      <span className="text-lg font-black text-[#071D49]">
                        {formatKRW(item.packageData.sale_price)}
                      </span>
                    </div>

                    <button
                      onClick={() => toggleComboItem(item.packageData.packageId)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                        isAdded
                          ? "bg-indigo-600 text-white shadow-md"
                          : "bg-slate-100 text-[#071D49] hover:bg-slate-200"
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          <span>담김</span>
                        </>
                      ) : (
                        <>
                          <Plus className="h-3.5 w-3.5" />
                          <span>콤보 담기</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
}
