"use client";

import { MapPin, Clock, Navigation, Phone } from "lucide-react";
import { CONTACT } from "@/lib/constants";

const operatingHours = [
  { day: "Senin – Jumat", hours: "08:00 – 17:00 WIB" },
  { day: "Sabtu – Minggu", hours: "07:00 – 17:00 WIB" },
  { day: "Hari Libur Nasional", hours: "07:00 – 17:00 WIB" },
];

export default function LocationSection() {
  return (
    <section id="lokasi" className="py-0 bg-[#1c1c1c] text-white relative overflow-hidden">
      {/* Header Banner */}
      <div className="relative py-10 sm:py-16 text-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/atv-kaliurang-merapi-5.jpeg"
            alt="Lokasi ATV Kaliurang"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/80" />
        </div>
        <div className="relative z-10 px-4">
          <p className="text-amber-400 font-extrabold text-xs sm:text-sm tracking-[0.3em] uppercase mb-2 drop-shadow">
            LOKASI KAMI
          </p>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight">
            CARA MENUJU LOKASI
          </h2>
          <div className="w-16 h-1 bg-[#b51b41] mx-auto mt-4 rounded" />
        </div>
      </div>

      {/* Content: Info + Map */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-start">
          {/* Left: Location Info */}
          <div className="w-full lg:flex-1 min-w-0">
            {/* Address Card */}
            <div className="bg-gray-900/80 border border-white/10 rounded-2xl p-6 sm:p-8 mb-6 backdrop-blur">
              <div className="flex items-start gap-4 mb-5">
                <div className="w-12 h-12 rounded-xl bg-[#b51b41] flex items-center justify-center shrink-0 shadow-lg">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white mb-1">Alamat</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Kaliurang Timur, RT.05/RW15, Kaliurang, Hargobinangun,
                    Kec. Pakem, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55582
                  </p>
                </div>
              </div>

              {/* Operating Hours */}
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-[#f6a440] flex items-center justify-center shrink-0 shadow-lg">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white mb-2">Jam Operasional</h3>
                  <div className="flex flex-col gap-1.5">
                    {operatingHours.map((item) => (
                      <div key={item.day} className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-gray-400 text-sm">{item.day}</span>
                        <span className="text-white text-sm font-semibold">{item.hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="w-full h-px bg-white/10 mb-5" />

              {/* Quick Contact */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-600 flex items-center justify-center shrink-0 shadow-lg">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Telepon / WhatsApp</p>
                  <a
                    href={`tel:${CONTACT.PHONE_HREF}`}
                    className="text-white font-bold text-base hover:text-[#f6a440] transition-colors"
                  >
                    {CONTACT.PHONE_DISPLAY}
                  </a>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="https://maps.app.goo.gl/q4Kcr7RGfrGbpnJR7"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2.5 bg-[#b51b41] hover:bg-[#8b1626] active:scale-95 text-white font-extrabold text-sm sm:text-base py-4 rounded-xl shadow-lg transition-all group"
              >
                <Navigation className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                Buka Google Maps
              </a>
              <a
                href="#booking"
                className="flex-1 inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 active:scale-95 text-white font-bold text-sm sm:text-base py-4 rounded-xl border border-white/15 transition-all"
              >
                Booking Sekarang
              </a>
            </div>
          </div>

          {/* Right: Google Maps Embed */}
          <div className="w-full lg:flex-1 min-w-0 rounded-2xl overflow-hidden border border-white/10 shadow-2xl aspect-square sm:aspect-[4/3]">
            <iframe
              src="https://maps.google.com/maps?q=-7.59972,110.42861+(OJE+ATV+Kaliurang)&hl=id&z=16&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Lokasi OJE ATV Kaliurang di Google Maps"
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
