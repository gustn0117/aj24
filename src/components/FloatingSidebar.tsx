"use client";

import { useState } from "react";

const menuItems = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    label: "위시리스트",
    href: "/mypage/wishlist",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    label: "주문조회",
    href: "/mypage/orders",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
      </svg>
    ),
    label: "마이페이지",
    href: "/mypage",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 0 1-4 4H3" />
      </svg>
    ),
    label: "교환/반품",
    href: "/mypage/orders",
  },
];

export default function FloatingSidebar() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-1 bg-white rounded-2xl shadow-lg border border-gray-100 p-2">
      {menuItems.map((item, i) => (
        <a
          key={i}
          href={item.href}
          className="flex flex-col items-center gap-1 px-3 py-3 rounded-xl hover:bg-gray-50 transition-colors group"
        >
          <span className="text-gray-400 group-hover:text-gray-700 transition-colors">{item.icon}</span>
          <span className="text-[10px] font-medium text-gray-400 group-hover:text-gray-700 transition-colors whitespace-nowrap">{item.label}</span>
        </a>
      ))}
      <button
        onClick={() => setVisible(false)}
        className="mx-auto mt-1 p-1 text-gray-300 hover:text-gray-500 transition-colors"
        title="닫기"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
      </button>
    </div>
  );
}
