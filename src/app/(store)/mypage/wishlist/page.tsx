"use client";

import { useState, useEffect } from "react";
import { Product } from "@/lib/types";
import { useWishlist } from "@/contexts/WishlistContext";
import { supabase } from "@/lib/supabase";
import ProductCard from "@/components/ProductCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function WishlistPage() {
  const { wishlistIds } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (wishlistIds.length === 0) { setProducts([]); setLoading(false); return; }
    supabase
      .from("products")
      .select("*")
      .in("id", wishlistIds)
      .eq("is_active", true)
      .then(({ data }) => { setProducts((data as Product[]) || []); setLoading(false); })
      .then(undefined, () => setLoading(false));
  }, [wishlistIds]);

  return (
    <main className="min-h-screen bg-white">
      <Header categories={[]} />
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-10 md:py-16">
        <div className="flex items-center gap-3 mb-8">
          <a href="/mypage" className="text-gray-400 hover:text-black transition-colors"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg></a>
          <h1 className="text-2xl font-black tracking-tight">위시리스트</h1>
          {products.length > 0 && <span className="text-sm text-gray-400">({products.length})</span>}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="animate-pulse"><div className="aspect-[3/4] bg-gray-100 rounded-lg mb-3" /><div className="h-3 bg-gray-100 rounded w-3/4" /></div>)}</div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-gray-400"><p className="text-sm font-semibold mb-2">위시리스트가 비어있습니다</p><a href="/" className="text-xs text-black font-semibold underline">쇼핑하러 가기</a></div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10">
            {products.map((product) => (<ProductCard key={product.id} product={product} />))}
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
