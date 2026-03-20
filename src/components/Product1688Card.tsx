"use client";

import Link from "next/link";
import { Product1688 } from "@/lib/types";

function formatPrice(price: number) {
  return price.toLocaleString("ko-KR");
}

export default function Product1688Card({ product }: { product: Product1688 }) {
  const handleClick = () => {
    try {
      sessionStorage.setItem(`1688_product_${product.id}`, JSON.stringify(product));
    } catch {}
  };

  return (
    <Link
      href={`/1688/${product.id}`}
      className="group cursor-pointer block"
      onClick={handleClick}
    >
      {/* Image */}
      <div className="relative aspect-square bg-[#f5f5f5] rounded-lg overflow-hidden mb-3">
        {product.imageUrl && (
          <img
            src={product.imageUrl}
            alt={product.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        )}

        {/* 1688 Badge */}
        <div className="absolute top-2 left-2 z-10">
          <span className="px-2 py-0.5 bg-orange-500 text-white text-[10px] font-bold rounded">
            1688
          </span>
        </div>

        {/* Min order badge */}
        {product.minOrder && product.minOrder > 1 && (
          <div className="absolute bottom-2 left-2 z-10">
            <span className="px-2 py-0.5 bg-black/70 text-white text-[10px] font-medium rounded backdrop-blur-sm">
              최소 {product.minOrder}개
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div>
        {product.supplierName && (
          <p className="text-[10px] text-gray-400 tracking-wider font-medium mb-0.5 truncate">
            {product.supplierName}
          </p>
        )}

        <h3 className="text-[13px] text-gray-800 font-medium leading-snug line-clamp-2 min-h-[2.4rem] mb-2 group-hover:text-black transition-colors">
          {product.title}
        </h3>

        {/* Price */}
        <div className="flex items-baseline gap-1.5 mb-1">
          <span className="text-[15px] font-extrabold text-black tracking-tight">
            {formatPrice(product.priceKRW)}원
          </span>
        </div>
        <p className="text-[11px] text-gray-400">
          ¥{product.priceCNY.toFixed(2)}
        </p>

        {/* Sales count */}
        {product.salesCount && (
          <p className="text-[10px] text-orange-500 font-medium mt-1.5">
            판매 {product.salesCount}
          </p>
        )}
      </div>
    </Link>
  );
}
