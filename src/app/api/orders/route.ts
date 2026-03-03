import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { getMemberIdFromRequest } from "@/lib/member-auth";

export async function POST(request: NextRequest) {
  const memberId = await getMemberIdFromRequest(request);
  if (!memberId) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  try {
    const { items, shippingName, shippingPhone, shippingAddress, memo } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "주문 상품이 없습니다." }, { status: 400 });
    }
    if (!shippingName || !shippingPhone || !shippingAddress) {
      return NextResponse.json({ error: "배송 정보를 입력해주세요." }, { status: 400 });
    }

    // Get member info
    const { data: member } = await supabaseAdmin
      .from("members")
      .select("name, email")
      .eq("id", memberId)
      .single();

    if (!member) {
      return NextResponse.json({ error: "회원 정보를 찾을 수 없습니다." }, { status: 404 });
    }

    // Verify prices from DB
    const productIds = items.map((item: { productId: number }) => item.productId);
    const { data: products } = await supabaseAdmin
      .from("products")
      .select("id, name, sale_price")
      .in("id", productIds);

    if (!products || products.length !== items.length) {
      return NextResponse.json({ error: "일부 상품을 찾을 수 없습니다." }, { status: 400 });
    }

    const priceMap = new Map(products.map((p: { id: number; sale_price: number; name: string }) => [p.id, p]));
    let totalAmount = 0;
    const orderItems = items.map((item: { productId: number; quantity: number }) => {
      const p = priceMap.get(item.productId)!;
      totalAmount += p.sale_price * item.quantity;
      return {
        product_id: item.productId,
        product_name: p.name,
        quantity: item.quantity,
        unit_price: p.sale_price,
      };
    });

    // Create order
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        member_id: memberId,
        member_name: member.name,
        member_email: member.email,
        status: "pending",
        total_amount: totalAmount,
        shipping_address: shippingAddress,
        shipping_name: shippingName,
        shipping_phone: shippingPhone,
        memo: memo || null,
      })
      .select("id")
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: "주문 생성에 실패했습니다." }, { status: 500 });
    }

    // Create order items
    await supabaseAdmin
      .from("order_items")
      .insert(orderItems.map((item: { product_id: number; product_name: string; quantity: number; unit_price: number }) => ({ ...item, order_id: order.id })));

    return NextResponse.json({ orderId: order.id });
  } catch {
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
