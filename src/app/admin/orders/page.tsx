"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Order } from "@/lib/types";

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: "대기", color: "bg-amber-50 text-amber-700 border-amber-200" },
  confirmed: { label: "확인", color: "bg-blue-50 text-blue-700 border-blue-200" },
  shipping: { label: "배송중", color: "bg-purple-50 text-purple-700 border-purple-200" },
  delivered: { label: "완료", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  cancelled: { label: "취소", color: "bg-gray-50 text-gray-500 border-gray-200" },
  refunded: { label: "환불", color: "bg-red-50 text-red-700 border-red-200" },
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
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">전체 <span className="font-semibold text-gray-900">{total}</span>건 주문</p>
      </div>

      <div className="flex gap-1.5 flex-wrap">
        {[
          { value: "", label: "전체" },
          { value: "pending", label: "대기" },
          { value: "confirmed", label: "확인" },
          { value: "shipping", label: "배송중" },
          { value: "delivered", label: "완료" },
          { value: "cancelled", label: "취소" },
          { value: "refunded", label: "환불" },
        ].map((s) => (
          <button key={s.value} onClick={() => { setStatus(s.value); setPage(1); }}
            className={`px-3.5 py-1.5 text-xs rounded-full font-medium transition-all ${status === s.value ? "bg-gray-900 text-white" : "bg-white text-gray-500 border border-gray-200 hover:border-gray-300"}`}>
            {s.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200/80 overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[650px]">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">주문번호</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">주문자</th>
              <th className="px-4 py-3 text-center text-[11px] font-semibold text-gray-500 uppercase tracking-wider">상태</th>
              <th className="px-4 py-3 text-right text-[11px] font-semibold text-gray-500 uppercase tracking-wider">금액</th>
              <th className="px-4 py-3 text-center text-[11px] font-semibold text-gray-500 uppercase tracking-wider">주문일</th>
              <th className="px-4 py-3 text-center text-[11px] font-semibold text-gray-500 uppercase tracking-wider">상세</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3.5 font-mono text-xs font-semibold text-gray-900">#{o.id}</td>
                <td className="px-4 py-3.5 font-medium text-gray-700">{o.member_name}</td>
                <td className="px-4 py-3.5 text-center">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${statusLabels[o.status]?.color || ""}`}>
                    {statusLabels[o.status]?.label || o.status}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-right font-semibold text-gray-900">{o.total_amount.toLocaleString()}원</td>
                <td className="px-4 py-3.5 text-center text-gray-400 text-xs">{new Date(o.created_at).toLocaleDateString("ko-KR")}</td>
                <td className="px-4 py-3.5 text-center">
                  <Link href={`/admin/orders/${o.id}`} className="px-2 py-1 text-[11px] font-medium text-gray-600 hover:bg-gray-100 rounded-md transition-colors">상세보기</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        {orders.length === 0 && <div className="text-center py-16"><p className="text-gray-400 text-sm">주문이 없습니다.</p></div>}
      </div>

      {total > 20 && (
        <div className="flex justify-center gap-1">
          {Array.from({ length: Math.ceil(total / 20) }, (_, i) => (
            <button key={i} onClick={() => setPage(i + 1)} className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${page === i + 1 ? "bg-gray-900 text-white" : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"}`}>{i + 1}</button>
          ))}
        </div>
      )}
    </div>
  );
}
