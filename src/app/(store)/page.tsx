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

      <ProductSection
        title="BEST SELLERS"
        subtitle="가장 많이 사랑받는 아이템"
        products={(bestProducts as Product[]) || []}
      />

      <Footer />
    </main>
  );
}
