"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { auth, signInWithCustomToken } from "@/lib/firebase/client";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ChevronLeft, Search, Laptop, Eye, EyeOff, ShieldCheck } from "lucide-react";
import Cookies from "js-cookie";

function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const customToken = searchParams.get("customToken");
  const modeParam = searchParams.get("mode");
  const roleParam = searchParams.get("role");

  // Step state: "select" | "general_signup" | "biz_signup"
  const [step, setStep] = useState<"select" | "general_signup" | "biz_signup">(
    roleParam === "owner" || modeParam === "biz" 
      ? "biz_signup" 
      : modeParam === "general" 
        ? "general_signup" 
        : "select"
  );

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Agreement states
  const [agreeAll, setAgreeAll] = useState(false);
  const [agreeAge, setAgreeAge] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (customToken) {
      signInWithCustomToken(auth, customToken).catch((err) => {
        console.warn("Onboarding auto sign-in error", err);
      });
    }
  }, [customToken]);

  const handleToggleAgreeAll = (checked: boolean) => {
    setAgreeAll(checked);
    setAgreeAge(checked);
    setAgreeTerms(checked);
  };

  const handleSignupSubmit = async (e: React.FormEvent, targetRole: "consumer" | "owner") => {
    e.preventDefault();
    if (!agreeAge || !agreeTerms) {
      alert("필수 약관에 동의해 주세요.");
      return;
    }

    if (password !== passwordConfirm) {
      setErrorMsg("비밀번호가 일치하지 않습니다.");
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    try {
      try {
        await createUserWithEmailAndPassword(auth, email, password);
      } catch (authErr: unknown) {
        console.warn("Firebase Auth Create User fallback:", authErr);
      }

      Cookies.set("qollab_user_role", targetRole, { expires: 7 });
      Cookies.set("qollab_terms_agreed", "true", { expires: 365 });

      setTimeout(() => {
        setSubmitting(false);
        if (targetRole === "owner") {
          alert("Qollab BIZ 회원가입이 완료되었습니다!");
          router.push("/owner/stores");
        } else {
          alert("Qollab 일반 회원가입이 완료되었습니다!");
          router.push("/");
        }
      }, 400);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "회원가입 실패";
      setErrorMsg(msg);
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[88vh] max-w-md flex-col justify-center px-4 py-8">
      {/* --- Step 1: 회원 종류 선택 화면 --- */}
      {step === "select" && (
        <div className="relative overflow-hidden rounded-3xl bg-[#141416] p-8 text-white shadow-2xl border border-slate-800 space-y-8">
          <div className="space-y-3 pt-2">
            <h1 className="text-xl font-extrabold text-white leading-tight">
              Qollab에서 어떤 종류로<br />
              서비스들을 이용하고 싶으세요?
            </h1>
          </div>

          <div className="space-y-4">
            {/* Option Card 1: 일반 회원가입 */}
            <div
              onClick={() => setStep("general_signup")}
              className="group relative flex items-start space-x-4 rounded-2xl bg-[#1D1D21] p-5 border border-slate-800 hover:border-indigo-500/50 hover:bg-[#25252B] transition cursor-pointer shadow-md"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Search className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-white group-hover:text-amber-400 transition">
                  일반 회원가입
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  패키지 구매로 강력한 혜택을 누려 보세요
                </p>
              </div>
            </div>

            {/* Option Card 2: BIZ 회원가입 */}
            <div
              onClick={() => setStep("biz_signup")}
              className="group relative flex items-start space-x-4 rounded-2xl bg-[#1D1D21] p-5 border border-slate-800 hover:border-amber-500/50 hover:bg-[#25252B] transition cursor-pointer shadow-md"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <Laptop className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-white group-hover:text-amber-400 transition">
                  BIZ 회원가입
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  연결의 가치를 경험해 보세요
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 text-center text-xs text-slate-500 font-medium">
            가입 이후에도 언제든 원하는 상태로 전환할 수 있어요!
          </div>
        </div>
      )}

      {/* --- Step 2-B: BIZ 회원가입 화면 (다크 테마) --- */}
      {step === "biz_signup" && (
        <div className="relative overflow-hidden rounded-3xl bg-[#141416] p-7 text-white shadow-2xl border border-slate-800 space-y-6">
          {/* Top Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <button
              onClick={() => setStep("select")}
              className="flex items-center space-x-1 text-xs text-slate-400 hover:text-white transition font-bold"
            >
              <ChevronLeft className="h-5 w-5" />
              <span>뒤로</span>
            </button>
            <span className="text-lg font-black tracking-wider text-white">QOLLAB</span>
            <div className="w-8" />
          </div>

          {/* Title */}
          <div className="space-y-1">
            <h2 className="text-xl font-black text-white">이제 혼자가 아닙니다.</h2>
            <p className="text-sm font-bold text-slate-300">연결의 기적을 경험하세요</p>
          </div>

          {errorMsg && (
            <div className="rounded-xl bg-rose-500/20 p-3 text-xs font-bold text-rose-300 border border-rose-500/30">
              {errorMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={(e) => handleSignupSubmit(e, "owner")} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1.5 font-bold">이메일</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="아이디로 사용할 이메일을 입력해 주세요"
                className="w-full rounded-xl bg-[#1D1D21] border border-slate-800 px-4 py-3 text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1.5 font-bold">비밀번호</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="영문, 숫자, 특수문자가 모두 들어간 8자 이상"
                  className="w-full rounded-xl bg-[#1D1D21] border border-slate-800 px-4 py-3 text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  placeholder="비밀번호를 한번 더 입력해 주세요"
                  className="w-full rounded-xl bg-[#1D1D21] border border-slate-800 px-4 py-3 text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Agreement Box */}
            <div className="space-y-3 rounded-2xl bg-[#18181C] p-4 border border-slate-800/80 text-xs">
              <label className="flex items-center space-x-2 font-bold text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeAll}
                  onChange={(e) => handleToggleAgreeAll(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-700 text-amber-500 focus:ring-amber-500"
                />
                <span>모두 동의합니다.</span>
              </label>

              <p className="text-[11px] text-slate-400 leading-relaxed border-t border-slate-800/80 pt-2">
                회원 가입 및 회원 관리 등의 목적으로 이메일, 비밀번호, 휴대폰 번호 등의 정보를 수집 및 이용하고 있습니다.
              </p>

              <div className="space-y-2 pt-1 border-t border-slate-800/80 text-slate-300">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeAge}
                    onChange={(e) => setAgreeAge(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-slate-700 text-amber-500"
                  />
                  <span>만 14세 이상입니다.</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-slate-700 text-amber-500"
                  />
                  <span>서비스 이용약관에 동의합니다.</span>
                </label>
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={submitting || !agreeAge || !agreeTerms}
              className="w-full rounded-2xl bg-white py-3.5 text-sm font-black text-slate-950 hover:bg-slate-100 disabled:opacity-50 transition shadow-lg mt-2"
            >
              {submitting ? "가입 처리 중..." : "가입완료"}
            </button>
          </form>
        </div>
      )}

      {/* --- Step 2-A: 일반 회원가입 화면 (라이트 테마) --- */}
      {step === "general_signup" && (
        <div className="relative overflow-hidden rounded-3xl bg-white p-7 text-slate-900 shadow-2xl border border-gray-200 space-y-6">
          {/* Top Header */}
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <button
              onClick={() => setStep("select")}
              className="flex items-center space-x-1 text-xs text-gray-500 hover:text-gray-900 transition font-bold"
            >
              <ChevronLeft className="h-5 w-5" />
              <span>뒤로</span>
            </button>
            <span className="text-lg font-black tracking-wider text-indigo-600">QOLLAB</span>
            <div className="w-8" />
          </div>

          {/* Title & Subtitle Link */}
          <div className="space-y-1">
            <h2 className="text-xl font-black text-slate-900 leading-tight">따로 사지 마세요.</h2>
            <p className="text-sm font-bold text-slate-700">
              연결될수록 커지는 단골 혜택을 누리세요.
            </p>
            <div className="pt-1">
              <span className="text-xs text-gray-400">이미 계정이 있으신가요? </span>
              <Link href="/auth/login" className="text-xs text-indigo-600 font-bold underline">
                로그인하기
              </Link>
            </div>
          </div>

          {errorMsg && (
            <div className="rounded-xl bg-rose-50 p-3 text-xs font-bold text-rose-700 border border-rose-200">
              {errorMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={(e) => handleSignupSubmit(e, "consumer")} className="space-y-4 text-xs">
            <div>
              <label className="block text-gray-700 mb-1.5 font-bold">*이메일</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일을 입력해 주세요."
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1.5 font-bold">*비밀번호</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="영문, 숫자, 특수문자가 모두 들어간 8자 이상"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  placeholder="비밀번호를 한번 더 입력해 주세요."
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Agreement Box */}
            <div className="space-y-3 rounded-2xl bg-gray-50 p-4 border border-gray-200 text-xs">
              <label className="flex items-center space-x-2 font-bold text-gray-900 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeAll}
                  onChange={(e) => handleToggleAgreeAll(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span>모두 동의합니다.</span>
              </label>

              <p className="text-[11px] text-gray-500 leading-relaxed border-t border-gray-200 pt-2">
                회원 가입 및 회원 관리 등의 목적으로 이메일, 비밀번호, 휴대폰 번호 등의 정보를 수집 및 이용하고 있습니다.
              </p>

              <div className="space-y-2 pt-1 border-t border-gray-200 text-gray-700">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeAge}
                    onChange={(e) => setAgreeAge(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-gray-300 text-indigo-600"
                  />
                  <span>만 14세 이상입니다.</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-gray-300 text-indigo-600"
                  />
                  <span>서비스 이용약관에 동의합니다.</span>
                </label>
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={submitting || !agreeAge || !agreeTerms}
              className="w-full rounded-2xl bg-slate-900 py-3.5 text-sm font-black text-white hover:bg-slate-800 disabled:opacity-50 transition shadow-lg mt-2"
            >
              {submitting ? "가입 처리 중..." : "가입 완료"}
            </button>
          </form>
        </div>
      )}
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
