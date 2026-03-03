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
  delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
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
        <span className="text-sm">로딩 중...</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-5">
      <button onClick={() => router.push("/admin/orders")} className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 transition-colors font-medium">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
        목록으로
      </button>

      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold text-gray-900">주문 #{order.id}</h1>
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${statusStyle[order.status] || ""}`}>
          {statusOptions.find(s => s.value === order.status)?.label || order.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200/80 p-5">
          <h2 className="font-semibold text-gray-900 mb-4 text-sm">주문 정보</h2>
          <dl className="space-y-3 text-sm">
            {[
              { label: "주문자", value: order.member_name },
              { label: "이메일", value: order.member_email || "-" },
              { label: "배송지", value: order.shipping_address || "-" },
              { label: "메모", value: order.memo || "-" },
              { label: "주문일", value: new Date(order.created_at).toLocaleString("ko-KR") },
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-start">
                <dt className="text-gray-400 text-xs shrink-0">{item.label}</dt>
                <dd className="text-right text-gray-900 font-medium text-xs">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="bg-white rounded-xl border border-gray-200/80 p-5">
          <h2 className="font-semibold text-gray-900 mb-4 text-sm">상태 변경</h2>
          <div className="flex gap-2">
            <select value={status} onChange={(e) => setStatus(e.target.value)}
              className="flex-1 px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900/10">
              {statusOptions.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            <button onClick={updateStatus} className="px-4 py-2.5 bg-gray-900 text-white rounded-lg text-xs font-semibold hover:bg-gray-800 transition-all active:scale-95">
              변경
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200/80 overflow-hidden">
        <div className="p-5 pb-0">
          <h2 className="font-semibold text-gray-900 text-sm">주문 상품</h2>
        </div>
        <table className="w-full text-sm mt-3">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">상품명</th>
              <th className="px-5 py-3 text-center text-[11px] font-semibold text-gray-500 uppercase tracking-wider">수량</th>
              <th className="px-5 py-3 text-right text-[11px] font-semibold text-gray-500 uppercase tracking-wider">단가</th>
              <th className="px-5 py-3 text-right text-[11px] font-semibold text-gray-500 uppercase tracking-wider">소계</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {items.map((item) => (
              <tr key={item.id}>
                <td className="px-5 py-3.5 font-medium text-gray-900">{item.product_name}</td>
                <td className="px-5 py-3.5 text-center"><span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-gray-100 text-[11px] font-semibold">{item.quantity}</span></td>
                <td className="px-5 py-3.5 text-right text-gray-600">{item.unit_price.toLocaleString()}원</td>
                <td className="px-5 py-3.5 text-right font-semibold text-gray-900">{(item.unit_price * item.quantity).toLocaleString()}원</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-gray-100">
              <td colSpan={3} className="px-5 py-4 text-right font-semibold text-gray-500 text-xs">합계</td>
              <td className="px-5 py-4 text-right">
                <span className="text-xl font-bold text-gray-900">{order.total_amount.toLocaleString()}<span className="text-xs font-semibold text-gray-400 ml-0.5">원</span></span>
              </td>
            </tr>
          </tfoot>
        </table>
        {items.length === 0 && <div className="text-center py-12"><p className="text-gray-400 text-sm">주문 상품이 없습니다.</p></div>}
      </div>
    </div>
  );
}
