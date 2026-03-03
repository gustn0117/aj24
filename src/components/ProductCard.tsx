"use client";

import Link from "next/link";
import { Product } from "@/lib/types";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";

function getBadgeClass(badge: string) {
  switch (badge) {
    case "NEW": case "신상": return "badge badge-new";
    case "HOT": case "히트": return "badge badge-hit";
    case "BEST": case "인기": return "badge badge-popular";
    case "SALE": return "badge badge-sale";
    case "1+1": return "badge badge-oneplus";
    case "추천": return "bg-gradient-to-r from-blue-500 to-cyan-500 badge";
    default: return "bg-black badge";
  }
}

function formatPrice(price: number) {
  return price.toLocaleString("ko-KR") + "원";
}

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  const discountPercent = product.discount || (
    product.original_price > product.sale_price
      ? Math.round((1 - product.sale_price / product.original_price) * 100)
      : 0
  );

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  }

  function handleToggleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  }

  return (
    <Link href={`/products/${product.id}`} className="group cursor-pointer block">
      {/* Image */}
      <div className="relative aspect-[3/4] bg-[#f5f5f5] rounded-lg overflow-hidden mb-3">
        {product.image && product.image !== "/images/placeholder.svg" && (
          <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
        )}
        {/* Badges */}
        {product.badges.length > 0 && (
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {product.badges.map((badge, i) => (
              <span key={i} className={getBadgeClass(badge)}>{badge}</span>
            ))}
          </div>
        )}

        {/* Discount */}
        {discountPercent > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded z-10">
            -{discountPercent}%
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-600" />

        {/* Mobile wishlist button (always visible on touch devices) */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-2 right-2 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-colors md:hidden ${wishlisted ? "bg-red-500 text-white" : "bg-white/80 text-gray-400 backdrop-blur-sm"} ${discountPercent > 0 ? "top-8" : ""}`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill={wishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {/* Quick actions on hover (desktop only) */}
        <div className="absolute bottom-0 left-0 right-0 p-2.5 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-10 hidden md:block">
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleAddToCart}
              className="flex-1 h-10 bg-black text-white rounded-md flex items-center justify-center text-[11px] font-bold tracking-wide hover:bg-black/80 transition-colors shadow-lg shadow-black/20"
            >
              ADD TO CART
            </button>
            <button
              onClick={handleToggleWishlist}
              className={`w-10 h-10 rounded-md flex items-center justify-center transition-colors shadow-lg ${wishlisted ? "bg-red-500 text-white" : "bg-white text-gray-500 hover:text-red-500"}`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill={wishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Info */}
      <div>
        {product.category && (
          <p className="text-[10px] text-gray-400 tracking-wider font-medium mb-0.5">{product.category}</p>
        )}

        <h3 className="text-[13px] text-gray-800 font-medium leading-snug line-clamp-2 min-h-[2.4rem] mb-2 group-hover:text-black transition-colors">
          {product.name}
        </h3>

        <div className="flex items-baseline gap-1.5 mb-2">
          {discountPercent > 0 && (
            <span className="text-[13px] font-extrabold text-red-500">{discountPercent}%</span>
          )}
          <span className="text-[15px] font-extrabold text-black tracking-tight">
            {formatPrice(product.sale_price)}
          </span>
        </div>
        {product.original_price !== product.sale_price && (
          <p className="text-[11px] text-gray-400 line-through -mt-1 mb-2">
            {formatPrice(product.original_price)}
          </p>
        )}

        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-px">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg key={star} width="12" height="12" viewBox="0 0 24 24" fill={star <= Math.round(product.rating) ? "#000" : "none"} stroke={star <= Math.round(product.rating) ? "#000" : "#ddd"} strokeWidth="1.5">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            ))}
          </div>
          <span className="text-[11px] text-gray-400">({Math.floor(product.rating * 47)})</span>
        </div>
      </div>
    </Link>
  );
}
