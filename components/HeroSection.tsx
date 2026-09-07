"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { TiktokIcon, InstagramIcon } from "./SocialIcons";
import { WA_ORDER_LINK } from "@/lib/constants";
import { ChevronLeft, ChevronRight } from "lucide-react";

const heroSlides = [
  {
    image: "/images/ATV-KALIURANG-1.jpeg",
    subtitle: "Selamat Datang Di OJE",
    title: "ATV KALIURANG",
    description:
      "Jelajahi Hutan, Sungai menggunakan ATV Kaliurang bersama keluarga, teman, atau orang terkasih Anda.",
  },
  {
    image: "/images/ATV-KALIURANG-2.jpeg",
    subtitle: "Petualangan Seru & Menantang",
    title: "TREK HUTAN & AIR",
    description:
      "Sensasi memacu adrenalin melintasi sungai berbatu dan jalur offroad alami lereng Gunung Merapi.",
  },
  {
    image: "/images/ATV-KALIURANG-5.jpeg",
    subtitle: "Pengalaman Tak Terlupakan",
    title: "WISATA MERAPI",
    description:
      "Abadikan momen petualangan terhebat Anda dengan fasilitas lengkap, aman, dan pemandu berpengalaman.",
  },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    if (isHovered) return;
    timerRef.current = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [nextSlide, isHovered]);

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Image Slideshow with Silky Smooth Sliding Effect */}
      <div className="absolute inset-0 overflow-hidden">
        {heroSlides.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={slide.image}
              className={`absolute inset-0 transition-all duration-1000 ease-out ${
                isActive
                  ? "opacity-100 scale-100 translate-x-0 z-10"
                  : index < currentSlide
                  ? "opacity-0 scale-105 -translate-x-12 z-0"
                  : "opacity-0 scale-105 translate-x-12 z-0"
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className={`w-full h-full object-cover object-center transition-transform duration-[6000ms] ease-out ${
                  isActive ? "scale-105" : "scale-100"
                }`}
              />
            </div>
          );
        })}
      </div>

      {/* Dark gradient overlay for contrast & readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/45 to-black/75 z-10" />

      {/* Decorative double triangle top-left */}
      <div className="absolute top-20 sm:top-36 left-4 sm:left-24 z-20 pointer-events-none hidden sm:block animate-float-triangle">
        <svg width="65" height="60" viewBox="0 0 65 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
          <polygon points="25,5 48,45 2,45" fill="#f6a440" />
          <polygon points="35,15 62,55 8,55" stroke="#ffffff" strokeWidth="2.5" fill="none" opacity="0.85" />
        </svg>
      </div>

      {/* Left Frosted Glass Floating Social Icons (TikTok & Instagram) */}
      <div className="absolute left-3 sm:left-8 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-3 sm:gap-4">
        <a
          href="https://www.tiktok.com/@oje_atvkaliurang"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="TikTok OJE ATV Kaliurang"
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/30 hover:bg-black hover:border-black hover:shadow-[0_0_20px_rgba(255,0,80,0.6)] backdrop-blur-md flex items-center justify-center border border-white/40 text-white shadow-xl transition-all duration-300 hover:scale-115 active:scale-95 animate-social-float-1 group"
        >
          <TiktokIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white drop-shadow group-hover:scale-110 transition-transform" />
        </a>

        <a
          href="https://www.instagram.com/oje_atvkaliurang/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram OJE ATV Kaliurang"
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/30 hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:border-transparent hover:shadow-[0_0_20px_rgba(225,48,108,0.6)] backdrop-blur-md flex items-center justify-center border border-white/40 text-white shadow-xl transition-all duration-300 hover:scale-115 active:scale-95 animate-social-float-2 group"
        >
          <InstagramIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white drop-shadow group-hover:scale-110 transition-transform" />
        </a>
      </div>

      {/* Prev & Next Slide Buttons (Desktop & Tablet) */}
      <button
        onClick={prevSlide}
        aria-label="Slide Sebelumnya"
        className="absolute left-4 sm:left-20 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/30 hover:bg-black/70 active:scale-90 border border-white/20 text-white backdrop-blur-md hidden md:flex items-center justify-center transition-all duration-300 shadow-xl group hover:border-[#f6a440]"
      >
        <ChevronLeft className="w-6 h-6 text-white group-hover:-translate-x-0.5 transition-transform" />
      </button>

      <button
        onClick={nextSlide}
        aria-label="Slide Selanjutnya"
        className="absolute right-4 sm:right-10 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/30 hover:bg-black/70 active:scale-90 border border-white/20 text-white backdrop-blur-md hidden md:flex items-center justify-center transition-all duration-300 shadow-xl group hover:border-[#f6a440]"
      >
        <ChevronRight className="w-6 h-6 text-white group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* Main Hero Center Content with Slide Entrance Effect */}
      <div className="relative z-20 text-center px-5 sm:px-6 max-w-4xl mx-auto pt-24 sm:pt-32 pb-24">
        {/* Subtitle text */}
        <p
          key={`sub-${currentSlide}`}
          className="text-amber-400 sm:text-amber-400 font-extrabold text-xs sm:text-base md:text-lg tracking-[0.25em] uppercase mb-2 sm:mb-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] animate-fade-up"
        >
          {heroSlides[currentSlide].subtitle}
        </p>

        {/* Big H1 Headline */}
        <h1
          key={`title-${currentSlide}`}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-9xl font-black text-white uppercase tracking-tight leading-[1.05] sm:leading-none mb-4 sm:mb-6 drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] animate-fade-up"
          style={{ animationDuration: "0.8s" }}
        >
          {heroSlides[currentSlide].title}
        </h1>

        {/* Description paragraph */}
        <p
          key={`desc-${currentSlide}`}
          className="text-white/95 text-xs sm:text-base md:text-xl max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed font-semibold drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)] animate-fade-up"
          style={{ animationDuration: "1s" }}
        >
          {heroSlides[currentSlide].description}
        </p>

        {/* Action Button: PROMO */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <a
            href={WA_ORDER_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 border-2 border-white/90 bg-black/40 hover:bg-white hover:text-black active:bg-white active:text-black text-white font-black text-base sm:text-lg px-8 sm:px-10 py-3.5 sm:py-4 rounded-full backdrop-blur-sm shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 group animate-float"
          >
            <span>PROMO</span>
            <svg
              className="w-5 h-5 group-hover:translate-x-1.5 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </a>

          <button
            onClick={() => scrollTo("#harga")}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#b51b41] hover:bg-[#8b1626] active:scale-95 text-white font-bold text-sm sm:text-base px-6 sm:px-8 py-3.5 sm:py-4 rounded-full shadow-lg transition-all"
          >
            Lihat Paket Harga
          </button>
        </div>
      </div>

      {/* Slide Indicators / Dots (Bottom Center) */}
      <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2.5 sm:gap-3 bg-black/40 px-4 py-2 rounded-full backdrop-blur-md border border-white/15">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            aria-label={`Pilih slide ${i + 1}`}
            className={`transition-all duration-500 rounded-full ${
              i === currentSlide
                ? "w-8 sm:w-10 h-2 sm:h-2.5 bg-[#f6a440] shadow-[0_0_12px_rgba(246,164,64,0.8)]"
                : "w-2 sm:w-2.5 h-2 sm:h-2.5 bg-white/50 hover:bg-white/90"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

