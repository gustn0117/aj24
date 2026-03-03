"use client";

import { useRouter, usePathname } from "next/navigation";

const pageTitles: Record<string, string> = {
  "/admin": "대시보드",
  "/admin/products": "상품 관리",
  "/admin/banners": "배너 관리",
  "/admin/categories": "카테고리 관리",
  "/admin/orders": "주문 관리",
  "/admin/members": "회원 관리",
};

export default function AdminHeader() {
  const router = useRouter();
  const pathname = usePathname();

  const title = pageTitles[pathname] || "관리자";

  const handleLogout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-gray-200/60 flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        <span className="hidden sm:block text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md font-medium">AJ24</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400 mr-2">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          온라인
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          로그아웃
        </button>
      </div>
    </header>
  );
}
