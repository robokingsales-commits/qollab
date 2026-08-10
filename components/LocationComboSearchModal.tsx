"use client";

import { useState, useEffect, useMemo } from "react";
import {
  MapPin,
  Search,
  Zap,
  Plus,
  Trash2,
  Check,
  Navigation,
  ChevronRight,
  Sparkles,
  ShoppingBag,
  X,
  Building2,
  Home as HomeIcon,
  Compass,
} from "lucide-react";
import {
  DEFAULT_USER_LOCATIONS,
  LocationPreset,
  ComboItemStore,
  DIYComboStep,
  searchStoresByRadius,
  calculateComboMarginPricing,
} from "@/lib/services/location-combo-service";
import { addToCart } from "@/lib/services/cart-service";

interface LocationComboSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialKeyword?: string;
  mode?: "consumer" | "biz";
  onOpenCart?: () => void;
}

export default function LocationComboSearchModal({
  isOpen,
  onClose,
  initialKeyword = "",
  mode = "consumer",
  onOpenCart,
}: LocationComboSearchModalProps) {
  // 1. Current Selected Location Preset
  const [selectedLocation, setSelectedLocation] = useState<LocationPreset>(
    DEFAULT_USER_LOCATIONS[0]
  );

  // Custom location input state
  const [isAddingCustomLoc, setIsAddingCustomLoc] = useState(false);
  const [customLocName, setCustomLocName] = useState("");

  // 2. Selected Search Radius (1km default, 3km, 5km, 10km)
  const [selectedRadius, setSelectedRadius] = useState<number>(1);

  // 3. Multi-step Combo Items State
  const [comboSteps, setComboSteps] = useState<DIYComboStep[]>([
    { stepIndex: 1, keyword: initialKeyword || "" },
  ]);

  // Current active step index for searching (0-indexed internally: 0 for Step 1)
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  // Search input state for the current active step
  const [searchInput, setSearchInput] = useState<string>(
    initialKeyword || ""
  );

  // Guideline Banner Notification Message
  const [guideNotice, setGuideNotice] = useState<string | null>(null);

  // Re-sync modal search input and step #1 keyword whenever modal opens or initialKeyword changes
  useEffect(() => {
    if (isOpen) {
      const kw = initialKeyword ? initialKeyword.trim() : "";
      setComboSteps([{ stepIndex: 1, keyword: kw }]);
      setActiveStepIndex(0);
      setSearchInput(kw);
      setGuideNotice(null);
    }
  }, [isOpen, initialKeyword]);

  // Handle real-time search input changes for the active step
  const handleSearchInputChange = (newVal: string) => {
    setSearchInput(newVal);
    setComboSteps((prev) => {
      const updated = [...prev];
      if (updated[activeStepIndex]) {
        updated[activeStepIndex] = {
          ...updated[activeStepIndex],
          keyword: newVal,
        };
      }
      return updated;
    });
  };

  // Calculate search results based on location, radius, and searchInput
  const searchResults = useMemo(() => {
    return searchStoresByRadius(
      selectedLocation.lat,
      selectedLocation.lng,
      selectedRadius,
      searchInput
    );
  }, [selectedLocation, selectedRadius, searchInput]);

  // Handle store selection for the active step
  const handleSelectStore = (store: ComboItemStore) => {
    const currentStepNum = activeStepIndex + 1;
    const updatedSteps = [...comboSteps];

    updatedSteps[activeStepIndex] = {
      ...updatedSteps[activeStepIndex],
      selectedStoreItem: store,
    };

    setComboSteps(updatedSteps);

    // Guide popup & auto-transition to next combo step (up to step 5)
    if (currentStepNum < 5) {
      const nextStepNum = currentStepNum + 1;
      setGuideNotice(
        `🎉 ${currentStepNum}번째 [${store.storeName}] 선택 완료! 다음 콤보로 하길 원하는 키워드를 입력해 주세요 (예: 커피, 두피스파, 영화 등)`
      );

      // Add next step slot if not already existing
      if (updatedSteps.length < nextStepNum) {
        updatedSteps.push({ stepIndex: nextStepNum, keyword: "" });
        setComboSteps(updatedSteps);
      }

      // Switch active step index to next step
      setActiveStepIndex(nextStepNum - 1);
      setSearchInput("");
    } else {
      setGuideNotice("👑 5단계 메가 콤보 작성이 완료되었습니다! 사업자 할인 여력의 100% 전부(최대할인가)가 반영됩니다.");
    }
  };

  // Remove a combo step
  const handleRemoveStep = (indexToRemove: number) => {
    if (comboSteps.length <= 1) return;
    const filtered = comboSteps.filter((_, idx) => idx !== indexToRemove);
    // Re-index steps
    const reindexed = filtered.map((step, idx) => ({ ...step, stepIndex: idx + 1 }));
    setComboSteps(reindexed);
    setActiveStepIndex(Math.max(0, indexToRemove - 1));
    setSearchInput(reindexed[Math.max(0, indexToRemove - 1)]?.keyword || "");
  };

  // Extract selected stores array
  const selectedStores = useMemo(() => {
    return comboSteps
      .map((s) => s.selectedStoreItem)
      .filter((s): s is ComboItemStore => !!s);
  }, [comboSteps]);

  // Calculate Combo Margin Capacity Pricing (0% -> 60% -> 85% -> 100%)
  const marginPricing = useMemo(() => {
    return calculateComboMarginPricing(selectedStores);
  }, [selectedStores]);

  // Add Combo to Cart
  const handleAddToCart = () => {
    if (selectedStores.length === 0) return;

    addToCart({
      title: `[부천 콤보] ${selectedStores.length}단계 DIY 연쇄 할인 콤보`,
      locationName: selectedLocation.address,
      itemCount: marginPricing.itemCount,
      discountRatePercent: marginPricing.ratePercent,
      rateLabel: marginPricing.badgeLabel,
      stores: marginPricing.items.map((it) => ({
        id: it.storeId,
        storeName: it.storeName,
        category: it.category,
        itemName: it.itemName,
        originalPrice: it.originalPrice,
        minPrice: it.minPrice,
        discountCapacity: it.discountCapacity,
        appliedDiscount: it.appliedDiscount,
        finalPrice: it.finalPrice,
        imageUrl: it.imageUrl,
      })),
      totalOriginalPrice: marginPricing.totalOriginalPrice,
      totalDiscountAmount: marginPricing.totalDiscountAmount,
      totalFinalPrice: marginPricing.totalFinalPrice,
    });

    if (onOpenCart) {
      onOpenCart();
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-3 sm:p-5 overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-3xl bg-white shadow-2xl border border-gray-100 flex flex-col overflow-hidden max-h-[90vh]">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-slate-900 text-white">
          <div className="flex items-center space-x-2">
            <Compass className="h-5 w-5 text-indigo-400 animate-pulse" />
            <h2 className="text-base sm:text-lg font-black tracking-tight">
              위치 기반 반경 조절 &amp; 다단계 DIY 콤보 생성기
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-gray-400 hover:bg-slate-800 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-5 overflow-y-auto flex-1">
          {/* 1. Location Selection & Radius Control Header */}
          <div className="rounded-2xl bg-[#071D49]/5 p-4 border border-[#071D49]/10 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-[#071D49] shrink-0" />
                <span className="text-xs font-black text-slate-900">기준 위치 설정:</span>
                
                {/* Location Selector Dropdown */}
                <select
                  value={selectedLocation.id}
                  onChange={(e) => {
                    const found = DEFAULT_USER_LOCATIONS.find((l) => l.id === e.target.value);
                    if (found) setSelectedLocation(found);
                  }}
                  className="rounded-xl border border-[#071D49]/30 bg-white px-3 py-1.5 text-xs font-bold text-[#071D49] focus:outline-none focus:ring-2 focus:ring-[#071D49] shadow-sm"
                >
                  {DEFAULT_USER_LOCATIONS.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Radius Filter Pills */}
              <div className="flex items-center space-x-1">
                <span className="text-[11px] font-bold text-gray-500 mr-1">검색 반경:</span>
                {[1, 3, 5, 10].map((radius) => (
                  <button
                    key={radius}
                    onClick={() => setSelectedRadius(radius)}
                    className={`rounded-xl px-2.5 py-1 text-xs font-extrabold transition shadow-sm cursor-pointer ${
                      selectedRadius === radius
                        ? "bg-[#071D49] text-white shadow"
                        : "bg-white text-gray-700 hover:bg-[#071D49]/10 border border-gray-200"
                    }`}
                  >
                    {radius}km
                  </button>
                ))}
              </div>
            </div>

            <p className="text-[11px] font-medium text-indigo-700/80 flex items-center gap-1">
              <span>📍 선택된 주소: <strong>{selectedLocation.address}</strong> (반경 {selectedRadius}km 이내 등록 매장 탐색)</span>
            </p>
          </div>

          {/* 2. Interactive Guide Notification Banner */}
          {guideNotice && (
            <div className="rounded-2xl bg-amber-500/10 border border-amber-500/30 p-3.5 flex items-start justify-between gap-2 text-amber-900 text-xs font-bold animate-fadeIn">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-amber-600 shrink-0" />
                <span>{guideNotice}</span>
              </div>
              <button
                onClick={() => setGuideNotice(null)}
                className="text-amber-700 hover:text-amber-950 font-extrabold text-[11px] shrink-0"
              >
                닫기
              </button>
            </div>
          )}

          {/* 3. Multi-step Combo Slot Badges */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-900 flex items-center gap-1">
                <span>🎯 나만의 DIY 콤보 결합 단계 ({comboSteps.length}/5):</span>
              </span>
              {selectedStores.length > 1 && (
                <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-rose-500 text-white shadow-sm animate-bounce">
                  {marginPricing.badgeLabel}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2.5 overflow-x-auto pb-2 scrollbar-none">
              {comboSteps.map((step, idx) => {
                const isSelected = !!step.selectedStoreItem;
                const isActive = activeStepIndex === idx;
                const item = step.selectedStoreItem;

                return (
                  <div
                    key={idx}
                    onClick={() => {
                      setActiveStepIndex(idx);
                      setSearchInput(step.keyword || "");
                    }}
                    className={`shrink-0 cursor-pointer rounded-2xl p-3 border transition-all space-y-2 min-w-[200px] max-w-[240px] shadow-sm relative overflow-hidden ${
                      isActive
                        ? "bg-indigo-600 text-white border-indigo-600 ring-2 ring-indigo-400"
                        : isSelected
                        ? "bg-emerald-50 text-emerald-950 border-emerald-300 hover:border-emerald-400"
                        : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    {/* Slot Header Bar */}
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider">
                      <span className={`px-2 py-0.5 rounded-full ${
                        isActive
                          ? "bg-white/20 text-white"
                          : isSelected
                          ? "bg-emerald-200 text-emerald-900"
                          : "bg-gray-200 text-gray-700"
                      }`}>
                        #{step.stepIndex} 콤보
                      </span>
                      {comboSteps.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveStep(idx);
                          }}
                          className={`rounded-full p-0.5 transition ${
                            isActive ? "hover:bg-white/20 text-white" : "hover:bg-gray-200 text-gray-400"
                          }`}
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Selected Item Visual Content (Thumbnail + Store Name + Price) */}
                    {isSelected && item ? (
                      <div className="flex items-center space-x-2.5 pt-0.5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.imageUrl}
                          alt={item.storeName}
                          className="h-12 w-12 rounded-xl object-cover shrink-0 border border-black/10 shadow-sm"
                        />
                        <div className="min-w-0 flex-1 space-y-0.5">
                          <div className={`font-black text-xs truncate ${isActive ? "text-white" : "text-gray-900"}`}>
                            {item.storeName}
                          </div>
                          <div className={`text-[10px] font-bold truncate ${isActive ? "text-indigo-100" : "text-indigo-600"}`}>
                            {item.itemName}
                          </div>
                          <div className="flex items-baseline space-x-1">
                            <span className={`text-[9px] line-through ${isActive ? "text-indigo-200" : "text-gray-400"}`}>
                              {item.originalPrice.toLocaleString()}원
                            </span>
                            <span className={`font-black text-xs ${isActive ? "text-amber-300" : "text-emerald-700"}`}>
                              {item.comboPrice.toLocaleString()}원
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="py-2 space-y-1">
                        <div className={`font-extrabold text-xs truncate ${isActive ? "text-white" : "text-gray-800"}`}>
                          {step.keyword || "키워드 입력..."}
                        </div>
                        <div className={`text-[10px] font-semibold ${isActive ? "text-indigo-200" : "text-gray-400"}`}>
                          {isActive ? "👉 하단에서 매장 선택 중" : "선택 대기..."}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {comboSteps.length < 5 && (
                <button
                  onClick={() => {
                    const nextNum = comboSteps.length + 1;
                    setComboSteps([...comboSteps, { stepIndex: nextNum, keyword: "" }]);
                    setActiveStepIndex(comboSteps.length);
                    setSearchInput("");
                  }}
                  className="shrink-0 rounded-2xl border border-dashed border-gray-300 hover:border-indigo-500 p-3 text-xs font-bold text-gray-400 hover:text-indigo-600 flex flex-col items-center justify-center space-y-1 min-w-[100px] transition"
                >
                  <Plus className="h-4 w-4" />
                  <span>+ 콤보 추가</span>
                </button>
              )}
            </div>
          </div>

          {/* 4. Active Step Keyword Search Bar */}
          <div className="relative">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => handleSearchInputChange(e.target.value)}
              placeholder={`#${activeStepIndex + 1}번째 콤보 검색어를 입력하세요 (예: 영화, 짜장면, 커피, 두피스파 등)`}
              className="w-full rounded-2xl bg-gray-100 border border-gray-200 px-10 py-3 text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition shadow-inner"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            {searchInput && (
              <button
                onClick={() => handleSearchInputChange("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-bold"
              >
                Clear
              </button>
            )}
          </div>

          {/* 5. Stores Search Results List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-black text-gray-700">
              <span>
                반경 {selectedRadius}km 이내 &apos;{searchInput || "전체"}&apos; 검색 결과 ({searchResults.length}개 매장)
              </span>
              {searchResults.length === 0 && (
                <span className="text-indigo-600 underline cursor-pointer" onClick={() => setSelectedRadius(selectedRadius === 10 ? 1 : selectedRadius === 1 ? 3 : selectedRadius === 3 ? 5 : 10)}>
                  💡 반경 넓히기 ({selectedRadius}km ➔ {selectedRadius < 10 ? selectedRadius * 2 + 1 : 10}km)
                </span>
              )}
            </div>

            {searchResults.length === 0 ? (
              <div className="rounded-2xl bg-gray-50 border border-dashed border-gray-200 p-8 text-center space-y-2">
                <p className="text-xs font-bold text-gray-500">
                  선택하신 반경 ({selectedRadius}km) 내에 해당 키워드 매장이 없습니다.
                </p>
                <button
                  onClick={() => setSelectedRadius(selectedRadius < 10 ? 5 : 10)}
                  className="rounded-xl bg-indigo-600 text-white font-extrabold text-xs px-4 py-2 shadow transition hover:bg-indigo-500"
                >
                  검색 반경 5km/10km로 확장하기
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[260px] overflow-y-auto pr-1">
                {searchResults.map((store) => {
                  const isCurrentActiveSelected =
                    comboSteps[activeStepIndex]?.selectedStoreItem?.id === store.id;

                  return (
                    <div
                      key={store.id}
                      className={`rounded-2xl p-4 border transition space-y-2 relative flex flex-col justify-between ${
                        isCurrentActiveSelected
                          ? "bg-indigo-50 border-indigo-400 ring-2 ring-indigo-400/50"
                          : "bg-white border-gray-200 hover:border-indigo-300 hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={store.imageUrl}
                          alt={store.storeName}
                          className="h-14 w-14 rounded-xl object-cover shrink-0 border border-gray-100"
                        />
                        <div className="space-y-0.5 min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                              V.I.M {store.vimScore}점
                            </span>
                            <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              📍 {store.distanceKm}km 거리
                            </span>
                          </div>
                          <h4 className="font-extrabold text-sm text-slate-900 truncate">
                            {store.storeName}
                          </h4>
                          <p className="text-xs font-bold text-indigo-600 truncate">
                            {store.itemName}
                          </p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                        <div>
                          <div className="flex items-center space-x-1.5">
                            <span className="text-[11px] text-gray-400 line-through font-medium">
                              정가 {store.originalPrice.toLocaleString()}원
                            </span>
                            <span className="text-[10px] text-rose-600 font-bold bg-rose-50 border border-rose-200 px-1.5 py-0.2 rounded">
                              여력 {(store.originalPrice - store.comboPrice).toLocaleString()}원
                            </span>
                          </div>
                          <span className="text-sm font-black text-indigo-600 block">
                            최대 {store.comboPrice.toLocaleString()}원
                          </span>
                        </div>

                        <button
                          onClick={() => handleSelectStore(store)}
                          className={`rounded-xl px-3 py-1.5 text-xs font-black transition flex items-center space-x-1 shadow ${
                            isCurrentActiveSelected
                              ? "bg-emerald-600 text-white"
                              : "bg-indigo-600 hover:bg-indigo-500 text-white"
                          }`}
                        >
                          {isCurrentActiveSelected ? (
                            <>
                              <Check className="h-3.5 w-3.5" />
                              <span>선택됨</span>
                            </>
                          ) : (
                            <>
                              <Plus className="h-3.5 w-3.5" />
                              <span>#{activeStepIndex + 1} 콤보에 담기</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* 6. Bottom Sticky DIY Combo Summary & Cart Action Dashboard */}
        <div className="border-t border-gray-200 bg-slate-900 text-white p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          <div className="space-y-1 text-center sm:text-left w-full sm:w-auto">
            <div className="flex items-center justify-center sm:justify-start space-x-2">
              <span className="text-xs text-slate-400 font-bold">
                선택 콤보: <strong>{selectedStores.length} / {comboSteps.length}개</strong>
              </span>
              <span className="rounded-full bg-indigo-500 text-white text-[10px] font-black px-2.5 py-0.5 shadow">
                {marginPricing.badgeLabel}
              </span>
            </div>

            <div className="flex items-baseline justify-center sm:justify-start space-x-2">
              {marginPricing.totalOriginalPrice > 0 && (
                <span className="text-xs text-slate-400 line-through font-medium">
                  정가 {marginPricing.totalOriginalPrice.toLocaleString()}원
                </span>
              )}
              {marginPricing.totalDiscountAmount > 0 && (
                <span className="text-xs text-rose-400 font-black">
                  (-{marginPricing.totalDiscountAmount.toLocaleString()}원 할인)
                </span>
              )}
              <span className="text-xl sm:text-2xl font-black text-amber-400">
                {marginPricing.totalFinalPrice.toLocaleString()}원
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            {/* Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={selectedStores.length === 0}
              className={`flex-1 sm:flex-none rounded-2xl px-5 py-3 text-xs font-black transition flex items-center justify-center space-x-1.5 border ${
                selectedStores.length > 0
                  ? "bg-slate-800 hover:bg-slate-700 border-slate-700 text-white shadow-md"
                  : "bg-slate-850 border-slate-800 text-slate-600 cursor-not-allowed"
              }`}
            >
              <ShoppingBag className="h-4 w-4 text-indigo-400" />
              <span>장바구니 담기</span>
            </button>

            {/* Direct Checkout Button */}
            <button
              onClick={() => {
                alert(
                  `🎉 ${selectedStores.length}단계 DIY 콤보 패키지가 즉시 결제 예약되었습니다!\n최종 결제 금액: ${marginPricing.totalFinalPrice.toLocaleString()}원 (${marginPricing.badgeLabel} 적용)`
                );
                onClose();
              }}
              disabled={selectedStores.length === 0}
              className={`flex-1 sm:flex-none rounded-2xl px-6 py-3 text-xs font-black transition flex items-center justify-center space-x-1.5 shadow-xl ${
                selectedStores.length > 0
                  ? "bg-amber-400 hover:bg-amber-300 text-slate-950 scale-105"
                  : "bg-slate-800 text-slate-500 cursor-not-allowed"
              }`}
            >
              <Zap className="h-4 w-4 fill-slate-950" />
              <span>
                {selectedStores.length > 0
                  ? `바로 콤보 결제하기 (${marginPricing.totalFinalPrice.toLocaleString()}원)`
                  : "콤보를 선택해주세요"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
