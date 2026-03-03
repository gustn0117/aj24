"use client";

import { useState, useEffect, useCallback } from "react";
import { Banner } from "@/lib/types";

interface HeroBannerProps {
  banners: Banner[];
}

export default function HeroBanner({ banners }: HeroBannerProps) {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goTo = useCallback((idx: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrent(idx);
      setTimeout(() => setIsTransitioning(false), 50);
    }, 300);
  }, [isTransitioning]);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      goTo((current + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length, current, goTo]);

  if (banners.length === 0) return null;

  return (
    <section className="relative overflow-hidden">
      <div
        className={`bg-gradient-to-br ${banners[current].bg_gradient} transition-all duration-700 py-20 md:py-28 lg:py-36 relative`}
      >
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-black/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.03] rounded-full" />
        </div>

        <div
          className={`max-w-[1400px] mx-auto px-4 sm:px-6 text-center text-white relative z-10 transition-all duration-300 ${
            isTransitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/15 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            AJ24 SPECIAL
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-5 leading-[1.1]">
            {banners[current].title}
          </h1>
          <p className="text-base sm:text-lg md:text-xl opacity-80 max-w-2xl mx-auto leading-relaxed">
            {banners[current].subtitle}
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <button className="px-8 py-3.5 bg-white text-gray-900 font-bold rounded-2xl hover:bg-gray-100 transition-all shadow-xl shadow-black/10 hover:shadow-2xl hover:shadow-black/20 active:scale-95 text-sm">
              SHOP NOW
            </button>
            <button className="px-8 py-3.5 border-2 border-white/40 text-white font-bold rounded-2xl hover:bg-white/10 transition-all text-sm backdrop-blur-sm">
              VIEW MORE
            </button>
          </div>
        </div>
      </div>

      {/* Navigation dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2.5">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`rounded-full transition-all duration-500 ${
              i === current
                ? "bg-white w-8 h-2.5 shadow-md"
                : "bg-white/40 w-2.5 h-2.5 hover:bg-white/60"
            }`}
          />
        ))}
      </div>

      {/* Arrow buttons */}
      {banners.length > 1 && (
        <>
          <button
            onClick={() => goTo((current - 1 + banners.length) % banners.length)}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            onClick={() => goTo((current + 1) % banners.length)}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </>
      )}
    </section>
  );
}
