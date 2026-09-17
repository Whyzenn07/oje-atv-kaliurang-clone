"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { X, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";

const galleryImages = [
  { src: "/images/atv-kaliurang-merapi-1.jpeg", alt: "ATV Kaliurang Merapi 1" },
  { src: "/images/atv-kaliurang-merapi-2.jpeg", alt: "ATV Kaliurang Merapi 2" },
  { src: "/images/atv-kaliurang-merapi-3.jpeg", alt: "ATV Kaliurang Merapi 3" },
  { src: "/images/atv-kaliurang-merapi-4.jpeg", alt: "ATV Kaliurang Merapi 4" },
  { src: "/images/atv-kaliurang-merapi-5.jpeg", alt: "ATV Kaliurang Merapi 5" },
  { src: "/images/atv-kaliurang-merapi-6.jpeg", alt: "ATV Kaliurang Merapi 6" },
  { src: "/images/atv-kaliurang-merapi-7.jpeg", alt: "ATV Kaliurang Merapi 7" },
  { src: "/images/atv-kaliurang-merapi-9.jpeg", alt: "ATV Kaliurang Merapi 9" },
  { src: "/images/atv-kaliurang-merapi-10.jpeg", alt: "ATV Kaliurang Merapi 10" },
  { src: "/images/atv-kaliurang-merapi-11.jpeg", alt: "ATV Kaliurang Merapi 11" },
  { src: "/images/atv-kaliurang-merapi-12.jpeg", alt: "ATV Kaliurang Merapi 12" },
  { src: "/images/ATV-KALIURANG-6.jpeg", alt: "ATV Kaliurang Merapi Group" },
];

export default function GallerySection() {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const prev = useCallback(() => {
    if (selectedIdx !== null) {
      setSelectedIdx((selectedIdx - 1 + galleryImages.length) % galleryImages.length);
    }
  }, [selectedIdx]);

  const next = useCallback(() => {
    if (selectedIdx !== null) {
      setSelectedIdx((selectedIdx + 1) % galleryImages.length);
    }
  }, [selectedIdx]);

  const close = useCallback(() => {
    setSelectedIdx(null);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (selectedIdx === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };

    // Prevent body scroll when lightbox is open
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedIdx, prev, next, close]);

  // Touch swipe handlers for lightbox
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;

    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    const minSwipe = 50;

    // Only trigger if horizontal swipe is dominant
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipe) {
      if (deltaX > 0) prev();
      else next();
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  return (
    <section id="gallery" className="py-0">
      {/* Red Gallery Header Bar */}
      <div className="bg-[#b51b41] py-5 text-center shadow-inner">
        <h2 className="text-white font-black text-2xl sm:text-3xl tracking-widest uppercase">
          GALLERY ATV
        </h2>
      </div>

      {/* Responsive Image Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-0.5 bg-gray-100">
        {galleryImages.map((img, i) => (
          <div
            key={i}
            onClick={() => setSelectedIdx(i)}
            className="relative overflow-hidden aspect-square group cursor-pointer bg-gray-900"
          >
            <img
              src={img.src}
              alt={img.alt}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            {/* Hover overlay with zoom icon */}
            <div className="absolute inset-0 bg-[#b51b41]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white">
              <ZoomIn className="w-10 h-10 mb-2 transform group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Lihat Foto
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal with Swipe + Keyboard support */}
      {selectedIdx !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={close}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Close button */}
          <button
            onClick={close}
            className="absolute top-4 right-4 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            aria-label="Tutup lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Prev */}
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            aria-label="Foto sebelumnya"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          {/* Next */}
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            aria-label="Foto selanjutnya"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          {/* Image */}
          <div
            className="relative max-w-5xl max-h-[85vh] p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              key={selectedIdx}
              src={galleryImages[selectedIdx].src}
              alt={galleryImages[selectedIdx].alt}
              className="max-w-full max-h-[80vh] object-contain mx-auto rounded-xl shadow-2xl animate-zoom-in transition-all duration-300"
            />
            <p className="text-center text-white/80 text-xs sm:text-sm font-bold uppercase tracking-wider mt-3">
              Foto {selectedIdx + 1} dari {galleryImages.length}
              <span className="hidden sm:inline text-white/40 ml-3">• ← → untuk navigasi • Esc untuk tutup</span>
            </p>
            {/* Mobile swipe hint */}
            <p className="text-center text-white/40 text-xs mt-1 sm:hidden">
              ← Geser untuk navigasi →
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
