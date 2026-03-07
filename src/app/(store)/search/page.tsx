"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, useMemo, Suspense } from "react";
import { Product } from "@/lib/types";
import ProductCard from "@/components/ProductCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type SortType = "default" | "price_asc" | "price_desc" | "rating";

const sortOptions: { value: SortType; label: string }[] = [
  { value: "default", label: "추천순" },
  { value: "price_asc", label: "낮은 가격순" },
  { value: "price_desc", label: "높은 가격순" },
  { value: "rating", label: "평점순" },
];

function SearchContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<SortType>("default");
  const [gender, setGender] = useState<"" | "남자" | "여자">("");

  useEffect(() => {
    if (!q) { setProducts([]); setLoading(false); return; }
    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(q)}`)
      .then((r) => r.json())
      .then(({ data }) => { setProducts(data || []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [q]);

  const filtered = useMemo(() => {
    let result = [...products];
    if (gender) result = result.filter((p) => p.gender === gender);
    switch (sort) {
      case "price_asc": return result.sort((a, b) => a.sale_price - b.sale_price);
      case "price_desc": return result.sort((a, b) => b.sale_price - a.sale_price);
      case "rating": return result.sort((a, b) => b.rating - a.rating);
      default: return result;
    }
  }, [products, sort, gender]);

  return (
    <main className="min-h-screen bg-white">
      <Header categories={[]} />
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-10 md:py-16">
        <div className="mb-6">
          <p className="text-sm text-gray-400 mb-1">검색 결과</p>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-black">&ldquo;{q}&rdquo;</h1>
          {!loading && <p className="text-sm text-gray-400 mt-2">{filtered.length}개의 상품</p>}
        </div>

        {/* Filter Bar */}
        {!loading && products.length > 0 && (
          <div className="flex flex-col gap-3 mb-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-1.5">
              {(["", "남자", "여자"] as const).map((g) => (
                <button key={g} onClick={() => setGender(g)}
                  className={`px-4 py-2 text-[13px] rounded-full font-semibold transition-all ${gender === g ? "bg-black text-white shadow-sm" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                  {g || "전체"}
                </button>
              ))}
            </div>
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
              {sortOptions.map((opt) => (
                <button key={opt.value} onClick={() => setSort(opt.value)}
                  className={`px-3.5 py-2 text-[12px] rounded-full font-medium whitespace-nowrap transition-all ${sort === opt.value ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600"}`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-gray-100 rounded-lg mb-3" />
                <div className="h-3 bg-gray-100 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg font-semibold mb-2">검색 결과가 없습니다</p>
            <p className="text-sm">다른 키워드로 검색해보세요</p>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchContent />
    </Suspense>
  );
}
