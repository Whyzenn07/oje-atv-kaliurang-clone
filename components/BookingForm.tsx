"use client";

import { useState, useEffect } from "react";
import { Send, User, Calendar, Bike, Hash, FileText } from "lucide-react";
import { CONTACT } from "@/lib/constants";

const packages = [
  "ATV Single (Rp 300.000 / 2 Jam)",
  "ATV Boncengan (Rp 350.000 / 2 Jam)",
];

export default function BookingForm() {
  const [form, setForm] = useState({
    nama: "",
    paket: "",
    tanggal: "",
    jumlah: "1",
    catatan: "",
  });
  const [minDate, setMinDate] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setMinDate(new Date().toISOString().split("T")[0]);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const formatWAMessage = () => {
    const lines = [
      "🏍️ *BOOKING OJE ATV KALIURANG*",
      "---------------------------------",
      `👤 *Nama*: ${form.nama}`,
      `🎯 *Paket*: ${form.paket}`,
      `📅 *Tanggal Sewa*: ${form.tanggal}`,
      `🔢 *Jumlah Unit*: ${form.jumlah} unit`,
      form.catatan ? `📝 *Catatan*: ${form.catatan}` : null,
      "---------------------------------",
      "Mohon informasi ketersediaan jadwal & detail meeting point. Terima kasih! 🙏",
    ]
      .filter(Boolean)
      .join("\n");
    return lines;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nama || !form.paket || !form.tanggal) return;

    const text = encodeURIComponent(formatWAMessage());
    const waUrl = `https://wa.me/${CONTACT.WA_NUMBER}?text=${text}`;
    setSubmitted(true);
    setTimeout(() => {
      window.open(waUrl, "_blank");
      setSubmitted(false);
    }, 500);
  };

  const isValid = form.nama && form.paket && form.tanggal;

  return (
    <section id="booking" className="py-14 sm:py-24 bg-[#1c1c1c] relative text-white">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#b51b41] to-transparent" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-10">
          <span className="inline-block text-xs font-black tracking-widest uppercase text-green-400 bg-green-500/10 border border-green-500/20 px-3.5 py-1 rounded-full mb-3">
            Form Pemesanan Online
          </span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white mb-3">
            Pesan ATV Via{" "}
            <span className="text-green-400">WhatsApp</span>
          </h2>
          <p className="text-gray-400 text-xs sm:text-base max-w-xl mx-auto">
            Isi form pemesanan berikut untuk reservasi tour ATV Kaliurang secara cepat.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-gray-900/90 border border-white/10 rounded-2xl p-5 sm:p-10 shadow-2xl backdrop-blur">
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            {/* Nama Lengkap */}
            <div>
              <label
                htmlFor="nama"
                className="flex items-center gap-2 text-xs sm:text-sm font-bold text-gray-300 mb-1.5 sm:mb-2"
              >
                <User className="w-4 h-4 text-amber-400" />
                Nama Lengkap <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="nama"
                name="nama"
                value={form.nama}
                onChange={handleChange}
                placeholder="Contoh: Budi Santoso"
                required
                className="w-full bg-gray-950 border border-white/15 focus:border-[#b51b41] focus:ring-2 focus:ring-red-900/30 text-white placeholder-gray-600 rounded-xl px-4 py-3 sm:py-3.5 outline-none transition-all duration-200 text-base"
              />
            </div>

            {/* Pilihan Paket */}
            <div>
              <label
                htmlFor="paket"
                className="flex items-center gap-2 text-xs sm:text-sm font-bold text-gray-300 mb-1.5 sm:mb-2"
              >
                <Bike className="w-4 h-4 text-amber-400" />
                Pilihan Paket <span className="text-red-400">*</span>
              </label>
              <select
                id="paket"
                name="paket"
                value={form.paket}
                onChange={handleChange}
                required
                className="w-full bg-gray-950 border border-white/15 focus:border-[#b51b41] focus:ring-2 focus:ring-red-900/30 text-white rounded-xl px-4 py-3 sm:py-3.5 outline-none transition-all duration-200 text-base cursor-pointer"
              >
                <option value="" className="text-gray-600">
                  — Pilih Paket ATV —
                </option>
                {packages.map((pkg) => (
                  <option key={pkg} value={pkg}>
                    {pkg}
                  </option>
                ))}
              </select>
            </div>

            {/* Tanggal & Jumlah */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <div>
                <label
                  htmlFor="tanggal"
                  className="flex items-center gap-2 text-xs sm:text-sm font-bold text-gray-300 mb-1.5 sm:mb-2"
                >
                  <Calendar className="w-4 h-4 text-amber-400" />
                  Tanggal Sewa <span className="text-red-400">*</span>
                </label>
                <input
                  type="date"
                  id="tanggal"
                  name="tanggal"
                  value={form.tanggal}
                  onChange={handleChange}
                  required
                  min={minDate || undefined}
                  className="w-full bg-gray-950 border border-white/15 focus:border-[#b51b41] focus:ring-2 focus:ring-red-900/30 text-white rounded-xl px-4 py-3 sm:py-3.5 outline-none transition-all duration-200 text-base"
                />
              </div>

              <div>
                <label
                  htmlFor="jumlah"
                  className="flex items-center gap-2 text-xs sm:text-sm font-bold text-gray-300 mb-1.5 sm:mb-2"
                >
                  <Hash className="w-4 h-4 text-amber-400" />
                  Jumlah Unit ATV
                </label>
                <input
                  type="number"
                  id="jumlah"
                  name="jumlah"
                  value={form.jumlah}
                  onChange={handleChange}
                  min="1"
                  max="30"
                  className="w-full bg-gray-950 border border-white/15 focus:border-[#b51b41] focus:ring-2 focus:ring-red-900/30 text-white rounded-xl px-4 py-3 sm:py-3.5 outline-none transition-all duration-200 text-base"
                />
              </div>
            </div>

            {/* Catatan */}
            <div>
              <label
                htmlFor="catatan"
                className="flex items-center gap-2 text-xs sm:text-sm font-bold text-gray-300 mb-1.5 sm:mb-2"
              >
                <FileText className="w-4 h-4 text-amber-400" />
                Catatan / Request Khusus (opsional)
              </label>
              <textarea
                id="catatan"
                name="catatan"
                value={form.catatan}
                onChange={handleChange}
                rows={3}
                placeholder="Contoh: Rombongan 6 orang, request dokumentasi foto..."
                className="w-full bg-gray-950 border border-white/15 focus:border-[#b51b41] focus:ring-2 focus:ring-red-900/30 text-white placeholder-gray-600 rounded-xl px-4 py-3 outline-none transition-all duration-200 resize-none text-base"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isValid || submitted}
              className={`w-full flex items-center justify-center gap-2.5 py-4 rounded-xl font-black text-base sm:text-lg transition-all duration-300 ${
                isValid && !submitted
                  ? "bg-green-600 hover:bg-green-500 active:scale-98 text-white shadow-xl shadow-green-600/30"
                  : "bg-gray-800 text-gray-500 cursor-not-allowed"
              }`}
            >
              {submitted ? (
                <>
                  <svg
                    className="animate-spin w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  Menghubungkan ke WhatsApp...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Kirim Booking via WhatsApp
                </>
              )}
            </button>

            <p className="text-center text-[11px] sm:text-xs text-gray-500">
              Admin kami akan langsung merespon konfirmasi jadwal booking Anda.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
