import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") || "";
  const page = parseInt(request.nextUrl.searchParams.get("page") || "1");
  const limit = 20;
  const from = (page - 1) * limit;

  if (!q.trim()) {
    return NextResponse.json({ data: [], total: 0 });
  }

  const { data, count } = await supabaseAdmin
    .from("products")
    .select("*", { count: "exact" })
    .eq("is_active", true)
    .ilike("name", `%${q}%`)
    .order("sort_order")
    .range(from, from + limit - 1);

  return NextResponse.json({ data: data || [], total: count || 0 });
}
