import { NextRequest, NextResponse } from "next/server";

const TMAPI_URL = "http://api.tmapi.top/1688";
const TMAPI_TOKEN = process.env.TMAPI_TOKEN || "";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractDescriptionImages(html: string): string[] {
  const matches = html.matchAll(/src=(?:\\?["'])?(https?:\/\/[^"'\\]+\.(?:jpg|jpeg|png|webp)(?:\?[^"'\\]*)?)/gi);
  const images: string[] = [];
  for (const m of matches) {
    const url = m[1].split("?")[0];
    if (!images.includes(url)) images.push(url);
  }
  return images;
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!TMAPI_TOKEN) {
    return NextResponse.json({ error: "Missing TMAPI token" }, { status: 500 });
  }

  try {
    // 1. Fetch product detail from TMAPI
    const res = await fetch(`${TMAPI_URL}/item_detail?item_id=${id}&apiToken=${TMAPI_TOKEN}`);
    const json = await res.json();

    if (json.code !== 200 || !json.data) {
      return NextResponse.json({ error: json.msg || "Failed to fetch", source: "tmapi" }, { status: 404 });
    }

    const d = json.data;

    // 2. Fetch description images from detail_url
    let descriptionImages: string[] = [];
    if (d.detail_url) {
      try {
        const descRes = await fetch(d.detail_url);
        const descHtml = await descRes.text();
        descriptionImages = extractDescriptionImages(descHtml);
      } catch {}
    }

    // 3. Parse SKU options
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const skuOptions: { name: string; values: { name: string; imageUrl?: string }[] }[] = [];
    if (d.sku_props && Array.isArray(d.sku_props)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      for (const prop of d.sku_props as any[]) {
        skuOptions.push({
          name: prop.prop_name || prop.name || "",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          values: (prop.values || []).map((v: any) => ({
            name: v.name || String(v),
            imageUrl: v.imageUrl || v.image_url || undefined,
          })),
        });
      }
    }

    // 4. Parse price range
    const priceRange: { price: string; startQuantity: number }[] = [];
    if (d.tiered_price_info && Array.isArray(d.tiered_price_info)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      for (const tier of d.tiered_price_info as any[]) {
        priceRange.push({
          price: String(tier.price || tier.sale_price || ""),
          startQuantity: Number(tier.min_quantity || tier.start_quantity || 1),
        });
      }
    } else if (d.price_info) {
      priceRange.push({ price: String(d.price_info.price || d.price_info.sale_price || ""), startQuantity: 1 });
    }

    // 5. Parse SKUs for individual prices
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const skus = (d.skus || []).map((s: any) => ({
      skuId: s.skuid,
      price: s.sale_price,
      stock: s.stock,
      propsNames: s.props_names,
    }));

    return NextResponse.json({
      source: "tmapi",
      id: String(d.item_id),
      title: d.title || "",
      images: d.main_imgs || [],
      descriptionImages,
      skuOptions,
      skus,
      priceRange,
      minOrder: d.sale_info?.min_order || null,
      soldCount: d.sale_count || null,
      shopName: d.shop_info?.shop_name || null,
      shopUrl: d.shop_info?.shop_url || null,
      videoUrl: d.video_url || null,
      productProps: d.product_props || [],
      deliveryInfo: d.delivery_info || null,
    });
  } catch (err) {
    console.error("[TMAPI] Error:", err);
    return NextResponse.json({ error: String(err), source: "tmapi" }, { status: 500 });
  }
}
