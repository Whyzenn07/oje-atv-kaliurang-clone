"use client";

import Image from "next/image";
import { SITE_ASSETS } from "@/lib/constants";

const cards = SITE_ASSETS.kenapaKamiCards;

export default function KenapaKamiSection() {
  return (
    <section className="relative py-0 overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row shadow-xl">
          {/* Left red panel - "Mengapa Pilih Kami?" */}
          <div className="w-full lg:w-72 shrink-0 bg-[#b51b41] text-white flex flex-col justify-center px-8 py-12 lg:py-16">
            <h2 className="text-3xl sm:text-4xl font-black leading-tight mb-3">
              Mengapa
              <br />
              Pilih Kami?
            </h2>
            <div className="w-12 h-1 bg-amber-400 mb-5 rounded" />
            <p className="text-white/90 text-sm leading-relaxed font-medium">
              Armada Jeep 4x4 terawat, harga jujur sudah termasuk tiket &amp;
              asuransi, serta pelayanan ramah 24 jam.
            </p>
          </div>

          {/* 4 feature cards from wisatamerapi.id */}
          <div className="flex-1 flex flex-wrap">
            {cards.map((card, i) => (
              <div
                key={i}
                className="w-full sm:w-1/2 xl:w-1/4 bg-white border-b sm:border-r border-gray-100 flex flex-col items-center text-center px-5 py-10 sm:py-12 hover:bg-gray-50/80 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group cursor-default"
              >
                <div className="w-20 h-20 mb-5 flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-red-50/50 rounded-2xl opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300 -z-10" />
                  <Image
                    src={card.icon}
                    alt={card.title}
                    width={64}
                    height={64}
                    className="w-16 h-16 object-contain group-hover:scale-115 group-hover:-rotate-3 group-hover:drop-shadow-md transition-all duration-300"
                  />
                </div>

                <h3 className="text-lg font-extrabold text-gray-900 mb-3 tracking-tight group-hover:text-[#b51b41] transition-colors duration-200">
                  {card.title}
                </h3>
                <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
