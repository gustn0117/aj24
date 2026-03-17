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

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
  Referer: "https://www.1688.com/",
};

export async function search1688(options: Scrape1688Options): Promise<Raw1688Product[]> {
  const { query, page = 1 } = options;

  try {
    const url = `https://s.1688.com/selloffer/offer_search.htm?keywords=${encodeURIComponent(query)}&beginPage=${page}&n=y`;

    const res = await fetch(url, { headers: HEADERS });
    if (!res.ok) return [];

    const html = await res.text();
    return parseProducts(html);
  } catch (err) {
    console.error("[1688 scraper] Error:", err);
    return [];
  }
}

function parseProducts(html: string): Raw1688Product[] {
  const products: Raw1688Product[] = [];

  // Strategy 1: Try to find __INIT_DATA or embedded JSON
  const jsonMatch = html.match(/__INIT_DATA\s*=\s*({[\s\S]*?});\s*<\/script>/);
  if (jsonMatch) {
    try {
      const data = JSON.parse(jsonMatch[1]);
      const offers = extractOffersFromJson(data);
      if (offers.length > 0) return offers;
    } catch {
      // Fall through to regex parsing
    }
  }

  // Strategy 2: Parse offer data from globalData or similar patterns
  const globalDataMatch = html.match(/globalData\s*:\s*({[\s\S]*?})\s*,\s*\n/);
  if (globalDataMatch) {
    try {
      const data = JSON.parse(globalDataMatch[1]);
      const offers = extractOffersFromJson(data);
      if (offers.length > 0) return offers;
    } catch {
      // Fall through
    }
  }

  // Strategy 3: Try to find offer list data in any script tag
  const scriptRegex = /"offerList"\s*:\s*(\[[\s\S]*?\])\s*[,}]/;
  const offerListMatch = html.match(scriptRegex);
  if (offerListMatch) {
    try {
      const offers = JSON.parse(offerListMatch[1]);
      return offers.map(parseOfferJson).filter(Boolean) as Raw1688Product[];
    } catch {
      // Fall through
    }
  }

  // Strategy 4: Regex-based HTML parsing (fallback)
  // Look for common 1688 offer card patterns
  const offerRegex = /offer_search[^"]*?(\d{10,})/g;
  const titleRegex = /<a[^>]*title="([^"]+)"[^>]*class="[^"]*sm-offer-item__title/g;

  // Try to extract from HTML structure
  const cardRegex = /data-offer-id="(\d+)"[\s\S]*?<img[^>]*src="([^"]*)"[\s\S]*?class="[^"]*title[^"]*"[^>]*>([^<]*)</g;
  let match;
  while ((match = cardRegex.exec(html)) !== null) {
    const [, offerId, imageUrl, title] = match;
    if (offerId && title) {
      products.push({
        offerId,
        title: decodeHTMLEntities(title.trim()),
        priceRange: "0",
        imageUrl: normalizeImageUrl(imageUrl),
        productUrl: `https://detail.1688.com/offer/${offerId}.html`,
        supplierName: "",
        minOrder: null,
        salesCount: null,
      });
    }
  }

  // Strategy 5: Extract from structured data patterns
  if (products.length === 0) {
    const offerIdRegex = /detail\.1688\.com\/offer\/(\d+)\.html/g;
    const foundIds = new Set<string>();
    let idMatch;
    while ((idMatch = offerIdRegex.exec(html)) !== null) {
      foundIds.add(idMatch[1]);
    }

    // For each offer ID, try to find associated data
    for (const id of Array.from(foundIds)) {
      const titlePattern = new RegExp(`${id}[\\s\\S]{0,2000}?title["\s:]+([^"<]{5,100})`, "i");
      const titleM = html.match(titlePattern);
      const imgPattern = new RegExp(`${id}[\\s\\S]{0,2000}?(?:img|image)["\s:]+(?:https?:)?//([^"\\s]+)`, "i");
      const imgM = html.match(imgPattern);

      if (titleM) {
        products.push({
          offerId: id,
          title: decodeHTMLEntities(titleM[1].trim()),
          priceRange: "0",
          imageUrl: imgM ? normalizeImageUrl("//" + imgM[1]) : "",
          productUrl: `https://detail.1688.com/offer/${id}.html`,
          supplierName: "",
          minOrder: null,
          salesCount: null,
        });
      }
    }
  }

  return products.slice(0, 40);
}

function extractOffersFromJson(data: Record<string, unknown>): Raw1688Product[] {
  // Recursively search for offer arrays in the JSON structure
  const results: Raw1688Product[] = [];

  function walk(obj: unknown): void {
    if (results.length >= 40) return;
    if (Array.isArray(obj)) {
      for (const item of obj) {
        if (item && typeof item === "object" && ("offerId" in (item as Record<string, unknown>) || "id" in (item as Record<string, unknown>))) {
          const parsed = parseOfferJson(item as Record<string, unknown>);
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

function parseOfferJson(item: Record<string, unknown>): Raw1688Product | null {
  const offerId = String(item.offerId || item.id || "");
  if (!offerId || offerId.length < 5) return null;

  const title = String(
    item.title || item.subject || item.offerTitle || ""
  ).replace(/<[^>]*>/g, ""); // strip HTML tags

  if (!title) return null;

  // Extract price
  let priceRange = "0";
  if (item.priceStr) priceRange = String(item.priceStr);
  else if (item.price) priceRange = String(item.price);
  else if (item.tradePrice) {
    const tp = item.tradePrice as Record<string, unknown>;
    priceRange = String(tp.offerPrice || tp.price || "0");
  }

  // Extract image
  let imageUrl = "";
  if (item.imageUrl) imageUrl = String(item.imageUrl);
  else if (item.image) {
    const img = item.image as Record<string, unknown>;
    imageUrl = String(img.imgUrl || img.url || img.src || "");
  }
  else if (item.imgUrl) imageUrl = String(item.imgUrl);

  // Extract supplier
  let supplierName = "";
  if (item.company) {
    const comp = item.company as Record<string, unknown>;
    supplierName = String(comp.name || comp.companyName || "");
  }
  else if (item.sellerName) supplierName = String(item.sellerName);
  else if (item.companyName) supplierName = String(item.companyName);

  // Extract sales
  let salesCount: string | null = null;
  if (item.quantitySummary) salesCount = String(item.quantitySummary);
  else if (item.monthSold) salesCount = String(item.monthSold);
  else if (item.gmvDisplay) salesCount = String(item.gmvDisplay);

  // Min order
  let minOrder: number | null = null;
  if (item.moq) minOrder = Number(item.moq) || null;
  else if (item.minOrder) minOrder = Number(item.minOrder) || null;

  return {
    offerId,
    title,
    priceRange,
    imageUrl: normalizeImageUrl(imageUrl),
    productUrl: `https://detail.1688.com/offer/${offerId}.html`,
    supplierName,
    minOrder,
    salesCount,
  };
}

function normalizeImageUrl(url: string): string {
  if (!url) return "";
  let normalized = url.trim();
  if (normalized.startsWith("//")) normalized = "https:" + normalized;
  // Remove size suffix to get original quality
  normalized = normalized.replace(/\.\d+x\d+\.jpg/, ".jpg");
  return normalized;
}

function decodeHTMLEntities(str: string): string {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}
