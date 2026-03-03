import { supabase } from "@/lib/supabase";
import { Product } from "@/lib/types";
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

  const { data: relatedProducts } = await supabase
    .from("products")
    .select("*")
    .eq("category", product.category)
    .neq("id", product.id)
    .eq("is_active", true)
    .limit(4);

  return <ProductDetailClient product={product as Product} relatedProducts={(relatedProducts as Product[]) || []} />;
}
