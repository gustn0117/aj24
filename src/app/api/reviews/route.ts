import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { getMemberIdFromRequest } from "@/lib/member-auth";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");
  if (!productId) return NextResponse.json({ error: "productId required" }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from("reviews")
    .select("*")
    .eq("product_id", productId)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function POST(request: NextRequest) {
  const memberId = await getMemberIdFromRequest(request);
  if (!memberId) return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });

  const body = await request.json();
  const { productId, rating, content } = body;

  if (!productId || !rating || !content) {
    return NextResponse.json({ error: "필수 항목을 입력해주세요." }, { status: 400 });
  }
  if (rating < 1 || rating > 5) {
    return NextResponse.json({ error: "별점은 1~5 사이여야 합니다." }, { status: 400 });
  }

  const { data: member } = await supabaseAdmin.from("members").select("name").eq("id", memberId).single();
  if (!member) return NextResponse.json({ error: "회원 정보를 찾을 수 없습니다." }, { status: 404 });

  const { data, error } = await supabaseAdmin.from("reviews").insert({
    product_id: productId,
    member_id: memberId,
    author_name: member.name,
    rating,
    content,
    is_admin_created: false,
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
