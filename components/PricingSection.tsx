"use client";

import { CheckCircle2 } from "lucide-react";
import { WA_ORDER_LINK } from "@/lib/constants";

const trek = [
  "Kaliurang Explore",
  "Lorong Oxygen",
  "Track Ponteng",
  "Trak Air Tempuran",
  "Nawang Jagad",
  "Gardu Pandang & Rumah Putih",
];

const fasilitas = [
  "Pemandu",
  "Foto dan Video",
  "Pelindung Air Untuk HP",
  "Helm, Sepatu dan Locker",
];

export default function PricingSection() {

  return (
    <section id="harga" className="py-0">
      {/* Header Banner: Dark background with ATV overlay */}
      <div className="relative py-12 sm:py-20 md:py-24 overflow-hidden text-center">
        <div className="absolute inset-0">
          <img
            src="/images/atv-kaliurang-merapi-4.jpeg"
            alt="Pricing background"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/80" />
        </div>
        <div className="relative z-10 px-4">
          <p className="text-amber-400 font-extrabold text-xs sm:text-sm tracking-[0.3em] uppercase mb-2 drop-shadow">
            INFORMASI HARGA
          </p>
          <h2 className="text-2xl sm:text-4xl md:text-6xl font-black text-white uppercase tracking-tight">
            ATV KALIURANG MERAPI
          </h2>
          <div className="w-16 h-1 bg-[#b51b41] mx-auto mt-4 rounded" />
        </div>
      </div>

      {/* Pricing Detail Card */}
      <div className="bg-[#f5f5f5] py-12 sm:py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* Left: Image stack with decorative elements */}
            <div className="relative max-w-md mx-auto lg:max-w-none w-full">
              {/* Red block behind image */}
              <div className="absolute top-4 left-0 w-[45%] h-[50%] bg-[#b51b41] rounded-2xl z-0" />

              {/* Main ATV photo */}
              <div className="relative z-10 ml-5 sm:ml-8 mt-5 sm:mt-8 rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="/images/atv-kaliurang-merapi-1.jpeg"
                  alt="ATV melintasi medan Kaliurang"
                  className="w-full h-[260px] sm:h-[380px] md:h-[460px] object-cover"
                />
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-3 right-0 sm:bottom-2 sm:right-0 z-20 bg-white rounded-xl sm:rounded-2xl shadow-xl px-4 py-3 sm:px-6 sm:py-4 text-center border border-gray-100 animate-float-slow hover:scale-105 transition-transform duration-300">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#b51b41] text-white font-black flex items-center justify-center mx-auto mb-1 shadow">
                  OJE
                </div>
                <p className="font-black text-gray-900 text-sm sm:text-lg leading-none">
                  ATV KALIURANG
                </p>
                <p className="text-gray-400 text-[10px] font-bold tracking-widest uppercase mt-1">
                  OFFROAD EXPEDITION
                </p>
              </div>
            </div>

            {/* Right: Pricing details */}
            <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-lg border border-gray-100 mt-4 lg:mt-0">
              <p className="text-amber-500 font-extrabold text-[11px] sm:text-xs tracking-[0.25em] uppercase mb-2">
                PAKET HARGA ATV KALIURANG EXPLORE
              </p>

              {/* Price lines */}
              <div className="space-y-1 mb-3">
                <h3 className="text-2xl sm:text-4xl font-black text-gray-900 leading-tight">
                  ATV SINGLE 300K
                </h3>
                <h3 className="text-xl sm:text-3xl font-black text-[#b51b41] leading-tight">
                  ATV BONCENGAN +50K
                </h3>
              </div>

              {/* Durasi */}
              <div className="inline-block bg-red-50 text-[#b51b41] font-black text-xs sm:text-sm px-3.5 py-1.5 rounded-full mb-5">
                ⏱️ DURASI +2 JAM
              </div>

              <div className="w-full h-px bg-gray-100 mb-5" />

              {/* Trek list */}
              <div className="mb-5">
                <p className="font-extrabold text-gray-900 text-xs sm:text-sm uppercase tracking-wider mb-2.5">
                  Rute &amp; Trek Wisata:
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {trek.map((t) => (
                    <li
                      key={t}
                      className="flex items-center gap-2 text-gray-700 text-xs sm:text-sm font-medium"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#b51b41] shrink-0" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>

              {/* FASILITAS */}
              <div className="mb-6 sm:mb-8">
                <p className="font-extrabold text-[#b51b41] text-xs sm:text-sm uppercase tracking-wider mb-2.5">
                  FASILITAS SUDAH TERMASUK:
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {fasilitas.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2 text-gray-700 text-xs sm:text-sm font-medium"
                    >
                      <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <a
                  href={WA_ORDER_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex-1 inline-flex items-center justify-center gap-2.5 bg-[#b51b41] hover:bg-[#8b1626] active:scale-95 text-white font-extrabold text-base py-4 rounded-xl shadow-lg transition-all group"
                >
                  ORDER SEKARANG
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
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </a>
                <a
                  href="#booking"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 active:scale-95 text-white font-bold text-sm px-6 py-4 rounded-xl transition-all"
                >
                  Form Booking
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
