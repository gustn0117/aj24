"use client";

import { useState, useEffect } from "react";
import { Product1688 } from "@/lib/types";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useParams, useRouter } from "next/navigation";

function formatKRW(price: number) {
  return price.toLocaleString("ko-KR") + "원";
}

function formatCNY(price: number) {
  return "¥" + price.toFixed(2);
}

export default function Product1688Page() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [product, setProduct] = useState<Product1688 | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [requestSent, setRequestSent] = useState(false);

  useEffect(() => {
    if (!id) return;
    try {
      const cached = sessionStorage.getItem(`1688_product_${id}`);
      if (cached) {
        const parsed = JSON.parse(cached) as Product1688;
        setProduct(parsed);
        if (parsed.minOrder && parsed.minOrder > 1) {
          setQuantity(parsed.minOrder);
        }
      }
    } catch {}
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <Header categories={[]} />
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
            <div className="aspect-square bg-gray-100 rounded-2xl animate-pulse" />
            <div className="space-y-4">
              <div className="h-4 bg-gray-100 rounded w-1/3 animate-pulse" />
              <div className="h-8 bg-gray-100 rounded w-3/4 animate-pulse" />
              <div className="h-6 bg-gray-100 rounded w-1/2 animate-pulse" />
              <div className="h-32 bg-gray-100 rounded animate-pulse mt-8" />
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-white">
        <Header categories={[]} />
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-20 text-center">
          <p className="text-lg font-semibold text-gray-400 mb-2">
            상품 정보를 찾을 수 없습니다
          </p>
          <p className="text-sm text-gray-400 mb-6">
            검색 페이지에서 상품을 다시 선택해주세요
          </p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-black transition-colors"
          >
            뒤로 가기
          </button>
        </div>
        <Footer />
      </main>
    );
  }

  const productUrl = `https://detail.1688.com/offer/${id}.html`;

  return (
    <main className="min-h-screen bg-white">
      <Header categories={[]} />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
          {/* Image */}
          <div>
            <div className="aspect-square bg-[#f5f5f5] rounded-2xl overflow-hidden">
              {product.imageUrl && (
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="w-full h-full object-contain"
                />
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            {/* 1688 Badge */}
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-0.5 bg-orange-500 text-white text-[10px] font-bold rounded">
                1688
              </span>
              {product.supplierName && (
                <span className="text-xs text-gray-400">
                  {product.supplierName}
                </span>
              )}
            </div>

            <h1 className="text-xl md:text-2xl font-black text-black tracking-tight mb-1">
              {product.title}
            </h1>
            <p className="text-xs text-gray-400 mb-6">
              {product.titleOriginal}
            </p>

            {/* Price */}
            <div className="border-t border-b border-gray-100 py-4 sm:py-6 mb-6">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-black">
                  {formatKRW(product.priceKRW)}
                </span>
              </div>
              <p className="text-sm text-gray-400 mt-1">
                {formatCNY(product.priceCNY)}
              </p>
            </div>

            {/* Sales count */}
            {product.salesCount && (
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs text-orange-500 font-medium">
                  판매 {product.salesCount}
                </span>
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-semibold text-gray-700">수량</span>
              <div className="flex items-center border border-gray-200 rounded-lg">
                <button
                  onClick={() =>
                    setQuantity(Math.max(product.minOrder || 1, quantity - 1))
                  }
                  className="w-11 h-11 flex items-center justify-center text-gray-500 hover:text-black transition-colors"
                >
                  −
                </button>
                <span className="w-12 text-center text-sm font-bold">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-11 h-11 flex items-center justify-center text-gray-500 hover:text-black transition-colors"
                >
                  +
                </button>
              </div>
              {product.minOrder && product.minOrder > 1 && (
                <span className="text-xs text-gray-400">
                  최소 {product.minOrder}개
                </span>
              )}
              <span className="text-sm text-gray-400 ml-auto font-medium">
                총 {formatKRW(product.priceKRW * quantity)}
              </span>
            </div>

            {/* Info notice */}
            <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 mb-6">
              <p className="text-xs text-orange-700 leading-relaxed">
                본 상품은 중국 1688.com에서 판매되는 상품입니다. 구매대행
                신청 시 실제 가격, 옵션, 배송비 등이 다를 수 있으며 관리자
                확인 후 안내드립니다.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-auto">
              {!requestSent ? (
                <button
                  onClick={() => setRequestSent(true)}
                  className="flex-1 py-4 bg-orange-500 text-white font-bold rounded-xl text-sm hover:bg-orange-600 transition-colors active:scale-[0.98]"
                >
                  구매대행 신청
                </button>
              ) : (
                <div className="flex-1 py-4 bg-green-50 border border-green-200 text-green-700 font-bold rounded-xl text-sm text-center">
                  신청이 접수되었습니다
                </div>
              )}
              <a
                href={productUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:text-orange-500 hover:border-orange-200 transition-colors"
                title="1688에서 보기"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
