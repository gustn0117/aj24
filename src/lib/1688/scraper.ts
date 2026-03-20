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
  apiPath: string,
  params: Record<string, string>
): string {
  // 1688 API signature: HMAC-SHA256 of apiPath + sorted params
  const sortedKeys = Object.keys(params).sort();
  let signStr = apiPath;
  for (const key of sortedKeys) {
    signStr += key + params[key];
  }

  const hmac = crypto.createHmac("sha256", APP_SECRET);
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
    const apiPath = "param2/1/com.alibaba.product/alibaba.cross.productSearch";
    const timestamp = new Date().toISOString().replace("T", " ").slice(0, 19);

    const bizParams: Record<string, string> = {
      keyword: query,
      pageNo: String(page),
      pageSize: "40",
    };

    const systemParams: Record<string, string> = {
      method: "alibaba.cross.productSearch",
      app_key: APP_KEY,
      access_token: ACCESS_TOKEN,
      timestamp,
      format: "json",
      v: "2",
      sign_method: "hmac-sha256",
    };

    const allParams = { ...systemParams, ...bizParams };
    const sign = signRequest(apiPath, allParams);
    allParams.sign = sign;

    const urlParams = new URLSearchParams(allParams);
    const url = `${API_URL}/${apiPath}?${urlParams.toString()}`;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    if (!res.ok) {
      console.error("[1688 API] HTTP Error:", res.status);
      // Fallback to scraping
      return fallbackScrape(query, page);
    }

    const data = await res.json();

    if (data.error_code || data.error_message) {
      console.error("[1688 API] API Error:", data.error_code, data.error_message);
      // Try alternative API method
      return tryAlternativeApi(query, page);
    }

    const result = data.result || data;
    const offers = result.data || result.offerList || result.productList || [];

    if (!Array.isArray(offers) || offers.length === 0) {
      return fallbackScrape(query, page);
    }

    return offers.map(parseApiProduct).filter(Boolean) as Raw1688Product[];
  } catch (err) {
    console.error("[1688 API] Error:", err);
    return fallbackScrape(query, page);
  }
}

async function tryAlternativeApi(query: string, page: number): Promise<Raw1688Product[]> {
  try {
    // Try alibaba.product.search or com.alibaba.product:alibaba.cross.productSearch
    const apiPath = "param2/1/com.alibaba.trade/alibaba.trade.productSearch";
    const timestamp = new Date().toISOString().replace("T", " ").slice(0, 19);

    const bizParams: Record<string, string> = {
      keyword: query,
      pageNo: String(page),
      pageSize: "40",
    };

    const systemParams: Record<string, string> = {
      method: "alibaba.trade.productSearch",
      app_key: APP_KEY,
      access_token: ACCESS_TOKEN,
      timestamp,
      format: "json",
      v: "2",
      sign_method: "hmac-sha256",
    };

    const allParams = { ...systemParams, ...bizParams };
    const sign = signRequest(apiPath, allParams);
    allParams.sign = sign;

    const urlParams = new URLSearchParams(allParams);
    const url = `${API_URL}/${apiPath}?${urlParams.toString()}`;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    if (!res.ok) return fallbackScrape(query, page);

    const data = await res.json();
    if (data.error_code) return fallbackScrape(query, page);

    const result = data.result || data;
    const offers = result.data || result.offerList || result.productList || [];

    if (!Array.isArray(offers) || offers.length === 0) {
      return fallbackScrape(query, page);
    }

    return offers.map(parseApiProduct).filter(Boolean) as Raw1688Product[];
  } catch {
    return fallbackScrape(query, page);
  }
}

