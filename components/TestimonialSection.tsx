"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    text: "ATV KALIURANG adalah tambahan yang bagus untuk kegiatan musim panas keluarga kami.",
    name: "Pujiatsuti",
    role: "Toro",
    avatar: "/images/atv-kaliurang-merapi-12.jpeg",
  },
  {
    text: "Tur ATV sangat mengagumkan! Saya dan keluarga saya menikmati setiap momen perjalanan kami. Kami ingin mengucapkan terima kasih atas pelayanan Anda yang luar biasa",
    name: "Andrew",
    role: "Manager",
    avatar: "/images/ATV-KALIURANG-3.jpeg",
  },
  {
    text: "Ini adalah pertama kalinya saya memesan aktivitas ATV. Harganya masuk akal.",
    name: "Alina Ja",
    role: "Pns",
    avatar: "/images/atv-kaliurang-merapi-6.jpeg",
  },
  {
    text: "Pemandu ramah, sabar dan sangat berpengalaman. Jalur airnya seru banget dan dokumentasi fotonya mantap!",
    name: "Bambang Wijaya",
    role: "Traveler",
    avatar: "/images/atv-kaliurang-merapi-1.jpeg",
  },
  {
    text: "Pengalaman terbaik berlibur ke Kaliurang bareng rekan kantor. Unit ATV-nya prima dan terawat!",
    name: "Rizky Pratama",
    role: "Karyawan Swasta",
    avatar: "/images/atv-kaliurang-merapi-2.jpeg",
  },
];

export default function TestimonialSection() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [itemsPerView, setItemsPerView] = useState(3);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  // Responsive items per view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(0, testimonials.length - itemsPerView);

  const nextSlide = useCallback(() => {
    setCurrentIdx((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const prevSlide = useCallback(() => {
    setCurrentIdx((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  useEffect(() => {
    if (isPaused) return;
    timerRef.current = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [nextSlide, isPaused]);

  // Touch swipe handlers
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    setIsPaused(true);
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;

    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    const minSwipe = 50;

    // Only trigger if horizontal swipe is dominant
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipe) {
      if (deltaX > 0) prevSlide();
      else nextSlide();
    }

    touchStartX.current = null;
    touchStartY.current = null;

    // Resume auto-play after a short delay
    setTimeout(() => setIsPaused(false), 3000);
  };

  return (
    <section className="bg-[#f5f5f5] py-20 sm:py-28 px-4 sm:px-6 overflow-hidden select-none">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14 sm:mb-16">
          <p className="text-amber-500 font-extrabold text-xs sm:text-sm tracking-[0.35em] uppercase mb-2">
            TESTIMONIALS
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 uppercase tracking-tight">
            REVIEW JUJUR
          </h2>
          <div className="w-16 h-1 bg-[#b51b41] mx-auto mt-4 rounded-full" />
        </div>

        {/* Carousel Viewport Container */}
        <div
          className="relative overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Smooth Sliding Track */}
          <div
            className="flex transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
            style={{
              transform: `translateX(-${currentIdx * (100 / itemsPerView)}%)`,
            }}
          >
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="px-3 shrink-0"
                style={{ width: `${100 / itemsPerView}%` }}
              >
                <div className="bg-white rounded-3xl p-8 sm:p-9 shadow-[0_10px_35px_rgba(0,0,0,0.06)] hover:shadow-[0_15px_45px_rgba(0,0,0,0.12)] border border-gray-100 transition-all duration-300 flex flex-col justify-between h-full min-h-[340px] relative group hover:-translate-y-1">
                  {/* Top: 5 Golden Stars (Centered) */}
                  <div className="flex justify-center gap-1.5 mb-6">
                    {[...Array(5)].map((_, s) => (
                      <Star
                        key={s}
                        className="w-5 h-5 text-[#f6a440] fill-[#f6a440] drop-shadow-sm"
                      />
                    ))}
                  </div>

                  {/* Middle: Review Text (Centered) */}
                  <p className="text-gray-700 text-center text-sm sm:text-base leading-relaxed mb-8 flex-grow font-medium">
                    {t.text}
                  </p>

                  {/* Bottom: Author Info + Burgundy Quotes */}
                  <div className="flex items-center justify-between pt-5 border-t border-gray-100/80">
                    <div className="flex items-center gap-3.5">
                      <img
                        src={t.avatar}
                        alt={t.name}
                        className="w-13 h-13 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-[#f6a440] shadow-md"
                      />
                      <div className="text-left">
                        <p className="font-extrabold text-gray-900 text-base">
                          {t.name}
                        </p>
                        {t.role && (
                          <p className="text-gray-400 text-xs font-semibold capitalize">
                            {t.role}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Burgundy / Wine Bold Quote Marks (Matching original site) */}
                    <div className="text-[#b51b41] text-4xl sm:text-5xl font-serif font-black leading-none select-none opacity-90 group-hover:scale-110 transition-transform">
                      &rdquo;
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile swipe hint */}
          <p className="text-center text-gray-400 text-xs mt-4 sm:hidden">
            ← Geser untuk lihat review lainnya →
          </p>
        </div>

        {/* Carousel Navigation Controls (Arrows + Dots) */}
        <div className="flex items-center justify-center gap-4 mt-12 sm:mt-14">
          <button
            onClick={prevSlide}
            aria-label="Previous review"
            className="w-11 h-11 rounded-full bg-white border-2 border-gray-200 text-gray-700 hover:bg-[#b51b41] hover:border-[#b51b41] hover:text-white flex items-center justify-center transition-all duration-300 shadow-md active:scale-90"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Indicator Dots */}
          <div className="flex items-center gap-2">
            {[...Array(maxIndex + 1)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIdx(i)}
                aria-label={`Slide ${i + 1}`}
                className={`transition-all duration-500 rounded-full ${
                  i === currentIdx
                    ? "bg-[#b51b41] w-8 h-2.5 shadow-md shadow-red-900/30"
                    : "bg-gray-300 hover:bg-gray-400 w-2.5 h-2.5"
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            aria-label="Next review"
            className="w-11 h-11 rounded-full bg-white border-2 border-gray-200 text-gray-700 hover:bg-[#b51b41] hover:border-[#b51b41] hover:text-white flex items-center justify-center transition-all duration-300 shadow-md active:scale-90"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
