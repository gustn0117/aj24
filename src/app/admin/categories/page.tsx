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

  const fetchCategories = useCallback(async () => {
    const res = await fetch("/api/admin/categories");
    const data = await res.json();
    setCategories(data.data || []);
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyCategory);
    setModalOpen(true);
  };

  const openEdit = (c: Category) => {
    setEditing(c);
    setForm({ name: c.name, slug: c.slug || "", sort_order: c.sort_order, is_active: c.is_active });
    setModalOpen(true);
  };

  const handleSave = async () => {
    const slug = form.slug || form.name.toLowerCase().replace(/[^a-z0-9가-힣]/g, "-").replace(/-+/g, "-");
    const method = editing ? "PUT" : "POST";
    const url = editing ? `/api/admin/categories/${editing.id}` : "/api/admin/categories";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, slug }),
    });
    setModalOpen(false);
    fetchCategories();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    fetchCategories();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">카테고리 관리</h1>
        <button onClick={openCreate} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
          + 카테고리 추가
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">이름</th>
              <th className="px-4 py-3 text-left">슬러그</th>
              <th className="px-4 py-3 text-center">순서</th>
              <th className="px-4 py-3 text-center">활성</th>
              <th className="px-4 py-3 text-center">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categories.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">{c.id}</td>
                <td className="px-4 py-3 font-medium">{c.name}</td>
                <td className="px-4 py-3 text-gray-400">{c.slug}</td>
                <td className="px-4 py-3 text-center">{c.sort_order}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`w-2 h-2 rounded-full inline-block ${c.is_active ? "bg-green-500" : "bg-gray-300"}`} />
                </td>
                <td className="px-4 py-3 text-center">
                  <button onClick={() => openEdit(c)} className="text-blue-600 hover:underline mr-3">수정</button>
                  <button onClick={() => handleDelete(c.id)} className="text-red-500 hover:underline">삭제</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {categories.length === 0 && <p className="text-center py-8 text-gray-400">카테고리가 없습니다.</p>}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "카테고리 수정" : "카테고리 추가"}>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">이름</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">슬러그</label>
            <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
              placeholder="자동 생성" className="w-full px-3 py-2 border rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">정렬 순서</label>
            <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
              className="w-full px-3 py-2 border rounded-lg text-sm" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} id="cat-active" />
            <label htmlFor="cat-active" className="text-sm">활성화</label>
          </div>
          <button onClick={handleSave} className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
            {editing ? "수정" : "추가"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
