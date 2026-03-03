"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", passwordConfirm: "", phone: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (form.password !== form.passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (form.password.length < 4) {
      setError("비밀번호는 4자 이상이어야 합니다.");
      return;
    }
    setLoading(true);
    const result = await register({ name: form.name, email: form.email, password: form.password, phone: form.phone || undefined });
    setLoading(false);
    if (result.ok) {
      router.push("/");
    } else {
      setError(result.error || "회원가입에 실패했습니다.");
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <a href="/" className="inline-flex items-center gap-2 mb-8">
            <img src="/images/logo.png" alt="AJ24" className="h-8 w-auto" />
            <span className="text-xl font-black tracking-tight">AJ24</span>
          </a>
          <h1 className="text-2xl font-black tracking-tight text-black">회원가입</h1>
          <p className="text-sm text-gray-400 mt-1">AJ24에 가입하고 쇼핑을 시작하세요</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">{error}</div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">이름 *</label>
            <input type="text" value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="홍길동" required className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black transition-colors" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">이메일 *</label>
            <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="email@example.com" required className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black transition-colors" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">비밀번호 *</label>
            <input type="password" value={form.password} onChange={(e) => update("password", e.target.value)} placeholder="4자 이상" required className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black transition-colors" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">비밀번호 확인 *</label>
            <input type="password" value={form.passwordConfirm} onChange={(e) => update("passwordConfirm", e.target.value)} placeholder="비밀번호 재입력" required className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black transition-colors" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">연락처</label>
            <input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="010-0000-0000" className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black transition-colors" />
          </div>

          <button type="submit" disabled={loading} className="w-full py-3.5 bg-black text-white font-bold rounded-lg text-sm hover:bg-gray-800 transition-colors disabled:opacity-50 active:scale-[0.98]">
            {loading ? "가입 중..." : "회원가입"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          이미 회원이신가요?{" "}
          <a href="/login" className="text-black font-semibold hover:underline">로그인</a>
        </p>
      </div>
    </div>
  );
}
