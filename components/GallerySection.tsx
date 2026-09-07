"use client";

import { useState } from "react";
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

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIdx !== null) {
      setSelectedIdx((selectedIdx - 1 + galleryImages.length) % galleryImages.length);
    }
  };

  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIdx !== null) {
      setSelectedIdx((selectedIdx + 1) % galleryImages.length);
    }
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

      {/* Lightbox Modal */}
      {selectedIdx !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setSelectedIdx(null)}
        >
          {/* Close button */}
          <button
            onClick={() => setSelectedIdx(null)}
            className="absolute top-4 right-4 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Prev */}
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          {/* Next */}
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
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
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
