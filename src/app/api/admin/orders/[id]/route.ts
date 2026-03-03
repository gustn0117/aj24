import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { verifyAdmin } from "@/lib/admin-auth";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [order, items] = await Promise.all([
    supabaseAdmin.from("orders").select("*").eq("id", params.id).single(),
    supabaseAdmin.from("order_items").select("*").eq("order_id", params.id).order("id"),
  ]);

  if (order.error) return NextResponse.json({ error: order.error.message }, { status: 500 });
  return NextResponse.json({ order: order.data, items: items.data || [] });
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { data, error } = await supabaseAdmin.from("orders").update(body).eq("id", params.id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
