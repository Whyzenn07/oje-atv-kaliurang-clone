"use client";

import { useEffect } from "react";
import Link from "next/link";
import { WA_ORDER_LINK } from "@/lib/constants";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[App/ErrorBoundary]", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-[#1c1c1c] text-white flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="max-w-lg w-full flex flex-col items-center gap-5">
        <span className="text-xs font-extrabold tracking-[0.25em] uppercase text-[#f6a440]">
          Terjadi Gangguan Sistem
        </span>
        <h1 className="text-3xl sm:text-4xl font-black">
          Halaman Gagal Dimuat
        </h1>
        <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
          Maaf, terjadi kendala sementara saat memuat halaman. Silakan coba muat ulang atau hubungi admin kami melalui WhatsApp.
        </p>

        <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center bg-[#b51b41] hover:bg-[#8b1626] text-white font-bold text-sm sm:text-base px-7 py-3.5 rounded-full shadow-lg transition-colors cursor-pointer"
          >
            Muat Ulang Halaman
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm sm:text-base px-7 py-3.5 rounded-full transition-colors"
          >
            Ke Beranda
          </Link>
          <a
            href={WA_ORDER_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center text-[#f6a440] hover:underline font-bold text-sm px-4 py-3"
          >
            Chat WhatsApp
          </a>
        </div>
      </div>
    </main>
  );
}
