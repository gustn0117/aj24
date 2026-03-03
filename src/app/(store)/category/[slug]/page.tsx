import { supabase } from "@/lib/supabase";
import { Product, Category } from "@/lib/types";
import { notFound } from "next/navigation";
import CategoryPageClient from "@/components/CategoryPageClient";

export const revalidate = 60;

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  // Try slug first, then ID
  let category: Category | null = null;
  const { data: bySlug } = await supabase.from("categories").select("*").eq("slug", params.slug).eq("is_active", true).single();
  if (bySlug) {
    category = bySlug as Category;
  } else {
    const { data: byId } = await supabase.from("categories").select("*").eq("id", params.slug).eq("is_active", true).single();
    if (byId) category = byId as Category;
  }

  if (!category) notFound();

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("category", category.name)
    .eq("is_active", true)
    .order("sort_order");

  const { data: categories } = await supabase.from("categories").select("*").eq("is_active", true).order("sort_order");

  return (
    <CategoryPageClient
      category={category}
      products={(products as Product[]) || []}
      categories={(categories as Category[]) || []}
    />
  );
}
