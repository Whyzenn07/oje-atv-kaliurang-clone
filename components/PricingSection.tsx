"use client";

import Image from "next/image";
import { CheckCircle2, Clock, Users, CalendarClock } from "lucide-react";
import { JEEP_PACKAGES, SITE_ASSETS, WA_ORDER_LINK } from "@/lib/constants";

export default function PricingSection() {
  const selectPackageAndScroll = (pkg: string) => {
    window.dispatchEvent(new CustomEvent("oje:select-package", { detail: pkg }));
    const el = document.getElementById("booking");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="harga" className="py-0">
      {/* Header Banner: Dark background with Jeep overlay */}
      <div className="relative py-12 sm:py-20 md:py-24 overflow-hidden text-center">
        <div className="absolute inset-0">
          <Image
            src={SITE_ASSETS.pricing.bannerImage}
            alt="Pilihan Paket Jeep Lava Tour Merapi"
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/80" />
        </div>
        <div className="relative z-10 px-4">
          <p className="text-amber-400 font-extrabold text-xs sm:text-sm tracking-[0.3em] uppercase mb-2 drop-shadow">
            PRICELIST RESMI
          </p>
          <h2 className="text-2xl sm:text-4xl md:text-6xl font-black text-white uppercase tracking-tight">
            PILIHAN PAKET JEEP MERAPI
          </h2>
          <p className="text-gray-300 text-xs sm:text-base max-w-2xl mx-auto mt-3">
            Harga tertera adalah harga per 1 Unit Jeep (maksimal 4 penumpang + 1 balita). Sudah termasuk tiket masuk destinasi, driver sebagai pemandu, dan asuransi.
          </p>
          <div className="w-16 h-1 bg-[#b51b41] mx-auto mt-4 rounded" />
        </div>
      </div>

      {/* 6 Jeep Packages Flexbox Cards */}
      <div className="bg-[#f5f5f5] py-12 sm:py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap -mx-3 gap-y-6">
            {JEEP_PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className="w-full md:w-1/2 lg:w-1/3 px-3 flex"
              >
                <div className="w-full bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1">
                  {/* Top: Package Poster Image */}
                  <div>
                    <div className="relative aspect-square w-full bg-gray-900 overflow-hidden group">
                      <Image
                        src={pkg.image}
                        alt={`${pkg.name} - Jeep Lava Tour Merapi`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {"badge" in pkg && pkg.badge && (
                        <span className="absolute top-3 right-3 z-10 bg-[#b51b41] text-white text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                          {pkg.badge}
                        </span>
                      )}
                    </div>

                    {/* Package Header & Price */}
                    <div className="p-5 sm:p-6">
                      <div className="flex items-baseline justify-between gap-2 mb-2">
                        <h3 className="text-xl sm:text-2xl font-black text-gray-900 uppercase tracking-tight">
                          {pkg.name}
                        </h3>
                        <span className="text-xl sm:text-2xl font-black text-[#b51b41] shrink-0">
                          {pkg.priceLabel}
                        </span>
                      </div>

                      {/* Badges: Duration, Schedule, Capacity */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="inline-flex items-center gap-1.5 bg-red-50 text-[#b51b41] font-bold text-xs px-3 py-1 rounded-full">
                          <Clock className="w-3.5 h-3.5 shrink-0" />
                          {pkg.duration}
                        </span>
                        <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 font-bold text-xs px-3 py-1 rounded-full">
                          <Users className="w-3.5 h-3.5 shrink-0" />
                          Maks. 4 Org / Jeep
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-gray-500 text-xs font-semibold mb-4">
                        <CalendarClock className="w-4 h-4 text-[#f6a440] shrink-0" />
                        <span>{pkg.schedule}</span>
                      </div>

                      <div className="w-full h-px bg-gray-100 mb-4" />

                      {/* Rute Destinasi */}
                      <div className="mb-4">
                        <p className="font-extrabold text-gray-900 text-xs uppercase tracking-wider mb-2">
                          Rute &amp; Destinasi:
                        </p>
                        <ul className="flex flex-col gap-1.5">
                          {pkg.routes.map((r) => (
                            <li
                              key={r}
                              className="flex items-start gap-2 text-gray-700 text-xs sm:text-sm font-medium"
                            >
                              <CheckCircle2 className="w-4 h-4 text-[#b51b41] shrink-0 mt-0.5" />
                              <span>{r}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Fasilitas */}
                      <div>
                        <p className="font-extrabold text-[#b51b41] text-xs uppercase tracking-wider mb-2">
                          Sudah Termasuk:
                        </p>
                        <ul className="flex flex-col gap-1.5">
                          {pkg.includes.map((inc) => (
                            <li
                              key={inc}
                              className="flex items-start gap-2 text-gray-700 text-xs sm:text-sm font-medium"
                            >
                              <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                              <span>{inc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action Buttons */}
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-2 flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => selectPackageAndScroll(pkg.selectValue)}
                      className="w-full inline-flex items-center justify-center bg-[#b51b41] hover:bg-[#8b1626] active:scale-95 text-white font-extrabold text-sm py-3.5 px-4 rounded-xl shadow-md transition-all cursor-pointer"
                    >
                      Pilih {pkg.name} &amp; Booking
                    </button>
                    <a
                      href={WA_ORDER_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs py-2.5 px-4 rounded-xl transition-colors"
                    >
                      Tanya Admin via WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
