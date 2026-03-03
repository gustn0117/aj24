"use client";

import { Product } from "@/lib/types";
import ProductCard from "./ProductCard";

interface ProductSectionProps {
  title: string;
  subtitle?: string;
  products: Product[];
  bgColor?: string;
}

export default function ProductSection({
  title,
  subtitle,
  products,
  bgColor = "bg-white",
}: ProductSectionProps) {
  return (
    <section className={`py-16 md:py-24 ${bgColor}`}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-gray-900">
                {title}
              </h2>
              <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 bg-gray-100 rounded-full text-[10px] font-bold text-gray-500">
                {products.length}
              </span>
            </div>
            {subtitle && (
              <p className="text-sm text-gray-400 leading-relaxed">{subtitle}</p>
            )}
          </div>
          <button className="group inline-flex items-center gap-2 px-5 py-2.5 border border-gray-200 rounded-full text-[12px] font-bold text-gray-500 hover:text-black hover:border-gray-400 transition-all shrink-0">
            전체보기
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:translate-x-0.5 transition-transform">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-12 stagger-children">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
