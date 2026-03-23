import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// ── 1688 Open API ──
const API_URL = "https://gw.open.1688.com/openapi";
const APP_KEY = process.env.ALI_APP_KEY || "";
const APP_SECRET = process.env.ALI_APP_SECRET || "";
const ACCESS_TOKEN = process.env.ALI_ACCESS_TOKEN || "";

function signOpenApi(urlPath: string, params: Record<string, string>): string {
  const sortedKeys = Object.keys(params).sort();
  let signStr = urlPath;
  for (const key of sortedKeys) signStr += key + params[key];
  return crypto.createHmac("sha1", APP_SECRET).update(signStr, "utf8").digest("hex").toUpperCase();
}

// ── 1688 Internal MTOP API ──
const MTOP_URL = "https://h5api.m.1688.com/h5/mtop.1688.mmga.offerdetail.service/1.0/";
const MTOP_APP_KEY = "12574478";
const MTOP_HEADERS = {
  "Content-Type": "application/x-www-form-urlencoded",
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
  Referer: "https://detail.1688.com/",
  Origin: "https://detail.1688.com",
};

let cachedToken = "";
let cachedCookies = "";
let tokenExpiry = 0;

function md5(str: string) {
  return crypto.createHash("md5").update(str).digest("hex");
}

function parseCookiesFromResponse(res: Response): string[] {
  const setCookies = res.headers.getSetCookie?.() || [];
  if (setCookies.length > 0) return setCookies;
  const raw = res.headers.get("set-cookie");
  return raw ? raw.split(/,(?=[^ ])/) : [];
}

