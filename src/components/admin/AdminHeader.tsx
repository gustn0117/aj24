"use client";

import { useRouter } from "next/navigation";

export default function AdminHeader() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <h2 className="text-sm font-medium text-gray-600">온오프마켓 관리자</h2>
      <button
        onClick={handleLogout}
        className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
      >
        로그아웃
      </button>
    </header>
  );
}
