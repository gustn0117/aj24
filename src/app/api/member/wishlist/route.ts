import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { getMemberIdFromRequest } from "@/lib/member-auth";

export async function GET(request: NextRequest) {
  const memberId = await getMemberIdFromRequest(request);
  if (!memberId) return NextResponse.json([], { status: 401 });

  const { data } = await supabaseAdmin
    .from("wishlists")
    .select("product_id")
    .eq("member_id", memberId);

  return NextResponse.json(data || []);
}

export async function POST(request: NextRequest) {
  const memberId = await getMemberIdFromRequest(request);
  if (!memberId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { productId } = await request.json();
  await supabaseAdmin.from("wishlists").upsert({ member_id: memberId, product_id: productId }, { onConflict: "member_id,product_id" });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: NextRequest) {
  const memberId = await getMemberIdFromRequest(request);
  if (!memberId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const productId = request.nextUrl.searchParams.get("productId");
  if (!productId) return NextResponse.json({ error: "Missing productId" }, { status: 400 });

  await supabaseAdmin.from("wishlists").delete().eq("member_id", memberId).eq("product_id", productId);
  return NextResponse.json({ ok: true });
}
