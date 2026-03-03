"use client";

import { Product } from "@/data/products";
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
    <section className={`py-16 ${bgColor}`}>
      <div className="max-w-[1400px] mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900 mb-2">
            {title}
          </h2>
          {subtitle && (
            <p className="text-gray-500 text-base">{subtitle}</p>
          )}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* More View Button */}
        <div className="text-center mt-10">
          <button className="px-10 py-3 border-2 border-gray-900 text-gray-900 font-semibold text-sm rounded hover:bg-gray-900 hover:text-white transition-all duration-300">
            More view
          </button>
        </div>
      </div>
    </section>
  );
}
