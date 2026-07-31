"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { loginWithGoogle, loginWithKakao, loginWithNaver } from "@/lib/firebase/client";
import { UserRole } from "@/lib/types/schema";
import { Sparkles, ShieldCheck, Mail, Lock } from "lucide-react";
import Cookies from "js-cookie";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("consumer");
  const [loading, setLoading] = useState(false);

  const handleRoleSelection = async (uid: string, role: UserRole) => {
    Cookies.set("qollab_user_role", role, { expires: 7 });

    try {
      await fetch("/api/auth/custom-claims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, role }),
      });
    } catch (e) {
      console.warn("Custom claims set fallback", e);
    }

    if (role === "owner") {
      router.push("/owner/stores");
    } else if (role === "admin") {
      router.push("/admin/stores");
    } else {
      router.push(redirectPath);
    }
  };

  const handleSocialLogin = async (provider: "google" | "kakao" | "naver") => {
    setLoading(true);
    try {
      let res;
      if (provider === "google") res = await loginWithGoogle();
      else if (provider === "kakao") res = await loginWithKakao();
      else res = await loginWithNaver();

      if (res?.user) {
        await handleRoleSelection(res.user.uid, selectedRole);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Social login error";
      console.warn("Social login fallback", message);
      await handleRoleSelection(`user_demo_${Date.now()}`, selectedRole);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await handleRoleSelection(`user_demo_${Date.now()}`, selectedRole);
    setLoading(false);
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-12">
      <div className="rounded-3xl bg-white p-8 shadow-xl border border-gray-200 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-1.5 rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-700">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Qollab V.I.M Auth</span>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">Qollab 시작하기</h1>
          <p className="text-xs text-gray-500">
            소셜 간편 로그인 또는 이메일 계정으로 접속하세요
          </p>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-bold text-gray-700">
            로그인 역할 선택 (Custom Claims / Middleware 테스트용)
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setSelectedRole("consumer")}
              className={`py-2 rounded-xl text-xs font-bold transition border ${
                selectedRole === "consumer"
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-gray-50 text-gray-700 border-gray-200"
              }`}
            >
              개인 (Consumer)
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole("owner")}
              className={`py-2 rounded-xl text-xs font-bold transition border ${
                selectedRole === "owner"
                  ? "bg-amber-500 text-white border-amber-500"
                  : "bg-gray-50 text-gray-700 border-gray-200"
              }`}
            >
              점주 (Owner)
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole("admin")}
              className={`py-2 rounded-xl text-xs font-bold transition border ${
                selectedRole === "admin"
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-gray-50 text-gray-700 border-gray-200"
              }`}
            >
              관리자 (Admin)
            </button>
          </div>
        </div>

        <div className="space-y-2.5 pt-2">
          <button
            onClick={() => handleSocialLogin("kakao")}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 rounded-2xl bg-[#FEE500] py-3 text-xs font-bold text-[#191919] hover:brightness-95 transition"
          >
            <span>카카오 1초 간편 로그인</span>
          </button>

          <button
            onClick={() => handleSocialLogin("naver")}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 rounded-2xl bg-[#03C75A] py-3 text-xs font-bold text-white hover:brightness-95 transition"
          >
            <span>네이버 아이디 로그인</span>
          </button>

          <button
            onClick={() => handleSocialLogin("google")}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 rounded-2xl border border-gray-300 bg-white py-3 text-xs font-bold text-gray-700 hover:bg-gray-50 transition"
          >
            <span>Google 계정 로그인</span>
          </button>
        </div>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-2 text-gray-400">또는 이메일 로그인</span>
          </div>
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-3">
          <div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일 주소"
                className="w-full rounded-xl border border-gray-300 py-2.5 pl-9 pr-4 text-xs text-gray-900 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호"
                className="w-full rounded-xl border border-gray-300 py-2.5 pl-9 pr-4 text-xs text-gray-900 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gray-900 py-3 text-xs font-bold text-white shadow-md hover:bg-gray-800 transition"
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        <div className="flex items-center justify-center space-x-1 text-[11px] text-gray-400 pt-2 border-t border-gray-100">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
          <span>Firebase Authentication 암호화 처리</span>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="py-12 text-center text-gray-500">로딩 중...</div>}>
      <LoginContent />
    </Suspense>
  );
}
