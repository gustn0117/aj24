"use client";

import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

function formatPrice(price: number) {
  return price.toLocaleString("ko-KR") + "원";
}

export default function CartDrawer() {
  const { items, removeItem, updateQuantity, getTotal, getItemCount, isCartOpen, setCartOpen } = useCart();
  const { member } = useAuth();

  if (!isCartOpen) return null;

  const total = getTotal();

  return (
    <div className="fixed inset-0 z-[60] animate-fade-in">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setCartOpen(false)} />
      <div className="absolute top-0 right-0 w-full sm:max-w-[400px] h-full bg-white shadow-2xl flex flex-col animate-slide-down">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-black">장바구니 ({getItemCount()})</h2>
          <button onClick={() => setCartOpen(false)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              <p className="mt-3 text-sm font-medium">장바구니가 비어있습니다</p>
              <button onClick={() => setCartOpen(false)} className="mt-4 text-xs font-semibold text-black underline">쇼핑 계속하기</button>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-3">
                  <div className="w-20 h-24 bg-[#f5f5f5] rounded-lg shrink-0 overflow-hidden">
                    {item.image && item.image !== "/images/placeholder.svg" && (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-gray-800 line-clamp-2 mb-1">{item.name}</p>
                    <p className="text-[13px] font-bold text-black">{formatPrice(item.sale_price)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="w-8 h-8 border border-gray-200 rounded flex items-center justify-center text-gray-500 hover:border-gray-400 text-xs">−</button>
                      <span className="text-xs font-semibold w-5 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="w-8 h-8 border border-gray-200 rounded flex items-center justify-center text-gray-500 hover:border-gray-400 text-xs">+</button>
                      <button onClick={() => removeItem(item.productId)} className="ml-auto text-gray-300 hover:text-red-500 transition-colors">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-black">합계</span>
              <span className="text-lg font-black text-black">{formatPrice(total)}</span>
            </div>
            <a
              href={member ? "/checkout" : "/login"}
              className="block w-full py-3.5 bg-black text-white font-bold rounded-lg text-sm text-center hover:bg-gray-800 transition-colors active:scale-[0.98]"
              onClick={() => setCartOpen(false)}
            >
              {member ? "주문하기" : "로그인 후 주문하기"}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
