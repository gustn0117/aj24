import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import ProductSection from "@/components/ProductSection";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { Product, Banner, Category } from "@/lib/types";

export const revalidate = 60;

export default async function Home() {
  const [{ data: banners }, { data: categories }, { data: allProducts }, { data: bestProducts }] = await Promise.all([
    supabase.from("banners").select("*").eq("is_active", true).order("sort_order"),
    supabase.from("categories").select("*").eq("is_active", true).order("sort_order"),
    supabase.from("products").select("*").eq("is_active", true).order("created_at", { ascending: false }).limit(8),
    supabase.from("products").select("*").eq("is_active", true).order("rating", { ascending: false }).limit(8),
  ]);

  const activeCategories = (categories as Category[]) || [];

  const categoryProducts = await Promise.all(
    activeCategories.map((cat) =>
      supabase
        .from("products")
        .select("*")
        .eq("category", cat.name)
        .eq("is_active", true)
        .order("sort_order")
        .limit(8)
    )
  );

  return (
    <main className="min-h-screen bg-white">
      <Header categories={activeCategories} />
      <HeroBanner banners={(banners as Banner[]) || []} />

      <ProductSection
        title="NEW ARRIVALS"
        subtitle="새로 입고된 상품"
        products={(allProducts as Product[]) || []}
      />

      <ProductSection
        title="BEST"
        subtitle="가장 인기 있는 상품"
        products={(bestProducts as Product[]) || []}
        bgColor="bg-[#fafafa]"
      />

      {activeCategories.map((cat, i) => (
        <ProductSection
          key={cat.id}
          title={cat.name}
          products={(categoryProducts[i]?.data as Product[]) || []}
          bgColor={i % 2 === 0 ? "bg-white" : "bg-[#fafafa]"}
          linkHref={`/category/${cat.slug || cat.id}`}
        />
      ))}

      <Footer />
    </main>
  );
}
