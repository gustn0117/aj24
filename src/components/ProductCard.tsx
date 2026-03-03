"use client";

import { Product } from "@/data/products";

function getBadgeClass(badge: string) {
  switch (badge) {
    case "히트":
      return "badge badge-hit";
    case "인기":
      return "badge badge-popular";
    case "1+1":
      return "badge badge-oneplus";
    case "추천":
      return "bg-blue-500 badge";
    case "BEST":
      return "bg-yellow-500 badge";
    default:
      return "bg-gray-500 badge";
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
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill={star <= Math.round(rating) ? "#fbbf24" : "none"}
          stroke={star <= Math.round(rating) ? "#fbbf24" : "#d1d5db"}
          strokeWidth="2"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group bg-white border border-gray-100 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Image area */}
      <div className="relative aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
        <div className="w-full h-full flex items-center justify-center p-6">
          <div className="w-32 h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex items-center justify-center text-gray-400 group-hover:scale-105 transition-transform duration-300">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5">
          {product.badges.map((badge, i) => (
            <span key={i} className={getBadgeClass(badge)}>
              {badge}
            </span>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="text-sm text-gray-800 font-medium leading-snug line-clamp-2 min-h-[2.5rem] mb-3">
          {product.name}
        </h3>

        {/* Pricing */}
        <div className="mb-3">
          {product.originalPrice !== product.salePrice && (
            <p className="text-xs text-gray-400 line-through">
              {formatPrice(product.originalPrice)}
            </p>
          )}
          <div className="flex items-center gap-2">
            <p className="text-lg font-bold text-gray-900">
              {formatPrice(product.salePrice)}
            </p>
            {product.discount && (
              <span className="text-lg font-bold text-red-500">
                {product.discount}%
              </span>
            )}
          </div>
        </div>

        {/* Actions row */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
          <div className="flex items-center gap-2">
            <button className="p-1.5 hover:bg-red-50 rounded-full transition-colors group/heart">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#aaa"
                strokeWidth="2"
                className="group-hover/heart:stroke-red-500"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
            <button className="p-1.5 hover:bg-blue-50 rounded-full transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#999">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </button>
            <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#999">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </button>
          </div>
          <StarRating rating={product.rating} />
        </div>
      </div>
    </div>
  );
}
