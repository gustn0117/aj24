import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { getMemberIdFromRequest } from "@/lib/member-auth";

export async function GET(request: NextRequest) {
  const memberId = await getMemberIdFromRequest(request);
  if (!memberId) {
    return NextResponse.json(null, { status: 401 });
  }

  const { data: member } = await supabaseAdmin
    .from("members")
    .select("id, email, name, phone, address, status, created_at")
    .eq("id", memberId)
    .single();

  if (!member) {
    return NextResponse.json(null, { status: 401 });
  }

  return NextResponse.json(member);
}
