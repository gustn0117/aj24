"use client";

import { Product } from "@/lib/types";

function getBadgeClass(badge: string) {
  switch (badge) {
    case "히트":
      return "badge badge-hit";
    case "인기":
      return "badge badge-popular";
    case "1+1":
      return "badge badge-oneplus";
    case "추천":
      return "bg-gradient-to-r from-blue-500 to-cyan-500 badge";
    case "BEST":
      return "bg-gradient-to-r from-amber-400 to-yellow-500 badge";
    default:
      return "bg-gradient-to-r from-gray-400 to-gray-500 badge";
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
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill={star <= Math.round(rating) ? "#fbbf24" : "none"}
          stroke={star <= Math.round(rating) ? "#fbbf24" : "#e5e7eb"}
          strokeWidth="2"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
      <span className="text-xs text-gray-400 ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500">
      {/* Image area */}
      <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
        <div className="w-full h-full flex items-center justify-center p-8">
          <div className="w-28 h-28 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center text-gray-400 group-hover:scale-110 group-hover:rotate-2 transition-all duration-500">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.badges.map((badge, i) => (
            <span key={i} className={`${getBadgeClass(badge)} shadow-sm`}>
              {badge}
            </span>
          ))}
        </div>

        {/* Discount tag */}
        {product.discount && (
          <div className="absolute top-3 right-3 w-11 h-11 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-200">
            <span className="text-white text-xs font-black">{product.discount}%</span>
          </div>
        )}

        {/* Quick actions on hover */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/30 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <div className="flex items-center justify-center gap-2">
            <button className="w-9 h-9 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-sm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
            <button className="flex-1 h-9 rounded-xl bg-gray-900/90 backdrop-blur-sm flex items-center justify-center text-white text-xs font-bold hover:bg-gray-900 transition-colors shadow-sm">
              장바구니 담기
            </button>
            <button className="w-9 h-9 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-sm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="text-[13px] text-gray-700 font-medium leading-snug line-clamp-2 min-h-[2.5rem] mb-2 group-hover:text-gray-900 transition-colors">
          {product.name}
        </h3>

        {/* Pricing */}
        <div className="mb-2.5">
          {product.original_price !== product.sale_price && (
            <p className="text-xs text-gray-400 line-through mb-0.5">
              {formatPrice(product.original_price)}
            </p>
          )}
          <p className="text-lg font-extrabold text-gray-900 tracking-tight">
            {formatPrice(product.sale_price)}
          </p>
        </div>

        {/* Rating & share */}
        <div className="flex items-center justify-between pt-2.5 border-t border-gray-100">
          <StarRating rating={product.rating} />
          <div className="flex items-center gap-1">
            <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors" title="공유">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
