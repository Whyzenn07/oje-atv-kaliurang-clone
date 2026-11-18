import Link from "next/link";
import { WA_ORDER_LINK } from "@/lib/constants";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#1c1c1c] text-white flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="max-w-lg w-full flex flex-col items-center gap-5">
        <span className="text-xs font-extrabold tracking-[0.25em] uppercase text-[#f6a440]">
          Halaman Tidak Ditemukan
        </span>
        <h1 className="text-7xl sm:text-8xl font-black text-[#b51b41] leading-none">
          404
        </h1>
        <h2 className="text-2xl sm:text-3xl font-extrabold">
          Jalur Offroad Tidak Tersedia
        </h2>
        <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
          Halaman yang Anda cari tidak ditemukan atau sudah dipindahkan. Kembali ke beranda untuk melihat pilihan paket dan booking Jeep Lava Tour Merapi.
        </p>

        <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center bg-[#b51b41] hover:bg-[#8b1626] text-white font-bold text-sm sm:text-base px-7 py-3.5 rounded-full shadow-lg transition-colors"
          >
            Kembali ke Beranda
          </Link>
          <a
            href={WA_ORDER_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm sm:text-base px-7 py-3.5 rounded-full transition-colors"
          >
            Hubungi Admin WA
          </a>
        </div>
      </div>
    </main>
  );
}
