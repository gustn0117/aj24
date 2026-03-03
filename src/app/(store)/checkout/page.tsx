"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";

function formatPrice(price: number) {
  return price.toLocaleString("ko-KR") + "원";
}

export default function CheckoutPage() {
  const { items, getTotal, clearCart } = useCart();
  const { member } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", phone: "", address: "", memo: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (member) {
      setForm((prev) => ({
        ...prev,
        name: prev.name || member.name,
        phone: prev.phone || member.phone || "",
        address: prev.address || member.address || "",
      }));
    }
  }, [member]);

  useEffect(() => {
    if (items.length === 0) router.replace("/");
  }, [items.length, router]);

  const total = getTotal();
  const shippingFee = total >= 50000 ? 0 : 3000;

  async function handleOrder() {
    if (!form.name || !form.phone || !form.address) {
      setError("배송 정보를 모두 입력해주세요.");
      return;
    }
    setLoading(true);
    setError("");

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
        shippingName: form.name,
        shippingPhone: form.phone,
        shippingAddress: form.address,
        memo: form.memo || null,
      }),
    });
    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      clearCart();
      router.push(`/checkout/complete?orderId=${data.orderId}`);
    } else {
      setError(data.error || "주문에 실패했습니다.");
    }
  }

  if (items.length === 0) return null;

  return (
    <main className="min-h-screen bg-[#fafafa]">
      <Header categories={[]} />
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 py-10 md:py-16">
        <h1 className="text-2xl font-black tracking-tight mb-8">주문하기</h1>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Shipping form */}
          <div className="md:col-span-3 bg-white rounded-xl p-6 border border-gray-100">
            <h2 className="text-base font-bold mb-5">배송 정보</h2>
            {error && <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600 mb-4">{error}</div>}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">받는 분 *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">연락처 *</label>
                <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="010-0000-0000" className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">배송 주소 *</label>
                <input type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="주소를 입력해주세요" className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">배송 메모</label>
                <input type="text" value={form.memo} onChange={(e) => setForm({ ...form, memo: e.target.value })} placeholder="부재 시 문 앞에 놓아주세요" className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black" />
              </div>
            </div>
          </div>

          {/* Order summary */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl p-6 border border-gray-100 sticky top-24">
              <h2 className="text-base font-bold mb-5">주문 요약</h2>
              <div className="space-y-3 mb-5">
                {items.map((item) => (
                  <div key={item.productId} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 truncate max-w-[60%]">{item.name} x{item.quantity}</span>
                    <span className="font-semibold">{formatPrice(item.sale_price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-4 space-y-2">
                <div className="flex justify-between text-sm"><span className="text-gray-500">상품 합계</span><span>{formatPrice(total)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">배송비</span><span className={shippingFee === 0 ? "text-green-600 font-semibold" : ""}>{shippingFee === 0 ? "무료" : formatPrice(shippingFee)}</span></div>
                <div className="flex justify-between text-lg font-black pt-2 border-t border-gray-100"><span>총 결제 금액</span><span>{formatPrice(total + shippingFee)}</span></div>
              </div>
              <button onClick={handleOrder} disabled={loading} className="w-full mt-6 py-4 bg-black text-white font-bold rounded-xl text-sm hover:bg-gray-800 transition-colors disabled:opacity-50 active:scale-[0.98]">
                {loading ? "주문 처리 중..." : `${formatPrice(total + shippingFee)} 결제하기`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
