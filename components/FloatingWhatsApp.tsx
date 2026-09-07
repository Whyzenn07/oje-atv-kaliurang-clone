"use client";

import { MessageCircle } from "lucide-react";
import { CONTACT } from "@/lib/constants";

export default function FloatingWhatsApp() {
  return (
    <a
      href={`https://wa.me/${CONTACT.WA_NUMBER}?text=${encodeURIComponent("Halo OJE ATV Kaliurang, saya ingin tanya paket tour.")}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat WhatsApp OJE ATV Kaliurang"
      className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-50 group flex items-center gap-3"
    >
      {/* Tooltip label (desktop only) */}
      <span className="hidden md:block opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300 bg-gray-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap">
        Chat WhatsApp
      </span>

      {/* Button */}
      <div className="relative w-13 h-13 sm:w-14 sm:h-14 bg-green-500 hover:bg-green-400 active:scale-90 rounded-full flex items-center justify-center shadow-xl shadow-green-500/40 transition-all duration-300 hover:scale-110 wa-pulse">
        <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 text-white fill-white transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
      </div>
    </a>
  );
}
