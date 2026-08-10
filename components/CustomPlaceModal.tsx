"use client";

import { useState } from "react";
import { X, MapPin, Plus, Home, Building2, GraduationCap, Trash2 } from "lucide-react";

export interface DesignatedPlace {
  id: string;
  nickname: string;
  address: string;
  detail?: string;
  iconType?: "home" | "office" | "school" | "pin";
}

interface CustomPlaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedPlaces: DesignatedPlace[];
  activePlaceId: string | null;
  onSelectPlace: (place: DesignatedPlace) => void;
  onAddPlace: (place: Omit<DesignatedPlace, "id">) => void;
  onDeletePlace: (id: string) => void;
}

export default function CustomPlaceModal({
  isOpen,
  onClose,
  savedPlaces,
  activePlaceId,
  onSelectPlace,
  onAddPlace,
  onDeletePlace,
}: CustomPlaceModalProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [nickname, setNickname] = useState("");
  const [address, setAddress] = useState("");
  const [iconType, setIconType] = useState<"home" | "office" | "school" | "pin">("home");

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim() || !address.trim()) return;

    onAddPlace({
      nickname: nickname.trim(),
      address: address.trim(),
      iconType,
    });

    setNickname("");
    setAddress("");
    setIsAdding(false);
  };

  const getIcon = (type?: string) => {
    switch (type) {
      case "home":
        return <Home className="h-4 w-4" />;
      case "office":
        return <Building2 className="h-4 w-4" />;
      case "school":
        return <GraduationCap className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-5 shadow-2xl border border-[rgba(0,0,0,0.08)] space-y-4 max-h-[90vh] overflow-y-auto scrollbar-none">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[rgba(0,0,0,0.06)] pb-3">
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-[#111111]" />
            <h3 className="text-base font-extrabold text-[#111111]">
              장소 지정 및 관리
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#86868b] hover:bg-[#f5f5f7] hover:text-[#111111] transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Saved Places List */}
        {!isAdding && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#86868b]">
                등록된 지정 장소 ({savedPlaces.length}개)
              </span>
              <button
                onClick={() => setIsAdding(true)}
                className="apple-pill-button text-xs py-1.5 px-3 shadow-2xs flex items-center gap-1 cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>새 장소 추가</span>
              </button>
            </div>

            {savedPlaces.length === 0 ? (
              <div className="p-6 text-center rounded-2xl bg-[#f5f5f7] border border-[rgba(0,0,0,0.06)] space-y-2">
                <MapPin className="h-8 w-8 text-[#86868b] mx-auto opacity-50" />
                <p className="text-xs font-bold text-[#111111]">
                  등록된 지정 장소가 없습니다.
                </p>
                <p className="text-[11px] text-[#86868b]">
                  집, 사무실, 학교 등 자주 방문하는 장소를 등록해 보세요!
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {savedPlaces.map((place) => {
                  const isSelected = activePlaceId === place.id;
                  return (
                    <div
                      key={place.id}
                      onClick={() => {
                        onSelectPlace(place);
                        onClose();
                      }}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                        isSelected
                          ? "bg-[#111111] text-white border-[#111111] shadow-md"
                          : "bg-white text-[#111111] border-[rgba(0,0,0,0.08)] hover:border-[#111111]"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`p-2 rounded-xl ${
                            isSelected
                              ? "bg-white/20 text-white"
                              : "bg-[#f5f5f7] text-[#111111]"
                          }`}
                        >
                          {getIcon(place.iconType)}
                        </div>
                        <div>
                          <div className="flex items-center space-x-1.5">
                            <span className="font-extrabold text-xs">
                              {place.nickname}
                            </span>
                            {isSelected && (
                              <span className="text-[9px] font-bold px-2 py-0.2 rounded-full bg-white text-[#111111]">
                                선택됨
                              </span>
                            )}
                          </div>
                          <p
                            className={`text-[11px] font-medium ${
                              isSelected ? "text-slate-300" : "text-[#86868b]"
                            }`}
                          >
                            {place.address}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeletePlace(place.id);
                        }}
                        className={`p-1.5 rounded-lg transition ${
                          isSelected
                            ? "text-slate-400 hover:text-white hover:bg-white/20"
                            : "text-[#86868b] hover:text-[#ff3b30] hover:bg-[#f5f5f7]"
                        }`}
                        title="장소 삭제"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Add New Place Form */}
        {isAdding && (
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-extrabold text-[#111111]">
                장소 닉네임
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="예: 집, 사무실, 본가, 학교 등"
                  required
                  className="w-full rounded-xl bg-[#f5f5f7] border border-[rgba(0,0,0,0.08)] px-3.5 py-2 text-xs font-medium text-[#111111] focus:outline-none focus:ring-2 focus:ring-black focus:bg-white"
                />
              </div>

              {/* Icon Type Quick Selectors */}
              <div className="flex items-center space-x-2 pt-1">
                {[
                  { type: "home", label: "집" },
                  { type: "office", label: "사무실" },
                  { type: "school", label: "학교" },
                  { type: "pin", label: "기타" },
                ].map((item) => (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => setIconType(item.type as "home" | "office" | "school" | "pin")}
                    className={`rounded-lg px-2.5 py-1 text-[10px] font-bold border transition ${
                      iconType === item.type
                        ? "bg-[#111111] text-white border-[#111111]"
                        : "bg-[#f5f5f7] text-[#86868b] border-[rgba(0,0,0,0.08)] hover:text-[#111111]"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-extrabold text-[#111111]">
                주소 입력
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="예: 서울특별시 강남구 테헤란로 123"
                required
                className="w-full rounded-xl bg-[#f5f5f7] border border-[rgba(0,0,0,0.08)] px-3.5 py-2 text-xs font-medium text-[#111111] focus:outline-none focus:ring-2 focus:ring-black focus:bg-white"
              />
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#86868b] hover:bg-[#f5f5f7] transition"
              >
                취소
              </button>
              <button
                type="submit"
                className="apple-pill-button text-xs py-2 px-5 shadow-sm"
              >
                저장하기
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
