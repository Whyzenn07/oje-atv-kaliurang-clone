"use client";

import { MessageCircle } from "lucide-react";

export default function FloatingWhatsApp() {
  return (
    <a
      href="https://wa.me/6281226983990?text=Halo%20OJE%20ATV%20Kaliurang%2C%20saya%20ingin%20bertanya%20mengenai%20paket%20tour%20ATV."
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat WhatsApp"
      className="fixed bottom-6 right-5 z-50 group flex items-center gap-3"
    >
      {/* Tooltip label */}
      <span className="hidden sm:block opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300 bg-gray-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap">
        Chat WhatsApp
      </span>

      {/* Button */}
      <div className="relative w-14 h-14 bg-green-500 hover:bg-green-400 rounded-full flex items-center justify-center shadow-xl shadow-green-500/40 transition-all duration-300 hover:scale-110 active:scale-95">
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-30" />
        <MessageCircle className="w-7 h-7 text-white fill-white" />
      </div>
    </a>
  );
}
