"use client";

import { useState } from "react";
import { Play, X } from "lucide-react";

export default function TentangKamiSection() {
  const [videoOpen, setVideoOpen] = useState(false);

  return (
    <section className="relative py-20 sm:py-24 bg-[#2d2d2d] text-white overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#b51b41]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left column: Text */}
          <div>
            <p className="text-amber-400 font-extrabold text-xs sm:text-sm tracking-[0.35em] uppercase mb-3">
              www.ojeatvkaliurang.com
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-5 leading-tight">
              Tentang Kami
            </h2>
            <div className="w-16 h-1 bg-[#b51b41] rounded mb-6" />

            <p className="text-gray-300 text-base sm:text-lg leading-relaxed text-justify mb-8">
              ATV Kaliurang adalah tempat yang menyenangkan untuk menjelajahi
              hutan, sungai di Kaliurang Yogyakarta. Tur petualangan ekstrem
              kami dirancang untuk orang dewasa dan anak-anak dari segala usia,
              yang menyukai sensasi menjelajahi tempat-tempat baru bersama-sama.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
              <div>
                <p className="text-2xl sm:text-3xl font-black text-amber-400">100%</p>
                <p className="text-xs text-gray-400 font-semibold uppercase mt-1">
                  Pemandu Profesional
                </p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-[#b51b41]">Safety First</p>
                <p className="text-xs text-gray-400 font-semibold uppercase mt-1">
                  Peralatan Standar Lengkap
                </p>
              </div>
            </div>
          </div>

          {/* Right column: Video Preview Box */}
          <div className="relative">
            <div
              onClick={() => setVideoOpen(true)}
              className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 group cursor-pointer aspect-video"
            >
              <img
                src="/images/ATV-KALIURANG-3.jpeg"
                alt="Video ATV Kaliurang"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/45 group-hover:bg-black/30 transition-colors" />

              {/* Play button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-[#b51b41] text-white flex items-center justify-center shadow-2xl group-hover:scale-115 group-hover:bg-[#8b1626] transition-all duration-300">
                  <Play className="w-8 h-8 fill-white ml-1" />
                </div>
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-center">
                <p className="text-xs sm:text-sm font-extrabold tracking-wider uppercase text-white/90 drop-shadow">
                  Klik untuk Memutar Video Petualangan
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {videoOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
            <button
              onClick={() => setVideoOpen(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/JZ4l4VcAPq4?autoplay=1"
              title="Video ATV Kaliurang"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </section>
  );
}
