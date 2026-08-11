"use client";

import { ChevronDown, Star } from "lucide-react";

export default function HeroSection() {
  const handleScroll = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background gradient layers */}
      <div className="absolute inset-0 bg-gray-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(245,158,11,0.15)_0%,transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(34,197,94,0.08)_0%,transparent_60%)]" />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(rgba(245,158,11,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.5) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Decorative blobs */}
      <div className="absolute top-20 -left-32 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 -right-32 w-96 h-96 bg-green-500/8 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 text-center px-5 max-w-4xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-amber-500/15 border border-amber-500/30 rounded-full px-4 py-1.5 mb-6">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
            ))}
          </div>
          <span className="text-amber-300 text-xs font-semibold tracking-wider uppercase">
            #1 ATV Tour di Kaliurang
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] mb-5">
          Tour ATV{" "}
          <span className="relative">
            <span className="text-amber-400">Kaliurang</span>
            <svg
              className="absolute -bottom-1 left-0 w-full"
              viewBox="0 0 300 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 5.5C50 2 150 1 299 5.5"
                stroke="#F59E0B"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <br />
          <span className="text-white/90">Harga Terjangkau</span>
          <br />
          <span className="text-amber-400">&amp; Kualitas Terbaik</span>
        </h1>

        {/* Subtitle */}
        <p className="text-gray-400 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
          Rasakan sensasi memacu ATV di jalur offroad berdebu, hutan hijau, dan
          sungai jernih Kaliurang. Pemandu berpengalaman, perlengkapan lengkap,
          foto &amp; video gratis.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => handleScroll("#booking")}
            className="group relative inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-gray-900 font-black text-base sm:text-lg px-8 py-4 rounded-xl shadow-xl shadow-amber-500/30 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            🏍️ Pesan Sekarang
            <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
          </button>
          <button
            onClick={() => handleScroll("#harga")}
            className="inline-flex items-center justify-center gap-2 border-2 border-white/20 hover:border-amber-500/50 text-white font-bold text-base sm:text-lg px-8 py-4 rounded-xl transition-all duration-300 hover:bg-amber-500/10"
          >
            Lihat Paket Harga
          </button>
        </div>

        {/* Stats row */}
        <div className="mt-12 grid grid-cols-3 gap-4 max-w-sm sm:max-w-md mx-auto">
          {[
            { value: "500+", label: "Peserta" },
            { value: "6", label: "Trek Seru" },
            { value: "5⭐", label: "Rating" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-sm"
            >
              <p className="text-amber-400 font-black text-xl sm:text-2xl">
                {stat.value}
              </p>
              <p className="text-gray-400 text-xs sm:text-sm font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={() => handleScroll("#harga")}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-500 hover:text-amber-400 transition-colors animate-bounce"
        aria-label="Scroll down"
      >
        <ChevronDown className="w-7 h-7" />
      </button>
    </section>
  );
}
