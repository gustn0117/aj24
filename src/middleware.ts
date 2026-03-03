import { NextRequest, NextResponse } from "next/server";

async function verifyToken(token: string, secret: string): Promise<boolean> {
  const [timestamp, hmac] = token.split(":");
  if (!timestamp || !hmac) return false;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(timestamp));
  const expected = Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  if (hmac !== expected) return false;
  const age = Date.now() - parseInt(timestamp);
  return age < 24 * 60 * 60 * 1000;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const token = request.cookies.get("admin_session")?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    const secret = process.env.ADMIN_SESSION_SECRET || "default-secret-change-me-32chars!!";
    const valid = await verifyToken(token, secret);
    if (!valid) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
