import crypto from "crypto";

export interface Raw1688Product {
  offerId: string;
  title: string;
  priceRange: string;
  imageUrl: string;
  productUrl: string;
  supplierName: string;
  minOrder: number | null;
  salesCount: string | null;
}

export interface Scrape1688Options {
  query: string; // Chinese query
  page?: number;
}

const API_URL = "https://gw.open.1688.com/openapi";
const APP_KEY = process.env.ALI_APP_KEY || "";
const APP_SECRET = process.env.ALI_APP_SECRET || "";
const ACCESS_TOKEN = process.env.ALI_ACCESS_TOKEN || "";

function signRequest(
  urlPath: string,
  params: Record<string, string>
): string {
  const sortedKeys = Object.keys(params).sort();
  let signStr = urlPath;
  for (const key of sortedKeys) {
    signStr += key + params[key];
  }

  const hmac = crypto.createHmac("sha1", APP_SECRET);
  hmac.update(signStr, "utf8");
  return hmac.digest("hex").toUpperCase();
}

export async function search1688(options: Scrape1688Options): Promise<Raw1688Product[]> {
  const { query, page = 1 } = options;

  if (!APP_KEY || !APP_SECRET || !ACCESS_TOKEN) {
    console.error("[1688 API] Missing API credentials");
    return [];
  }

  try {
    const urlPath = `param2/1/com.alibaba.fenxiao/product.keywords.search/${APP_KEY}`;

    const param = JSON.stringify({
      keywords: query,
      pageNum: page,
      pageSize: 40,
    });

    const paramsToSign: Record<string, string> = {
      access_token: ACCESS_TOKEN,
      _aop_timestamp: String(Date.now()),
      param,
    };

    const sign = signRequest(urlPath, paramsToSign);

    const body = new URLSearchParams({
      ...paramsToSign,
      _aop_signature: sign,
    });

    const url = `${API_URL}/${urlPath}`;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });

    if (!res.ok) {
      console.error("[1688 API] HTTP Error:", res.status);
      return [];
    }

    const data = await res.json();

    if (data.error_code || data.error_message) {
      console.error("[1688 API] API Error:", data.error_code, data.error_message);
      return [];
    }

    const result = data.result;
    if (!result?.success || !Array.isArray(result.result)) {
      return [];
    }

    return result.result.map(parseApiProduct).filter(Boolean) as Raw1688Product[];
  } catch (err) {
    console.error("[1688 API] Error:", err);
    return [];
  }
}

function parseApiProduct(item: Record<string, unknown>): Raw1688Product | null {
  const offerId = String(item.offerId || "");
  if (!offerId || offerId.length < 5) return null;

  const title = String(item.subject || "").replace(/<[^>]*>/g, "");
  if (!title) return null;

  // Price
  let priceRange = "0";
  if (item.offerPrice) {
    const op = item.offerPrice as Record<string, unknown>;
    priceRange = String(op.price || op.consignPrice || "0");
  }

  // Image
  let imageUrl = "";
  if (item.offerImage) {
    const img = item.offerImage as Record<string, unknown>;
    imageUrl = String(img.imageUrl || "");
  }
  if (imageUrl && imageUrl.startsWith("//")) imageUrl = "https:" + imageUrl;

  // Supplier
  let supplierName = "";
  if (item.companyInfo) {
    const ci = item.companyInfo as Record<string, unknown>;
    supplierName = String(ci.companyName || "");
  }
  if (!supplierName && item.loginId) {
    supplierName = String(item.loginId);
  }

  // Sales from offerHistoryTradeInfo
  let salesCount: string | null = null;
  if (Array.isArray(item.offerHistoryTradeInfo)) {
    const sales90 = (item.offerHistoryTradeInfo as Array<Record<string, string>>)
      .find(t => t.historyTradeKey === "Sales90Fuzzify");
    if (sales90) salesCount = sales90.historyTradeValue;
  }

  return {
    offerId,
    title,
    priceRange,
    imageUrl,
    productUrl: `https://detail.1688.com/offer/${offerId}.html`,
    supplierName,
    minOrder: null,
    salesCount,
  };
}
