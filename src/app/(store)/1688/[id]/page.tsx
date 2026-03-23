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
function proxyImage(url: string) {
  if (!url) return "";
  return `/api/1688/image?url=${encodeURIComponent(url)}`;
}

interface ApiData {
  source?: string;
  title?: string;
  images?: string[];
  skuOptions?: { name: string; values: { name: string; imageUrl?: string }[] }[];
  priceRange?: { price: string; startQuantity: number }[];
  minOrder?: number | null;
  soldCount?: string | null;
  shopName?: string | null;
}

export default function Product1688Page() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [product, setProduct] = useState<Product1688 | null>(null);
  const [apiData, setApiData] = useState<ApiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [apiLoading, setApiLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [requestSent, setRequestSent] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (!id) return;
    try {
      const cached = sessionStorage.getItem(`1688_product_${id}`);
      if (cached) {
        const parsed = JSON.parse(cached) as Product1688;
        setProduct(parsed);
        if (parsed.minOrder && parsed.minOrder > 1) setQuantity(parsed.minOrder);
      }
    } catch {}
    setLoading(false);

    setApiLoading(true);
    fetch(`/api/1688/product/${id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => { if (data && !data.error) setApiData(data); })
      .catch(() => {})
      .finally(() => setApiLoading(false));
  }, [id]);

  // Merge data: API data takes priority
  const title = apiData?.title || product?.title || "";
  const titleOriginal = product?.titleOriginal || "";
  const allImages = apiData?.images?.length ? apiData.images : product?.imageUrl ? [product.imageUrl] : [];
  const supplierName = apiData?.shopName || product?.supplierName || "";
  const soldCount = apiData?.soldCount || product?.salesCount || "";
  const minOrder = apiData?.minOrder || product?.minOrder || 1;

  // Price: prefer API price range, fall back to search price
  const priceCNY = apiData?.priceRange?.[0]?.price
    ? parseFloat(apiData.priceRange[0].price)
    : product?.priceCNY || 0;
  const priceKRW = product?.priceKRW || Math.round(priceCNY * 190);
  const productUrl = `https://detail.1688.com/offer/${id}.html`;

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

  if (!product && !apiData) {
    return (
      <main className="min-h-screen bg-white">
        <Header categories={[]} />
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-20 text-center">
          {apiLoading ? (
            <div className="space-y-4">
              <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm text-gray-400">상품 정보를 불러오는 중...</p>
            </div>
          ) : (
            <>
              <p className="text-lg font-semibold text-gray-400 mb-2">상품 정보를 찾을 수 없습니다</p>
              <p className="text-sm text-gray-400 mb-6">검색 페이지에서 상품을 다시 선택해주세요</p>
              <button onClick={() => router.back()} className="px-6 py-3 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-black transition-colors">뒤로 가기</button>
            </>
          )}
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <Header categories={[]} />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
          {/* ── Image Section ── */}
          <div>
            <div className="aspect-square bg-[#f5f5f5] rounded-2xl overflow-hidden mb-3">
              {allImages[selectedImage] ? (
                <img src={proxyImage(allImages[selectedImage])} alt={title} className="w-full h-full object-contain" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                  <svg width="64" height="64" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
                </div>
              )}
            </div>

            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${selectedImage === i ? "border-orange-500" : "border-transparent hover:border-gray-300"}`}
                  >
                    <img src={proxyImage(img)} alt="" className="w-full h-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Product Info ── */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-0.5 bg-orange-500 text-white text-[10px] font-bold rounded">1688</span>
              {supplierName && <span className="text-xs text-gray-400">{supplierName}</span>}
              {apiData?.source === "mtop" && (
                <span className="px-1.5 py-0.5 bg-green-100 text-green-600 text-[9px] font-medium rounded">상세 정보</span>
              )}
            </div>

            <h1 className="text-xl md:text-2xl font-black text-black tracking-tight mb-1">{title}</h1>
            {titleOriginal && <p className="text-xs text-gray-400 mb-4">{titleOriginal}</p>}

            {/* Price Section */}
            <div className="border-t border-b border-gray-100 py-4 sm:py-6 mb-4">
              {apiData?.priceRange && apiData.priceRange.length > 1 ? (
                <div className="space-y-2">
                  {apiData.priceRange.map((tier, i) => (
                    <div key={i} className="flex items-baseline justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className={`font-black text-black ${i === 0 ? "text-3xl" : "text-xl"}`}>
                          ¥{tier.price}
                        </span>
                        <span className="text-xs text-gray-400">
                          ({formatKRW(Math.round(parseFloat(tier.price) * 190))})
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                        {tier.startQuantity}개 이상
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-black">{formatKRW(priceKRW)}</span>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">{formatCNY(priceCNY)}</p>
                </>
              )}
            </div>

            {/* Sales & Min Order Info */}
            <div className="flex items-center gap-3 mb-4">
              {soldCount && (
                <span className="text-xs text-orange-500 font-medium">판매 {soldCount}개</span>
              )}
              {minOrder > 1 && (
                <span className="text-xs text-gray-400">최소주문 {minOrder}개</span>
              )}
            </div>

            {/* SKU Options */}
            {apiData?.skuOptions && apiData.skuOptions.length > 0 && (
              <div className="space-y-4 mb-6">
                {apiData.skuOptions.map((option, i) => (
                  <div key={i}>
                    <span className="text-sm font-semibold text-gray-700 mb-2 block">{option.name}</span>
                    <div className="flex flex-wrap gap-2">
                      {option.values.map((value, j) => (
                        <div key={j} className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg hover:border-orange-300 cursor-pointer transition-colors">
                          {value.imageUrl && (
                            <img src={proxyImage(value.imageUrl)} alt="" className="w-6 h-6 rounded object-cover" />
                          )}
                          <span className="text-xs text-gray-600">{value.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-semibold text-gray-700">수량</span>
              <div className="flex items-center border border-gray-200 rounded-lg">
                <button onClick={() => setQuantity(Math.max(minOrder, quantity - 1))} className="w-11 h-11 flex items-center justify-center text-gray-500 hover:text-black transition-colors">−</button>
                <span className="w-12 text-center text-sm font-bold">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-11 h-11 flex items-center justify-center text-gray-500 hover:text-black transition-colors">+</button>
              </div>
              <span className="text-sm text-gray-400 ml-auto font-medium">총 {formatKRW(priceKRW * quantity)}</span>
            </div>

            {/* Info notice */}
            <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 mb-6">
              <p className="text-xs text-orange-700 leading-relaxed">
                본 상품은 중국 1688.com에서 판매되는 상품입니다. 구매대행 신청 시 실제 가격, 옵션, 배송비 등이 다를 수 있으며 관리자 확인 후 안내드립니다.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-auto">
              {!requestSent ? (
                <button onClick={() => setRequestSent(true)} className="flex-1 py-4 bg-orange-500 text-white font-bold rounded-xl text-sm hover:bg-orange-600 transition-colors active:scale-[0.98]">
                  구매대행 신청
                </button>
              ) : (
                <div className="flex-1 py-4 bg-green-50 border border-green-200 text-green-700 font-bold rounded-xl text-sm text-center">
                  신청이 접수되었습니다
                </div>
              )}
              <a href={productUrl} target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:text-orange-500 hover:border-orange-200 transition-colors" title="1688에서 보기">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
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
