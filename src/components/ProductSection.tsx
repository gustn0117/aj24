"use client";

import Link from "next/link";
import { Product } from "@/lib/types";
import ProductCard from "./ProductCard";

interface ProductSectionProps {
  title: string;
  subtitle?: string;
  products: Product[];
  bgColor?: string;
  linkHref?: string;
}

export default function ProductSection({
  title,
  subtitle,
  products,
  bgColor = "bg-white",
  linkHref,
}: ProductSectionProps) {
  if (products.length === 0) return null;

  return (
    <section className={`py-12 md:py-16 ${bgColor}`}>
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex items-end justify-between gap-4 mb-8 md:mb-10">
          <div className="flex items-baseline gap-3">
            <h2 className="text-xl md:text-2xl font-black tracking-tight text-gray-900">
              {title}
            </h2>
            {subtitle && (
              <p className="hidden sm:block text-sm text-gray-400">{subtitle}</p>
            )}
          </div>
          {linkHref && (
            <Link href={linkHref} className="inline-flex items-center gap-1 text-[13px] font-semibold text-gray-400 hover:text-black transition-colors shrink-0">
              전체보기
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          )}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-5 sm:gap-y-10 stagger-children">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
