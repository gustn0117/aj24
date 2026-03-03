"use client";

import { useState, useEffect, useCallback } from "react";
import Modal from "@/components/admin/Modal";
import { Review, Product } from "@/lib/types";

const emptyReview = {
  product_id: 0,
  author_name: "",
  rating: 5,
  content: "",
};

function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-px">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} width={size} height={size} viewBox="0 0 24 24" fill={s <= rating ? "#000" : "none"} stroke={s <= rating ? "#000" : "#ddd"} strokeWidth="1.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<(Review & { product_name?: string })[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Review | null>(null);
  const [form, setForm] = useState(emptyReview);

  const fetchProducts = useCallback(async () => {
    const res = await fetch("/api/admin/products?page=1");
    const data = await res.json();
    setProducts(data.data || []);
  }, []);

  const fetchReviews = useCallback(async () => {
    const params = new URLSearchParams({ page: String(page) });
    const res = await fetch(`/api/admin/reviews?${params}`);
    const data = await res.json();
    setTotal(data.total || 0);

    // Fetch product names for display
    const reviewsData = data.data || [];
    const productMap: Record<number, string> = {};
    const pRes = await fetch("/api/admin/products?page=1");
    const pData = await pRes.json();
    (pData.data || []).forEach((p: Product) => { productMap[p.id] = p.name; });
    setReviews(reviewsData.map((r: Review) => ({ ...r, product_name: productMap[r.product_id] || `상품#${r.product_id}` })));
  }, [page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  const openCreate = () => { setEditing(null); setForm(emptyReview); setModalOpen(true); };
  const openEdit = (r: Review) => {
    setEditing(r);
    setForm({ product_id: r.product_id, author_name: r.author_name, rating: r.rating, content: r.content });
    setModalOpen(true);
  };
  const handleSave = async () => {
    const method = editing ? "PUT" : "POST";
    const url = editing ? `/api/admin/reviews/${editing.id}` : "/api/admin/reviews";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setModalOpen(false); fetchReviews();
  };
  const handleDelete = async (id: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
    fetchReviews();
  };

  const inputCls = "w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900/10 transition-all bg-white";
  const labelCls = "block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5";

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">전체 <span className="font-semibold text-gray-900">{total}</span>개 리뷰</p>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-lg text-xs font-semibold hover:bg-gray-800 transition-all active:scale-95">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          리뷰 추가
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">상품</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">작성자</th>
                <th className="px-4 py-3 text-center text-[11px] font-semibold text-gray-500 uppercase tracking-wider">별점</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">내용</th>
                <th className="px-4 py-3 text-center text-[11px] font-semibold text-gray-500 uppercase tracking-wider">구분</th>
                <th className="px-4 py-3 text-center text-[11px] font-semibold text-gray-500 uppercase tracking-wider">날짜</th>
                <th className="px-4 py-3 text-center text-[11px] font-semibold text-gray-500 uppercase tracking-wider">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {reviews.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3.5 text-gray-400 font-mono text-xs">#{r.id}</td>
                  <td className="px-4 py-3.5 font-medium text-gray-900 max-w-[150px] truncate">{r.product_name}</td>
                  <td className="px-4 py-3.5 text-gray-700">{r.author_name}</td>
                  <td className="px-4 py-3.5 text-center"><Stars rating={r.rating} size={12} /></td>
                  <td className="px-4 py-3.5 text-gray-500 max-w-[200px] truncate">{r.content}</td>
                  <td className="px-4 py-3.5 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${r.is_admin_created ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-blue-50 text-blue-700 border-blue-200"}`}>
                      {r.is_admin_created ? "조작" : "실제"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-center text-gray-400 text-xs">{new Date(r.created_at).toLocaleDateString("ko-KR")}</td>
                  <td className="px-4 py-3.5 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => openEdit(r)} className="px-2 py-1 text-[11px] font-medium text-gray-600 hover:bg-gray-100 rounded-md transition-colors">수정</button>
                      <button onClick={() => handleDelete(r.id)} className="px-2 py-1 text-[11px] font-medium text-red-500 hover:bg-red-50 rounded-md transition-colors">삭제</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {reviews.length === 0 && <div className="text-center py-16"><p className="text-gray-400 text-sm">리뷰가 없습니다.</p></div>}
      </div>

      {total > 20 && (
        <div className="flex justify-center gap-1">
          {Array.from({ length: Math.ceil(total / 20) }, (_, i) => (
            <button key={i} onClick={() => setPage(i + 1)} className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${page === i + 1 ? "bg-gray-900 text-white" : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"}`}>{i + 1}</button>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "리뷰 수정" : "리뷰 추가 (조작)"}>
        <div className="space-y-4">
          <div>
            <label className={labelCls}>상품</label>
            <select value={form.product_id} onChange={(e) => setForm({ ...form, product_id: Number(e.target.value) })} className={inputCls}>
              <option value={0}>상품 선택</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>작성자명</label>
            <input value={form.author_name} onChange={(e) => setForm({ ...form, author_name: e.target.value })} placeholder="표시될 이름" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>별점</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <button key={s} type="button" onClick={() => setForm({ ...form, rating: s })}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${form.rating >= s ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-400 border border-gray-200"}`}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className={labelCls}>내용</label>
            <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={3} placeholder="리뷰 내용" className={`${inputCls} resize-none`} />
          </div>
          <button onClick={handleSave} disabled={!form.product_id || !form.author_name || !form.content} className="w-full py-3 bg-gray-900 text-white rounded-lg font-bold text-sm hover:bg-gray-800 transition-all active:scale-[0.98] disabled:opacity-50">
            {editing ? "수정하기" : "추가하기"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
