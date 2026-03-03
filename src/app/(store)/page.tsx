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

      <Footer />
    </main>
  );
}
