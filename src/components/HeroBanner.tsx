"use client";

import { useState, useEffect, useCallback } from "react";
import { Banner } from "@/lib/types";

interface HeroBannerProps {
  banners: Banner[];
}

export default function HeroBanner({ banners }: HeroBannerProps) {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [progressKey, setProgressKey] = useState(0);

  const goTo = useCallback((idx: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrent(idx);
      setProgressKey((k) => k + 1);
      setTimeout(() => setIsTransitioning(false), 50);
    }, 400);
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
    <section className="relative overflow-hidden bg-black">
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${banners[current].bg_gradient} transition-all duration-1000`} />

      {/* Banner image */}
      {banners[current].image_url && (
        <img src={banners[current].image_url!} alt="" className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${isTransitioning ? "opacity-0" : "opacity-100"}`} />
      )}

      {/* Noise overlay */}
      <div className="absolute inset-0 noise-bg" />

      {/* Decorative grid */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-[20%] w-px h-full bg-white/[0.04]" />
        <div className="absolute top-0 left-[40%] w-px h-full bg-white/[0.04]" />
        <div className="absolute top-0 left-[60%] w-px h-full bg-white/[0.04]" />
        <div className="absolute top-0 left-[80%] w-px h-full bg-white/[0.04]" />
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-white/[0.03] rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-black/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 min-h-[480px] md:min-h-[580px] lg:min-h-[640px] flex items-center">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 w-full py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left content */}
            <div className={`transition-all duration-500 ${isTransitioning ? "opacity-0 translate-y-6" : "opacity-100 translate-y-0"}`}>
              <div className="inline-flex items-center gap-2 px-3 py-1 border border-white/15 rounded-full text-[11px] font-medium text-white/70 mb-6 backdrop-blur-sm">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                AJ24 Collection
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.02] mb-6">
                {banners[current].title}
              </h1>
              <p className="text-base sm:text-lg text-white/50 leading-relaxed mb-10 max-w-md">
                {banners[current].subtitle}
              </p>
              <div className="flex items-center gap-3">
                <a href={banners[current].link_url || "/"} className="group px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-white/90 transition-all active:scale-95 text-sm tracking-wide inline-flex items-center gap-2">
                  SHOP NOW
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:translate-x-1 transition-transform">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Right: Slide counter (desktop) */}
            <div className="hidden lg:flex flex-col items-end justify-end h-full">
              <div className="text-right">
                <span className="text-8xl font-black text-white/10 leading-none block">
                  {String(current + 1).padStart(2, "0")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        {/* Progress bar */}
        <div className="h-0.5 bg-white/10">
          <div key={progressKey} className="h-full bg-white/60 banner-progress" />
        </div>

        {/* Navigation */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              {banners.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`transition-all duration-500 ${
                    i === current
                      ? "text-white text-sm font-bold"
                      : "text-white/30 text-sm font-medium hover:text-white/60"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </button>
              ))}
            </div>
            {banners.length > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => goTo((current - 1 + banners.length) % banners.length)}
                  className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/60 hover:text-white hover:border-white/30 transition-all"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
                <button
                  onClick={() => goTo((current + 1) % banners.length)}
                  className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/60 hover:text-white hover:border-white/30 transition-all"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
