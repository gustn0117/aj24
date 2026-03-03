import { NextRequest, NextResponse } from "next/server";

async function verifyHmacToken(token: string, secret: string, maxAgeMs: number): Promise<boolean> {
  const parts = token.split(":");
  if (parts.length < 2) return false;

  const hmac = parts[parts.length - 1];
  const payload = parts.slice(0, parts.length - 1).join(":");
  const timestampStr = parts.length === 3 ? parts[1] : parts[0];

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  const expected = Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  if (hmac !== expected) return false;
  const age = Date.now() - parseInt(timestampStr);
  return age < maxAgeMs;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin route protection
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const token = request.cookies.get("admin_session")?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    const secret = process.env.ADMIN_SESSION_SECRET || "default-secret-change-me-32chars!!";
    const valid = await verifyHmacToken(token, secret, 24 * 60 * 60 * 1000);
    if (!valid) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // Member route protection (mypage, checkout)
  if (pathname.startsWith("/mypage") || pathname.startsWith("/checkout")) {
    const token = request.cookies.get("member_session")?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    const secret = process.env.MEMBER_SESSION_SECRET || "default-member-secret-32chars!!";
    const valid = await verifyHmacToken(token, secret, 7 * 24 * 60 * 60 * 1000);
    if (!valid) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/mypage/:path*", "/checkout/:path*"],
};
