"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "Ini nanti dijemput atau ada titik kumpulnya ya min?",
    answer:
      "Kalau menginap di area Kaliurang (terjangkau) bisa langsung jemput pakai Jeep tanpa biaya tambahan. Jika di luar area tersebut, nanti bisa menggunakan jasa antar-jemput atau bertemu langsung di basecamp kami.",
  },
  {
    question: "Apakah harga sudah termasuk dokumentasi?",
    answer:
      "Belum termasuk paket fotografer profesional, tapi jika sekadar dokumentasi foto & video menggunakan HP pribadi nanti bisa dibantu langsung oleh driver kami di setiap spot wisata. Jika ingin dokumentasi foto kamera & drone, silakan tulis di kolom Tambahan saat mengisi Form Booking.",
  },
  {
    question: "Apakah anak satu tahun boleh ikut min?",
    answer:
      "Boleh dong! Kapasitas 1 unit Jeep maksimal untuk 4 penumpang dewasa (+1 balita masih bisa ikut dengan nyaman didampingi orang tua).",
  },
  {
    question: "Apakah di basecamp tersedia toilet & tempat ibadah?",
    answer:
      "Ya, tersedia lengkap. Di basecamp kami tersedia area parkir luas, toilet bersih, kamar bilas, dan mushola/tempat ibadah.",
  },
  {
    question: "Free jas hujan ngga min?",
    answer:
      "Untuk jas hujan beli sendiri yaa, nanti di sekitar lokasi basecamp banyak yang menjual dengan harga terjangkau apabila turun hujan atau ingin basah-basahan di Kali Kuning.",
  },
];

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="py-16 sm:py-24 bg-[#f5f5f5] relative overflow-hidden">
      {/* Subtle decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#b51b41]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 font-extrabold text-[11px] sm:text-xs tracking-[0.25em] uppercase px-4 py-1.5 rounded-full mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            PERTANYAAN UMUM
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-gray-900 uppercase tracking-tight">
            Pertanyaan Yang Sering Diajukan
          </h2>
          <p className="text-gray-500 text-sm sm:text-base mt-3 max-w-lg mx-auto">
            Informasi seputar layanan Wisata Lava Tour Jeep Merapi
          </p>
          <div className="w-16 h-1 bg-[#b51b41] mx-auto mt-4 rounded" />
        </div>

        {/* FAQ List (Flexbox) */}
        <div className="flex flex-col gap-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className={`bg-white rounded-2xl border transition-all duration-300 shadow-sm hover:shadow-md flex flex-col ${
                  isOpen
                    ? "border-[#b51b41]/30 shadow-md"
                    : "border-gray-100"
                }`}
              >
                {/* Question Button */}
                <button
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between gap-4 px-5 sm:px-7 py-4 sm:py-5 text-left group"
                  aria-expanded={isOpen}
                >
                  <span
                    className={`text-sm sm:text-base font-bold transition-colors duration-200 ${
                      isOpen ? "text-[#b51b41]" : "text-gray-800 group-hover:text-[#b51b41]"
                    }`}
                  >
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                      isOpen
                        ? "bg-[#b51b41] text-white rotate-180"
                        : "bg-gray-100 text-gray-500 group-hover:bg-[#b51b41]/10 group-hover:text-[#b51b41]"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                </button>

                {/* Answer Content — Pure Flexbox accordion */}
                <div className={`faq-content ${isOpen ? "faq-open" : ""}`}>
                  <div className="px-5 sm:px-7 pb-5 sm:pb-6 pt-0 flex flex-col">
                    <div className="w-full h-px bg-gray-100 mb-4" />
                    <p className="text-gray-600 text-sm sm:text-[15px] leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-10 sm:mt-12">
          <p className="text-gray-500 text-sm mb-4">
            Masih ada pertanyaan? Hubungi kami langsung!
          </p>
          <a
            href="#booking"
            className="inline-flex items-center gap-2 bg-[#b51b41] hover:bg-[#8b1626] active:scale-95 text-white font-bold text-sm sm:text-base px-7 py-3.5 rounded-full shadow-lg transition-all group"
          >
            Hubungi Kami
            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
