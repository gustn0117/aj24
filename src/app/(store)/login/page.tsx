"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [saveId, setSaveId] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await login(email, password);
      if (result.ok) {
        if (saveId) localStorage.setItem("aj24_saved_id", email);
        else localStorage.removeItem("aj24_saved_id");
        router.push("/");
      } else {
        setError(result.error || "로그인에 실패했습니다.");
      }
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 h-12 border-b border-gray-100">
        <button onClick={() => router.back()} className="p-1 text-gray-700">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
        </button>
        <a href="/" className="p-1 text-gray-700">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
        </a>
      </div>

      <div className="flex-1 flex flex-col items-center px-5 pt-8 pb-12 max-w-md mx-auto w-full">
        {/* Logo */}
        <a href="/" className="inline-flex items-center gap-2 mb-6">
          <img src="/images/logo.png" alt="AJ24" className="h-8 w-auto" />
          <span className="text-xl font-black tracking-tight">AJ24</span>
        </a>

        {/* Heading */}
        <h1 className="text-2xl font-black tracking-tight text-black mb-1">로그인</h1>
        <p className="text-[13px] text-gray-400 mb-8">AJ24의 다양한 혜택을 누려보세요</p>

        {/* Kakao Login */}
        <button className="w-full flex items-center justify-center gap-2 py-3.5 rounded-lg font-bold text-sm text-[#3C1E1E] mb-6" style={{ backgroundColor: "#FEE500" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#3C1E1E"><path d="M12 3C6.48 3 2 6.58 2 10.9c0 2.78 1.86 5.22 4.66 6.6l-1.2 4.38c-.1.36.3.65.6.44l5.02-3.32c.3.02.6.04.92.04 5.52 0 10-3.58 10-7.94S17.52 3 12 3z" /></svg>
          카카오로 시작하기
        </button>

        {/* Benefits */}
        <div className="grid grid-cols-4 gap-3 w-full mb-8">
          {[
            { icon: "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2", label: "첫 구매 쿠폰" },
            { icon: "M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0-6C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z", label: "신규 가입 적립" },
            { icon: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3", label: "APP 설치 쿠폰" },
            { icon: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z", label: "생일 쿠폰" },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <div className="w-12 h-12 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.5"><path d={item.icon} /></svg>
              </div>
              <span className="text-[10px] text-gray-500 font-medium text-center leading-tight">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 w-full mb-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">또는</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Tab */}
        <div className="flex w-full border-b border-gray-200 mb-6">
          <div className="flex-1 text-center pb-3 text-sm font-bold text-black border-b-2 border-black">
            기존 회원이세요?
          </div>
          <a href="/order-lookup" className="flex-1 text-center pb-3 text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors">
            비회원 주문조회
          </a>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-3">
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">{error}</div>
          )}

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="아이디 (이메일)"
            required
            className="w-full px-4 py-3.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black transition-colors bg-white"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호"
            required
            className="w-full px-4 py-3.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black transition-colors bg-white"
          />

          {/* Save ID checkbox */}
          <label className="flex items-center gap-2 cursor-pointer py-1">
            <input
              type="checkbox"
              checked={saveId}
              onChange={(e) => setSaveId(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black accent-black"
            />
            <span className="text-xs text-gray-500">아이디저장</span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-black text-white font-bold rounded-lg text-sm hover:bg-gray-800 transition-colors disabled:opacity-50 active:scale-[0.98]"
          >
            {loading ? "로그인 중..." : "기존 회원 로그인"}
          </button>
        </form>

        {/* Links */}
        <div className="flex items-center gap-4 mt-5">
          <span className="text-xs text-gray-400">아이디/비밀번호 찾기</span>
          <span className="text-gray-200">|</span>
          <a href="/register" className="text-xs text-gray-600 font-semibold hover:text-black transition-colors">회원가입</a>
        </div>

        {/* Social divider */}
        <div className="flex items-center gap-3 w-full mt-8 mb-5">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">또는</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Social login icons */}
        <div className="flex items-center justify-center gap-4">
          {/* Naver */}
          <button className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: "#03C75A" }}>
            N
          </button>
          {/* Google */}
          <button className="w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center bg-white">
            <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
          </button>
          {/* Apple */}
          <button className="w-11 h-11 rounded-full bg-black flex items-center justify-center text-white">
            <svg width="16" height="20" viewBox="0 0 16 20" fill="currentColor"><path d="M15.07 14.81c-.38.87-.82 1.67-1.33 2.4-.7 1-1.27 1.7-1.72 2.08-.68.63-1.42.96-2.2.98-.56 0-1.24-.16-2.03-.48-.8-.32-1.53-.48-2.2-.48-.7 0-1.45.16-2.25.48-.8.32-1.45.49-1.95.5-.75.03-1.51-.31-2.27-1.02-.48-.42-1.09-1.14-1.81-2.18-.77-1.1-1.41-2.38-1.91-3.84C.13 11.75 0 10.3 0 8.9c0-1.6.35-2.97 1.04-4.13.54-.93 1.27-1.66 2.17-2.2.9-.53 1.88-.8 2.93-.82.6 0 1.38.18 2.35.54.97.36 1.59.54 1.87.54.2 0 .9-.21 2.07-.63 1.1-.39 2.04-.55 2.8-.49 2.07.17 3.62 1 4.66 2.49-1.85 1.12-2.76 2.7-2.74 4.72.02 1.57.59 2.88 1.69 3.91.5.48 1.06.84 1.68 1.1-.13.39-.28.76-.44 1.12zM11.55.38c0 1.23-.45 2.38-1.35 3.45-1.08 1.27-2.39 2-3.81 1.88-.02-.15-.03-.3-.03-.47 0-1.18.52-2.44 1.44-3.47.46-.53 1.05-.96 1.76-1.31.71-.34 1.38-.53 2.01-.56.02.16.03.32.03.48z" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
