"use client";

import { useState, useEffect } from "react";
import { Category } from "@/lib/types";

interface HeaderProps {
  categories: Category[];
}

export default function Header({ categories }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass border-b border-gray-200/60 shadow-sm"
          : "bg-white border-b border-gray-100"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 shrink-0 group">
          <img src="/images/로고.png" alt="AJ24" className="h-9 w-auto" />
          <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            AJ24
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1 ml-10">
          {categories.map((cat) => (
            <a
              key={cat.id}
              href="#"
              className="relative text-sm text-gray-600 hover:text-gray-900 whitespace-nowrap transition-colors font-medium px-3 py-2 rounded-lg hover:bg-gray-50"
            >
              {cat.name}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-all hover:shadow-lg hover:shadow-gray-300/30 active:scale-95">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            LOGIN
          </button>
          <button className="relative p-2.5 hover:bg-gray-100 rounded-xl transition-all active:scale-95">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            <span className="absolute top-1 right-1 bg-gradient-to-r from-red-500 to-rose-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-sm">
              0
            </span>
          </button>
          <button className="p-2.5 hover:bg-gray-100 rounded-xl transition-all active:scale-95">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>

          {/* Mobile menu toggle */}
          <button
            className="lg:hidden p-2.5 hover:bg-gray-100 rounded-xl transition-all active:scale-95"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <>
                  <line x1="4" y1="7" x2="20" y2="7" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="17" x2="20" y2="17" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <nav className="lg:hidden border-t border-gray-100 bg-white px-4 sm:px-6 py-4 animate-slide-down">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <a
                key={cat.id}
                href="#"
                className="text-sm text-gray-600 hover:text-gray-900 px-4 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all font-medium"
              >
                {cat.name}
              </a>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
