"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const menuItems = [
  { href: "/admin", label: "대시보드", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4", color: "from-blue-500 to-cyan-500" },
  { href: "/admin/products", label: "상품 관리", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4", color: "from-violet-500 to-purple-500" },
  { href: "/admin/banners", label: "배너 관리", icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z", color: "from-pink-500 to-rose-500" },
  { href: "/admin/categories", label: "카테고리", icon: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z", color: "from-teal-500 to-emerald-500" },
  { href: "/admin/orders", label: "주문 관리", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2", color: "from-orange-500 to-amber-500" },
  { href: "/admin/members", label: "회원 관리", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z", color: "from-green-500 to-lime-500" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[240px] bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 min-h-screen flex flex-col shrink-0">
      {/* Logo */}
      <div className="p-5 pb-4">
        <Link href="/admin" className="flex items-center gap-2.5">
          <img src="/images/로고.png" alt="AJ24" className="h-8 w-auto brightness-0 invert" />
          <div>
            <span className="text-white font-bold text-sm block leading-tight">AJ24</span>
            <span className="text-gray-500 text-[10px] font-medium">Admin Panel</span>
          </div>
        </Link>
      </div>

      {/* Divider */}
      <div className="mx-4 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />

      {/* Navigation */}
      <nav className="flex-1 p-3 mt-2">
        <p className="px-3 mb-2 text-[10px] font-semibold text-gray-600 uppercase tracking-widest">메뉴</p>
        <div className="space-y-0.5">
          {menuItems.map((item) => {
            const isActive = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-white/10 text-white shadow-lg shadow-black/10"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  isActive ? `bg-gradient-to-br ${item.color} shadow-md` : "bg-gray-800"
                }`}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isActive ? "white" : "#9ca3af"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d={item.icon} />
                  </svg>
                </div>
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom */}
      <div className="p-4 mx-3 mb-3 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 rounded-xl border border-indigo-500/10">
        <p className="text-xs text-gray-400 mb-2">사이트 보기</p>
        <Link href="/" className="flex items-center gap-2 text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
          aj24.hsweb.pics
        </Link>
      </div>
    </aside>
  );
}
