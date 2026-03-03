"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Order, OrderItem } from "@/lib/types";

const statusOptions = [
  { value: "pending", label: "대기" },
  { value: "confirmed", label: "확인" },
  { value: "shipping", label: "배송중" },
  { value: "delivered", label: "완료" },
  { value: "cancelled", label: "취소" },
  { value: "refunded", label: "환불" },
];

const statusStyle: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  confirmed: "bg-blue-50 text-blue-700 border-blue-200",
  shipping: "bg-purple-50 text-purple-700 border-purple-200",
  delivered: "bg-green-50 text-green-700 border-green-200",
  cancelled: "bg-gray-50 text-gray-500 border-gray-200",
  refunded: "bg-red-50 text-red-700 border-red-200",
};

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetch(`/api/admin/orders/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        setOrder(data.order);
        setItems(data.items || []);
        setStatus(data.order?.status || "");
      });
  }, [params.id]);

  const updateStatus = async () => {
    await fetch(`/api/admin/orders/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    alert("상태가 변경되었습니다.");
  };

  if (!order) return (
    <div className="flex items-center justify-center py-32">
      <div className="flex items-center gap-3 text-gray-400">
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
        로딩 중...
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <button onClick={() => router.push("/admin/orders")} className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
        목록으로
      </button>

      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-gray-900">주문 #{order.id}</h1>
        <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold border ${statusStyle[order.status] || ""}`}>
          {statusOptions.find(s => s.value === order.status)?.label || order.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
            주문 정보
          </h2>
          <dl className="space-y-3 text-sm">
            {[
              { label: "주문자", value: order.member_name },
              { label: "이메일", value: order.member_email || "-" },
              { label: "배송지", value: order.shipping_address || "-" },
              { label: "메모", value: order.memo || "-" },
              { label: "주문일", value: new Date(order.created_at).toLocaleString("ko-KR") },
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-start">
                <dt className="text-gray-400 shrink-0">{item.label}</dt>
                <dd className="text-right text-gray-900 font-medium">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            상태 변경
          </h2>
          <div className="flex gap-2">
            <select value={status} onChange={(e) => setStatus(e.target.value)}
              className="flex-1 px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10">
              {statusOptions.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            <button onClick={updateStatus} className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-indigo-200 transition-all active:scale-95">
              변경
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="p-6 pb-0">
          <h2 className="font-bold text-gray-900 flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></svg>
            주문 상품
          </h2>
        </div>
        <table className="w-full text-sm mt-4">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">상품명</th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">수량</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">단가</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">소계</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {items.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 font-medium text-gray-900">{item.product_name}</td>
                <td className="px-6 py-4 text-center"><span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-gray-100 text-xs font-semibold">{item.quantity}</span></td>
                <td className="px-6 py-4 text-right">{item.unit_price.toLocaleString()}원</td>
                <td className="px-6 py-4 text-right font-semibold">{(item.unit_price * item.quantity).toLocaleString()}원</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-gray-100">
              <td colSpan={3} className="px-6 py-5 text-right font-bold text-gray-500">합계</td>
              <td className="px-6 py-5 text-right">
                <span className="text-2xl font-bold text-gray-900">{order.total_amount.toLocaleString()}<span className="text-sm font-semibold text-gray-400 ml-0.5">원</span></span>
              </td>
            </tr>
          </tfoot>
        </table>
        {items.length === 0 && <div className="text-center py-12"><p className="text-gray-400 text-sm">주문 상품이 없습니다.</p></div>}
      </div>
    </div>
  );
}
