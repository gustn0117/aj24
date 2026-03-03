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
    supabase
      .from("products")
      .select("*")
      .eq("section", "megahit")
      .eq("is_active", true)
      .order("sort_order"),
    supabase
      .from("products")
      .select("*")
      .eq("section", "recommend")
      .eq("is_active", true)
      .order("sort_order"),
    supabase
      .from("products")
      .select("*")
      .eq("section", "best")
      .eq("is_active", true)
      .order("sort_order"),
    supabase
      .from("banners")
      .select("*")
      .eq("is_active", true)
      .order("sort_order"),
    supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("sort_order"),
  ]);

  return (
    <main className="min-h-screen">
      <Header categories={(categories as Category[]) || []} />
      <HeroBanner banners={(banners as Banner[]) || []} />

      <ProductSection
        title="MAGAHIT GOODS"
        subtitle="매가히트 상품들을 만나보세요!"
        products={(megahitProducts as Product[]) || []}
      />

      <ProductSection
        title="RECOMMEND GOODS"
        subtitle="온오프마켓이 추천하는 인기 상품"
        products={(recommendProducts as Product[]) || []}
        bgColor="bg-gray-50"
      />

      <ProductSection
        title="BEST ITEMS"
        subtitle="가장 많이 사랑받는 베스트 아이템"
        products={(bestProducts as Product[]) || []}
      />

      <Footer />
    </main>
  );
}
