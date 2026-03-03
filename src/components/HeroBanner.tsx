"use client";

import { useState, useEffect } from "react";
import { Banner } from "@/lib/types";

interface HeroBannerProps {
  banners: Banner[];
}

export default function HeroBanner({ banners }: HeroBannerProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (banners.length === 0) return null;

  return (
    <section className="relative overflow-hidden">
      <div
        className={`bg-gradient-to-r ${banners[current].bg_gradient} transition-all duration-700 py-24 md:py-32`}
      >
        <div className="max-w-[1400px] mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 drop-shadow-lg">
            {banners[current].title}
          </h1>
          <p className="text-lg md:text-xl opacity-90">
            {banners[current].subtitle}
          </p>
          <button className="mt-8 px-8 py-3 bg-white text-gray-900 font-semibold rounded-full hover:bg-gray-100 transition-colors shadow-lg">
            SHOP NOW
          </button>
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              i === current ? "bg-white w-6" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
