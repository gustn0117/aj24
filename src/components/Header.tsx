"use client";

import { useState } from "react";
import { Category } from "@/lib/types";

interface HeaderProps {
  categories: Category[];
}

export default function Header({ categories }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-[1400px] mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-full border-2 border-gray-800 flex items-center justify-center">
            <div className="w-2 h-2 bg-red-500 rounded-full" />
          </div>
          <span className="text-lg font-bold tracking-tight">
            <span className="text-gray-400">온</span>
            <span className="text-gray-900">오프마켓</span>
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6 ml-8">
          {categories.map((cat) => (
            <a
              key={cat.id}
              href="#"
              className="text-sm text-gray-700 hover:text-black whitespace-nowrap transition-colors font-medium"
            >
              {cat.name}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <button className="hidden sm:block px-4 py-1.5 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 transition-colors">
            LOGIN
          </button>
          <button className="relative p-2 hover:bg-gray-50 rounded-lg transition-colors">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              0
            </span>
          </button>
          <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>

          {/* Mobile menu toggle */}
          <button
            className="lg:hidden p-2 hover:bg-gray-50 rounded-lg"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <nav className="lg:hidden border-t border-gray-100 bg-white px-4 py-3 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <a
              key={cat.id}
              href="#"
              className="text-sm text-gray-700 hover:text-black px-3 py-1.5 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              {cat.name}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