async function getMtopToken(): Promise<{ token: string; cookies: string }> {
  if (cachedToken && Date.now() < tokenExpiry) {
    return { token: cachedToken, cookies: cachedCookies };
  }

  const t = String(Date.now());
  const data = "{}";
  const sign = md5(`&${t}&${MTOP_APP_KEY}&${data}`);
  const url = `${MTOP_URL}?jsv=2.7.4&appKey=${MTOP_APP_KEY}&t=${t}&sign=${sign}&api=mtop.1688.mmga.offerdetail.service&v=1.0&type=originaljson&dataType=json`;

  const res = await fetch(url, { method: "POST", headers: MTOP_HEADERS, body: `data=${encodeURIComponent(data)}` });
  await res.text(); // consume body

  const allCookies = parseCookiesFromResponse(res);
  let token = "";
  const parts: string[] = [];

  for (const sc of allCookies) {
    const m1 = sc.match(/_m_h5_tk=([^;]+)/);
    if (m1) { token = m1[1].split("_")[0]; parts.push(`_m_h5_tk=${m1[1]}`); }
    const m2 = sc.match(/_m_h5_tk_enc=([^;]+)/);
    if (m2) parts.push(`_m_h5_tk_enc=${m2[1]}`);
  }

  if (token) {
    cachedToken = token;
    cachedCookies = parts.join("; ");
    tokenExpiry = Date.now() + 25 * 60 * 1000;
  }
  return { token, cookies: parts.join("; ") };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function callMtop(offerId: string, token: string, cookies: string): Promise<any> {
  const t = String(Date.now());
  const data = JSON.stringify({ mmgaRequest: { serviceName: "offerReadFnService", offerIds: [Number(offerId)] } });
  const sign = md5(`${token}&${t}&${MTOP_APP_KEY}&${data}`);
  const url = `${MTOP_URL}?jsv=2.7.4&appKey=${MTOP_APP_KEY}&t=${t}&sign=${sign}&api=mtop.1688.mmga.offerdetail.service&v=1.0&type=originaljson&dataType=json`;
  const res = await fetch(url, { method: "POST", headers: { ...MTOP_HEADERS, Cookie: cookies }, body: `data=${encodeURIComponent(data)}` });
  return res.json();
}

interface ProductResult {
  source: string;
  id: string;
  title: string;
  images: string[];
  skuOptions: { name: string; values: { name: string; imageUrl?: string }[] }[];
  priceRange: { price: string; startQuantity: number }[];
  minOrder: number | null;
  soldCount: string | null;
  shopName: string | null;
}

async function fetchViaMtop(offerId: string): Promise<ProductResult | null> {
  try {
    let { token, cookies } = await getMtopToken();
    if (!token) return null;

    let json = await callMtop(offerId, token, cookies);

    // If token expired, get fresh token and retry
    if (json?.ret?.[0]?.includes("TOKEN_EMPTY") || json?.ret?.[0]?.includes("TOKEN_EXOIRED")) {
      cachedToken = "";
      tokenExpiry = 0;
      ({ token, cookies } = await getMtopToken());
      if (!token) return null;
      json = await callMtop(offerId, token, cookies);
    }

    if (!json?.ret?.[0]?.includes("SUCCESS")) return null;

    // Parse response: data.data.records[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const records = json?.data?.data?.records as any[];
    if (!records?.length) return null;
    const d = records[0];

    // Images
    const images: string[] = (d.imageList || d.productImage?.images || []).map(
      (img: string) => (img.startsWith("http") ? img : `https:${img}`)
    );

    // Price
    const priceRange: { price: string; startQuantity: number }[] = [];
    if (d.priceRangeList && Array.isArray(d.priceRangeList)) {
      for (const r of d.priceRangeList) {
        priceRange.push({ price: String(r.price), startQuantity: Number(r.startQuantity || 1) });
      }
    } else if (d.priceDisplay) {
      const m = typeof d.priceDisplay === "string" ? d.priceDisplay.match(/[\d.]+/) : null;
      if (m) priceRange.push({ price: m[0], startQuantity: 1 });
    }

    // SKU
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const skuOptions: ProductResult["skuOptions"] = [];
    if (d.skuProps && Array.isArray(d.skuProps)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      for (const prop of d.skuProps as any[]) {
        skuOptions.push({
          name: prop.propName || prop.name || "",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          values: (prop.values || []).map((v: any) => ({
            name: v.name || String(v),
            imageUrl: v.imageUrl ? (v.imageUrl.startsWith("http") ? v.imageUrl : `https:${v.imageUrl}`) : undefined,
          })),
        });
      }
    }

    return {
      source: "mtop",
      id: offerId,
      title: d.subject || d.title || "",
      images,
      skuOptions,
      priceRange,
      minOrder: d.beginAmount ? Number(d.beginAmount) : null,
      soldCount: d.starCount || d.soldOut ? String(d.starCount || d.soldOut) : null,
      shopName: d.sellerLoginId || null,
    };
  } catch (err) {
    console.error("[MTOP] Error:", err);
    return null;
  }
}

async function fetchViaOpenApi(id: string): Promise<ProductResult | null> {
  if (!APP_KEY || !APP_SECRET || !ACCESS_TOKEN) return null;
  try {
    const urlPath = `param2/1/com.alibaba.product/alibaba.product.simple.get/${APP_KEY}`;
    const p: Record<string, string> = { access_token: ACCESS_TOKEN, _aop_timestamp: String(Date.now()), productID: id, webSite: "1688" };
    const sign = signOpenApi(urlPath, p);
    const res = await fetch(`${API_URL}/${urlPath}`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ ...p, _aop_signature: sign }).toString(),
    });
    const data = await res.json();
    if (!data.productInfo) return null;
    const info = data.productInfo;
    const images = (info.image?.images || []).map((img: string) => img.startsWith("http") ? img : `https://cbu01.alicdn.com/${img}`);
    return { source: "openapi", id: String(info.productID), title: info.subject || "", images, skuOptions: [], priceRange: [], minOrder: null, soldCount: null, shopName: null };
  } catch { return null; }
}

// ── Route Handler ──
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const mtopData = await fetchViaMtop(id);
  if (mtopData) return NextResponse.json(mtopData);

  const openApiData = await fetchViaOpenApi(id);
  if (openApiData) return NextResponse.json(openApiData);

  return NextResponse.json({ error: "Could not fetch product details", source: "none" }, { status: 404 });
}