function parseApiProduct(item: Record<string, unknown>): Raw1688Product | null {
  const offerId = String(item.offerId || item.productId || item.id || "");
  if (!offerId || offerId.length < 5) return null;

  const title = String(
    item.subject || item.title || item.offerTitle || item.productTitle || ""
  ).replace(/<[^>]*>/g, "");
  if (!title) return null;

  // Price
  let priceRange = "0";
  if (item.priceInfo) {
    const pi = item.priceInfo as Record<string, unknown>;
    if (pi.price) priceRange = String(pi.price);
    else if (pi.priceRange) priceRange = String(pi.priceRange);
  } else if (item.referencePrice) {
    priceRange = String(item.referencePrice);
  } else if (item.price) {
    priceRange = String(item.price);
  }

  // Image
  let imageUrl = "";
  if (item.imageUrl) imageUrl = String(item.imageUrl);
  else if (item.image) {
    const img = item.image as Record<string, unknown>;
    imageUrl = String(img.imgUrl || img.url || img.src || "");
  }
  else if (item.imgUrl) imageUrl = String(item.imgUrl);
  else if (item.productImage) imageUrl = String(item.productImage);

  if (imageUrl && imageUrl.startsWith("//")) imageUrl = "https:" + imageUrl;

  // Supplier
  let supplierName = "";
  if (item.companyName) supplierName = String(item.companyName);
  else if (item.supplierLoginId) supplierName = String(item.supplierLoginId);

  // Sales
  let salesCount: string | null = null;
  if (item.monthSold) salesCount = String(item.monthSold);
  else if (item.quantitySummary) salesCount = String(item.quantitySummary);
  else if (item.bookedCount) salesCount = String(item.bookedCount);

  // Min order
  let minOrder: number | null = null;
  if (item.moq) minOrder = Number(item.moq) || null;
  else if (item.beginAmount) minOrder = Number(item.beginAmount) || null;

  return {
    offerId,
    title,
    priceRange,
    imageUrl,
    productUrl: `https://detail.1688.com/offer/${offerId}.html`,
    supplierName,
    minOrder,
    salesCount,
  };
}

// Fallback: direct scraping (may be blocked from non-CN IPs)
async function fallbackScrape(query: string, page: number): Promise<Raw1688Product[]> {
  try {
    const url = `https://s.1688.com/selloffer/offer_search.htm?keywords=${encodeURIComponent(query)}&beginPage=${page}&n=y`;

    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
        Referer: "https://www.1688.com/",
      },
    });

    if (!res.ok) return [];

    const html = await res.text();
    return parseHtmlProducts(html);
  } catch (err) {
    console.error("[1688 fallback scraper] Error:", err);
    return [];
  }
}

function parseHtmlProducts(html: string): Raw1688Product[] {
  const products: Raw1688Product[] = [];

  // Try embedded JSON
  const jsonMatch = html.match(/__INIT_DATA\s*=\s*({[\s\S]*?});\s*<\/script>/);
  if (jsonMatch) {
    try {
      const data = JSON.parse(jsonMatch[1]);
      const offers = extractOffersFromJson(data);
      if (offers.length > 0) return offers;
    } catch { /* fall through */ }
  }

  // Try offerList
  const offerListMatch = html.match(/"offerList"\s*:\s*(\[[\s\S]*?\])\s*[,}]/);
  if (offerListMatch) {
    try {
      const offers = JSON.parse(offerListMatch[1]);
      return offers.map(parseApiProduct).filter(Boolean) as Raw1688Product[];
    } catch { /* fall through */ }
  }

  // Regex fallback
  const cardRegex = /data-offer-id="(\d+)"[\s\S]*?<img[^>]*src="([^"]*)"[\s\S]*?class="[^"]*title[^"]*"[^>]*>([^<]*)/g;
  let match;
  while ((match = cardRegex.exec(html)) !== null) {
    const [, offerId, imageUrl, title] = match;
    if (offerId && title) {
      products.push({
        offerId,
        title: title.trim(),
        priceRange: "0",
        imageUrl: imageUrl.startsWith("//") ? "https:" + imageUrl : imageUrl,
        productUrl: `https://detail.1688.com/offer/${offerId}.html`,
        supplierName: "",
        minOrder: null,
        salesCount: null,
      });
    }
  }

  return products.slice(0, 40);
}

function extractOffersFromJson(data: Record<string, unknown>): Raw1688Product[] {
  const results: Raw1688Product[] = [];

  function walk(obj: unknown): void {
    if (results.length >= 40) return;
    if (Array.isArray(obj)) {
      for (const item of obj) {
        if (item && typeof item === "object" && ("offerId" in (item as Record<string, unknown>) || "id" in (item as Record<string, unknown>))) {
          const parsed = parseApiProduct(item as Record<string, unknown>);
          if (parsed) results.push(parsed);
        } else {
          walk(item);
        }
      }
    } else if (obj && typeof obj === "object") {
      for (const value of Object.values(obj as Record<string, unknown>)) {
        walk(value);
      }
    }
  }

  walk(data);
  return results;
}
