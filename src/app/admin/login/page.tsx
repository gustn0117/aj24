"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin");
    } else {
      setError("비밀번호가 일치하지 않습니다.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-px h-full bg-white/[0.03]" />
        <div className="absolute top-0 left-2/4 w-px h-full bg-white/[0.03]" />
        <div className="absolute top-0 left-3/4 w-px h-full bg-white/[0.03]" />
      </div>

      <form onSubmit={handleSubmit} className="relative bg-white/[0.03] border border-white/[0.06] p-8 rounded-2xl w-full max-w-sm mx-4">
        <div className="text-center mb-8">
          <img src="/images/logo.png" alt="AJ24" className="h-12 w-auto mx-auto mb-4 brightness-0 invert" />
          <h1 className="text-xl font-bold text-white">관리자 로그인</h1>
          <p className="text-xs text-gray-600 mt-1">AJ24 Admin Panel</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/10 text-red-400 text-xs rounded-lg flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            {error}
          </div>
        )}

        <div className="relative mb-5">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력하세요"
            className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/[0.08] rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-white/20 transition-all text-sm"
            autoFocus
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-white text-gray-900 rounded-lg font-bold text-sm hover:bg-gray-100 disabled:opacity-50 transition-all active:scale-[0.98]"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              로그인 중...
            </span>
          ) : (
            "로그인"
          )}
        </button>
      </form>
    </div>
  );
}
