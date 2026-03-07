"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Modal from "@/components/admin/Modal";
import { Product, Category } from "@/lib/types";

function ImageUploader({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json();
    setUploading(false);
    if (res.ok && data.url) onChange(data.url);
    else alert(data.error || "업로드 실패");
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) upload(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) upload(file);
  }

  const hasImage = value && value !== "/images/placeholder.svg";

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-lg cursor-pointer transition-all overflow-hidden ${dragOver ? "border-gray-900 bg-gray-50" : "border-gray-200 hover:border-gray-400"} ${hasImage ? "aspect-[3/4] max-w-[200px]" : "py-8"}`}
      >
        {uploading ? (
          <div className="flex flex-col items-center justify-center h-full py-4">
            <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
            <p className="text-xs text-gray-400 mt-2">업로드 중...</p>
          </div>
        ) : hasImage ? (
          <>
            <img src={value} alt="상품" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors flex items-center justify-center">
              <span className="text-white text-xs font-semibold opacity-0 hover:opacity-100">변경</span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center text-gray-400">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" /></svg>
            <p className="text-xs mt-2">클릭 또는 드래그하여 업로드</p>
            <p className="text-[10px] text-gray-300 mt-1">JPG, PNG, WebP (최대 5MB)</p>
          </div>
        )}
        <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
      </div>
      {hasImage && (
        <button type="button" onClick={() => onChange("/images/placeholder.svg")} className="text-[11px] text-red-400 hover:text-red-600 mt-1.5">이미지 삭제</button>
      )}
    </div>
  );
}

function DetailImageUploader({ images, onChange }: { images: string[]; onChange: (imgs: string[]) => void }) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function uploadFiles(files: FileList) {
    setUploading(true);
    const newImages = [...images];
    for (let i = 0; i < files.length; i++) {
      const fd = new FormData();
      fd.append("file", files[i]);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok && data.url) newImages.push(data.url);
    }
    onChange(newImages);
    setUploading(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) uploadFiles(e.dataTransfer.files);
  }

  function removeImage(idx: number) {
    onChange(images.filter((_, i) => i !== idx));
  }

  function moveImage(idx: number, dir: -1 | 1) {
    if (idx + dir < 0 || idx + dir >= images.length) return;
    const arr = [...images];
    [arr[idx], arr[idx + dir]] = [arr[idx + dir], arr[idx]];
    onChange(arr);
  }

  return (
    <div>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-2">
        {images.map((img, idx) => (
          <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
            <img src={img} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
              {idx > 0 && <button onClick={() => moveImage(idx, -1)} className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-xs shadow">&#8593;</button>}
              {idx < images.length - 1 && <button onClick={() => moveImage(idx, 1)} className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-xs shadow">&#8595;</button>}
              <button onClick={() => removeImage(idx)} className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs shadow">&times;</button>
            </div>
            <span className="absolute top-1 left-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">{idx + 1}</span>
          </div>
        ))}
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="aspect-square border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
        >
          {uploading ? (
            <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
              <p className="text-[10px] text-gray-400 mt-1">추가</p>
            </>
          )}
        </div>
      </div>
      <input ref={inputRef} type="file" accept="image/*" multiple onChange={(e) => e.target.files && uploadFiles(e.target.files)} className="hidden" />
      <p className="text-[10px] text-gray-400">여러 장 선택 가능. 드래그로 순서 변경.</p>
    </div>
  );
}

const emptyProduct = {
  name: "",
  original_price: 0,
  sale_price: 0,
  discount: null as null,
  image: "/images/placeholder.svg",
  badges: [] as string[],
  rating: 0,
  category: "",
  gender: null as "남자" | "여자" | null,
  sort_order: 0,
  is_active: true,
  description: "",
  detail_images: [] as string[],
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyProduct);
  const [badgeInput, setBadgeInput] = useState("");

  const fetchCategories = useCallback(async () => {
    const res = await fetch("/api/admin/categories");
    const data = await res.json();
    setCategories(data.data || []);
  }, []);

  const fetchProducts = useCallback(async () => {
    const params = new URLSearchParams({ page: String(page) });
    if (categoryFilter) params.set("category", categoryFilter);
    const res = await fetch(`/api/admin/products?${params}`);
    const data = await res.json();
    setProducts(data.data || []);
    setTotal(data.total || 0);
  }, [page, categoryFilter]);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);
  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const openCreate = () => { setEditing(null); setForm(emptyProduct); setBadgeInput(""); setModalOpen(true); };
  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({ name: p.name, original_price: p.original_price, sale_price: p.sale_price, discount: null, image: p.image, badges: p.badges, rating: p.rating, category: p.category, gender: p.gender, sort_order: p.sort_order, is_active: p.is_active, description: p.description || "", detail_images: p.detail_images || [] });
    setBadgeInput(""); setModalOpen(true);
  };
  const handleSave = async () => {
    const method = editing ? "PUT" : "POST";
    const url = editing ? `/api/admin/products/${editing.id}` : "/api/admin/products";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setModalOpen(false); fetchProducts();
  };
  const handleDelete = async (id: number) => { if (!confirm("정말 삭제하시겠습니까?")) return; await fetch(`/api/admin/products/${id}`, { method: "DELETE" }); fetchProducts(); };
  const addBadge = () => { if (badgeInput.trim() && !form.badges.includes(badgeInput.trim())) { setForm({ ...form, badges: [...form.badges, badgeInput.trim()] }); setBadgeInput(""); } };
  const removeBadge = (b: string) => { setForm({ ...form, badges: form.badges.filter((x) => x !== b) }); };

  const inputCls = "w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900/10 transition-all bg-white";
  const labelCls = "block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5";

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">전체 <span className="font-semibold text-gray-900">{total}</span>개 상품</p>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-lg text-xs font-semibold hover:bg-gray-800 transition-all active:scale-95">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          상품 추가
        </button>
      </div>

      <div className="flex gap-1.5 flex-wrap">
        <button onClick={() => { setCategoryFilter(""); setPage(1); }}
          className={`px-3.5 py-1.5 text-xs rounded-full font-medium transition-all ${categoryFilter === "" ? "bg-gray-900 text-white" : "bg-white text-gray-500 border border-gray-200 hover:border-gray-300"}`}>
          전체
        </button>
        {categories.filter(c => c.is_active).map((c) => (
          <button key={c.id} onClick={() => { setCategoryFilter(c.name); setPage(1); }}
            className={`px-3.5 py-1.5 text-xs rounded-full font-medium transition-all ${categoryFilter === c.name ? "bg-gray-900 text-white" : "bg-white text-gray-500 border border-gray-200 hover:border-gray-300"}`}>
            {c.name}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200/80 overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider w-12">이미지</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">상품명</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">카테고리</th>
              <th className="px-4 py-3 text-center text-[11px] font-semibold text-gray-500 uppercase tracking-wider">성별</th>
              <th className="px-4 py-3 text-right text-[11px] font-semibold text-gray-500 uppercase tracking-wider">판매가</th>
              <th className="px-4 py-3 text-center text-[11px] font-semibold text-gray-500 uppercase tracking-wider">상태</th>
              <th className="px-4 py-3 text-center text-[11px] font-semibold text-gray-500 uppercase tracking-wider">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3.5 text-gray-400 font-mono text-xs">#{p.id}</td>
                <td className="px-4 py-3.5">{p.image && p.image !== "/images/placeholder.svg" ? <img src={p.image} alt="" className="w-10 h-10 object-cover rounded" /> : <div className="w-10 h-10 bg-gray-100 rounded" />}</td>
                <td className="px-4 py-3.5 font-medium text-gray-900 max-w-xs truncate">{p.name}</td>
                <td className="px-4 py-3.5"><span className="px-2 py-0.5 rounded-full bg-gray-100 text-[11px] font-medium text-gray-600">{p.category || "-"}</span></td>
                <td className="px-4 py-3.5 text-center"><span className="text-[11px] text-gray-500">{p.gender || "-"}</span></td>
                <td className="px-4 py-3.5 text-right font-semibold text-gray-900">{p.sale_price.toLocaleString()}원</td>
                <td className="px-4 py-3.5 text-center">
                  <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium ${p.is_active ? "text-emerald-600" : "text-gray-400"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${p.is_active ? "bg-emerald-500" : "bg-gray-300"}`} />{p.is_active ? "활성" : "비활성"}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <button onClick={() => openEdit(p)} className="px-2 py-1 text-[11px] font-medium text-gray-600 hover:bg-gray-100 rounded-md transition-colors">수정</button>
                    <button onClick={() => handleDelete(p.id)} className="px-2 py-1 text-[11px] font-medium text-red-500 hover:bg-red-50 rounded-md transition-colors">삭제</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        {products.length === 0 && <div className="text-center py-16"><p className="text-gray-400 text-sm">상품이 없습니다.</p></div>}
      </div>

      {total > 20 && (
        <div className="flex justify-center gap-1">
          {Array.from({ length: Math.ceil(total / 20) }, (_, i) => (
            <button key={i} onClick={() => setPage(i + 1)} className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${page === i + 1 ? "bg-gray-900 text-white" : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"}`}>{i + 1}</button>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "상품 수정" : "상품 추가"}>
        <div className="space-y-4">
          <div><label className={labelCls}>상품명</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} /></div>
          <div>
            <label className={labelCls}>카테고리</label>
            <div className="flex gap-2 flex-wrap">
              {categories.filter(c => c.is_active).map((c) => (
                <button key={c.id} type="button" onClick={() => setForm({ ...form, category: form.category === c.name ? "" : c.name })}
                  className={`px-3.5 py-2 text-xs rounded-lg font-medium transition-all ${form.category === c.name ? "bg-gray-900 text-white ring-2 ring-gray-900/20" : "bg-gray-50 text-gray-600 border border-gray-200 hover:border-gray-400"}`}>
                  {c.name}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className={labelCls}>성별</label>
            <div className="flex gap-2">
              {(["남자", "여자"] as const).map((g) => (
                <button key={g} type="button" onClick={() => setForm({ ...form, gender: form.gender === g ? null : g })}
                  className={`px-3.5 py-2 text-xs rounded-lg font-medium transition-all ${form.gender === g ? "bg-gray-900 text-white ring-2 ring-gray-900/20" : "bg-gray-50 text-gray-600 border border-gray-200 hover:border-gray-400"}`}>
                  {g}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div><label className={labelCls}>원가</label><input type="number" value={form.original_price} onChange={(e) => setForm({ ...form, original_price: Number(e.target.value) })} className={inputCls} /></div>
            <div>
              <label className={labelCls}>판매가</label>
              <input type="number" value={form.sale_price} onChange={(e) => setForm({ ...form, sale_price: Number(e.target.value) })} className={inputCls} />
              {form.original_price > form.sale_price && form.sale_price > 0 && (
                <p className="text-xs text-red-500 font-semibold mt-1">-{Math.round((1 - form.sale_price / form.original_price) * 100)}% 할인</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div><label className={labelCls}>평점 (0~5)</label><input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} className={inputCls} /></div>
            <div><label className={labelCls}>정렬 순서</label><input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} className={inputCls} /></div>
          </div>
          <div><label className={labelCls}>상품 이미지</label><ImageUploader value={form.image} onChange={(url) => setForm({ ...form, image: url })} /></div>
          <div>
            <label className={labelCls}>뱃지</label>
            <div className="flex gap-1.5 mb-2 flex-wrap">
              {form.badges.map((b) => (<span key={b} className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-700 rounded-md text-[11px] font-medium">{b}<button onClick={() => removeBadge(b)} className="text-gray-400 hover:text-red-500 ml-0.5">&times;</button></span>))}
            </div>
            <div className="flex gap-2">
              <input value={badgeInput} onChange={(e) => setBadgeInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addBadge())} placeholder="뱃지 입력 후 Enter" className={`flex-1 ${inputCls}`} />
              <button onClick={addBadge} className="px-3 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-medium transition-colors">추가</button>
            </div>
          </div>
          <div>
            <label className={labelCls}>상세 이미지</label>
            <DetailImageUploader images={form.detail_images} onChange={(imgs) => setForm({ ...form, detail_images: imgs })} />
          </div>
          <div><label className={labelCls}>설명</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className={`${inputCls} resize-none`} /></div>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <div className="relative"><input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="sr-only peer" /><div className="w-9 h-5 bg-gray-200 peer-checked:bg-gray-900 rounded-full transition-colors" /><div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm peer-checked:translate-x-4 transition-transform" /></div>
            <span className="text-xs font-medium text-gray-700">활성화</span>
          </label>
          <button onClick={handleSave} className="w-full py-3 bg-gray-900 text-white rounded-lg font-bold text-sm hover:bg-gray-800 transition-all active:scale-[0.98]">
            {editing ? "수정하기" : "추가하기"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
