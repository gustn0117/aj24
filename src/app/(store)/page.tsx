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
