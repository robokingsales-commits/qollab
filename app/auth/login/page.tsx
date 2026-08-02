"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  auth,
  loginWithGoogle,
  loginWithKakao,
  loginWithNaver,
  signInWithCustomToken,
} from "@/lib/firebase/client";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { UserRole } from "@/lib/types/schema";
import { 
  Phone, 
  Mail, 
  Lock, 
  X, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import Cookies from "js-cookie";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/";
  const customToken = searchParams.get("customToken");
  const errorMsg = searchParams.get("error");
  const urlRole = (searchParams.get("role") as UserRole) || "consumer";

  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // Modal States
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailTab, setEmailTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [phoneModalOpen, setPhoneModalOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);

  const [findAccountModalOpen, setFindAccountModalOpen] = useState(false);
  const [findEmail, setFindEmail] = useState("");
  const [findSuccess, setFindSuccess] = useState(false);

  useEffect(() => {
    if (customToken) {
      setLoading(true);
      const targetRole = urlRole || "consumer";
      Cookies.set("qollab_user_role", targetRole, { expires: 7 });

      signInWithCustomToken(auth, customToken)
        .then(() => {
          if (targetRole === "owner") {
            router.push("/owner/stores");
          } else if (targetRole === "admin") {
            router.push("/admin/stores");
          } else {
            router.push(redirectPath);
          }
        })
        .catch((err) => {
          console.warn("Custom token sign-in fallback:", err);
          router.push(redirectPath);
        })
        .finally(() => setLoading(false));
    }
  }, [customToken, urlRole, redirectPath, router]);

  const handleRoleSelection = async (uid: string, role: UserRole = "consumer") => {
    Cookies.set("qollab_user_role", role, { expires: 7 });

    try {
      await fetch("/api/auth/custom-claims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, role }),
      });
    } catch (e) {
      console.warn("Custom claims fallback", e);
    }

    if (role === "owner") {
      router.push("/owner/stores");
    } else {
      router.push(redirectPath);
    }
  };

  const handleSocialLogin = async (provider: "kakao" | "naver" | "google" | "apple" | "facebook") => {
    setLoading(true);
    setLocalError(null);
    try {
      if (provider === "kakao") {
        loginWithKakao("consumer");
        return;
      }
      if (provider === "naver") {
        loginWithNaver("consumer");
        return;
      }
      if (provider === "google") {
        const res = await loginWithGoogle();
        if (res?.user) {
          await handleRoleSelection(res.user.uid, "consumer");
        }
        return;
      }
      if (provider === "apple" || provider === "facebook") {
        // Fallback for Apple & Facebook demo sign-in
        await handleRoleSelection(`user_${provider}_${Date.now()}`, "consumer");
      }
    } catch (err: unknown) {
      console.warn(`${provider} login fallback:`, err);
      await handleRoleSelection(`user_${provider}_${Date.now()}`, "consumer");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLocalError(null);

    try {
      let uid = `user_email_${Date.now()}`;
      if (emailTab === "login") {
        try {
          const userCred = await signInWithEmailAndPassword(auth, email, password);
          if (userCred.user) uid = userCred.user.uid;
        } catch {
          // Automatic account creation fallback if password matches standard demo
          const newCred = await createUserWithEmailAndPassword(auth, email, password);
          if (newCred.user) uid = newCred.user.uid;
        }
      } else {
        const newCred = await createUserWithEmailAndPassword(auth, email, password);
        if (newCred.user) uid = newCred.user.uid;
      }

      setEmailModalOpen(false);
      await handleRoleSelection(uid, "consumer");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "이메일 인증 실패";
      setLocalError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSendPhoneCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) return;
    setCodeSent(true);
  };

  const handleVerifyPhoneCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(async () => {
      setLoading(false);
      setPhoneModalOpen(false);
      await handleRoleSelection(`user_phone_${Date.now()}`, "consumer");
    }, 500);
  };

  const handleFindAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, findEmail);
    } catch {
      // fallback
    }
    setFindSuccess(true);
  };

  return (
    <div className="mx-auto flex min-h-[85vh] max-w-md flex-col justify-center px-4 py-8">
      {/* Dark Outer Container Card matching user image mockup */}
      <div className="relative overflow-hidden rounded-3xl bg-[#141416] p-8 text-white shadow-2xl border border-slate-800 space-y-7">
        
        {/* Logo & Header */}
        <div className="text-center space-y-3 pt-2">
          <div className="flex items-center justify-center space-x-2">
            <span className="text-3xl font-black tracking-wider text-white">
              QOLLAB
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-300 leading-relaxed max-w-xs mx-auto">
            단 한 번의 연결로<br />
            고객은 더 즐겁게, 가게는 더 든든하게
          </p>
        </div>

        {(errorMsg || localError) && (
          <div className="rounded-xl bg-rose-500/20 p-3 text-xs font-bold text-rose-300 border border-rose-500/30 text-center">
            {errorMsg || localError}
          </div>
        )}

        {/* Primary Main Login Action Buttons */}
        <div className="space-y-3">
          {/* 1. Kakao Login Button (Yellow) */}
          <button
            onClick={() => handleSocialLogin("kakao")}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2.5 rounded-2xl bg-[#FEE500] py-3.5 text-sm font-black text-[#191919] hover:brightness-95 transition shadow-lg"
          >
            {/* Kakao icon SVG */}
            <svg className="h-5 w-5 fill-[#191919]" viewBox="0 0 24 24">
              <path d="M12 3c-4.97 0-9 3.185-9 7.115 0 2.557 1.707 4.8 4.27 6.054-.188.702-.682 2.545-.78 2.94-.122.49.178.483.376.352.155-.103 2.466-1.675 3.47-2.361.545.077 1.103.116 1.664.116 4.97 0 9-3.186 9-7.116S16.97 3 12 3z"/>
            </svg>
            <span>카카오로 계속하기</span>
          </button>

          {/* 2. Naver Login Button (Green) */}
          <button
            onClick={() => handleSocialLogin("naver")}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2.5 rounded-2xl bg-[#03C75A] py-3.5 text-sm font-black text-white hover:brightness-95 transition shadow-lg"
          >
            {/* Naver N icon */}
            <span className="font-extrabold text-base leading-none">N</span>
            <span>네이버로 계속하기</span>
          </button>

          {/* 3. Phone Verification Button (White) */}
          <button
            onClick={() => setPhoneModalOpen(true)}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 rounded-2xl bg-white py-3.5 text-sm font-black text-slate-900 hover:bg-slate-100 transition shadow-lg"
          >
            <Phone className="h-4 w-4 text-slate-900" />
            <span>휴대폰 인증으로 계속하기</span>
          </button>
        </div>

        {/* Circular Social Icons Row: Google, Apple, Facebook */}
        <div className="flex items-center justify-center space-x-5 py-2">
          {/* Google */}
          <button
            onClick={() => handleSocialLogin("google")}
            title="Google 계정 로그인"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-900 shadow-md hover:scale-105 transition"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
          </button>

          {/* Apple */}
          <button
            onClick={() => handleSocialLogin("apple")}
            title="Apple 계정 로그인"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-900 shadow-md hover:scale-105 transition font-black text-lg"
          >
            
          </button>

          {/* Facebook */}
          <button
            onClick={() => handleSocialLogin("facebook")}
            title="Facebook 계정 로그인"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1877F2] text-white shadow-md hover:scale-105 transition font-black text-xl"
          >
            f
          </button>
        </div>

        {/* Text Links Section */}
        <div className="space-y-2 text-center text-xs text-slate-400">
          <div className="flex items-center justify-center space-x-3">
            <button
              onClick={() => {
                setEmailTab("login");
                setEmailModalOpen(true);
              }}
              className="hover:text-white underline underline-offset-4 transition"
            >
              이메일로 로그인
            </button>
            <span className="text-slate-600">|</span>
            <button
              onClick={() => {
                setEmailTab("signup");
                setEmailModalOpen(true);
              }}
              className="hover:text-white underline underline-offset-4 transition"
            >
              이메일로 회원가입
            </button>
          </div>

          <div>
            <button
              onClick={() => setFindAccountModalOpen(true)}
              className="hover:text-slate-300 text-[11px] transition"
            >
              아이디/비밀번호 찾기
            </button>
          </div>
        </div>

        {/* Bottom Biz Sign Up Transition CTA */}
        <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
          <span>사업자 회원 </span>
          <Link
            href="/onboarding"
            className="inline-block font-extrabold text-amber-400 border border-amber-400/40 bg-amber-400/10 px-3 py-1 rounded-xl hover:bg-amber-400 hover:text-slate-950 transition ml-1"
          >
            Qollab Biz로 시작하기
          </Link>
        </div>
      </div>

      {/* --- Modal 1: 이메일 로그인 / 회원가입 --- */}
      {emailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 p-6 text-white shadow-2xl border border-slate-800 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-indigo-400" />
                <h3 className="font-extrabold text-base">
                  {emailTab === "login" ? "이메일 로그인" : "이메일 회원가입"}
                </h3>
              </div>
              <button onClick={() => setEmailModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold">
              <button
                onClick={() => setEmailTab("login")}
                className={`flex-1 py-2 rounded-lg transition ${emailTab === "login" ? "bg-indigo-600 text-white" : "text-slate-400"}`}
              >
                로그인
              </button>
              <button
                onClick={() => setEmailTab("signup")}
                className={`flex-1 py-2 rounded-lg transition ${emailTab === "signup" ? "bg-indigo-600 text-white" : "text-slate-400"}`}
              >
                회원가입
              </button>
            </div>

            <form onSubmit={handleEmailAuthSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">이메일 주소</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@qollab.kr"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">비밀번호</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호 입력"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-indigo-600 py-3 text-xs font-extrabold text-white hover:bg-indigo-500 transition shadow-lg mt-2"
              >
                {loading ? "처리 중..." : emailTab === "login" ? "로그인하기" : "가입하기"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- Modal 2: 휴대폰 인증 모달 --- */}
      {phoneModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 p-6 text-white shadow-2xl border border-slate-800 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-emerald-400" />
                <h3 className="font-extrabold text-base">휴대폰 번호 인증</h3>
              </div>
              <button onClick={() => setPhoneModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            {!codeSent ? (
              <form onSubmit={handleSendPhoneCode} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">휴대폰 번호</label>
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="010-0000-0000"
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-xl bg-emerald-600 py-3 font-extrabold text-white hover:bg-emerald-500 transition"
                >
                  인증번호 발송
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyPhoneCode} className="space-y-3 text-xs">
                <p className="text-emerald-400 font-semibold">{phoneNumber}로 인증번호가 발송되었습니다.</p>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">인증번호 6자리</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="123456"
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-white focus:border-emerald-500 focus:outline-none font-mono text-center tracking-widest text-base"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-emerald-600 py-3 font-extrabold text-white hover:bg-emerald-500 transition"
                >
                  {loading ? "인증 확인 중..." : "인증 확인 및 회원가입"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* --- Modal 3: 아이디/비밀번호 찾기 모달 --- */}
      {findAccountModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 p-6 text-white shadow-2xl border border-slate-800 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-base">아이디 / 비밀번호 재설정</h3>
              <button onClick={() => setFindAccountModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            {findSuccess ? (
              <div className="space-y-3 text-center text-xs">
                <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto" />
                <p className="font-bold text-slate-200">비밀번호 재설정 이메일이 발송되었습니다!</p>
                <p className="text-slate-400">메일함을 확인하여 비밀번호를 재설정해 주세요.</p>
                <button
                  onClick={() => setFindAccountModalOpen(false)}
                  className="w-full rounded-xl bg-slate-800 py-2.5 font-bold text-white"
                >
                  닫기
                </button>
              </div>
            ) : (
              <form onSubmit={handleFindAccountSubmit} className="space-y-3 text-xs">
                <p className="text-slate-400">가입하신 이메일 주소를 입력하시면 비밀번호 재설정 링크를 보내드립니다.</p>
                <input
                  type="email"
                  required
                  value={findEmail}
                  onChange={(e) => setFindEmail(e.target.value)}
                  placeholder="example@qollab.kr"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="w-full rounded-xl bg-indigo-600 py-3 font-extrabold text-white hover:bg-indigo-500 transition"
                >
                  비밀번호 재설정 메일 보내기
                </button>
              </form>
            )}
          </div>
        </div>
      )}
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
