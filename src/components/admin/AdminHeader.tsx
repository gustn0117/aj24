"use client";

import { useRouter, usePathname } from "next/navigation";

const pageTitles: Record<string, { title: string; desc: string }> = {
  "/admin": { title: "대시보드", desc: "사이트 현황을 확인하세요" },
  "/admin/products": { title: "상품 관리", desc: "상품을 추가하고 관리하세요" },
  "/admin/banners": { title: "배너 관리", desc: "히어로 배너를 관리하세요" },
  "/admin/categories": { title: "카테고리 관리", desc: "카테고리를 추가하고 수정하세요" },
  "/admin/orders": { title: "주문 관리", desc: "주문을 확인하고 처리하세요" },
  "/admin/members": { title: "회원 관리", desc: "회원 정보를 관리하세요" },
};

interface AdminHeaderProps {
  onMenuToggle: () => void;
}

export default function AdminHeader({ onMenuToggle }: AdminHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();

  const page = pageTitles[pathname] || { title: "관리자", desc: "" };

  const handleLogout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <header className="h-14 sm:h-16 bg-white border-b border-gray-200/80 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button onClick={onMenuToggle} className="md:hidden p-1.5 -ml-1.5 hover:bg-gray-100 rounded-lg transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <line x1="3" y1="7" x2="21" y2="7" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="17" x2="15" y2="17" />
          </svg>
        </button>
        <div>
          <h2 className="text-sm font-bold text-gray-900">{page.title}</h2>
          <p className="text-[11px] text-gray-400 hidden sm:block">{page.desc}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden sm:flex items-center gap-2 text-[11px] text-gray-400 mr-2">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
          온라인
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-800 transition-colors px-2.5 sm:px-3 py-1.5 rounded-lg hover:bg-gray-100 font-medium"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span className="hidden sm:inline">로그아웃</span>
        </button>
      </div>
    </header>
  );
}
