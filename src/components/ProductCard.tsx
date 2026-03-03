"use client";

import { Product } from "@/lib/types";

function getBadgeClass(badge: string) {
  switch (badge) {
    case "NEW":
    case "신상":
      return "badge badge-new";
    case "HOT":
    case "히트":
      return "badge badge-hit";
    case "BEST":
    case "인기":
      return "badge badge-popular";
    case "SALE":
      return "badge badge-sale";
    case "1+1":
      return "badge badge-oneplus";
    case "추천":
      return "bg-gradient-to-r from-blue-500 to-cyan-500 badge";
    default:
      return "bg-gray-900 badge";
  }
}

function formatPrice(price: number) {
  return price.toLocaleString("ko-KR") + "원";
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          width="11"
          height="11"
          viewBox="0 0 24 24"
          fill={star <= Math.round(rating) ? "#111827" : "none"}
          stroke={star <= Math.round(rating) ? "#111827" : "#d1d5db"}
          strokeWidth="2"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
      <span className="text-[10px] text-gray-400 ml-0.5 font-medium">{rating.toFixed(1)}</span>
    </div>
  );
}

export default function ProductCard({ product }: { product: Product }) {
  const discountPercent = product.discount || (
    product.original_price > product.sale_price
      ? Math.round((1 - product.sale_price / product.original_price) * 100)
      : 0
  );

  return (
    <div className="group cursor-pointer">
      {/* Image area */}
      <div className="relative aspect-[3/4] bg-stone-100 rounded-xl overflow-hidden mb-3">
        <div className="w-full h-full flex items-center justify-center img-zoom">
          <div className="w-24 h-24 bg-stone-200/80 rounded-2xl flex items-center justify-center text-stone-300">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
          {product.badges.map((badge, i) => (
            <span key={i} className={getBadgeClass(badge)}>
              {badge}
            </span>
          ))}
        </div>

        {/* Discount tag */}
        {discountPercent > 0 && (
          <div className="absolute top-2.5 right-2.5 bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-md">
            -{discountPercent}%
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />

        {/* Quick actions */}
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
          <div className="flex items-center gap-1.5">
            <button className="flex-1 h-10 bg-white text-gray-900 rounded-lg flex items-center justify-center text-xs font-bold hover:bg-gray-900 hover:text-white transition-colors shadow-lg">
              장바구니 담기
            </button>
            <button className="w-10 h-10 bg-white rounded-lg flex items-center justify-center hover:bg-gray-900 hover:text-white transition-colors shadow-lg text-gray-600">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="px-0.5">
        {/* Category */}
        {product.category && (
          <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium mb-1">{product.category}</p>
        )}

        <h3 className="text-sm text-gray-800 font-medium leading-snug line-clamp-2 min-h-[2.5rem] mb-1.5 group-hover:text-black transition-colors">
          {product.name}
        </h3>

        {/* Pricing */}
        <div className="flex items-baseline gap-2 mb-2">
          {discountPercent > 0 && (
            <span className="text-sm font-bold text-red-500">{discountPercent}%</span>
          )}
          <span className="text-[15px] font-extrabold text-gray-900 tracking-tight">
            {formatPrice(product.sale_price)}
          </span>
          {product.original_price !== product.sale_price && (
            <span className="text-xs text-gray-400 line-through">
              {formatPrice(product.original_price)}
            </span>
          )}
        </div>

        {/* Rating */}
        <StarRating rating={product.rating} />
      </div>
    </div>
  );
}
