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
    <section className={`py-16 md:py-20 ${bgColor}`}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">
            <span className="w-1 h-1 bg-indigo-500 rounded-full" />
            {title}
          </div>
          {subtitle && (
            <p className="text-gray-600 text-base md:text-lg">{subtitle}</p>
          )}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 stagger-children">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* More View Button */}
        <div className="text-center mt-12">
          <button className="group inline-flex items-center gap-2 px-8 py-3.5 border-2 border-gray-900 text-gray-900 font-bold text-sm rounded-2xl hover:bg-gray-900 hover:text-white transition-all duration-300 active:scale-95">
            더 보기
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:translate-x-1 transition-transform">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
