"use client";

import { WA_ORDER_LINK } from "@/lib/constants";

export default function ProfilSection() {
  return (
    <section id="profil" className="py-14 sm:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left: ATV Image with decorative elements */}
          <div className="relative animate-slide-left max-w-lg mx-auto lg:max-w-none w-full">
            {/* Red decorative box behind */}
            <div className="absolute top-3 left-2 sm:top-4 sm:left-4 w-[45%] h-[55%] bg-[#b51b41] rounded-2xl z-0" />

            {/* Main photo */}
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-xl ml-4 sm:ml-6 mt-4 sm:mt-6">
              <img
                src="/images/atv-kaliurang-merapi-10.jpeg"
                alt="ATV Merapi Kaliurang - Jelajahi Hutan dan Sungai"
                className="w-full h-[280px] sm:h-[420px] md:h-[480px] object-cover"
              />
            </div>

            {/* Floating badge bottom right - OJE ATV KALIURANG */}
            <div className="absolute -bottom-3 right-0 sm:bottom-2 sm:right-2 z-20 bg-white rounded-xl sm:rounded-2xl shadow-xl px-4 py-3 sm:px-6 sm:py-4 text-center border border-gray-100 animate-float-slow hover:scale-105 transition-transform duration-300">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#b51b41] text-white font-black flex items-center justify-center mx-auto mb-1 sm:mb-2 text-sm sm:text-lg shadow">
                OJE
              </div>
              <p className="font-black text-gray-900 text-sm sm:text-lg leading-tight tracking-wide">
                ATV KALIURANG
              </p>
              <p className="text-amber-500 text-[10px] sm:text-xs font-bold tracking-widest uppercase mt-0.5">
                MERAPI JOGJA
              </p>
            </div>
          </div>

          {/* Right: Text content */}
          <div className="animate-slide-right mt-4 lg:mt-0">
            <p className="text-amber-500 font-extrabold text-xs sm:text-sm tracking-[0.3em] uppercase mb-2">
              PROFIL
            </p>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-gray-900 uppercase leading-tight mb-3 sm:mb-4 tracking-tight">
              ATV MERAPI KALIURANG
            </h2>
            <div className="w-16 h-1 bg-[#b51b41] rounded mb-5" />

            <div className="space-y-3 sm:space-y-4 text-gray-600 text-sm sm:text-base leading-relaxed text-justify">
              <p className="font-bold text-gray-800 text-base sm:text-lg">
                Rasakan Pengalaman Beraktivitas di Alam Bebas yang Menyenangkan
              </p>
              <p>
                Jelajahi Hutan, Sungai menggunakan ATV dengan keluarga, teman atau
                orang yang Anda cintai. <strong>ATV KALIURANG</strong> adalah kegiatan
                hebat yang memberikan kesempatan untuk menikmati keindahan alam
                bersama keluarga dan teman.
              </p>
              <p>
                Rasakan gairah menerjang jalanan berlumpur, melewati sungai-sungai
                berbatu, ataupun menghadapi tantangan alam lainnya. Tentu, dengan
                pemandangan hutan yang hijau dan suara gemericik air sungai yang
                menenangkan. Semua ini bisa Anda alami hanya dengan berpartisipasi
                dalam paket wisata ATV Kaliurang.
              </p>
              <p>
                Jadi, tunggu apa lagi? Sambut petualangan Anda berikutnya, dan
                rasakan sensasinya bersama <strong>ATV Kaliurang</strong>.
              </p>
            </div>

            <div className="mt-7 pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <a
                href={WA_ORDER_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#b51b41] hover:bg-[#8b1626] active:scale-95 text-white font-bold text-sm sm:text-base px-6 py-3.5 rounded-full shadow-lg transition-all group"
              >
                Pesan Sekarang
                <svg className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
              <a
                href="#harga"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-gray-700 hover:text-[#b51b41] font-bold text-sm sm:text-base px-4 py-3.5 rounded-full border border-gray-200 sm:border-transparent transition-colors"
              >
                Lihat Paket Harga
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
