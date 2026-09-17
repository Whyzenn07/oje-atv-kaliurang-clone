"use client";

import { Phone } from "lucide-react";
import { CONTACT, WA_ORDER_LINK } from "@/lib/constants";
import { useState, useEffect } from "react";

export default function MobileStickyBar() {
  const [visible, setVisible] = useState(false);

  // Tampilkan setelah scroll 200px (jangan ganggu hero section)
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 200);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`mobile-sticky-cta transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      role="navigation"
      aria-label="Tombol kontak cepat"
    >
      {/* Tombol Telepon */}
      <a
        href={`tel:${CONTACT.PHONE_HREF}`}
        className="flex-1 flex flex-col items-center justify-center gap-0.5 py-3 text-white active:bg-white/10 transition-colors"
        aria-label="Telepon kami"
      >
        <Phone className="w-5 h-5 text-[#f6a440] fill-[#f6a440]" />
        <span className="text-[11px] font-bold tracking-wide">Telepon</span>
      </a>

      {/* Divider */}
      <div className="w-px bg-white/10 my-2" />

      {/* Tombol Order WhatsApp */}
      <a
        href={WA_ORDER_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-[2] flex flex-col items-center justify-center gap-0.5 py-3 bg-[#25D366] active:bg-[#1fa355] text-white font-black transition-colors"
        aria-label="Order via WhatsApp"
      >
        {/* WA Icon */}
        <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
        </svg>
        <span className="text-[11px] font-black tracking-wide">ORDER SEKARANG</span>
      </a>

      {/* Tombol Booking Form */}
      <div className="w-px bg-white/10 my-2" />
      <a
        href="#booking"
        className="flex-1 flex flex-col items-center justify-center gap-0.5 py-3 text-white active:bg-white/10 transition-colors"
        aria-label="Isi Form Booking"
      >
        <svg className="w-5 h-5 text-[#b51b41]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <span className="text-[11px] font-bold tracking-wide">Booking</span>
      </a>
    </div>
  );
}
