"use client";

import { useState, useEffect, useCallback } from "react";
import Modal from "@/components/admin/Modal";
import { Category } from "@/lib/types";

const emptyCategory = { name: "", slug: "", sort_order: 0, is_active: true };

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState(emptyCategory);

  const fetchCategories = useCallback(async () => { const res = await fetch("/api/admin/categories"); const data = await res.json(); setCategories(data.data || []); }, []);
  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const openCreate = () => { setEditing(null); setForm(emptyCategory); setModalOpen(true); };
  const openEdit = (c: Category) => { setEditing(c); setForm({ name: c.name, slug: c.slug || "", sort_order: c.sort_order, is_active: c.is_active }); setModalOpen(true); };
  const handleSave = async () => {
    const slug = form.slug || form.name.toLowerCase().replace(/[^a-z0-9가-힣]/g, "-").replace(/-+/g, "-");
    const method = editing ? "PUT" : "POST";
    const url = editing ? `/api/admin/categories/${editing.id}` : "/api/admin/categories";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, slug }) });
    setModalOpen(false); fetchCategories();
  };
  const handleDelete = async (id: number) => { if (!confirm("정말 삭제하시겠습니까?")) return; await fetch(`/api/admin/categories/${id}`, { method: "DELETE" }); fetchCategories(); };

  const inputCls = "w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all";
  const labelCls = "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{categories.length}개 카테고리</p>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-indigo-200 transition-all active:scale-95">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          카테고리 추가
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">이름</th>
              <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">슬러그</th>
              <th className="px-5 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">순서</th>
              <th className="px-5 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">상태</th>
              <th className="px-5 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {categories.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-5 py-4 text-gray-400 font-mono text-xs">#{c.id}</td>
                <td className="px-5 py-4 font-medium text-gray-900">{c.name}</td>
                <td className="px-5 py-4 text-gray-400 font-mono text-xs">{c.slug}</td>
                <td className="px-5 py-4 text-center"><span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-gray-100 text-xs font-semibold text-gray-600">{c.sort_order}</span></td>
                <td className="px-5 py-4 text-center">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${c.is_active ? "text-green-600" : "text-gray-400"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${c.is_active ? "bg-green-500" : "bg-gray-300"}`} />{c.is_active ? "활성" : "비활성"}
                  </span>
                </td>
                <td className="px-5 py-4 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <button onClick={() => openEdit(c)} className="px-2.5 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">수정</button>
                    <button onClick={() => handleDelete(c.id)} className="px-2.5 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors">삭제</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {categories.length === 0 && <div className="text-center py-16"><p className="text-gray-400 text-sm">카테고리가 없습니다.</p></div>}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "카테고리 수정" : "카테고리 추가"}>
        <div className="space-y-4">
          <div><label className={labelCls}>이름</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} /></div>
          <div><label className={labelCls}>슬러그</label><input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="자동 생성" className={inputCls} /></div>
          <div><label className={labelCls}>정렬 순서</label><input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} className={inputCls} /></div>
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
