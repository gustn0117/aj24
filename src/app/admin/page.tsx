"use client";

import { useState, useEffect } from "react";

interface Stats {
  products: number;
  banners: number;
  categories: number;
  orders: number;
  members: number;
  pendingOrders: number;
  totalRevenue: number;
}

const statCards = [
  { key: "products", label: "전체 상품", color: "bg-blue-500" },
  { key: "banners", label: "활성 배너", color: "bg-purple-500" },
  { key: "categories", label: "카테고리", color: "bg-teal-500" },
  { key: "orders", label: "전체 주문", color: "bg-orange-500" },
  { key: "members", label: "전체 회원", color: "bg-green-500" },
  { key: "pendingOrders", label: "대기 주문", color: "bg-red-500" },
] as const;

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">대시보드</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {statCards.map((card) => (
          <div key={card.key} className="bg-white rounded-lg shadow-sm p-5 flex items-center gap-4">
            <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center text-white font-bold text-lg`}>
              {stats ? (stats[card.key as keyof Stats] ?? 0) : "-"}
            </div>
            <div>
              <p className="text-sm text-gray-500">{card.label}</p>
              <p className="text-2xl font-bold">
                {stats ? (stats[card.key as keyof Stats] ?? 0).toLocaleString() : "..."}
              </p>
            </div>
          </div>
        ))}
      </div>
      {stats && (
        <div className="bg-white rounded-lg shadow-sm p-5">
          <p className="text-sm text-gray-500 mb-1">총 매출</p>
          <p className="text-3xl font-bold text-gray-900">
            {stats.totalRevenue.toLocaleString()}원
          </p>
        </div>
      )}
    </div>
  );
}
