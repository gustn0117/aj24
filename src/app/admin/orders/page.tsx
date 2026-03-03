"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Order } from "@/lib/types";

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: "대기", color: "bg-yellow-100 text-yellow-700" },
  confirmed: { label: "확인", color: "bg-blue-100 text-blue-700" },
  shipping: { label: "배송중", color: "bg-purple-100 text-purple-700" },
  delivered: { label: "완료", color: "bg-green-100 text-green-700" },
  cancelled: { label: "취소", color: "bg-gray-100 text-gray-600" },
  refunded: { label: "환불", color: "bg-red-100 text-red-700" },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");

  const fetchOrders = useCallback(async () => {
    const params = new URLSearchParams({ page: String(page) });
    if (status) params.set("status", status);
    const res = await fetch(`/api/admin/orders?${params}`);
    const data = await res.json();
    setOrders(data.data || []);
    setTotal(data.total || 0);
  }, [page, status]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">주문 관리</h1>

      <div className="mb-4 flex gap-2 flex-wrap">
        {["", "pending", "confirmed", "shipping", "delivered", "cancelled", "refunded"].map((s) => (
          <button key={s} onClick={() => { setStatus(s); setPage(1); }}
            className={`px-3 py-1.5 text-sm rounded-lg ${status === s ? "bg-gray-900 text-white" : "bg-white text-gray-600 border"}`}>
            {s ? (statusLabels[s]?.label || s) : "전체"}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="px-4 py-3 text-left">주문번호</th>
              <th className="px-4 py-3 text-left">주문자</th>
              <th className="px-4 py-3 text-center">상태</th>
              <th className="px-4 py-3 text-right">금액</th>
              <th className="px-4 py-3 text-center">주문일</th>
              <th className="px-4 py-3 text-center">상세</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">#{o.id}</td>
                <td className="px-4 py-3">{o.member_name}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-0.5 rounded text-xs ${statusLabels[o.status]?.color || ""}`}>
                    {statusLabels[o.status]?.label || o.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">{o.total_amount.toLocaleString()}원</td>
                <td className="px-4 py-3 text-center text-gray-400 text-xs">
                  {new Date(o.created_at).toLocaleDateString("ko-KR")}
                </td>
                <td className="px-4 py-3 text-center">
                  <Link href={`/admin/orders/${o.id}`} className="text-blue-600 hover:underline">보기</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && <p className="text-center py-8 text-gray-400">주문이 없습니다.</p>}
      </div>

      {total > 20 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: Math.ceil(total / 20) }, (_, i) => (
            <button key={i} onClick={() => setPage(i + 1)}
              className={`w-8 h-8 rounded text-sm ${page === i + 1 ? "bg-gray-900 text-white" : "bg-white border"}`}>
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
