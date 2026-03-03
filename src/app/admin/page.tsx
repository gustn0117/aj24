"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

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
  { key: "products", label: "전체 상품", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4", href: "/admin/products" },
  { key: "banners", label: "활성 배너", icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z", href: "/admin/banners" },
  { key: "categories", label: "카테고리", icon: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z", href: "/admin/categories" },
  { key: "orders", label: "전체 주문", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2", href: "/admin/orders" },
  { key: "members", label: "전체 회원", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z", href: "/admin/members" },
  { key: "pendingOrders", label: "대기 주문", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", href: "/admin/orders" },
] as const;

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats);
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="relative overflow-hidden bg-gray-950 rounded-2xl p-6 md:p-8 text-white">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute top-0 left-1/3 w-px h-full bg-white/[0.03]" />
          <div className="absolute top-0 left-2/3 w-px h-full bg-white/[0.03]" />
        </div>
        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">AJ24 Admin</p>
            <h1 className="text-xl md:text-2xl font-bold mb-1">관리자 대시보드</h1>
            <p className="text-gray-500 text-xs">사이트 현황을 한눈에 확인하세요.</p>
          </div>
          <div className="hidden md:block text-right">
            <p className="text-xs text-gray-600">{new Date().toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" })}</p>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {statCards.map((card) => (
          <Link
            key={card.key}
            href={card.href}
            className="group bg-white rounded-xl p-4 md:p-5 hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-gray-200"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-gray-100 group-hover:bg-gray-900 flex items-center justify-center transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-white transition-colors">
                  <path d={card.icon} />
                </svg>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2" className="group-hover:stroke-gray-400 group-hover:translate-x-0.5 transition-all">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
            <p className="text-[11px] text-gray-400 mb-0.5 font-medium">{card.label}</p>
            <p className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
              {stats ? (stats[card.key as keyof Stats] ?? 0).toLocaleString() : (
                <span className="inline-block w-14 h-8 bg-gray-100 rounded-lg animate-pulse" />
              )}
            </p>
          </Link>
        ))}
      </div>

      {/* Revenue card */}
      <div className="bg-white rounded-xl p-5 md:p-6 border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gray-900 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
            </svg>
          </div>
          <div>
            <p className="text-[11px] text-gray-400 font-medium">총 매출액</p>
            <p className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
              {stats ? (
                <>{stats.totalRevenue.toLocaleString()}<span className="text-sm font-semibold text-gray-400 ml-1">원</span></>
              ) : (
                <span className="inline-block w-36 h-8 bg-gray-100 rounded-lg animate-pulse" />
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
