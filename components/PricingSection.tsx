"use client";

import { Check, MapPin, Shield } from "lucide-react";

const trek = [
  "🌿 Kaliurang Explore",
  "🍃 Lorong Oxygen",
  "🛤️ Track Ponteng",
  "💧 Trak Air Tempuran",
  "🏔️ Nawang Jagad",
  "🔭 Gardu Pandang & Rumah Putih",
];

const fasilitas = [
  "Pemandu Berpengalaman",
  "Foto & Video Gratis",
  "Pelindung Air HP",
  "Helm Standar SNI",
  "Sepatu Boot",
  "Locker Aman",
];

const packages = [
  {
    id: "single",
    name: "ATV Single",
    subtitle: "1 Orang / 1 Unit ATV",
    price: "Rp 300.000",
    duration: "+2 Jam",
    highlight: false,
    emoji: "🏍️",
  },
  {
    id: "boncengan",
    name: "ATV Boncengan",
    subtitle: "2 Orang / 1 Unit ATV",
    price: "Rp 350.000",
    duration: "+2 Jam",
    highlight: true,
    emoji: "🚵",
  },
];

export default function PricingSection() {
  const handleBook = (pkgName: string) => {
    const el = document.querySelector("#booking");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      // Pre-select after scroll
      setTimeout(() => {
        const select = document.getElementById(
          "paket"
        ) as HTMLSelectElement | null;
        if (select) {
          select.value = pkgName;
          select.dispatchEvent(new Event("change", { bubbles: true }));
        }
      }, 700);
    }
  };

  return (
    <section id="harga" className="py-20 sm:py-28 bg-gray-950 relative">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-bold tracking-widest uppercase text-amber-400 bg-amber-500/10 border border-amber-500/20 px-4 py-1.5 rounded-full mb-4">
            Paket Harga
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">
            Pilih Paket{" "}
            <span className="text-amber-400">Petualangan</span>
          </h2>
          <p className="text-gray-400 text-base sm:text-lg max-w-xl mx-auto">
            Harga transparan, tanpa biaya tersembunyi. Semua paket sudah
            termasuk pemandu dan perlengkapan keselamatan.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto mb-16">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative rounded-2xl border p-6 sm:p-8 flex flex-col transition-all duration-300 hover:-translate-y-1 ${
                pkg.highlight
                  ? "bg-gradient-to-br from-amber-500/20 via-amber-500/10 to-gray-900 border-amber-500/50 shadow-xl shadow-amber-500/10"
                  : "bg-gray-900/60 border-white/10 hover:border-amber-500/30"
              }`}
            >
              {pkg.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="bg-amber-500 text-gray-900 text-xs font-black px-4 py-1 rounded-full uppercase tracking-wider shadow-md">
                    ⭐ Paling Populer
                  </span>
                </div>
              )}

              <div className="text-4xl mb-3">{pkg.emoji}</div>
              <h3 className="text-xl font-black text-white mb-1">{pkg.name}</h3>
              <p className="text-sm text-gray-400 mb-4">{pkg.subtitle}</p>

              <div className="flex items-end gap-2 mb-2">
                <span className="text-3xl sm:text-4xl font-black text-amber-400">
                  {pkg.price}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-400 text-sm mb-6">
                <Shield className="w-4 h-4 text-green-400" />
                <span>Durasi {pkg.duration}</span>
              </div>

              <button
                onClick={() => handleBook(pkg.name)}
                className={`mt-auto w-full py-3 rounded-xl font-bold text-sm transition-all duration-200 active:scale-95 ${
                  pkg.highlight
                    ? "bg-amber-500 hover:bg-amber-400 text-gray-900 shadow-lg shadow-amber-500/30"
                    : "bg-white/10 hover:bg-amber-500/20 text-white border border-white/10 hover:border-amber-500/40"
                }`}
              >
                Pilih Paket Ini →
              </button>
            </div>
          ))}
        </div>

        {/* Trek & Fasilitas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Trek */}
          <div className="bg-gray-900/50 border border-white/10 rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center">
                <MapPin className="w-4 h-4 text-amber-400" />
              </div>
              <h3 className="text-lg font-bold text-white">Rute Trek</h3>
            </div>
            <ul className="space-y-3">
              {trek.map((item) => (
                <li key={item} className="flex items-center gap-3 text-gray-300 text-sm sm:text-base">
                  <span className="text-base">{item.split(" ")[0]}</span>
                  <span>{item.split(" ").slice(1).join(" ")}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Fasilitas */}
          <div className="bg-gray-900/50 border border-white/10 rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Check className="w-4 h-4 text-green-400" />
              </div>
              <h3 className="text-lg font-bold text-white">
                Fasilitas Termasuk
              </h3>
            </div>
            <ul className="space-y-3">
              {fasilitas.map((item) => (
                <li key={item} className="flex items-center gap-3 text-gray-300 text-sm sm:text-base">
                  <div className="flex-shrink-0 w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-green-400" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
