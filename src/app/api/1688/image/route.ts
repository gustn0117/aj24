import { NextRequest, NextResponse } from "next/server";

const ALLOWED_DOMAINS = [
  "cbu01.alicdn.com",
  "cbu02.alicdn.com",
  "cbu03.alicdn.com",
  "cbu04.alicdn.com",
  "img.alicdn.com",
  "gw.alicdn.com",
  "sc01.alicdn.com",
  "sc02.alicdn.com",
  "sc04.alicdn.com",
];

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  try {
    const parsed = new URL(url);
    const isAllowed = ALLOWED_DOMAINS.some((d) => parsed.hostname === d || parsed.hostname.endsWith("." + d));

    if (!isAllowed) {
      return NextResponse.json({ error: "Domain not allowed" }, { status: 403 });
    }

    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Referer: "https://www.1688.com/",
        Accept: "image/*,*/*;q=0.8",
      },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch image" }, { status: 502 });
    }

    const contentType = res.headers.get("content-type") || "image/jpeg";
    const buffer = await res.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }
}
