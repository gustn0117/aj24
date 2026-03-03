import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import ProductSection from "@/components/ProductSection";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { Product, Banner, Category } from "@/lib/types";

export const revalidate = 60;

export default async function Home() {
  const [{ data: banners }, { data: categories }] = await Promise.all([
    supabase.from("banners").select("*").eq("is_active", true).order("sort_order"),
    supabase.from("categories").select("*").eq("is_active", true).order("sort_order"),
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

      {activeCategories.map((cat, i) => (
        <ProductSection
          key={cat.id}
          title={cat.name}
          products={(categoryProducts[i]?.data as Product[]) || []}
          bgColor={i % 2 === 1 ? "bg-[#fafafa]" : "bg-white"}
          linkHref={`/category/${cat.slug || cat.id}`}
        />
      ))}

      <Footer />
    </main>
  );
}
