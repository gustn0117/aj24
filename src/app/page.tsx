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

  return (
    <main className="min-h-screen bg-white">
      <Header categories={(categories as Category[]) || []} />
      <HeroBanner banners={(banners as Banner[]) || []} />

      {/* Trust badges */}
      <section className="border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
            {[
              { icon: "M5 12h14M12 5l7 7-7 7", title: "무료배송", desc: "5만원 이상" },
              { icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15", title: "무료반품", desc: "14일 이내" },
              { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", title: "안전결제", desc: "SSL 보안" },
              { icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", title: "빠른배송", desc: "당일발송" },
            ].map((item) => (
              <div key={item.title} className="flex items-center gap-3 py-5 md:py-6 px-4 md:justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d={item.icon} />
                </svg>
                <div>
                  <p className="text-xs font-bold text-gray-900">{item.title}</p>
                  <p className="text-[10px] text-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Quick Links */}
      <section className="py-10 md:py-14">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-black">카테고리</h2>
          </div>
          <div className="flex gap-3 overflow-x-auto scroll-x-section pb-2">
            {(categories as Category[] || []).slice(0, 10).map((cat, idx) => (
              <a key={cat.id} href="#" className="flex flex-col items-center gap-2.5 group min-w-[72px]">
                <div className="w-16 h-16 rounded-full bg-[#f5f5f5] group-hover:bg-black flex items-center justify-center transition-all duration-300 group-hover:scale-105">
                  <span className="text-lg group-hover:text-white transition-colors">
                    {["✨","🧥","👕","👖","👗","👟","👜","🧦","💍","🏷️"][idx] || "🏷️"}
                  </span>
                </div>
                <span className="text-[11px] font-medium text-gray-500 group-hover:text-black transition-colors text-center whitespace-nowrap">{cat.name}</span>
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

      {/* Promotion banners */}
      <section className="py-4 md:py-8">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {/* Dark banner */}
            <div className="relative overflow-hidden rounded-2xl bg-black p-8 md:p-10 text-white group cursor-pointer min-h-[260px] flex flex-col justify-between noise-bg">
              <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-bl from-rose-500/15 via-transparent to-transparent" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 border border-white/10 rounded-full text-[10px] font-semibold uppercase tracking-widest text-rose-300 mb-4">
                  <span className="w-1 h-1 bg-rose-400 rounded-full" />
                  New Season
                </div>
                <h3 className="text-3xl md:text-4xl font-black leading-[1.05] tracking-tight">2026 S/S<br/>컬렉션</h3>
              </div>
              <div className="relative z-10 flex items-center justify-between">
                <p className="text-sm text-gray-500">봄 신상품 최대 40% 할인</p>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-white border border-white/15 px-4 py-2 rounded-full group-hover:bg-white group-hover:text-black transition-all">
                  VIEW MORE
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                </span>
              </div>
            </div>

            {/* Light banner */}
            <div className="relative overflow-hidden rounded-2xl bg-[#f5f0eb] p-8 md:p-10 group cursor-pointer min-h-[260px] flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#e8dfd5]/80 to-transparent" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 border border-black/10 rounded-full text-[10px] font-semibold uppercase tracking-widest text-stone-500 mb-4">
                  <span className="w-1 h-1 bg-stone-400 rounded-full" />
                  Premium
                </div>
                <h3 className="text-3xl md:text-4xl font-black text-black leading-[1.05] tracking-tight">프리미엄<br/>가죽 컬렉션</h3>
              </div>
              <div className="relative z-10 flex items-center justify-between">
                <p className="text-sm text-gray-500">장인이 만든 이태리 가죽</p>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-black border border-black/15 px-4 py-2 rounded-full group-hover:bg-black group-hover:text-white transition-all">
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
        bgColor="bg-[#fafafa]"
      />

      {/* Lookbook / Horizontal scroll */}
      <section className="py-16 md:py-20 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-medium mb-1">Lookbook</p>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-black">STYLE GUIDE</h2>
            </div>
            <button className="text-xs font-semibold text-gray-400 hover:text-black transition-colors">VIEW ALL</button>
          </div>
        </div>
        <div className="flex gap-3 md:gap-4 pl-4 sm:pl-[max(1.5rem,calc((100vw-1400px)/2+1.5rem))] scroll-x-section">
          {[
            { title: "Street Casual", color: "from-zinc-800 to-zinc-900" },
            { title: "Minimal Basic", color: "from-stone-300 to-stone-400" },
            { title: "Modern Office", color: "from-slate-700 to-slate-800" },
            { title: "Weekend Mood", color: "from-amber-100 to-orange-100" },
            { title: "Night Out", color: "from-gray-900 to-black" },
          ].map((look) => (
            <div key={look.title} className="relative w-[240px] md:w-[280px] aspect-[3/4] rounded-xl overflow-hidden group cursor-pointer flex-shrink-0">
              <div className={`absolute inset-0 bg-gradient-to-br ${look.color}`} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="text-white font-bold text-sm mb-1">{look.title}</p>
                <p className="text-white/50 text-xs">12 아이템</p>
              </div>
              <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            </div>
          ))}
          <div className="w-4 flex-shrink-0" />
        </div>
      </section>

      {/* Brand story */}
      <section className="py-24 md:py-32 bg-black text-white overflow-hidden relative noise-bg">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-[20%] w-px h-full bg-white/[0.03]" />
          <div className="absolute top-0 left-[40%] w-px h-full bg-white/[0.03]" />
          <div className="absolute top-0 left-[60%] w-px h-full bg-white/[0.03]" />
          <div className="absolute top-0 left-[80%] w-px h-full bg-white/[0.03]" />
        </div>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-gray-600 mb-4 font-medium">About AJ24</p>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] mb-6">
                스타일을<br/>완성하는 곳
              </h2>
              <p className="text-gray-500 text-sm md:text-base leading-relaxed max-w-md mb-8">
                트렌디한 패션 아이템부터 데일리 베이직까지, AJ24에서 당신만의 스타일을 찾아보세요. 엄선된 브랜드와 합리적인 가격으로 패션의 즐거움을 경험하세요.
              </p>
              <button className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-white rounded-full text-sm font-bold hover:bg-white hover:text-black transition-all">
                ABOUT US
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-6 md:gap-8">
              {[
                { num: "500+", label: "상품 수", desc: "엄선된 패션 아이템" },
                { num: "50K+", label: "고객 수", desc: "만족한 고객" },
                { num: "4.8", label: "평균 평점", desc: "별점 만점 가까이" },
                { num: "99%", label: "만족도", desc: "재구매율" },
              ].map((s) => (
                <div key={s.label} className="border border-white/[0.06] rounded-xl p-5 md:p-6 hover-lift">
                  <p className="text-3xl md:text-4xl font-black tracking-tight mb-1">{s.num}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-1">{s.label}</p>
                  <p className="text-xs text-gray-600">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ProductSection
        title="BEST SELLERS"
        subtitle="가장 많이 사랑받는 아이템"
        products={(bestProducts as Product[]) || []}
      />

      {/* Instagram / Social proof */}
      <section className="py-16 md:py-20 bg-[#fafafa]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 text-center mb-8">
          <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-medium mb-1">@aj24_official</p>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-black">#AJ24STYLE</h2>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-1 md:gap-1.5 max-w-[1400px] mx-auto px-4 sm:px-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-square bg-gray-200 rounded-lg overflow-hidden group cursor-pointer relative">
              <div className={`w-full h-full bg-gradient-to-br ${
                ["from-rose-100 to-rose-200", "from-stone-200 to-stone-300", "from-sky-100 to-sky-200", "from-amber-100 to-amber-200", "from-violet-100 to-violet-200", "from-emerald-100 to-emerald-200"][i]
              }`} />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white" className="opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth="0">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
