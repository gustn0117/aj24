import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { getMemberIdFromRequest } from "@/lib/member-auth";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const memberId = await getMemberIdFromRequest(request);
  if (!memberId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: order } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq("id", params.id)
    .eq("member_id", memberId)
    .single();

  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { data: items } = await supabaseAdmin
    .from("order_items")
    .select("*")
    .eq("order_id", order.id);

  return NextResponse.json({ ...order, items: items || [] });
}
