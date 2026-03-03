import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { getMemberIdFromRequest, verifyPassword, hashPassword } from "@/lib/member-auth";

export async function GET(request: NextRequest) {
  const memberId = await getMemberIdFromRequest(request);
  if (!memberId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data } = await supabaseAdmin
    .from("members")
    .select("id, email, name, phone, address, status, created_at")
    .eq("id", memberId)
    .single();

  return NextResponse.json(data);
}

export async function PUT(request: NextRequest) {
  const memberId = await getMemberIdFromRequest(request);
  if (!memberId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, phone, address, currentPassword, newPassword } = await request.json();

  const updates: Record<string, string | null> = {};
  if (name) updates.name = name;
  if (phone !== undefined) updates.phone = phone || null;
  if (address !== undefined) updates.address = address || null;

  // Password change
  if (currentPassword && newPassword) {
    const { data: member } = await supabaseAdmin
      .from("members")
      .select("password_hash")
      .eq("id", memberId)
      .single();

    if (!member?.password_hash || !(await verifyPassword(currentPassword, member.password_hash))) {
      return NextResponse.json({ error: "현재 비밀번호가 올바르지 않습니다." }, { status: 400 });
    }

    updates.password_hash = await hashPassword(newPassword);
  }

  const { error } = await supabaseAdmin.from("members").update(updates).eq("id", memberId);

  if (error) return NextResponse.json({ error: "업데이트에 실패했습니다." }, { status: 500 });
  return NextResponse.json({ ok: true });
}
