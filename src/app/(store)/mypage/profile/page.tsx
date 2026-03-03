"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ProfilePage() {
  const { member } = useAuth();
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [pw, setPw] = useState({ current: "", new: "", confirm: "" });
  const [msg, setMsg] = useState("");
  const [pwMsg, setPwMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (member) setForm({ name: member.name, phone: member.phone || "", address: member.address || "" });
  }, [member]);

  async function handleProfile(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setMsg("");
    const res = await fetch("/api/member/profile", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setLoading(false);
    setMsg(res.ok ? "저장되었습니다." : "저장에 실패했습니다.");
  }

  async function handlePassword(e: React.FormEvent) {
    e.preventDefault();
    if (pw.new !== pw.confirm) { setPwMsg("새 비밀번호가 일치하지 않습니다."); return; }
    setLoading(true); setPwMsg("");
    const res = await fetch("/api/member/profile", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ currentPassword: pw.current, newPassword: pw.new }) });
    const data = await res.json();
    setLoading(false);
    setPwMsg(res.ok ? "비밀번호가 변경되었습니다." : data.error || "변경에 실패했습니다.");
    if (res.ok) setPw({ current: "", new: "", confirm: "" });
  }

  return (
    <main className="min-h-screen bg-[#fafafa]">
      <Header categories={[]} />
      <div className="max-w-[600px] mx-auto px-4 sm:px-6 py-10 md:py-16">
        <div className="flex items-center gap-3 mb-8">
          <a href="/mypage" className="text-gray-400 hover:text-black transition-colors"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg></a>
          <h1 className="text-2xl font-black tracking-tight">프로필 수정</h1>
        </div>

        <form onSubmit={handleProfile} className="bg-white rounded-xl p-6 border border-gray-100 mb-6">
          <h2 className="text-sm font-bold mb-4">기본 정보</h2>
          {msg && <div className={`p-3 rounded-lg text-sm mb-4 ${msg.includes("실패") ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>{msg}</div>}
          <div className="space-y-4">
            <div><label className="block text-xs font-semibold text-gray-500 mb-1.5">이름</label><input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black" /></div>
            <div><label className="block text-xs font-semibold text-gray-500 mb-1.5">이메일</label><input type="email" value={member?.email || ""} disabled className="w-full px-4 py-3 border border-gray-100 rounded-lg text-sm bg-gray-50 text-gray-400" /></div>
            <div><label className="block text-xs font-semibold text-gray-500 mb-1.5">연락처</label><input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black" /></div>
            <div><label className="block text-xs font-semibold text-gray-500 mb-1.5">주소</label><input type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black" /></div>
          </div>
          <button type="submit" disabled={loading} className="w-full mt-5 py-3 bg-black text-white font-bold rounded-lg text-sm hover:bg-gray-800 disabled:opacity-50">저장</button>
        </form>

        <form onSubmit={handlePassword} className="bg-white rounded-xl p-6 border border-gray-100">
          <h2 className="text-sm font-bold mb-4">비밀번호 변경</h2>
          {pwMsg && <div className={`p-3 rounded-lg text-sm mb-4 ${pwMsg.includes("실패") || pwMsg.includes("올바르지") || pwMsg.includes("일치") ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>{pwMsg}</div>}
          <div className="space-y-4">
            <div><label className="block text-xs font-semibold text-gray-500 mb-1.5">현재 비밀번호</label><input type="password" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black" /></div>
            <div><label className="block text-xs font-semibold text-gray-500 mb-1.5">새 비밀번호</label><input type="password" value={pw.new} onChange={(e) => setPw({ ...pw, new: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black" /></div>
            <div><label className="block text-xs font-semibold text-gray-500 mb-1.5">새 비밀번호 확인</label><input type="password" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black" /></div>
          </div>
          <button type="submit" disabled={loading} className="w-full mt-5 py-3 border border-gray-200 font-bold rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50">비밀번호 변경</button>
        </form>
      </div>
      <Footer />
    </main>
  );
}
