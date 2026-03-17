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
    <section className="relative overflow-hidden bg-gray-100">
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

      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />

      {/* Content */}
      <div className="relative z-10 min-h-[320px] sm:min-h-[400px] lg:min-h-[480px] flex items-center">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 w-full py-12 sm:py-16 lg:py-20">
          <div className={`max-w-xl transition-all duration-500 ${isTransitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}`}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-3 sm:mb-4 drop-shadow-lg">
              {banner.title}
            </h2>
            {banner.subtitle && (
              <p className="text-sm sm:text-base text-white/80 leading-relaxed mb-6 sm:mb-8 max-w-md drop-shadow">
                {banner.subtitle}
              </p>
            )}
            {banner.link_url && (
              <a
                href={banner.link_url}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 font-bold rounded-lg text-sm hover:bg-gray-100 transition-all active:scale-95 shadow-lg"
              >
                자세히 보기
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Bottom progress & dots */}
      {banners.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 z-20">
          {/* Progress bars */}
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
            <div className="flex gap-2 pb-6">
              {banners.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className="relative flex-1 h-1 rounded-full overflow-hidden bg-white/30 cursor-pointer max-w-[120px]"
                >
                  {i === current && (
                    <div key={progressKey} className="absolute inset-0 bg-white rounded-full banner-progress" />
                  )}
                  {i < current && (
                    <div className="absolute inset-0 bg-white rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
