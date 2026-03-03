"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Header from "@/components/Header";

function CompleteContent() {
  const params = useSearchParams();
  const orderId = params.get("orderId");

  return (
    <main className="min-h-screen bg-white">
      <Header categories={[]} />
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h1 className="text-2xl font-black tracking-tight mb-2">주문이 완료되었습니다</h1>
        <p className="text-sm text-gray-400 mb-2">감사합니다! 주문이 정상적으로 접수되었습니다.</p>
        {orderId && <p className="text-sm text-gray-500 mb-8">주문번호: <span className="font-bold text-black">#{orderId}</span></p>}

        <div className="flex gap-3 justify-center">
          <a href="/mypage/orders" className="px-6 py-3 bg-black text-white rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors">주문 내역 보기</a>
          <a href="/" className="px-6 py-3 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors">홈으로</a>
        </div>
      </div>
    </main>
  );
}

export default function CompletePage() {
  return <Suspense><CompleteContent /></Suspense>;
}
