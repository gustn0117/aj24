import { NextRequest, NextResponse } from "next/server";
import { createSessionToken } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  const { password } = await request.json();

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "비밀번호가 일치하지 않습니다." }, { status: 401 });
  }

  const token = createSessionToken();
  const response = NextResponse.json({ success: true });
  response.cookies.set("admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 86400,
    path: "/",
  });

  return response;
}
