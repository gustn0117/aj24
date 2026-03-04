"use client";

import { useState, useMemo } from "react";
import { Product, Category } from "@/lib/types";
import ProductCard from "./ProductCard";
import Header from "./Header";
import Footer from "./Footer";

type SortType = "default" | "price_asc" | "price_desc" | "rating";

const sortOptions: { value: SortType; label: string }[] = [
  { value: "default", label: "추천순" },
  { value: "price_asc", label: "낮은 가격순" },
  { value: "price_desc", label: "높은 가격순" },
  { value: "rating", label: "평점순" },
];

export default function CategoryPageClient({ category, products, categories }: { category: Category; products: Product[]; categories: Category[] }) {
  const [sort, setSort] = useState<SortType>("default");
  const [gender, setGender] = useState<"" | "남자" | "여자">("");

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
      <Header categories={categories} />
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 md:py-16">
        {/* Title */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-black">{category.name}</h1>
          <p className="text-sm text-gray-400 mt-1">{filtered.length}개의 상품</p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col gap-3 mb-8 sm:flex-row sm:items-center sm:justify-between">
          {/* Gender */}
          <div className="flex gap-1.5">
            {(["", "남자", "여자"] as const).map((g) => (
              <button key={g} onClick={() => setGender(g)}
                className={`px-4 py-2 text-[13px] rounded-full font-semibold transition-all ${gender === g ? "bg-black text-white shadow-sm" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                {g || "전체"}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            {sortOptions.map((s) => (
              <button key={s.value} onClick={() => setSort(s.value)}
                className={`px-3.5 py-2 text-[13px] rounded-full font-medium whitespace-nowrap transition-all shrink-0 ${sort === s.value ? "bg-black text-white shadow-sm" : "bg-white text-gray-500 border border-gray-200 hover:border-gray-400"}`}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg font-semibold">상품이 없습니다</p>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
