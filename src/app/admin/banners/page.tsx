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

const emptyBanner = {
  title: "",
  subtitle: "",
  bg_gradient: "from-indigo-500 to-purple-600",
  link_url: "",
  sort_order: 0,
  is_active: true,
};

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [form, setForm] = useState(emptyBanner);

  const fetchBanners = useCallback(async () => {
    const res = await fetch("/api/admin/banners");
    const data = await res.json();
    setBanners(data.data || []);
  }, []);

  useEffect(() => { fetchBanners(); }, [fetchBanners]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyBanner);
    setModalOpen(true);
  };

  const openEdit = (b: Banner) => {
    setEditing(b);
    setForm({
      title: b.title,
      subtitle: b.subtitle || "",
      bg_gradient: b.bg_gradient,
      link_url: b.link_url || "",
      sort_order: b.sort_order,
      is_active: b.is_active,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    const method = editing ? "PUT" : "POST";
    const url = editing ? `/api/admin/banners/${editing.id}` : "/api/admin/banners";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setModalOpen(false);
    fetchBanners();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    await fetch(`/api/admin/banners/${id}`, { method: "DELETE" });
    fetchBanners();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">배너 관리</h1>
        <button onClick={openCreate} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
          + 배너 추가
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {banners.map((b) => (
          <div key={b.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className={`bg-gradient-to-r ${b.bg_gradient} p-6 text-white`}>
              <p className="text-xs opacity-70 mb-1">#{b.sort_order}</p>
              <h3 className="text-xl font-bold">{b.title}</h3>
              {b.subtitle && <p className="text-sm opacity-80 mt-1">{b.subtitle}</p>}
            </div>
            <div className="p-3 flex items-center justify-between">
              <span className={`text-xs px-2 py-0.5 rounded ${b.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                {b.is_active ? "활성" : "비활성"}
              </span>
              <div className="flex gap-2">
                <button onClick={() => openEdit(b)} className="text-sm text-blue-600 hover:underline">수정</button>
                <button onClick={() => handleDelete(b.id)} className="text-sm text-red-500 hover:underline">삭제</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {banners.length === 0 && <p className="text-center py-8 text-gray-400">배너가 없습니다.</p>}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "배너 수정" : "배너 추가"}>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">제목</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">부제목</label>
            <input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">그라디언트</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {gradientPresets.map((g) => (
                <button key={g} onClick={() => setForm({ ...form, bg_gradient: g })}
                  className={`w-8 h-8 rounded-full bg-gradient-to-r ${g} border-2 ${form.bg_gradient === g ? "border-black" : "border-transparent"}`} />
              ))}
            </div>
            <input value={form.bg_gradient} onChange={(e) => setForm({ ...form, bg_gradient: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="from-xxx to-xxx" />
          </div>
          <div className={`bg-gradient-to-r ${form.bg_gradient} p-4 rounded-lg text-white text-center`}>
            <p className="font-bold">{form.title || "미리보기"}</p>
            {form.subtitle && <p className="text-sm opacity-80">{form.subtitle}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">링크 URL</label>
              <input value={form.link_url} onChange={(e) => setForm({ ...form, link_url: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">정렬 순서</label>
              <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg text-sm" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} id="banner-active" />
            <label htmlFor="banner-active" className="text-sm">활성화</label>
          </div>
          <button onClick={handleSave} className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
            {editing ? "수정" : "추가"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
