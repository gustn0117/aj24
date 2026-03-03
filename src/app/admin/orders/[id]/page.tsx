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

  if (!order) return <p className="text-gray-400">로딩 중...</p>;

  return (
    <div>
      <button onClick={() => router.push("/admin/orders")} className="text-sm text-gray-500 hover:text-gray-800 mb-4 inline-block">
        &larr; 목록으로
      </button>
      <h1 className="text-2xl font-bold mb-6">주문 #{order.id}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-5">
          <h2 className="font-semibold mb-4">주문 정보</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-gray-500">주문자</dt><dd>{order.member_name}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-500">이메일</dt><dd>{order.member_email || "-"}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-500">배송지</dt><dd>{order.shipping_address || "-"}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-500">메모</dt><dd>{order.memo || "-"}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-500">주문일</dt><dd>{new Date(order.created_at).toLocaleString("ko-KR")}</dd></div>
          </dl>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-5">
          <h2 className="font-semibold mb-4">상태 변경</h2>
          <div className="flex gap-2">
            <select value={status} onChange={(e) => setStatus(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-lg text-sm">
              {statusOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <button onClick={updateStatus} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
              변경
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm mt-6 overflow-hidden">
        <h2 className="font-semibold p-5 pb-0">주문 상품</h2>
        <table className="w-full text-sm mt-3">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="px-4 py-3 text-left">상품명</th>
              <th className="px-4 py-3 text-center">수량</th>
              <th className="px-4 py-3 text-right">단가</th>
              <th className="px-4 py-3 text-right">소계</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-3">{item.product_name}</td>
                <td className="px-4 py-3 text-center">{item.quantity}</td>
                <td className="px-4 py-3 text-right">{item.unit_price.toLocaleString()}원</td>
                <td className="px-4 py-3 text-right font-medium">{(item.unit_price * item.quantity).toLocaleString()}원</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50">
            <tr>
              <td colSpan={3} className="px-4 py-3 text-right font-semibold">합계</td>
              <td className="px-4 py-3 text-right font-bold text-lg">{order.total_amount.toLocaleString()}원</td>
            </tr>
          </tfoot>
        </table>
        {items.length === 0 && <p className="text-center py-8 text-gray-400">주문 상품이 없습니다.</p>}
      </div>
    </div>
  );
}
