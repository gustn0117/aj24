"use client";

import { useState, useMemo } from "react";
import { Product, Category } from "@/lib/types";
import ProductCard from "./ProductCard";
import Header from "./Header";
import Footer from "./Footer";

type SortType = "default" | "price_asc" | "price_desc" | "rating";

export default function CategoryPageClient({ category, products, categories }: { category: Category; products: Product[]; categories: Category[] }) {
  const [sort, setSort] = useState<SortType>("default");

  const sorted = useMemo(() => {
    const copy = [...products];
    switch (sort) {
      case "price_asc": return copy.sort((a, b) => a.sale_price - b.sale_price);
      case "price_desc": return copy.sort((a, b) => b.sale_price - a.sale_price);
      case "rating": return copy.sort((a, b) => b.rating - a.rating);
      default: return copy;
    }
  }, [products, sort]);

  return (
    <main className="min-h-screen bg-white">
      <Header categories={categories} />
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-10 md:py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-black">{category.name}</h1>
            <p className="text-sm text-gray-400 mt-1">{products.length}개의 상품</p>
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortType)}
            className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:border-black bg-white"
          >
            <option value="default">기본 정렬</option>
            <option value="price_asc">낮은 가격순</option>
            <option value="price_desc">높은 가격순</option>
            <option value="rating">평점순</option>
          </select>
        </div>

        {sorted.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10">
            {sorted.map((product) => (
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
