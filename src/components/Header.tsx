"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Category } from "@/lib/types";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import CartDrawer from "./CartDrawer";

interface HeaderProps {
  categories: Category[];
}

export default function Header({ categories }: HeaderProps) {
  const { member, isLoading, logout } = useAuth();
  const { getItemCount, setCartOpen } = useCart();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen || menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [searchOpen, menuOpen]);

  function handleSearch(q?: string) {
    const query = q || searchQuery;
    if (!query.trim()) return;
    setSearchOpen(false);
    setSearchQuery("");
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  }

  const itemCount = getItemCount();

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled ? "glass shadow-sm shadow-black/[0.03]" : "bg-white"
        }`}
      >
        <div className="hidden sm:block bg-black text-white">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 flex items-center justify-center h-9 text-[11px] tracking-wide">
            <p className="flex items-center gap-3">
              <span className="font-semibold">FREE SHIPPING</span>
              <span className="w-px h-3 bg-white/20" />
              <span className="font-semibold">EASY RETURNS</span>
            </p>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 flex items-center justify-between h-[60px]">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-1.5 -ml-1.5 hover:bg-gray-100 rounded-lg transition-colors" onClick={() => setMenuOpen(!menuOpen)}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                {menuOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <><line x1="3" y1="7" x2="21" y2="7" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="17" x2="15" y2="17" /></>}
              </svg>
            </button>
            <a href="/" className="flex items-center gap-2 shrink-0">
              <img src="/images/logo.png" alt="AJ24" className="h-7 w-auto" />
              <span className="text-[17px] font-black tracking-tight text-black">AJ24</span>
            </a>
          </div>

          <nav className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {categories.slice(0, 8).map((cat) => (
              <a key={cat.id} href={`/category/${cat.slug || cat.id}`} className="relative text-[13px] text-gray-500 hover:text-black whitespace-nowrap transition-colors font-medium px-3.5 py-2 group">
                {cat.name}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-black group-hover:w-4 transition-all duration-300" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-0.5 shrink-0">
            {/* Desktop inline search */}
            <div className="hidden sm:flex items-center relative mr-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" className="absolute left-3 pointer-events-none"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="검색..."
                className="w-[160px] lg:w-[200px] pl-9 pr-3 py-2 bg-gray-100 rounded-full text-[13px] font-medium text-black placeholder:text-gray-400 outline-none focus:bg-gray-50 focus:ring-1 focus:ring-gray-300 transition-all"
              />
            </div>
            {/* Mobile search button */}
            <button onClick={() => setSearchOpen(true)} className="sm:hidden p-2.5 hover:bg-gray-100 rounded-full transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            </button>
            <a href="/mypage/wishlist" className="p-2.5 hover:bg-gray-100 rounded-full transition-colors hidden sm:flex">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>
            </a>
            <button onClick={() => setCartOpen(true)} className="relative p-2.5 hover:bg-gray-100 rounded-full transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></svg>
              {itemCount > 0 && (
                <span className="absolute top-1 right-1 bg-black text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{itemCount > 99 ? "99" : itemCount}</span>
              )}
            </button>
            {isLoading ? (
              <div className="hidden sm:flex ml-2"><span className="w-[72px] h-[34px] bg-gray-100 rounded-full animate-pulse" /></div>
            ) : member ? (
              <div className="hidden sm:flex items-center gap-2 ml-2">
                <a href="/mypage" className="flex items-center gap-1.5 px-4 py-2 bg-black text-white rounded-full text-[11px] font-bold tracking-wide hover:bg-gray-800 transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                  {member.name}
                </a>
              </div>
            ) : (
              <a href="/login" className="hidden sm:flex items-center gap-1.5 ml-2 px-4 py-2 bg-black text-white rounded-full text-[11px] font-bold tracking-wide hover:bg-gray-800 transition-colors active:scale-95">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                LOGIN
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Search Overlay (mobile) */}
      {searchOpen && (
        <div className="fixed inset-0 z-[60] sm:hidden animate-fade-in">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSearchOpen(false)} />
          <div className="relative bg-white animate-slide-down">
            <div className="max-w-[800px] mx-auto px-4 py-8">
              <div className="flex items-center gap-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="상품을 검색해보세요..."
                  className="flex-1 text-base sm:text-xl font-medium outline-none placeholder:text-gray-300 text-black"
                />
                <button onClick={() => setSearchOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </button>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {categories.slice(0, 6).map((cat) => (
                  <button key={cat.id} onClick={() => handleSearch(cat.name)} className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-xs font-medium hover:bg-gray-200 cursor-pointer transition-colors">
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Nav Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-[55] lg:hidden animate-fade-in">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMenuOpen(false)} />
          <div className="absolute top-0 left-0 w-[300px] h-full bg-white animate-slide-down overflow-y-auto">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <a href="/" className="flex items-center gap-2"><img src="/images/logo.png" alt="AJ24" className="h-6 w-auto" /><span className="text-sm font-black tracking-tight">AJ24</span></a>
              <button onClick={() => setMenuOpen(false)} className="p-1.5 hover:bg-gray-100 rounded-lg"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg></button>
            </div>
            <nav className="p-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-2">카테고리</p>
              <div className="space-y-0.5">
                {categories.map((cat) => (
                  <a key={cat.id} href={`/category/${cat.slug || cat.id}`} className="flex items-center justify-between px-3 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors font-medium">
                    {cat.name}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
                  </a>
                ))}
              </div>
            </nav>
            <div className="p-4 border-t border-gray-100">
              <a href="/mypage/wishlist" className="flex items-center gap-3 px-3 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors font-medium">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
                위시리스트
              </a>
            </div>
            <div className="p-4 border-t border-gray-100">
              {isLoading ? (
                <div className="w-full h-[44px] bg-gray-100 rounded-lg animate-pulse" />
              ) : member ? (
                <div className="space-y-2">
                  <a href="/mypage" className="block w-full py-3 bg-black text-white rounded-lg text-sm font-bold text-center">{member.name}님</a>
                  <button onClick={logout} className="w-full py-3 border border-gray-200 rounded-lg text-sm font-bold text-gray-500">로그아웃</button>
                </div>
              ) : (
                <a href="/login" className="block w-full py-3 bg-black text-white rounded-lg text-sm font-bold text-center">LOGIN</a>
              )}
            </div>
          </div>
        </div>
      )}

      <CartDrawer />
    </>
  );
}
