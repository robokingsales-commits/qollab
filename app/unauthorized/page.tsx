"use client";

import Link from "next/link";
import { ShieldAlert, ArrowLeft, KeyRound } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <div className="rounded-3xl bg-white p-8 shadow-xl border border-rose-100 space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-600">
          <ShieldAlert className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black text-gray-900">접근 권한 제한 (403 Unauthorized)</h1>
          <p className="text-xs text-gray-500 leading-relaxed">
            해당 페이지에 접근하기 위한 역할(Role) 권한이 부족합니다. <br />
            점주(Owner) 또는 관리자(Admin) 계정으로 다시 로그인해 주세요.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <Link
            href="/auth/login"
            className="flex items-center justify-center space-x-2 rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white shadow-md hover:bg-indigo-500 transition"
          >
            <KeyRound className="h-4 w-4" />
            <span>권한 계정으로 다시 로그인</span>
          </Link>

          <Link
            href="/"
            className="flex items-center justify-center space-x-2 rounded-xl border border-gray-300 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>메인 홈으로 이동</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
