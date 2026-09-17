"use client";

import { useState, useEffect, useRef } from "react";
import { Send, User, Calendar, Bike, Hash, FileText, ShieldCheck, CheckCircle2 } from "lucide-react";
import { CONTACT } from "@/lib/constants";
import { WhatsAppIcon } from "@/components/SocialIcons";

const SPAM_COOLDOWN_SEC = 8; // detik jeda setelah submit

const packages = [
  "ATV Single (Rp 300.000 / 2 Jam)",
  "ATV Boncengan (Rp 350.000 / 2 Jam)",
];

/** Sanitasi input: hapus karakter berbahaya & batasi panjang */
function sanitize(str: string, maxLen = 200): string {
  return str
    .trim()
    .replace(/[<>"'`\\]/g, "") // hapus karakter berbahaya
    .slice(0, maxLen);
}

export default function BookingForm() {
  const [form, setForm] = useState({
    nama: "",
    paket: "",
    tanggal: "",
    jumlah: "1",
    catatan: "",
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [minDate, setMinDate] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [lastWaUrl, setLastWaUrl] = useState<string | null>(null);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Inline validation
  const errors: Record<string, string> = {};
  if (touched.nama && !form.nama.trim()) errors.nama = "Nama wajib diisi";
  else if (touched.nama && form.nama.trim().length < 2) errors.nama = "Nama minimal 2 karakter";
  if (touched.paket && !form.paket) errors.paket = "Pilih paket terlebih dahulu";
  if (touched.tanggal && !form.tanggal) errors.tanggal = "Pilih tanggal sewa";
  else if (touched.tanggal && minDate && form.tanggal < minDate) errors.tanggal = "Tanggal tidak boleh di masa lalu";

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  useEffect(() => {
    setMinDate(new Date().toISOString().split("T")[0]);
  }, []);

  // Bersihkan interval cooldown saat komponen unmount
  useEffect(() => {
    return () => {
      if (cooldownRef.current) clearInterval(cooldownRef.current);
    };
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const formatWAMessage = (bookingCode?: string) => {
    // Sanitasi semua input sebelum masuk ke pesan WA
    const safeName = sanitize(form.nama, 100);
    const safePaket = sanitize(form.paket, 100);
    const safeCatatan = sanitize(form.catatan, 300);
    const safeJumlah = Math.min(Math.max(parseInt(form.jumlah) || 1, 1), 30);

    const lines = [
      "🏍️ *BOOKING OJE ATV KALIURANG*",
      "---------------------------------",
      bookingCode ? `🆔 *ID Booking*: ${bookingCode}` : null,
      `👤 *Nama*: ${safeName}`,
      `🎯 *Paket*: ${safePaket}`,
      `📅 *Tanggal Sewa*: ${form.tanggal}`,
      `🔢 *Jumlah Unit*: ${safeJumlah} unit`,
      safeCatatan ? `📝 *Catatan*: ${safeCatatan}` : null,
      "---------------------------------",
      "Halo Admin, saya sudah mengisi form booking di website. Mohon informasi ketersediaan jadwal & detail meeting point. Terima kasih! 🙏",
    ]
      .filter(Boolean)
      .join("\n");
    return lines;
  };

  const startCooldown = () => {
    setCooldown(SPAM_COOLDOWN_SEC);
    cooldownRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(cooldownRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nama || !form.paket || !form.tanggal) return;
    if (cooldown > 0) return;

    setSubmitted(true);
    setApiError(null);
    setSuccessMsg(null);

    try {
      // ── Step 1: Simpan ke database via API Route ──────────────────────
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama: sanitize(form.nama, 100),
          paket: form.paket,
          tanggal: form.tanggal,
          jumlah: Math.min(Math.max(parseInt(form.jumlah) || 1, 1), 30),
          catatan: form.catatan ? sanitize(form.catatan, 300) : null,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setApiError(result.error || "Terjadi kesalahan. Silakan coba lagi.");
        setSubmitted(false);
        return;
      }

      // ── Step 2: Siapkan pesan WhatsApp SEBELUM reset form ───────────────
      const bookingCode = result.bookingId
        ? `#${result.bookingId.substring(0, 8).toUpperCase()}`
        : "";
      const text = encodeURIComponent(formatWAMessage(bookingCode));
      const waUrl = `https://wa.me/${CONTACT.WA_NUMBER}?text=${text}`;

      setLastWaUrl(waUrl);
      setSuccessMsg(
        `Booking ${bookingCode} berhasil dicatat di sistem! Admin kami telah menerima notifikasi.`
      );

      // Reset form
      setForm({ nama: "", paket: "", tanggal: "", jumlah: "1", catatan: "" });

      // Coba buka WhatsApp otomatis (jika diizinkan popup browser)
      setTimeout(() => {
        try {
          window.open(waUrl, "_blank");
        } catch {
          // Jika diblokir popup blocker, tombol manual di bawah sudah siap
        }
      }, 500);

      startCooldown();
    } catch (err) {
      console.error("[BookingForm] Network error:", err);
      setApiError("Tidak dapat terhubung ke server. Periksa koneksi internet Anda.");
    } finally {
      setSubmitted(false);
    }
  };

  const isValid = form.nama.trim() && form.paket && form.tanggal;
  const hasErrors = Object.keys(errors).length > 0;
  const isBlocked = !isValid || hasErrors || submitted || cooldown > 0;

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

        {/* Error & Success Feedback */}
        {apiError && (
          <div className="mx-4 sm:mx-0 mb-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
            <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z" />
            </svg>
            <p className="text-red-400 text-sm font-medium">{apiError}</p>
          </div>
        )}
        {successMsg && (
          <div className="mx-4 sm:mx-0 mb-6 bg-green-500/10 border border-green-500/30 rounded-2xl p-6 sm:p-7 flex flex-col items-center gap-3.5 animate-fade-up text-center shadow-xl shadow-green-950/20">
            <div className="w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center mb-1">
              <CheckCircle2 className="w-8 h-8 text-green-400" />
            </div>
            <p className="text-green-400 text-base sm:text-lg font-bold">{successMsg}</p>
            <p className="text-gray-300 text-xs sm:text-sm max-w-lg">
              Data pemesanan Anda sudah tersimpan di database. Tekan tombol di bawah untuk langsung mengirimkan pesan rincian booking ini ke WhatsApp Admin:
            </p>
            {lastWaUrl && (
              <a
                href={lastWaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#25D366] hover:bg-[#20ba59] active:scale-95 text-white font-extrabold text-sm sm:text-base rounded-xl shadow-lg shadow-green-600/30 transition-all duration-200 hover:scale-105"
              >
                <WhatsAppIcon className="w-5 h-5 fill-white" />
                <span>Kirim Rincian Booking via WhatsApp &rarr;</span>
              </a>
            )}
            <p className="text-gray-500 text-[11px] mt-1">
              *Jika aplikasi WhatsApp tidak otomatis terbuka, klik tombol hijau di atas.
            </p>
          </div>
        )}

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
                onBlur={() => handleBlur("nama")}
                placeholder="Contoh: Budi Santoso"
                required
                className={`w-full bg-gray-950 border focus:ring-2 text-white placeholder-gray-600 rounded-xl px-4 py-3 sm:py-3.5 outline-none transition-all duration-200 text-base ${errors.nama ? "border-red-500 focus:border-red-500 focus:ring-red-500/30" : "border-white/15 focus:border-[#b51b41] focus:ring-red-900/30"}`}
              />
              {errors.nama && <p className="text-red-400 text-xs mt-1.5 font-medium">{errors.nama}</p>}
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
                onBlur={() => handleBlur("paket")}
                required
                className={`w-full bg-gray-950 border focus:ring-2 text-white rounded-xl px-4 py-3 sm:py-3.5 outline-none transition-all duration-200 text-base cursor-pointer ${errors.paket ? "border-red-500 focus:border-red-500 focus:ring-red-500/30" : "border-white/15 focus:border-[#b51b41] focus:ring-red-900/30"}`}
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
              {errors.paket && <p className="text-red-400 text-xs mt-1.5 font-medium">{errors.paket}</p>}
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
                  onBlur={() => handleBlur("tanggal")}
                  required
                  min={minDate || undefined}
                  className={`w-full bg-gray-950 border focus:ring-2 text-white rounded-xl px-4 py-3 sm:py-3.5 outline-none transition-all duration-200 text-base ${errors.tanggal ? "border-red-500 focus:border-red-500 focus:ring-red-500/30" : "border-white/15 focus:border-[#b51b41] focus:ring-red-900/30"}`}
                />
                {errors.tanggal && <p className="text-red-400 text-xs mt-1.5 font-medium">{errors.tanggal}</p>}
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
              disabled={isBlocked}
              className={`w-full flex items-center justify-center gap-2.5 py-4 rounded-xl font-black text-base sm:text-lg transition-all duration-300 ${
                !isBlocked
                  ? "bg-green-600 hover:bg-green-500 active:scale-[0.98] text-white shadow-xl shadow-green-600/30"
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
              ) : cooldown > 0 ? (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  Silakan tunggu {cooldown} detik...
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
