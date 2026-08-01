"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { auth, signInWithCustomToken } from "@/lib/firebase/client";
import { Sparkles, ShieldCheck, ArrowRight } from "lucide-react";
import Cookies from "js-cookie";

function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const customToken = searchParams.get("customToken");
  const role = (searchParams.get("role") as "consumer" | "owner" | "admin") || "consumer";

  const [displayName, setDisplayName] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (customToken) {
      signInWithCustomToken(auth, customToken).catch((err) => {
        console.warn("Onboarding auto sign-in error", err);
      });
    }
  }, [customToken]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms || !agreePrivacy) {
      alert("필수 약관에 동의해 주세요.");
      return;
    }

    setSubmitting(true);
    Cookies.set("qollab_user_role", role, { expires: 7 });

    setTimeout(() => {
      setSubmitting(false);
      alert("Qollab 회원가입 및 이용약관 동의가 완료되었습니다!");
      if (role === "owner") {
        router.push("/owner/stores");
      } else if (role === "admin") {
        router.push("/admin/stores");
      } else {
        router.push("/");
      }
    }, 500);
  };

  return (
    <div className="mx-auto flex min-h-[85vh] max-w-lg flex-col justify-center px-4 py-12">
      <div className="rounded-3xl bg-white p-8 shadow-xl border border-gray-200 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-1.5 rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-700">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Qollab 환영합니다</span>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">회원가입 프로필 및 약관동의</h1>
          <p className="text-xs text-gray-500">
            최초 1회 이용약관 동의 후 서비스를 자유롭게 이용하실 수 있습니다.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-700">
              닉네임 / 성함
            </label>
            <input
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="예: 홍길동 (또는 닉네임)"
              className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-xs text-gray-900 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="space-y-3 rounded-2xl bg-gray-50 p-4 border border-gray-200 text-xs">
            <label className="flex items-center space-x-2 font-bold text-gray-900 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeTerms && agreePrivacy}
                onChange={(e) => {
                  setAgreeTerms(e.target.checked);
                  setAgreePrivacy(e.target.checked);
                }}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span>전체 약관 동의하기</span>
            </label>

            <div className="border-t border-gray-200 pt-3 space-y-2">
              <label className="flex items-center justify-between text-gray-600 cursor-pointer">
                <span className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-gray-300 text-indigo-600"
                  />
                  <span>[필수] Qollab 서비스 이용약관 동의</span>
                </span>
                <span className="text-[10px] text-gray-400 underline">보기</span>
              </label>

              <label className="flex items-center justify-between text-gray-600 cursor-pointer">
                <span className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={agreePrivacy}
                    onChange={(e) => setAgreePrivacy(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-gray-300 text-indigo-600"
                  />
                  <span>[필수] 개인정보 수집 및 이용 동의</span>
                </span>
                <span className="text-[10px] text-gray-400 underline">보기</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || !agreeTerms || !agreePrivacy}
            className="w-full flex items-center justify-center space-x-2 rounded-2xl bg-indigo-600 py-3.5 text-xs font-bold text-white shadow-lg hover:bg-indigo-500 disabled:opacity-50 transition"
          >
            <span>{submitting ? "처리 중..." : "동의하고 서비스 시작하기"}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="flex items-center justify-center space-x-1 text-[11px] text-gray-400 pt-2 border-t border-gray-100">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
          <span>개인정보보호 표준지침 준수 및 암호화 보장</span>
        </div>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="py-12 text-center text-gray-500">로딩 중...</div>}>
      <OnboardingContent />
    </Suspense>
  );
}
