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

  const banner = banners[current];

  return (
    <section className="bg-white py-4 sm:py-6">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        {/* Banner container - contained with rounded corners */}
        <div className="relative overflow-hidden rounded-2xl">
          {/* Background image */}
          {banner.image_url ? (
            <img
              src={banner.image_url}
              alt=""
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${isTransitioning ? "opacity-0 scale-105" : "opacity-100 scale-100"}`}
            />
          ) : (
            <div className={`absolute inset-0 bg-gradient-to-br ${banner.bg_gradient} transition-all duration-700`} />
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/25 to-transparent" />

          {/* Content */}
          <div className="relative z-10 min-h-[240px] sm:min-h-[340px] lg:min-h-[420px] flex items-center">
            <div className="w-full px-8 sm:px-12 lg:px-16 py-10 sm:py-14 lg:py-16">
              <div className={`max-w-lg transition-all duration-500 ${isTransitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}`}>
                <h2 className="text-2xl sm:text-3xl lg:text-[42px] font-black text-white leading-tight mb-3 sm:mb-4 drop-shadow-lg">
                  {banner.title}
                </h2>
                {banner.subtitle && (
                  <p className="text-xs sm:text-sm lg:text-base text-white/75 leading-relaxed mb-6 max-w-md drop-shadow">
                    {banner.subtitle}
                  </p>
                )}
                {banner.link_url && (
                  <a
                    href={banner.link_url}
                    className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-white text-gray-900 font-bold rounded-lg text-xs sm:text-sm hover:bg-gray-100 transition-all active:scale-95 shadow-lg"
                  >
                    자세히 보기
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Progress bars - below the banner */}
        {banners.length > 1 && (
          <div className="flex gap-2 mt-3 max-w-[480px]">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className="relative flex-1 h-[3px] rounded-full overflow-hidden bg-gray-200 cursor-pointer"
              >
                {i === current && (
                  <div key={progressKey} className="absolute inset-0 bg-gray-800 rounded-full banner-progress" />
                )}
                {i < current && (
                  <div className="absolute inset-0 bg-gray-800 rounded-full" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
