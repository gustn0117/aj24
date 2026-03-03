"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { Product } from "@/lib/types";
import ProductCard from "@/components/ProductCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

function SearchContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!q) { setProducts([]); setTotal(0); setLoading(false); return; }
    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(q)}`)
      .then((r) => r.json())
      .then(({ data, total }) => { setProducts(data); setTotal(total); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [q]);

  return (
    <main className="min-h-screen bg-white">
      <Header categories={[]} />
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-10 md:py-16">
        <div className="mb-10">
          <p className="text-sm text-gray-400 mb-1">검색 결과</p>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-black">&ldquo;{q}&rdquo;</h1>
          {!loading && <p className="text-sm text-gray-400 mt-2">{total}개의 상품</p>}
        </div>

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
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10">
            {products.map((product) => (
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
