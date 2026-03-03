import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import ProductSection from "@/components/ProductSection";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { Product, Banner, Category } from "@/lib/types";

export const revalidate = 60;

export default async function Home() {
  const [
    { data: megahitProducts },
    { data: recommendProducts },
    { data: bestProducts },
    { data: banners },
    { data: categories },
  ] = await Promise.all([
    supabase.from("products").select("*").eq("section", "megahit").eq("is_active", true).order("sort_order"),
    supabase.from("products").select("*").eq("section", "recommend").eq("is_active", true).order("sort_order"),
    supabase.from("products").select("*").eq("section", "best").eq("is_active", true).order("sort_order"),
    supabase.from("banners").select("*").eq("is_active", true).order("sort_order"),
    supabase.from("categories").select("*").eq("is_active", true).order("sort_order"),
  ]);

  const categoryIcons: Record<string, string> = {
    "신상품": "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
    "아우터": "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z",
    "상의": "M20 12v7a2 2 0 01-2 2H6a2 2 0 01-2-2v-7",
    "하의": "M12 2v20M2 12h20",
    "원피스/세트": "M4 4h16v16H4z",
    "신발": "M2 12s4-8 10-8 10 8 10 8-4 8-10 8-10-8-10-8z",
    "가방": "M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z",
    "양말/속옷": "M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z",
    "패션잡화": "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    "SALE": "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
  };

  return (
    <main className="min-h-screen bg-white">
      <Header categories={(categories as Category[]) || []} />
      <HeroBanner banners={(banners as Banner[]) || []} />

      {/* Category Quick Links */}
      <section className="py-8 md:py-12 border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 sm:gap-4">
            {(categories as Category[] || []).slice(0, 10).map((cat) => (
              <a key={cat.id} href="#" className="flex flex-col items-center gap-2 group py-2">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-50 group-hover:bg-gray-900 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400 group-hover:text-white transition-colors">
                    <path d={categoryIcons[cat.name] || "M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"} />
                  </svg>
                </div>
                <span className="text-[10px] sm:text-[11px] font-medium text-gray-500 group-hover:text-gray-900 transition-colors text-center leading-tight">{cat.name}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <ProductSection
        title="MEGA HIT"
        subtitle="지금 가장 핫한 아이템"
        products={(megahitProducts as Product[]) || []}
      />

      {/* Mid promotion banner */}
      <section className="py-4 md:py-8">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative overflow-hidden rounded-2xl bg-gray-900 p-8 md:p-10 text-white group cursor-pointer min-h-[220px] flex items-end">
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent" />
              <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-bl from-rose-500/20 to-transparent" />
              <div className="relative z-10">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-rose-300 mb-3">New Season</p>
                <h3 className="text-2xl md:text-3xl font-black mb-2 leading-tight">2026 S/S<br/>컬렉션</h3>
                <p className="text-sm text-gray-400 mb-5">봄 신상품 최대 40% 할인</p>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-white border border-white/20 px-4 py-2 rounded-full group-hover:bg-white group-hover:text-gray-900 transition-all">
                  VIEW MORE
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                </span>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-2xl bg-stone-100 p-8 md:p-10 group cursor-pointer min-h-[220px] flex items-end">
              <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-stone-200/80 to-transparent" />
              <div className="relative z-10">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-400 mb-3">Premium</p>
                <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-2 leading-tight">프리미엄<br/>가죽 컬렉션</h3>
                <p className="text-sm text-gray-500 mb-5">장인이 만든 이태리 가죽</p>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-gray-900 border border-gray-900/20 px-4 py-2 rounded-full group-hover:bg-gray-900 group-hover:text-white transition-all">
                  SHOP NOW
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ProductSection
        title="STAFF PICK"
        subtitle="AJ24 스태프가 추천하는 아이템"
        products={(recommendProducts as Product[]) || []}
        bgColor="bg-stone-50"
      />

      {/* Brand story strip */}
      <section className="py-20 md:py-28 bg-gray-950 text-white overflow-hidden relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-px h-full bg-white/[0.03]" />
          <div className="absolute top-0 left-2/4 w-px h-full bg-white/[0.03]" />
          <div className="absolute top-0 left-3/4 w-px h-full bg-white/[0.03]" />
        </div>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 text-center relative z-10">
          <p className="text-[10px] uppercase tracking-[0.4em] text-gray-600 mb-6 font-medium">About AJ24</p>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6 leading-[1.1]">
            스타일을 완성하는 곳
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto text-sm md:text-base leading-relaxed">
            트렌디한 패션 아이템부터 데일리 베이직까지,<br className="hidden sm:block" />
            AJ24에서 당신만의 스타일을 찾아보세요.
          </p>
          <div className="flex justify-center gap-10 md:gap-20 mt-14">
            {[
              { num: "500+", label: "상품 수" },
              { num: "50K+", label: "고객 수" },
              { num: "4.8", label: "평균 평점" },
              { num: "99%", label: "만족도" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-3xl md:text-5xl font-black tracking-tight">{s.num}</p>
                <p className="text-[10px] text-gray-600 mt-2 uppercase tracking-wider font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ProductSection
        title="BEST SELLERS"
        subtitle="가장 많이 사랑받는 아이템"
        products={(bestProducts as Product[]) || []}
      />

      <Footer />
    </main>
  );
}
