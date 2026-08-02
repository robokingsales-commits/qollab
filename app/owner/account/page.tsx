"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Settings, LogOut, Trash2, Building2, CheckCircle } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import Cookies from "js-cookie";

export default function BizAccountPage() {
  const router = useRouter();
  const [bizNumber, setBizNumber] = useState("123-45-67890");
  const [bizName, setBizName] = useState("성수 로스터리 주식회사");
  const [updated, setUpdated] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn("Logout error:", e);
    }
    Cookies.remove("qollab_user_role");
    router.push("/");
    router.refresh();
  };

  const handleSaveBizInfo = (e: React.FormEvent) => {
    e.preventDefault();
    setUpdated(true);
    setTimeout(() => setUpdated(false), 3000);
  };

  const handleDeleteAccount = () => {
    if (confirm("정말로 BIZ 계정을 삭제하시겠습니까? 관련 매장 정보 및 정산 데이터는 법령 규정에 따라 일정 기간 보존됩니다.")) {
      handleLogout();
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <div>
        <div className="inline-flex items-center space-x-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800 border border-amber-200">
          <Settings className="h-3.5 w-3.5" />
          <span>BIZ 회원 계정 관리</span>
        </div>
        <h1 className="text-3xl font-black text-gray-900 mt-2">계정 관리 (BIZ Account)</h1>
        <p className="text-sm text-gray-500 mt-1">
          사업자 정보 변경, 로그아웃 및 계정 삭제를 처리합니다.
        </p>
      </div>

      {/* 사업자 변경 등 */}
      <div className="rounded-3xl bg-white p-6 border border-gray-200 shadow-sm space-y-6">
        <h2 className="text-xl font-extrabold text-gray-900 border-b pb-4 flex items-center space-x-2">
          <Building2 className="h-5 w-5 text-amber-600" />
          <span>사업자 정보 변경 및 조회</span>
        </h2>

        {updated && (
          <div className="rounded-2xl bg-emerald-50 p-4 text-emerald-800 text-xs font-bold flex items-center space-x-2 border border-emerald-200">
            <CheckCircle className="h-4 w-4 text-emerald-600" />
            <span>사업자 정보가 성공적으로 변경되었습니다.</span>
          </div>
        )}

        <form onSubmit={handleSaveBizInfo} className="space-y-4 text-xs max-w-md">
          <div>
            <label className="font-bold text-gray-700 block mb-1">상호명 / 법인명</label>
            <input
              type="text"
              value={bizName}
              onChange={(e) => setBizName(e.target.value)}
              className="w-full rounded-xl border p-2.5 font-semibold text-gray-900"
            />
          </div>
          <div>
            <label className="font-bold text-gray-700 block mb-1">사업자 등록번호</label>
            <input
              type="text"
              value={bizNumber}
              onChange={(e) => setBizNumber(e.target.value)}
              className="w-full rounded-xl border p-2.5 font-semibold text-gray-900"
            />
          </div>
          <button
            type="submit"
            className="rounded-xl bg-amber-500 px-5 py-2.5 font-bold text-white shadow hover:bg-amber-400 transition"
          >
            사업자 정보 저장
          </button>
        </form>
      </div>

      {/* Action buttons: 로그아웃, 계정 삭제 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="rounded-3xl bg-white p-6 border border-gray-200 shadow-sm space-y-3">
          <h3 className="font-extrabold text-gray-900 text-base">로그아웃</h3>
          <p className="text-xs text-gray-500">현재 BIZ 점주 세션을 안전하게 종료합니다.</p>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 rounded-xl bg-slate-900 py-3 text-xs font-bold text-white hover:bg-slate-800 transition"
          >
            <LogOut className="h-4 w-4" />
            <span>BIZ 계정 로그아웃</span>
          </button>
        </div>

        <div className="rounded-3xl bg-rose-50 p-6 border border-rose-200 shadow-sm space-y-3">
          <h3 className="font-extrabold text-rose-900 text-base">계정 삭제 / 탈퇴</h3>
          <p className="text-xs text-rose-700">등록된 모든 매장 정보 및 BIZ 권한이 비활성화됩니다.</p>
          <button
            onClick={handleDeleteAccount}
            className="w-full flex items-center justify-center space-x-2 rounded-xl bg-rose-600 py-3 text-xs font-extrabold text-white shadow hover:bg-rose-500 transition"
          >
            <Trash2 className="h-4 w-4" />
            <span>BIZ 계정 영구 삭제</span>
          </button>
        </div>
      </div>
    </div>
  );
}
