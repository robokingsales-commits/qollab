"use client";

import { useState, use } from "react";
import { 
  User, 
  ShoppingBag, 
  CreditCard, 
  RotateCcw, 
  Star, 
  Bell, 
  Coins, 
  MapPin, 
  Settings, 
  LogOut, 
  UserX,
  CheckCircle,
  Plus,
  Trash2,
  Lock,
  ChevronRight
} from "lucide-react";
import { formatKRW } from "@/lib/utils";

interface MyPageProps {
  searchParams: Promise<{ tab?: string }>;
}

export default function MyPage({ searchParams }: MyPageProps) {
  const resolvedParams = use(searchParams);
  const initialTab = resolvedParams?.tab || "orders";
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  // Sample data states
  const [points] = useState(12500);
  const [favoritesAlert, setFavoritesAlert] = useState([
    { id: 1, type: "미용실 + 루프탑 카페", enabled: true, area: "성수동" },
    { id: 2, type: "영화관 + 팝콘 디저트 패키지", enabled: true, area: "전국 브랜드" },
  ]);

  const [addresses, setAddresses] = useState([
    { id: 1, label: "우리집", address: "서울특별시 성동구 아차산로 123 101동 502호", isDefault: true },
    { id: 2, label: "회사", address: "서울특별시 강남구 테헤란로 456 Qollab 타워 8층", isDefault: false },
  ]);

  const [payments] = useState([
    { id: 1, bank: "카카오페이 / 신한카드 (8842)", type: "신용카드", isDefault: true },
    { id: 2, bank: "토스페이 간편결제", type: "간편결제", isDefault: false },
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Top Banner / User Header */}
      <div className="rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-purple-800/40">
        <div className="flex items-center space-x-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-600 text-2xl font-black text-white shadow-lg border border-purple-400/30">
            Q
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-black">김콜라보 님</h1>
              <span className="rounded-full bg-purple-500/20 px-2.5 py-0.5 text-xs font-bold text-purple-300 border border-purple-500/30">
                개인회원 (V.I.M VIP)
              </span>
            </div>
            <p className="text-xs text-purple-200 mt-1">
              qollab_user@example.com • 가입일: 2026.08.01
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4 bg-white/10 p-4 rounded-2xl backdrop-blur border border-white/10 text-xs">
          <div>
            <span className="text-purple-300 block">보유 V.I.M 포인트</span>
            <span className="text-xl font-black text-amber-400">{formatKRW(points)}</span>
          </div>
          <div className="h-8 w-px bg-white/20" />
          <div>
            <span className="text-purple-300 block">사용 가능 바우처</span>
            <span className="text-xl font-black text-emerald-400">2 개</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Sidebar Tabs vs Content */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Menu Tree Items */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 mb-2">
            마이페이지 메뉴
          </div>
          {[
            { id: "orders", label: "구매내역", icon: ShoppingBag },
            { id: "payments", label: "결제수단 등록", icon: CreditCard },
            { id: "returns", label: "취소/반품/교환 내역", icon: RotateCcw },
            { id: "reviews", label: "상품리뷰", icon: Star },
            { id: "profile", label: "프로필 관리", icon: User },
            { id: "favorites", label: "즐겨찾기 알림 설정", icon: Bell },
            { id: "points", label: "포인트 관리", icon: Coins },
            { id: "shipping", label: "배송주소지 설정", icon: MapPin },
            { id: "account", label: "계정 정보 변경", icon: Settings },
            { id: "withdraw", label: "회원탈퇴", icon: UserX },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between rounded-2xl px-4 py-3 text-xs font-bold transition ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-100"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-gray-400"}`} />
                  <span>{item.label}</span>
                </div>
                <ChevronRight className={`h-3.5 w-3.5 ${isActive ? "text-indigo-200" : "text-gray-400"}`} />
              </button>
            );
          })}
        </div>

        {/* Content Panel */}
        <div className="md:col-span-3 rounded-3xl bg-white p-6 shadow-sm border border-gray-200 min-h-[480px]">
          {/* 1. 구매내역 */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              <h2 className="text-xl font-extrabold text-gray-900 border-b pb-4">구매내역</h2>
              <div className="rounded-2xl border border-gray-200 p-5 space-y-4">
                <div className="flex items-center justify-between text-xs text-gray-500 border-b pb-3">
                  <span>주문번호: ORD-20260802-9841</span>
                  <span>주문일자: 2026.08.02</span>
                </div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-bold text-indigo-600">성수동 동네 콜라보</span>
                    <h3 className="font-extrabold text-gray-900 text-base">
                      성수 루프탑 카페 + 아틀리에 헤어 힐링 패키지
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">발급 바우처 2건 (QR/바코드 이용 가능)</p>
                  </div>
                  <span className="rounded-full bg-emerald-100 text-emerald-800 text-xs px-3 py-1 font-extrabold">
                    결제완료
                  </span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t text-xs">
                  <span className="text-gray-500">총 결제금액:</span>
                  <span className="text-base font-black text-indigo-600">49,000원</span>
                </div>
              </div>
            </div>
          )}

          {/* 2. 결제수단 등록 */}
          {activeTab === "payments" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b pb-4">
                <h2 className="text-xl font-extrabold text-gray-900">결제수단 등록 및 관리</h2>
                <button className="flex items-center space-x-1 rounded-xl bg-indigo-600 px-3 py-2 text-xs font-bold text-white shadow hover:bg-indigo-500 transition">
                  <Plus className="h-4 w-4" />
                  <span>새 결제수단 추가</span>
                </button>
              </div>

              <div className="space-y-3">
                {payments.map((p) => (
                  <div key={p.id} className="flex items-center justify-between rounded-2xl border p-4 text-xs font-semibold">
                    <div className="flex items-center space-x-3">
                      <CreditCard className="h-5 w-5 text-indigo-600" />
                      <div>
                        <p className="font-bold text-gray-900">{p.bank}</p>
                        <span className="text-[11px] text-gray-400">{p.type}</span>
                      </div>
                    </div>
                    {p.isDefault && (
                      <span className="rounded-full bg-indigo-100 text-indigo-700 text-[11px] font-bold px-2.5 py-0.5">
                        기본 결제수단
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. 취소/반품/교환 내역 */}
          {activeTab === "returns" && (
            <div className="space-y-6">
              <h2 className="text-xl font-extrabold text-gray-900 border-b pb-4">취소 / 반품 / 교환 내역</h2>
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-8 text-center text-xs text-gray-500 space-y-2">
                <RotateCcw className="h-8 w-8 text-gray-400 mx-auto" />
                <p className="font-bold text-gray-700">최근 3개월 간 취소 및 반품 내역이 없습니다.</p>
                <p>Qollab은 바우처 미사용 시 100% 환불 정책을 지원합니다.</p>
              </div>
            </div>
          )}

          {/* 4. 상품리뷰 */}
          {activeTab === "reviews" && (
            <div className="space-y-6">
              <h2 className="text-xl font-extrabold text-gray-900 border-b pb-4">작성 가능한 리뷰</h2>
              <div className="rounded-2xl border p-4 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900">성수 루프탑 카페 + 아틀리에 헤어 힐링 패키지</span>
                  <button className="rounded-xl bg-amber-500 px-3 py-1.5 font-bold text-white shadow hover:bg-amber-400">
                    리뷰 작성 (+500P)
                  </button>
                </div>
                <p className="text-gray-500">이용 완료 바우처에 대한 생생한 후기를 남겨주세요.</p>
              </div>
            </div>
          )}

          {/* 5. 프로필 관리 */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <h2 className="text-xl font-extrabold text-gray-900 border-b pb-4">프로필 관리</h2>
              <div className="space-y-4 max-w-md text-xs">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">이름 / 닉네임</label>
                  <input type="text" defaultValue="김콜라보" className="w-full rounded-xl border p-2.5" />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">휴대폰 번호</label>
                  <input type="text" defaultValue="010-1234-5678" className="w-full rounded-xl border p-2.5" />
                </div>
                <button className="rounded-xl bg-indigo-600 px-4 py-2 font-bold text-white">
                  프로필 저장
                </button>
              </div>
            </div>
          )}

          {/* 6. 즐겨찾기 알림 설정 */}
          {activeTab === "favorites" && (
            <div className="space-y-6">
              <div className="border-b pb-4">
                <h2 className="text-xl font-extrabold text-gray-900">즐겨찾기(브랜드/매장) 알림 서비스</h2>
                <p className="text-xs text-gray-500 mt-1">
                  선호하는 종류의 패키지(예: 영화, 미용실, 맛집 등)가 구성되면 알림을 전달합니다.
                </p>
              </div>

              <div className="space-y-3">
                {favoritesAlert.map((fav) => (
                  <div key={fav.id} className="flex items-center justify-between rounded-2xl border p-4 text-xs">
                    <div className="flex items-center space-x-3">
                      <Bell className="h-5 w-5 text-amber-500" />
                      <div>
                        <p className="font-bold text-gray-900">{fav.type}</p>
                        <span className="text-gray-400">지역: {fav.area}</span>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={fav.enabled}
                        onChange={() => {
                          setFavoritesAlert(prev => prev.map(f => f.id === fav.id ? { ...f, enabled: !f.enabled } : f));
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. 포인트 */}
          {activeTab === "points" && (
            <div className="space-y-6">
              <h2 className="text-xl font-extrabold text-gray-900 border-b pb-4">V.I.M 포인트 내역</h2>
              <div className="rounded-2xl bg-amber-50 p-5 border border-amber-200 text-amber-900 text-xs space-y-1">
                <span className="font-bold block">현재 잔여 포인트:</span>
                <span className="text-2xl font-black text-amber-600">{formatKRW(points)}</span>
              </div>
            </div>
          )}

          {/* 8. 배송주소지 설정 */}
          {activeTab === "shipping" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b pb-4">
                <h2 className="text-xl font-extrabold text-gray-900">배송주소지 설정</h2>
                <button className="rounded-xl bg-indigo-600 px-3 py-2 text-xs font-bold text-white">
                  + 주소지 추가
                </button>
              </div>
              <div className="space-y-3">
                {addresses.map((a) => (
                  <div key={a.id} className="rounded-2xl border p-4 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900">{a.label}</span>
                      {a.isDefault && <span className="text-indigo-600 font-bold text-[11px]">[기본 배송지]</span>}
                    </div>
                    <p className="text-gray-600">{a.address}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 9. 계정 정보 변경 */}
          {activeTab === "account" && (
            <div className="space-y-6">
              <h2 className="text-xl font-extrabold text-gray-900 border-b pb-4">계정 정보 변경</h2>
              <div className="space-y-4 max-w-md text-xs">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">비밀번호 변경</label>
                  <input type="password" placeholder="현재 비밀번호" className="w-full rounded-xl border p-2.5 mb-2" />
                  <input type="password" placeholder="새 비밀번호" className="w-full rounded-xl border p-2.5" />
                </div>
                <button className="rounded-xl bg-indigo-600 px-4 py-2 font-bold text-white">
                  비밀번호 변경 적용
                </button>
              </div>
            </div>
          )}

          {/* 10. 회원탈퇴 */}
          {activeTab === "withdraw" && (
            <div className="space-y-6">
              <h2 className="text-xl font-extrabold text-rose-600 border-b pb-4">회원탈퇴</h2>
              <div className="rounded-2xl bg-rose-50 p-5 border border-rose-200 text-xs text-rose-900 space-y-3">
                <p className="font-bold">회원 탈퇴 시 유의사항:</p>
                <ul className="list-disc list-inside space-y-1 text-rose-700">
                  <li>보유 중인 바우처 및 포인트({formatKRW(points)})는 전액 소멸됩니다.</li>
                  <li>거래 내역 및 관련 법령에 따른 정보 보존 기간이 적용됩니다.</li>
                </ul>
                <button className="rounded-xl bg-rose-600 px-4 py-2.5 font-extrabold text-white shadow hover:bg-rose-700">
                  위 내용을 확인하였으며 탈퇴를 신청합니다
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
