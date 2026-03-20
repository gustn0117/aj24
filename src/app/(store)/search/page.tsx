"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, useMemo, Suspense } from "react";
import { Product, Product1688 } from "@/lib/types";
import ProductCard from "@/components/ProductCard";
import Product1688Card from "@/components/Product1688Card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type SortType = "default" | "price_asc" | "price_desc";

const sortOptions: { value: SortType; label: string }[] = [
  { value: "default", label: "추천순" },
  { value: "price_asc", label: "낮은 가격순" },
  { value: "price_desc", label: "높은 가격순" },
];

function SearchContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [products1688, setProducts1688] = useState<Product1688[]>([]);
  const [loading, setLoading] = useState(true);
  const [loading1688, setLoading1688] = useState(true);
  const [sort, setSort] = useState<SortType>("default");

  // Fetch both in parallel
  useEffect(() => {
    if (!q) {
      setProducts([]);
      setProducts1688([]);
      setLoading(false);
      setLoading1688(false);
      return;
    }

    setLoading(true);
    setLoading1688(true);

    fetch(`/api/search?q=${encodeURIComponent(q)}`)
      .then((r) => r.json())
      .then(({ data }) => setProducts(data || []))
      .catch(() => {})
      .finally(() => setLoading(false));

    fetch(`/api/1688/search?q=${encodeURIComponent(q)}`)
      .then((r) => r.json())
      .then((res) => setProducts1688(res.data || []))
      .catch(() => {})
      .finally(() => setLoading1688(false));
  }, [q]);

  // Unified sorted list: convert both to a common shape for sorting
  const sortedItems = useMemo(() => {
    const localItems = products.map((p) => ({ type: "local" as const, product: p, price: p.sale_price }));
    const items1688 = products1688.map((p) => ({ type: "1688" as const, product: p, price: p.priceKRW }));
    const all = [...localItems, ...items1688];

    switch (sort) {
      case "price_asc": return all.sort((a, b) => a.price - b.price);
      case "price_desc": return all.sort((a, b) => b.price - a.price);
      default: return all;
    }
  }, [products, products1688, sort]);

  const isLoading = loading && loading1688;
  const totalCount = products.length + products1688.length;

  return (
    <main className="min-h-screen bg-white">
      <Header categories={[]} />
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-10 md:py-16">
        {/* Title */}
        <div className="mb-6">
          <p className="text-sm text-gray-400 mb-1">검색 결과</p>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-black">&ldquo;{q}&rdquo;</h1>
          {!isLoading && (
            <p className="text-xs text-gray-400 mt-1">{totalCount}개의 상품</p>
          )}
        </div>

        {/* Sort Bar */}
        {!isLoading && totalCount > 0 && (
          <div className="flex items-center justify-end mb-8">
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

        {/* Results */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-gray-100 rounded-lg mb-3" />
                <div className="h-3 bg-gray-100 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : totalCount > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-5 sm:gap-y-10">
            {sortedItems.map((item) =>
              item.type === "local" ? (
                <ProductCard key={`local-${(item.product as Product).id}`} product={item.product as Product} />
              ) : (
                <Product1688Card key={`1688-${(item.product as Product1688).id}`} product={item.product as Product1688} />
              )
            )}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg font-semibold mb-2">검색 결과가 없습니다</p>
            <p className="text-sm">다른 키워드로 검색해보세요</p>
          </div>
        )}

        {/* Partial loading indicator */}
        {!isLoading && (loading || loading1688) && (
          <div className="flex justify-center py-8">
            <div className="animate-spin w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full" />
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
