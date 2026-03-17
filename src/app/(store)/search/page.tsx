"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, useMemo, Suspense } from "react";
import { Product, Product1688 } from "@/lib/types";
import ProductCard from "@/components/ProductCard";
import Product1688Card from "@/components/Product1688Card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type SortType = "default" | "price_asc" | "price_desc" | "rating";
type SourceTab = "local" | "1688";

const sortOptions: { value: SortType; label: string }[] = [
  { value: "default", label: "추천순" },
  { value: "price_asc", label: "낮은 가격순" },
  { value: "price_desc", label: "높은 가격순" },
  { value: "rating", label: "평점순" },
];

const sort1688Options: { value: SortType; label: string }[] = [
  { value: "default", label: "추천순" },
  { value: "price_asc", label: "낮은 가격순" },
  { value: "price_desc", label: "높은 가격순" },
];

function SearchContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const initialSource = searchParams.get("source") as SourceTab | null;

  const [source, setSource] = useState<SourceTab>(initialSource === "1688" ? "1688" : "local");
  const [products, setProducts] = useState<Product[]>([]);
  const [products1688, setProducts1688] = useState<Product1688[]>([]);
  const [loading, setLoading] = useState(true);
  const [loading1688, setLoading1688] = useState(false);
  const [chineseQuery, setChineseQuery] = useState("");
  const [sort, setSort] = useState<SortType>("default");
  const [gender, setGender] = useState<"" | "남자" | "여자">("");
  const [fetched1688, setFetched1688] = useState(false);

  // Fetch local products
  useEffect(() => {
    if (!q) { setProducts([]); setLoading(false); return; }
    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(q)}`)
      .then((r) => r.json())
      .then(({ data }) => { setProducts(data || []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [q]);

  // Fetch 1688 products when tab is switched or query changes
  useEffect(() => {
    if (source !== "1688" || !q || fetched1688) return;
    setLoading1688(true);
    fetch(`/api/1688/search?q=${encodeURIComponent(q)}`)
      .then((r) => r.json())
      .then((res) => {
        setProducts1688(res.data || []);
        setChineseQuery(res.chineseQuery || "");
        setFetched1688(true);
      })
      .catch(() => {})
      .finally(() => setLoading1688(false));
  }, [source, q, fetched1688]);

  // Reset 1688 fetch state when query changes
  useEffect(() => {
    setFetched1688(false);
    setProducts1688([]);
  }, [q]);

  const filtered = useMemo(() => {
    let result = [...products];
    if (gender) result = result.filter((p) => p.gender === gender);
    switch (sort) {
      case "price_asc": return result.sort((a, b) => a.sale_price - b.sale_price);
      case "price_desc": return result.sort((a, b) => b.sale_price - a.sale_price);
      case "rating": return result.sort((a, b) => b.rating - a.rating);
      default: return result;
    }
  }, [products, sort, gender]);

  const sorted1688 = useMemo(() => {
    const result = [...products1688];
    switch (sort) {
      case "price_asc": return result.sort((a, b) => a.priceCNY - b.priceCNY);
      case "price_desc": return result.sort((a, b) => b.priceCNY - a.priceCNY);
      default: return result;
    }
  }, [products1688, sort]);

  const isLoading = source === "local" ? loading : loading1688;
  const isEmpty = source === "local" ? filtered.length === 0 : sorted1688.length === 0;

  return (
    <main className="min-h-screen bg-white">
      <Header categories={[]} />
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-10 md:py-16">
        {/* Title */}
        <div className="mb-6">
          <p className="text-sm text-gray-400 mb-1">검색 결과</p>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-black">&ldquo;{q}&rdquo;</h1>
          {source === "1688" && chineseQuery && (
            <p className="text-xs text-gray-400 mt-1">중국어 검색어: {chineseQuery}</p>
          )}
        </div>

        {/* Source Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => { setSource("local"); setSort("default"); }}
            className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
              source === "local"
                ? "bg-gray-900 text-white shadow-sm"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            자체 상품
            {!loading && <span className="ml-1.5 text-xs opacity-70">({products.length})</span>}
          </button>
          <button
            onClick={() => { setSource("1688"); setSort("default"); }}
            className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-1.5 ${
              source === "1688"
                ? "bg-orange-500 text-white shadow-sm"
                : "bg-orange-50 text-orange-600 hover:bg-orange-100"
            }`}
          >
            <span className="text-[10px] font-black px-1 py-0.5 rounded bg-white/20">1688</span>
            소싱
            {fetched1688 && <span className="text-xs opacity-70">({products1688.length})</span>}
          </button>
        </div>

        {/* Filter Bar */}
        {!isLoading && !isEmpty && (
          <div className="flex flex-col gap-3 mb-8 sm:flex-row sm:items-center sm:justify-between">
            {source === "local" && (
              <div className="flex gap-1.5">
                {(["", "남자", "여자"] as const).map((g) => (
                  <button key={g} onClick={() => setGender(g)}
                    className={`px-4 py-2 text-[13px] rounded-full font-semibold transition-all ${gender === g ? "bg-black text-white shadow-sm" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                    {g || "전체"}
                  </button>
                ))}
              </div>
            )}
            {source === "1688" && <div />}
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
              {(source === "1688" ? sort1688Options : sortOptions).map((opt) => (
                <button key={opt.value} onClick={() => setSort(opt.value)}
                  className={`px-3.5 py-2 text-[12px] rounded-full font-medium whitespace-nowrap transition-all ${sort === opt.value ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600"}`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className={`${source === "1688" ? "aspect-square" : "aspect-[3/4]"} bg-gray-100 rounded-lg mb-3`} />
                <div className="h-3 bg-gray-100 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : !isEmpty ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-5 sm:gap-y-10">
            {source === "local"
              ? filtered.map((product) => <ProductCard key={product.id} product={product} />)
              : sorted1688.map((product) => <Product1688Card key={product.id} product={product} />)
            }
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg font-semibold mb-2">
              {source === "1688" ? "1688 검색 결과가 없습니다" : "검색 결과가 없습니다"}
            </p>
            <p className="text-sm">
              {source === "1688"
                ? "다른 키워드로 검색하거나, 1688.com에서 직접 검색해보세요"
                : "다른 키워드로 검색해보세요"
              }
            </p>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchContent />
    </Suspense>
  );
}
