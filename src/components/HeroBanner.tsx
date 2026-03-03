"use client";

import { useState, useEffect } from "react";

const slides = [
  {
    title: "SPRING COLLECTION",
    subtitle: "2026 봄 신상품을 만나보세요",
    bg: "from-indigo-500 to-purple-600",
  },
  {
    title: "MEGA SALE",
    subtitle: "최대 50% 할인 기획전",
    bg: "from-rose-500 to-pink-600",
  },
  {
    title: "NEW ARRIVALS",
    subtitle: "이번 주 새로 입고된 인기상품",
    bg: "from-emerald-500 to-teal-600",
  },
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden">
      <div
        className={`bg-gradient-to-r ${slides[current].bg} transition-all duration-700 py-24 md:py-32`}
      >
        <div className="max-w-[1400px] mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 drop-shadow-lg">
            {slides[current].title}
          </h1>
          <p className="text-lg md:text-xl opacity-90">
            {slides[current].subtitle}
          </p>
          <button className="mt-8 px-8 py-3 bg-white text-gray-900 font-semibold rounded-full hover:bg-gray-100 transition-colors shadow-lg">
            SHOP NOW
          </button>
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
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
