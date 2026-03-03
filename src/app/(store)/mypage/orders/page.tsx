"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Order } from "@/lib/types";

function formatPrice(price: number) { return price.toLocaleString("ko-KR") + "원"; }

const statusLabels: Record<string, string> = {
  pending: "주문접수", confirmed: "확인", shipping: "배송중", delivered: "배송완료", cancelled: "취소", refunded: "환불",
};
const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700", confirmed: "bg-blue-100 text-blue-700", shipping: "bg-purple-100 text-purple-700", delivered: "bg-green-100 text-green-700", cancelled: "bg-gray-100 text-gray-500", refunded: "bg-red-100 text-red-600",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/member/orders").then((r) => r.json()).then(setOrders).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-[#fafafa]">
      <Header categories={[]} />
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 py-10 md:py-16">
        <div className="flex items-center gap-3 mb-8">
          <a href="/mypage" className="text-gray-400 hover:text-black transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
          </a>
          <h1 className="text-2xl font-black tracking-tight">주문 내역</h1>
        </div>

        {loading ? (
          <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-20 bg-white rounded-xl animate-pulse" />)}</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 text-gray-400"><p className="text-sm">주문 내역이 없습니다</p><a href="/" className="text-xs text-black font-semibold underline mt-2 inline-block">쇼핑하러 가기</a></div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <a key={order.id} href={`/mypage/orders/${order.id}`} className="block bg-white rounded-xl p-5 border border-gray-100 hover:border-gray-300 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-black">주문 #{order.id}</p>
                    <p className="text-xs text-gray-400 mt-1">{new Date(order.created_at).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" })}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-black">{formatPrice(order.total_amount)}</p>
                    <span className={`inline-block mt-1 text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${statusColors[order.status] || "bg-gray-100 text-gray-600"}`}>{statusLabels[order.status] || order.status}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
