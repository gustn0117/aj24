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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full border-2 border-gray-800 flex items-center justify-center mx-auto mb-3">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
          </div>
          <h1 className="text-xl font-bold">관리자 로그인</h1>
          <p className="text-sm text-gray-500 mt-1">온오프마켓 어드민</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded">{error}</div>
        )}

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          autoFocus
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors"
        >
          {loading ? "로그인 중..." : "로그인"}
        </button>
      </form>
    </div>
  );
}
