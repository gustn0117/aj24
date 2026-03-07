"use client";

import { useState, useEffect } from "react";
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
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("aj24_saved_id");
    if (saved) {
      setEmail(saved);
      setSaveId(true);
    }
  }, []);

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
    <div className="min-h-screen bg-[#fafafa] flex flex-col">
      {/* Top bar */}
      <div className="bg-white flex items-center justify-between px-4 h-12 border-b border-gray-100">
        <button onClick={() => router.back()} className="p-1 text-gray-700 hover:text-black transition-colors">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
        </button>
        <span className="text-sm font-bold tracking-tight">로그인</span>
        <a href="/" className="p-1 text-gray-700 hover:text-black transition-colors">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
        </a>
      </div>

      <div className="flex-1 flex flex-col items-center px-5 pt-10 pb-16 max-w-md mx-auto w-full">
        {/* Logo */}
        <a href="/" className="inline-flex items-center gap-2.5 mb-8">
          <img src="/images/logo.png" alt="AJ24" className="h-10 w-auto" />
          <span className="text-2xl font-black tracking-tight">AJ24</span>
        </a>

        {/* Card */}
        <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          {/* Heading */}
          <div className="text-center mb-6">
            <h1 className="text-xl font-black tracking-tight text-black mb-1">환영합니다</h1>
            <p className="text-[13px] text-gray-400">AJ24 계정으로 로그인하세요</p>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-4 gap-2 mb-6">
            {[
              { icon: <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 12l2 2 4-4" /></>, label: "첫 구매 혜택" },
              { icon: <><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></>, label: "빠른 배송" },
              { icon: <><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></>, label: "위시리스트" },
              { icon: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></>, label: "주문 관리" },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <div className="w-11 h-11 rounded-xl bg-gray-50 flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{item.icon}</svg>
                </div>
                <span className="text-[10px] text-gray-400 font-medium text-center leading-tight">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-100 mb-6" />

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
                {error}
              </div>
            )}

            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일 주소"
                required
                className="w-full px-4 py-3.5 bg-[#f8f8f8] border border-gray-150 rounded-xl text-sm focus:outline-none focus:border-black focus:bg-white transition-all placeholder:text-gray-350"
              />
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="2" /><polyline points="22,7 12,13 2,7" /></svg>
              </div>
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호"
                required
                className="w-full px-4 py-3.5 bg-[#f8f8f8] border border-gray-150 rounded-xl text-sm focus:outline-none focus:border-black focus:bg-white transition-all placeholder:text-gray-350 pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                )}
              </button>
            </div>

            {/* Save ID & links */}
            <div className="flex items-center justify-between py-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <div
                  onClick={() => setSaveId(!saveId)}
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors cursor-pointer ${saveId ? "bg-black border-black" : "border-gray-300"}`}
                >
                  {saveId && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>}
                </div>
                <span className="text-xs text-gray-500">아이디 저장</span>
              </label>
              <a href="/register" className="text-xs text-gray-400 hover:text-black transition-colors">회원가입</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-black text-white font-bold rounded-xl text-sm hover:bg-gray-800 transition-all disabled:opacity-50 active:scale-[0.98] shadow-sm"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  로그인 중...
                </span>
              ) : "로그인"}
            </button>
          </form>
        </div>

        {/* Bottom link */}
        <p className="text-center text-xs text-gray-400 mt-6">
          아직 회원이 아니신가요?{" "}
          <a href="/register" className="text-black font-semibold hover:underline">무료 회원가입</a>
        </p>
      </div>
    </div>
  );
}
