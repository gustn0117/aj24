"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const menuItems = [
  { href: "/admin", label: "대시보드", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4" },
  { href: "/admin/products", label: "상품 관리", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
  { href: "/admin/banners", label: "배너 관리", icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" },
  { href: "/admin/categories", label: "카테고리", icon: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" },
  { href: "/admin/orders", label: "주문 관리", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
  { href: "/admin/members", label: "회원 관리", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[240px] bg-gray-950 min-h-screen flex flex-col shrink-0 border-r border-gray-800/50">
      {/* Logo */}
      <div className="p-5 pb-4">
        <Link href="/admin" className="flex items-center gap-2.5">
          <img src="/images/logo.png" alt="AJ24" className="h-7 w-auto brightness-0 invert" />
          <div>
            <span className="text-white font-bold text-sm block leading-tight">AJ24</span>
            <span className="text-gray-600 text-[10px] font-medium">Admin Panel</span>
          </div>
        </Link>
      </div>

      {/* Divider */}
      <div className="mx-4 h-px bg-gray-800/50" />

      {/* Navigation */}
      <nav className="flex-1 p-3 mt-2">
        <p className="px-3 mb-3 text-[10px] font-semibold text-gray-600 uppercase tracking-widest">메뉴</p>
        <div className="space-y-0.5">
          {menuItems.map((item) => {
            const isActive = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 text-[13px] rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-white text-gray-900 font-semibold shadow-sm"
                    : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                }`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d={item.icon} />
                </svg>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom */}
      <div className="p-3 mb-3">
        <div className="px-3 py-3 bg-white/5 rounded-lg border border-white/5">
          <p className="text-[10px] text-gray-600 mb-2 font-medium">사이트 보기</p>
          <Link href="/" target="_blank" className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors font-medium">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            aj24.hsweb.pics
          </Link>
        </div>
      </div>
    </aside>
  );
}
