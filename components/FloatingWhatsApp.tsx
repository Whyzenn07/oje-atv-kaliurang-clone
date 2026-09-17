"use client";

import { CONTACT } from "@/lib/constants";
import { WhatsAppIcon } from "@/components/SocialIcons";

export default function FloatingWhatsApp() {
  return (
    <a
      href={`https://wa.me/${CONTACT.WA_NUMBER}?text=${encodeURIComponent("Halo OJE ATV Kaliurang, saya ingin tanya paket tour.")}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat WhatsApp OJE ATV Kaliurang"
      // wa-float-btn: class khusus agar naik di atas sticky bar di mobile (via CSS)
      className="wa-float-btn fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-50 group flex items-center gap-3"
    >
      {/* Tooltip label (desktop only) */}
      <span className="hidden md:block opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300 bg-gray-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap">
        Chat WhatsApp
      </span>

      {/* Button */}
      <div className="relative w-14 h-14 bg-[#25D366] hover:bg-[#20ba59] active:scale-90 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 wa-pulse">
        <WhatsAppIcon className="w-7 h-7 text-white fill-white transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
      </div>
    </a>
  );
}
