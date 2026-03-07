"use client";

import { useState } from "react";
import { Product, Review } from "@/lib/types";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useAuth } from "@/contexts/AuthContext";
import ProductCard from "./ProductCard";
import Header from "./Header";
import Footer from "./Footer";

function formatPrice(price: number) {
  return price.toLocaleString("ko-KR") + "원";
}

function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-px">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg key={star} width={size} height={size} viewBox="0 0 24 24" fill={star <= Math.round(rating) ? "#000" : "none"} stroke={star <= Math.round(rating) ? "#000" : "#ddd"} strokeWidth="1.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

function StarSelector({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button key={s} type="button" onClick={() => onChange(s)} className="p-0.5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill={s <= value ? "#000" : "none"} stroke={s <= value ? "#000" : "#ccc"} strokeWidth="1.5" className="transition-colors">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </button>
      ))}
    </div>
  );
}

export default function ProductDetailClient({ product, relatedProducts, reviews: initialReviews }: { product: Product; relatedProducts: Product[]; reviews: Review[] }) {
  const { addItem } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { member, isLoading: authLoading } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const wishlisted = isWishlisted(product.id);

  const [activeTab, setActiveTab] = useState<"detail" | "review">("detail");
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [reviewForm, setReviewForm] = useState({ rating: 5, content: "" });
  const [submitting, setSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [detailExpanded, setDetailExpanded] = useState(false);

  const discountPercent = product.original_price > product.sale_price
    ? Math.round((1 - product.sale_price / product.original_price) * 100)
    : 0;

  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  async function handleSubmitReview() {
    if (!reviewForm.content.trim()) { setReviewError("리뷰 내용을 입력해주세요."); return; }
    setSubmitting(true);
    setReviewError("");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, rating: reviewForm.rating, content: reviewForm.content }),
      });
      const data = await res.json();
      if (res.ok) {
        setReviews([data, ...reviews]);
        setReviewForm({ rating: 5, content: "" });
      } else {
        setReviewError(data.error || "리뷰 작성에 실패했습니다.");
      }
    } catch {
      setReviewError("네트워크 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <Header categories={[]} />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
          {/* Image */}
          <div className="aspect-[3/4] bg-[#f5f5f5] rounded-2xl overflow-hidden">
            {product.image && product.image !== "/images/placeholder.svg" && (
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col">
            {product.category && (
              <p className="text-xs text-gray-400 tracking-wider font-medium mb-2 uppercase">{product.category}</p>
            )}

            <h1 className="text-2xl md:text-3xl font-black text-black tracking-tight mb-4">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <StarRating rating={avgRating || product.rating} />
              <span className="text-sm text-gray-400">({reviews.length}개 리뷰)</span>
            </div>

            {/* Badges */}
            {product.badges.length > 0 && (
              <div className="flex gap-1.5 mb-6">
                {product.badges.map((badge, i) => (
                  <span key={i} className="inline-block px-2.5 py-1 text-[10px] font-bold text-white rounded bg-black uppercase tracking-wider">{badge}</span>
                ))}
              </div>
            )}

            {/* Price */}
            <div className="border-t border-b border-gray-100 py-4 sm:py-6 mb-6">
              <div className="flex items-baseline gap-3">
                {discountPercent > 0 && (
                  <span className="text-2xl font-black text-red-500">{discountPercent}%</span>
                )}
                <span className="text-3xl font-black text-black">{formatPrice(product.sale_price)}</span>
              </div>
              {product.original_price !== product.sale_price && (
                <p className="text-sm text-gray-400 line-through mt-1">{formatPrice(product.original_price)}</p>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-sm text-gray-500 leading-relaxed mb-6">{product.description}</p>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-semibold text-gray-700">수량</span>
              <div className="flex items-center border border-gray-200 rounded-lg">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-11 h-11 flex items-center justify-center text-gray-500 hover:text-black transition-colors">−</button>
                <span className="w-10 text-center text-sm font-bold">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-11 h-11 flex items-center justify-center text-gray-500 hover:text-black transition-colors">+</button>
              </div>
              <span className="text-sm text-gray-400 ml-auto">{formatPrice(product.sale_price * quantity)}</span>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-auto">
              <button
                onClick={() => addItem(product, quantity)}
                className="flex-1 py-4 bg-black text-white font-bold rounded-xl text-sm hover:bg-gray-800 transition-colors active:scale-[0.98]"
              >
                장바구니 담기
              </button>
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`w-14 h-14 rounded-xl border flex items-center justify-center transition-colors ${wishlisted ? "bg-red-50 border-red-200 text-red-500" : "border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200"}`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill={wishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-20">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("detail")}
              className={`px-6 py-4 text-sm font-bold transition-colors relative ${activeTab === "detail" ? "text-black" : "text-gray-400 hover:text-gray-600"}`}
            >
              상세정보
              {activeTab === "detail" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />}
            </button>
            <button
              onClick={() => setActiveTab("review")}
              className={`px-6 py-4 text-sm font-bold transition-colors relative ${activeTab === "review" ? "text-black" : "text-gray-400 hover:text-gray-600"}`}
            >
              리뷰 ({reviews.length})
              {activeTab === "review" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />}
            </button>
          </div>

          {/* Detail Tab */}
          {activeTab === "detail" && (
            <div className="pt-8">
              {product.detail_images && product.detail_images.length > 0 ? (
                <div className="relative">
                  <div className={`overflow-hidden transition-all duration-500 ${!detailExpanded ? "max-h-[800px]" : ""}`}>
                    <div className="flex flex-col items-center gap-0">
                      {product.detail_images.map((img, idx) => (
                        <img key={idx} src={img} alt={`${product.name} 상세 ${idx + 1}`} className="w-full max-w-[800px]" loading="lazy" />
                      ))}
                    </div>
                  </div>
                  {!detailExpanded && product.detail_images.length > 0 && (
                    <div className="relative -mt-20">
                      <div className="h-20 bg-gradient-to-t from-white to-transparent" />
                      <div className="text-center pb-4">
                        <button
                          onClick={() => setDetailExpanded(true)}
                          className="inline-flex items-center gap-2 px-8 py-3 border border-gray-300 rounded-full text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          상세정보 더보기
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-sm text-gray-400">등록된 상세정보가 없습니다.</p>
                </div>
              )}
            </div>
          )}

          {/* Review Tab */}
          {activeTab === "review" && (
            <div className="pt-8">
              <div className="flex items-center gap-3 mb-8">
                <h2 className="text-xl font-black tracking-tight">리뷰</h2>
                <span className="text-sm text-gray-400">({reviews.length})</span>
                {reviews.length > 0 && (
                  <div className="flex items-center gap-1.5 ml-2">
                    <StarRating rating={avgRating} size={14} />
                    <span className="text-sm font-semibold">{avgRating.toFixed(1)}</span>
                  </div>
                )}
              </div>

              {authLoading ? (
                <div className="bg-[#fafafa] rounded-xl p-5 mb-8"><div className="h-20 bg-gray-100 rounded-lg animate-pulse" /></div>
              ) : member ? (
                <div className="bg-[#fafafa] rounded-xl p-5 sm:p-6 mb-8">
                  <p className="text-sm font-semibold mb-3">리뷰 작성</p>
                  <div className="mb-3">
                    <StarSelector value={reviewForm.rating} onChange={(v) => setReviewForm({ ...reviewForm, rating: v })} />
                  </div>
                  <textarea
                    value={reviewForm.content}
                    onChange={(e) => setReviewForm({ ...reviewForm, content: e.target.value })}
                    placeholder="상품에 대한 솔직한 리뷰를 작성해주세요."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black resize-none bg-white"
                  />
                  {reviewError && <p className="text-xs text-red-500 mt-1">{reviewError}</p>}
                  <button
                    onClick={handleSubmitReview}
                    disabled={submitting}
                    className="mt-3 px-6 py-2.5 bg-black text-white text-sm font-bold rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                  >
                    {submitting ? "등록 중..." : "리뷰 등록"}
                  </button>
                </div>
              ) : (
                <div className="bg-[#fafafa] rounded-xl p-5 mb-8 text-center">
                  <p className="text-sm text-gray-500">로그인 후 리뷰를 작성할 수 있습니다.</p>
                </div>
              )}

              {reviews.length > 0 ? (
                <div className="space-y-0 divide-y divide-gray-100">
                  {reviews.map((review) => (
                    <div key={review.id} className="py-5 first:pt-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                          {review.author_name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{review.author_name}</p>
                          <div className="flex items-center gap-2">
                            <StarRating rating={review.rating} size={12} />
                            <span className="text-[11px] text-gray-400">{new Date(review.created_at).toLocaleDateString("ko-KR")}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed ml-11">{review.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 text-center py-8">아직 리뷰가 없습니다.</p>
              )}
            </div>
          )}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="text-xl font-black tracking-tight mb-8">관련 상품</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
