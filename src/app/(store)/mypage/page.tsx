"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Order } from "@/lib/types";

function formatPrice(price: number) {
  return price.toLocaleString("ko-KR") + "원";
}

const statusLabels: Record<string, string> = {
  pending: "주문접수", confirmed: "확인", shipping: "배송중", delivered: "배송완료", cancelled: "취소", refunded: "환불",
};

export default function MyPage() {
  const { member, logout } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetch("/api/member/orders").then((r) => r.json()).then(setOrders).catch(() => {});
  }, []);

  return (
    <main className="min-h-screen bg-[#fafafa]">
      <Header categories={[]} />
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 py-10 md:py-16">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-black tracking-tight">마이페이지</h1>
          <button onClick={() => { logout(); router.push("/"); }} className="text-sm text-gray-400 hover:text-black transition-colors">로그아웃</button>
        </div>

        {/* Profile card */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white font-bold text-lg">
              {member?.name?.charAt(0) || "?"}
            </div>
            <div>
              <p className="font-bold text-black">{member?.name}</p>
              <p className="text-sm text-gray-400">{member?.email}</p>
            </div>
            <a href="/mypage/profile" className="ml-auto text-xs font-semibold text-gray-400 hover:text-black border border-gray-200 px-3 py-1.5 rounded-lg transition-colors">프로필 수정</a>
          </div>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <a href="/mypage/orders" className="bg-white rounded-xl p-4 sm:p-5 border border-gray-100 text-center hover:border-gray-300 transition-colors">
            <p className="text-2xl font-black text-black">{orders.length}</p>
            <p className="text-xs text-gray-400 mt-1">주문 내역</p>
          </a>
          <a href="/mypage/wishlist" className="bg-white rounded-xl p-4 sm:p-5 border border-gray-100 text-center hover:border-gray-300 transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
            <p className="text-xs text-gray-400 mt-1">위시리스트</p>
          </a>
          <a href="/mypage/profile" className="bg-white rounded-xl p-4 sm:p-5 border border-gray-100 text-center hover:border-gray-300 transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
            <p className="text-xs text-gray-400 mt-1">내 정보</p>
          </a>
        </div>

        {/* Recent orders */}
        <div className="bg-white rounded-xl border border-gray-100">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-sm">최근 주문</h2>
            <a href="/mypage/orders" className="text-xs text-gray-400 hover:text-black transition-colors">전체보기</a>
          </div>
          {orders.length === 0 ? (
            <div className="p-10 text-center text-gray-400 text-sm">주문 내역이 없습니다</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {orders.slice(0, 5).map((order) => (
                <a key={order.id} href={`/mypage/orders/${order.id}`} className="flex items-center justify-between px-4 sm:px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="text-sm font-semibold text-black">주문 #{order.id}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{new Date(order.created_at).toLocaleDateString("ko-KR")}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{formatPrice(order.total_amount)}</p>
                    <span className="inline-block mt-0.5 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{statusLabels[order.status] || order.status}</span>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
