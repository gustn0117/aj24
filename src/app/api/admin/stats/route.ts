import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { verifyAdmin } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [products, banners, categories, orders, members, pendingOrders, revenue] =
    await Promise.all([
      supabaseAdmin.from("products").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("banners").select("*", { count: "exact", head: true }).eq("is_active", true),
      supabaseAdmin.from("categories").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("orders").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("members").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("orders").select("*", { count: "exact", head: true }).eq("status", "pending"),
      supabaseAdmin.from("orders").select("total_amount"),
    ]);

  const totalRevenue = (revenue.data || []).reduce((sum, o) => sum + o.total_amount, 0);

  return NextResponse.json({
    products: products.count || 0,
    banners: banners.count || 0,
    categories: categories.count || 0,
    orders: orders.count || 0,
    members: members.count || 0,
    pendingOrders: pendingOrders.count || 0,
    totalRevenue,
  });
}
