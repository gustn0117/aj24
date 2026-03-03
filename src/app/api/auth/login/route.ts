import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { verifyPassword, createMemberToken } from "@/lib/member-auth";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "이메일과 비밀번호를 입력해주세요." }, { status: 400 });
    }

    const { data: member } = await supabaseAdmin
      .from("members")
      .select("*")
      .eq("email", email)
      .single();

    if (!member || !member.password_hash) {
      return NextResponse.json({ error: "이메일 또는 비밀번호가 올바르지 않습니다." }, { status: 401 });
    }

    if (member.status !== "active") {
      return NextResponse.json({ error: "비활성화된 계정입니다." }, { status: 403 });
    }

    const valid = await verifyPassword(password, member.password_hash);
    if (!valid) {
      return NextResponse.json({ error: "이메일 또는 비밀번호가 올바르지 않습니다." }, { status: 401 });
    }

    const token = await createMemberToken(member.id);
    const { password_hash: _, ...publicMember } = member;
    const res = NextResponse.json({
      id: publicMember.id,
      email: publicMember.email,
      name: publicMember.name,
      phone: publicMember.phone,
      address: publicMember.address,
      status: publicMember.status,
      created_at: publicMember.created_at,
    });
    res.cookies.set("member_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });
    return res;
  } catch {
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
