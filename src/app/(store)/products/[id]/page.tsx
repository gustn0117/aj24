import { supabase } from "@/lib/supabase";
import { Product, Review, Category } from "@/lib/types";
import { notFound } from "next/navigation";
import ProductDetailClient from "@/components/ProductDetailClient";

export const revalidate = 60;

export default async function ProductPage({ params }: { params: { id: string } }) {
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", params.id)
    .eq("is_active", true)
    .single();

  if (!product) notFound();

  const [{ data: relatedProducts }, { data: reviews }, { data: categories }] = await Promise.all([
    supabase
      .from("products")
      .select("*")
      .eq("category", product.category)
      .neq("id", product.id)
      .eq("is_active", true)
      .limit(4),
    supabase
      .from("reviews")
      .select("*")
      .eq("product_id", product.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("sort_order"),
  ]);

  return (
    <ProductDetailClient
      product={product as Product}
      relatedProducts={(relatedProducts as Product[]) || []}
      reviews={(reviews as Review[]) || []}
      categories={(categories as Category[]) || []}
    />
  );
}
