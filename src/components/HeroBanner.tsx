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
        className={`bg-gradient-to-br ${banners[current].bg_gradient} transition-all duration-700 py-24 md:py-32 lg:py-40 relative`}
      >
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-black/5 rounded-full blur-3xl" />
          <div className="absolute top-1/4 right-1/4 w-px h-40 bg-white/10 rotate-45" />
          <div className="absolute bottom-1/4 left-1/3 w-px h-32 bg-white/10 -rotate-45" />
        </div>

        <div
          className={`max-w-[1400px] mx-auto px-4 sm:px-6 text-white relative z-10 transition-all duration-300 ${
            isTransitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
          }`}
        >
          <div className="max-w-2xl">
            <p className="text-xs sm:text-sm uppercase tracking-[0.25em] text-white/60 font-medium mb-4">
              AJ24 Collection
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-5 leading-[1.05]">
              {banners[current].title}
            </h1>
            <p className="text-base sm:text-lg opacity-70 leading-relaxed mb-10 max-w-lg">
              {banners[current].subtitle}
            </p>
            <div className="flex items-center gap-3">
              <button className="px-8 py-3.5 bg-white text-gray-900 font-bold rounded-full hover:bg-gray-100 transition-all shadow-xl shadow-black/10 active:scale-95 text-sm tracking-wide">
                SHOP NOW
              </button>
              <button className="px-8 py-3.5 border border-white/30 text-white font-bold rounded-full hover:bg-white/10 transition-all text-sm tracking-wide">
                VIEW MORE
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-8 sm:bottom-8 flex items-center gap-4">
        <div className="flex items-center gap-2">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-500 ${
                i === current
                  ? "bg-white w-8 h-2"
                  : "bg-white/30 w-2 h-2 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
        {banners.length > 1 && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => goTo((current - 1 + banners.length) % banners.length)}
              className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-all"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              onClick={() => goTo((current + 1) % banners.length)}
              className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-all"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Slide counter */}
      <div className="absolute top-8 right-8 text-white/40 text-xs font-mono hidden sm:block">
        <span className="text-white font-bold text-sm">{String(current + 1).padStart(2, "0")}</span>
        <span className="mx-1">/</span>
        <span>{String(banners.length).padStart(2, "0")}</span>
      </div>
    </section>
  );
}
