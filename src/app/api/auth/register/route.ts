import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { hashPassword, createMemberToken } from "@/lib/member-auth";

export async function POST(request: Request) {
  try {
    const { name, email, password, phone } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "이름, 이메일, 비밀번호는 필수입니다." }, { status: 400 });
    }
    if (password.length < 4) {
      return NextResponse.json({ error: "비밀번호는 4자 이상이어야 합니다." }, { status: 400 });
    }

    const { data: existing } = await supabaseAdmin
      .from("members")
      .select("id")
      .eq("email", email)
      .single();

    if (existing) {
      return NextResponse.json({ error: "이미 등록된 이메일입니다." }, { status: 409 });
    }

    const password_hash = await hashPassword(password);

    const { data: member, error } = await supabaseAdmin
      .from("members")
      .insert({ name, email, password_hash, phone: phone || null, status: "active" })
      .select("id, email, name, phone, address, status, created_at")
      .single();

    if (error) {
      return NextResponse.json({ error: "회원가입에 실패했습니다." }, { status: 500 });
    }

    const token = await createMemberToken(member.id);
    const res = NextResponse.json(member);
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
