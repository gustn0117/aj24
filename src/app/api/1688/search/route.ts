import { NextRequest, NextResponse } from "next/server";
import { koToCn, batchCnToKo } from "@/lib/1688/translate";
import { getCNYtoKRWRate, convertCNYtoKRW } from "@/lib/1688/currency";
import { search1688 } from "@/lib/1688/scraper";
import { Product1688 } from "@/lib/types";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") || "";
  const page = parseInt(request.nextUrl.searchParams.get("page") || "1");

  if (!q.trim()) {
    return NextResponse.json({ data: [], query: "", chineseQuery: "" });
  }

  try {
    // 1. Translate Korean → Chinese
    const chineseQuery = await koToCn(q.trim());

    // 2. Scrape 1688
    const rawProducts = await search1688({ query: chineseQuery, page });

    if (rawProducts.length === 0) {
      return NextResponse.json({ data: [], query: q, chineseQuery });
    }

    // 3. Get exchange rate
    const rate = await getCNYtoKRWRate();

    // 4. Batch translate titles
    const titles = rawProducts.map((p) => p.title);
    const koreanTitles = await batchCnToKo(titles);

    // 5. Map to Product1688
    const products: Product1688[] = rawProducts.map((raw, i) => {
      const price = parseFloat(raw.priceRange.split("-")[0].replace(/[^\d.]/g, "")) || 0;

      return {
        id: raw.offerId,
        title: koreanTitles[i] || raw.title,
        titleOriginal: raw.title,
        priceCNY: price,
        priceKRW: convertCNYtoKRW(price, rate),
        imageUrl: raw.imageUrl
          ? `/api/1688/image?url=${encodeURIComponent(raw.imageUrl)}`
          : "",
        productUrl: raw.productUrl,
        supplierName: raw.supplierName,
        minOrder: raw.minOrder,
        salesCount: raw.salesCount,
      };
    });

    return NextResponse.json({ data: products, query: q, chineseQuery });
  } catch (err) {
    console.error("[1688 search] Error:", err);
    return NextResponse.json(
      { data: [], query: q, error: "검색 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
