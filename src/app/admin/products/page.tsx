"use client";

import { useState, useEffect, useCallback } from "react";
import Modal from "@/components/admin/Modal";
import { Product } from "@/lib/types";

const emptyProduct = {
  name: "",
  original_price: 0,
  sale_price: 0,
  discount: null as number | null,
  image: "/images/placeholder.svg",
  badges: [] as string[],
  rating: 0,
  category: "",
  section: "megahit" as "megahit" | "recommend" | "best",
  sort_order: 0,
  is_active: true,
  description: "",
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [section, setSection] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyProduct);
  const [badgeInput, setBadgeInput] = useState("");

  const fetchProducts = useCallback(async () => {
    const params = new URLSearchParams({ page: String(page) });
    if (section) params.set("section", section);
    const res = await fetch(`/api/admin/products?${params}`);
    const data = await res.json();
    setProducts(data.data || []);
    setTotal(data.total || 0);
  }, [page, section]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyProduct);
    setBadgeInput("");
    setModalOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({
      name: p.name,
      original_price: p.original_price,
      sale_price: p.sale_price,
      discount: p.discount,
      image: p.image,
      badges: p.badges,
      rating: p.rating,
      category: p.category,
      section: p.section,
      sort_order: p.sort_order,
      is_active: p.is_active,
      description: p.description || "",
    });
    setBadgeInput("");
    setModalOpen(true);
  };

  const handleSave = async () => {
    const method = editing ? "PUT" : "POST";
    const url = editing ? `/api/admin/products/${editing.id}` : "/api/admin/products";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setModalOpen(false);
    fetchProducts();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    fetchProducts();
  };

  const addBadge = () => {
    if (badgeInput.trim() && !form.badges.includes(badgeInput.trim())) {
      setForm({ ...form, badges: [...form.badges, badgeInput.trim()] });
      setBadgeInput("");
    }
  };

  const removeBadge = (b: string) => {
    setForm({ ...form, badges: form.badges.filter((x) => x !== b) });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">상품 관리</h1>
        <button onClick={openCreate} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
          + 상품 추가
        </button>
      </div>

      <div className="mb-4 flex gap-2">
        {["", "megahit", "recommend", "best"].map((s) => (
          <button
            key={s}
            onClick={() => { setSection(s); setPage(1); }}
            className={`px-3 py-1.5 text-sm rounded-lg ${section === s ? "bg-gray-900 text-white" : "bg-white text-gray-600 border"}`}
          >
            {s || "전체"}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">상품명</th>
              <th className="px-4 py-3 text-left">섹션</th>
              <th className="px-4 py-3 text-right">판매가</th>
              <th className="px-4 py-3 text-center">활성</th>
              <th className="px-4 py-3 text-center">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">{p.id}</td>
                <td className="px-4 py-3 max-w-xs truncate">{p.name}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">{p.section}</span>
                </td>
                <td className="px-4 py-3 text-right">{p.sale_price.toLocaleString()}원</td>
                <td className="px-4 py-3 text-center">
                  <span className={`w-2 h-2 rounded-full inline-block ${p.is_active ? "bg-green-500" : "bg-gray-300"}`} />
                </td>
                <td className="px-4 py-3 text-center">
                  <button onClick={() => openEdit(p)} className="text-blue-600 hover:underline mr-3">수정</button>
                  <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:underline">삭제</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && <p className="text-center py-8 text-gray-400">상품이 없습니다.</p>}
      </div>

      {total > 20 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: Math.ceil(total / 20) }, (_, i) => (
            <button key={i} onClick={() => setPage(i + 1)}
              className={`w-8 h-8 rounded text-sm ${page === i + 1 ? "bg-gray-900 text-white" : "bg-white border"}`}>
              {i + 1}
            </button>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "상품 수정" : "상품 추가"}>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">상품명</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">섹션</label>
              <select value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value as "megahit" | "recommend" | "best" })}
                className="w-full px-3 py-2 border rounded-lg text-sm">
                <option value="megahit">megahit</option>
                <option value="recommend">recommend</option>
                <option value="best">best</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">카테고리</label>
              <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">원가</label>
              <input type="number" value={form.original_price} onChange={(e) => setForm({ ...form, original_price: Number(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">판매가</label>
              <input type="number" value={form.sale_price} onChange={(e) => setForm({ ...form, sale_price: Number(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">할인율(%)</label>
              <input type="number" value={form.discount ?? ""} onChange={(e) => setForm({ ...form, discount: e.target.value ? Number(e.target.value) : null })}
                className="w-full px-3 py-2 border rounded-lg text-sm" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">평점 (0~5)</label>
              <input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">정렬 순서</label>
              <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">이미지 URL</label>
            <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">뱃지</label>
            <div className="flex gap-1 mb-2 flex-wrap">
              {form.badges.map((b) => (
                <span key={b} className="px-2 py-1 bg-gray-100 rounded text-xs flex items-center gap-1">
                  {b} <button onClick={() => removeBadge(b)} className="text-gray-400 hover:text-red-500">&times;</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={badgeInput} onChange={(e) => setBadgeInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addBadge())}
                placeholder="뱃지 입력 후 Enter" className="flex-1 px-3 py-2 border rounded-lg text-sm" />
              <button onClick={addBadge} className="px-3 py-2 bg-gray-200 rounded-lg text-sm">추가</button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">설명</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2} className="w-full px-3 py-2 border rounded-lg text-sm" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} id="active" />
            <label htmlFor="active" className="text-sm">활성화</label>
          </div>
          <button onClick={handleSave} className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
            {editing ? "수정" : "추가"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
