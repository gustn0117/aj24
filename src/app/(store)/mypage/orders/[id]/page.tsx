"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Order, OrderItem } from "@/lib/types";

function formatPrice(price: number) { return price.toLocaleString("ko-KR") + "원"; }

const statusLabels: Record<string, string> = {
  pending: "주문접수", confirmed: "확인", shipping: "배송중", delivered: "배송완료", cancelled: "취소", refunded: "환불",
};

export default function OrderDetailPage() {
  const params = useParams();
  const [order, setOrder] = useState<(Order & { items: OrderItem[] }) | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/member/orders/${params.id}`).then((r) => r.json()).then(setOrder).catch(() => {}).finally(() => setLoading(false));
  }, [params.id]);

  if (loading) return <main className="min-h-screen bg-[#fafafa]"><Header categories={[]} /><div className="max-w-[900px] mx-auto px-4 py-16"><div className="h-60 bg-white rounded-xl animate-pulse" /></div></main>;
  if (!order) return <main className="min-h-screen bg-[#fafafa]"><Header categories={[]} /><div className="max-w-[900px] mx-auto px-4 py-16 text-center text-gray-400">주문을 찾을 수 없습니다</div></main>;

  return (
    <main className="min-h-screen bg-[#fafafa]">
      <Header categories={[]} />
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 py-10 md:py-16">
        <div className="flex items-center gap-3 mb-8">
          <a href="/mypage/orders" className="text-gray-400 hover:text-black transition-colors"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg></a>
          <h1 className="text-2xl font-black tracking-tight">주문 #{order.id}</h1>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600">{statusLabels[order.status] || order.status}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <h2 className="text-sm font-bold mb-4">주문 상품</h2>
            <div className="divide-y divide-gray-50">
              {order.items.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between">
                  <div><p className="text-sm font-medium">{item.product_name}</p><p className="text-xs text-gray-400">{item.quantity}개 × {formatPrice(item.unit_price)}</p></div>
                  <p className="text-sm font-bold">{formatPrice(item.unit_price * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-3 mt-3 flex justify-between"><span className="font-bold text-sm">합계</span><span className="font-black text-lg">{formatPrice(order.total_amount)}</span></div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <h2 className="text-sm font-bold mb-4">배송 정보</h2>
            <div className="space-y-3 text-sm">
              <div><span className="text-gray-400">받는 분</span><p className="font-medium">{order.shipping_name || order.member_name}</p></div>
              {order.shipping_phone && <div><span className="text-gray-400">연락처</span><p className="font-medium">{order.shipping_phone}</p></div>}
              {order.shipping_address && <div><span className="text-gray-400">주소</span><p className="font-medium">{order.shipping_address}</p></div>}
              {order.memo && <div><span className="text-gray-400">메모</span><p className="font-medium">{order.memo}</p></div>}
              <div><span className="text-gray-400">주문일</span><p className="font-medium">{new Date(order.created_at).toLocaleString("ko-KR")}</p></div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
