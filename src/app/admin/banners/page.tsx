"use client";

import { useState, useEffect, useCallback } from "react";
import Modal from "@/components/admin/Modal";
import { Banner } from "@/lib/types";

const gradientPresets = [
  "from-indigo-500 to-purple-600",
  "from-rose-500 to-pink-600",
  "from-emerald-500 to-teal-600",
  "from-blue-500 to-cyan-600",
  "from-orange-500 to-red-600",
  "from-violet-500 to-fuchsia-600",
  "from-amber-500 to-yellow-600",
  "from-sky-500 to-blue-600",
];

const emptyBanner = { title: "", subtitle: "", bg_gradient: "from-indigo-500 to-purple-600", link_url: "", sort_order: 0, is_active: true };

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [form, setForm] = useState(emptyBanner);

  const fetchBanners = useCallback(async () => { const res = await fetch("/api/admin/banners"); const data = await res.json(); setBanners(data.data || []); }, []);
  useEffect(() => { fetchBanners(); }, [fetchBanners]);

  const openCreate = () => { setEditing(null); setForm(emptyBanner); setModalOpen(true); };
  const openEdit = (b: Banner) => { setEditing(b); setForm({ title: b.title, subtitle: b.subtitle || "", bg_gradient: b.bg_gradient, link_url: b.link_url || "", sort_order: b.sort_order, is_active: b.is_active }); setModalOpen(true); };
  const handleSave = async () => { const method = editing ? "PUT" : "POST"; const url = editing ? `/api/admin/banners/${editing.id}` : "/api/admin/banners"; await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) }); setModalOpen(false); fetchBanners(); };
  const handleDelete = async (id: number) => { if (!confirm("정말 삭제하시겠습니까?")) return; await fetch(`/api/admin/banners/${id}`, { method: "DELETE" }); fetchBanners(); };

  const inputCls = "w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all";
  const labelCls = "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{banners.length}개 배너</p>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-indigo-200 transition-all active:scale-95">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          배너 추가
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {banners.map((b) => (
          <div key={b.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all group">
            <div className={`bg-gradient-to-br ${b.bg_gradient} p-8 text-white relative overflow-hidden`}>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              <p className="text-[10px] uppercase tracking-widest opacity-60 mb-2 font-semibold">#{b.sort_order} Banner</p>
              <h3 className="text-xl font-bold leading-tight">{b.title}</h3>
              {b.subtitle && <p className="text-sm opacity-75 mt-1.5">{b.subtitle}</p>}
            </div>
            <div className="p-4 flex items-center justify-between">
              <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg ${b.is_active ? "bg-green-50 text-green-600" : "bg-gray-50 text-gray-400"}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${b.is_active ? "bg-green-500" : "bg-gray-300"}`} />
                {b.is_active ? "활성" : "비활성"}
              </span>
              <div className="flex gap-1">
                <button onClick={() => openEdit(b)} className="px-2.5 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">수정</button>
                <button onClick={() => handleDelete(b.id)} className="px-2.5 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors">삭제</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {banners.length === 0 && <div className="text-center py-16"><p className="text-gray-400 text-sm">배너가 없습니다.</p></div>}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "배너 수정" : "배너 추가"}>
        <div className="space-y-4">
          <div><label className={labelCls}>제목</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputCls} /></div>
          <div><label className={labelCls}>부제목</label><input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} className={inputCls} /></div>
          <div>
            <label className={labelCls}>그라디언트</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {gradientPresets.map((g) => (
                <button key={g} onClick={() => setForm({ ...form, bg_gradient: g })}
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${g} transition-all ${form.bg_gradient === g ? "ring-2 ring-offset-2 ring-indigo-500 scale-110" : "hover:scale-105"}`} />
              ))}
            </div>
            <input value={form.bg_gradient} onChange={(e) => setForm({ ...form, bg_gradient: e.target.value })} className={inputCls} placeholder="from-xxx to-xxx" />
          </div>
          <div className={`bg-gradient-to-br ${form.bg_gradient} p-6 rounded-xl text-white text-center`}>
            <p className="font-bold text-lg">{form.title || "미리보기"}</p>
            {form.subtitle && <p className="text-sm opacity-75 mt-1">{form.subtitle}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className={labelCls}>링크 URL</label><input value={form.link_url} onChange={(e) => setForm({ ...form, link_url: e.target.value })} className={inputCls} /></div>
            <div><label className={labelCls}>정렬 순서</label><input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} className={inputCls} /></div>
          </div>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <div className="relative"><input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="sr-only peer" /><div className="w-9 h-5 bg-gray-200 peer-checked:bg-indigo-500 rounded-full transition-colors" /><div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm peer-checked:translate-x-4 transition-transform" /></div>
            <span className="text-sm font-medium text-gray-700">활성화</span>
          </label>
          <button onClick={handleSave} className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-indigo-200 transition-all active:scale-[0.98]">{editing ? "수정하기" : "추가하기"}</button>
        </div>
      </Modal>
    </div>
  );
}
