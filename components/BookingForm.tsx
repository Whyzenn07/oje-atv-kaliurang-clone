"use client";

import { useState, useEffect, useRef, useSyncExternalStore } from "react";
import { CONTACT } from "@/lib/constants";
import { WhatsAppIcon } from "@/components/SocialIcons";

const SPAM_COOLDOWN_SEC = 8; // detik jeda setelah submit
const MAX_UNITS = 15; // sinkron dengan kuota harian API (MAX_ATV_PER_DAY)

const packages = [
  "ATV Single (Rp 300.000 / 2 Jam)",
  "ATV Boncengan (Rp 350.000 / 2 Jam)",
];

const notePresets = [
  "Request dokumentasi fotografer & editor",
  "Rombongan vacation perusahaan",
  "Pemula, butuh briefing santai",
];

type BookingReceipt = {
  code: string;
  nama: string;
  whatsapp: string;
  paket: string;
  tanggal: string;
  jumlah: number;
  estimasi: string;
  catatan: string;
};

const emptySubscribe = () => () => {};
const getTodayDateString = () =>
  new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" });

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
    whatsapp: "",
    paket: "",
    tanggal: "",
    jumlah: "1",
    catatan: "",
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const minDate = useSyncExternalStore(emptySubscribe, getTodayDateString, () => "");
  const [submitted, setSubmitted] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [apiError, setApiError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<BookingReceipt | null>(null);
  const [lastWaUrl, setLastWaUrl] = useState<string | null>(null);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Inline validation
  const errors: Record<string, string> = {};
  if (touched.nama && !form.nama.trim()) errors.nama = "Nama wajib diisi";
  else if (touched.nama && form.nama.trim().length < 2) errors.nama = "Nama minimal 2 karakter";
  if (touched.whatsapp && !form.whatsapp.trim()) errors.whatsapp = "Nomor WhatsApp wajib diisi";
  else if (touched.whatsapp && form.whatsapp.replace(/[^0-9]/g, "").length < 9) errors.whatsapp = "Nomor WhatsApp minimal 9 digit";
  if (touched.paket && !form.paket) errors.paket = "Pilih paket terlebih dahulu";
  if (touched.tanggal && !form.tanggal) errors.tanggal = "Pilih tanggal sewa";
  else if (touched.tanggal && minDate && form.tanggal < minDate) errors.tanggal = "Tanggal tidak boleh di masa lalu";

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Bersihkan interval cooldown saat komponen unmount
  useEffect(() => {
    return () => {
      if (cooldownRef.current) clearInterval(cooldownRef.current);
    };
  }, []);

  // Terima pilihan paket otomatis dari section harga (#harga)
  useEffect(() => {
    const onSelectPkg = (e: Event) => {
      const pkg = (e as CustomEvent<string>).detail;
      if (typeof pkg === "string" && packages.includes(pkg)) {
        setForm((prev) => ({ ...prev, paket: pkg }));
        setTouched((prev) => ({ ...prev, paket: false }));
      }
    };
    window.addEventListener("oje:select-package", onSelectPkg);
    return () => window.removeEventListener("oje:select-package", onSelectPkg);
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
    const safeWA = sanitize(form.whatsapp, 20);
    const safePaket = sanitize(form.paket, 100);
    const safeCatatan = sanitize(form.catatan, 300);
    const safeJumlah = Math.min(Math.max(parseInt(form.jumlah) || 1, 1), MAX_UNITS);

    const lines = [
      "🏍️ *BOOKING OJE ATV KALIURANG*",
      "---------------------------------",
      bookingCode ? `🆔 *ID Booking*: ${bookingCode}` : null,
      `👤 *Nama*: ${safeName}`,
      `📱 *No. WhatsApp*: ${safeWA}`,
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
    if (!form.nama || !form.whatsapp || !form.paket || !form.tanggal) return;
    if (cooldown > 0) return;

    setSubmitted(true);
    setApiError(null);
    setReceipt(null);

    const safeName = sanitize(form.nama, 100);
    const safeWA = sanitize(form.whatsapp, 20);
    const safeCatatan = form.catatan ? sanitize(form.catatan, 300) : "";
    const safeJumlah = Math.min(Math.max(parseInt(form.jumlah) || 1, 1), MAX_UNITS);
    const selectedPrice = form.paket.includes("350.000") ? 350000 : form.paket.includes("300.000") ? 300000 : 0;
    const totalEstimasi = selectedPrice
      ? `Rp ${(selectedPrice * safeJumlah).toLocaleString("id-ID")}`
      : "-";

    try {
      // ── Step 1: Simpan ke database via API Route ──────────────────────
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama: safeName,
          whatsapp: safeWA,
          paket: form.paket,
          tanggal: form.tanggal,
          jumlah: safeJumlah,
          catatan: safeCatatan || null,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setApiError(result.error || "Terjadi kesalahan. Silakan coba lagi.");
        setSubmitted(false);
        return;
      }

      // ── Step 2: Siapkan pesan WhatsApp SEBELUM reset form ───────────────
      const bookingCode = result.bookingCode
        ? `#${result.bookingCode}`
        : result.bookingId
        ? `#${result.bookingId.substring(0, 8).toUpperCase()}`
        : "#TERCATAT";
      const text = encodeURIComponent(formatWAMessage(bookingCode));
      const waUrl = `https://wa.me/${CONTACT.WA_NUMBER}?text=${text}`;

      setLastWaUrl(waUrl);
      setReceipt({
        code: bookingCode,
        nama: safeName,
        whatsapp: safeWA,
        paket: form.paket,
        tanggal: form.tanggal,
        jumlah: safeJumlah,
        estimasi: totalEstimasi,
        catatan: safeCatatan,
      });

      // Reset form & validation touched state
      setForm({ nama: "", whatsapp: "", paket: "", tanggal: "", jumlah: "1", catatan: "" });
      setTouched({});

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

  const toggleNotePreset = (note: string) => {
    setForm((prev) => {
      const current = prev.catatan.trim();
      if (!current) return { ...prev, catatan: note };
      if (current.includes(note)) return prev;
      return { ...prev, catatan: `${current}, ${note}` };
    });
  };

  const isValid = form.nama.trim() && form.whatsapp.trim() && form.paket && form.tanggal;
  const hasErrors = Object.keys(errors).length > 0;
  const isBlocked = !isValid || hasErrors || submitted || cooldown > 0;

  const inputBase =
    "w-full min-w-0 bg-white border text-[#1c1c1c] placeholder-gray-400 rounded-xl px-4 py-3 sm:py-3.5 outline-none transition-colors duration-200 text-base focus:ring-2 focus:ring-[#1c1c1c]/10";
  const inputClass = (err?: string) =>
    `${inputBase} ${err ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-[#1c1c1c]"}`;
  const labelClass = "block text-xs sm:text-sm font-bold text-[#1c1c1c]";

  const unitPrice = form.paket.includes("350.000") ? 350000 : form.paket.includes("300.000") ? 300000 : 0;
  const qty = Math.min(Math.max(parseInt(form.jumlah) || 1, 1), MAX_UNITS);
  const estimate = unitPrice
    ? `Rp ${(unitPrice * qty).toLocaleString("id-ID")}`
    : "Pilih paket terlebih dahulu";
  const setQty = (n: number) =>
    setForm((prev) => ({ ...prev, jumlah: String(Math.min(Math.max(n, 1), MAX_UNITS)) }));

  return (
    <section id="booking" className="py-12 sm:py-24 bg-[#f5f5f5] border-b border-gray-200 text-[#1c1c1c] overflow-x-hidden">
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 flex flex-col gap-6 sm:gap-8">
        {/* Section Header */}
        <div className="flex flex-col items-start sm:items-center text-left sm:text-center gap-2 sm:gap-3">
          <span className="text-xs font-extrabold tracking-[0.16em] uppercase text-[#b51b41]">
            Form Pemesanan
          </span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-[#1c1c1c]">
            Booking ATV Kaliurang
          </h2>
          <p className="text-gray-500 text-xs sm:text-base max-w-xl leading-relaxed">
            Lengkapi data berikut. Kode booking dan estimasi biaya dibuat otomatis, konfirmasi dilanjutkan melalui WhatsApp.
          </p>
        </div>

        {/* Error Feedback */}
        {apiError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center">
            <p className="text-red-700 text-sm font-medium">{apiError}</p>
          </div>
        )}

        {/* Booking Receipt Card (Ticket) */}
        {receipt && (
          <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-8 shadow-sm flex flex-col gap-5">
            <div className="flex flex-col items-center text-center gap-1 pb-4 border-b border-dashed border-gray-300">
              <span className="text-xs font-extrabold tracking-widest uppercase text-green-700">
                Booking Tercatat
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1c1c1c] tracking-tight break-all">
                {receipt.code}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500">
                Tunjukkan kode ini saat tiba di Basecamp Kaliurang
              </p>
            </div>

            <dl className="flex flex-col gap-2.5 text-sm">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <dt className="text-gray-500 shrink-0">Nama Pemesan</dt>
                <dd className="font-semibold text-[#1c1c1c] sm:text-right break-words min-w-0">{receipt.nama}</dd>
              </div>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <dt className="text-gray-500 shrink-0">WhatsApp</dt>
                <dd className="font-semibold text-[#1c1c1c] sm:text-right break-words min-w-0">{receipt.whatsapp}</dd>
              </div>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <dt className="text-gray-500 shrink-0">Paket</dt>
                <dd className="font-semibold text-[#1c1c1c] sm:text-right break-words min-w-0">{receipt.paket}</dd>
              </div>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <dt className="text-gray-500 shrink-0">Tanggal &amp; Unit</dt>
                <dd className="font-semibold text-[#1c1c1c] sm:text-right">
                  {receipt.tanggal} · {receipt.jumlah} unit
                </dd>
              </div>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <dt className="text-gray-500 shrink-0">Estimasi Total</dt>
                <dd className="font-extrabold text-[#1c1c1c] sm:text-right">{receipt.estimasi}</dd>
              </div>
              {receipt.catatan && (
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <dt className="text-gray-500 shrink-0">Catatan</dt>
                  <dd className="font-medium text-gray-700 sm:text-right break-words min-w-0">{receipt.catatan}</dd>
                </div>
              )}
            </dl>

            <div className="flex flex-col gap-2">
              {lastWaUrl && (
                <a
                  href={lastWaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 bg-[#1c1c1c] hover:bg-black text-white font-bold text-base rounded-xl transition-colors"
                >
                  <WhatsAppIcon className="w-5 h-5 fill-white shrink-0" />
                  <span>Kirim Rincian via WhatsApp</span>
                </a>
              )}
              <button
                type="button"
                onClick={() => setReceipt(null)}
                className="w-full py-2.5 text-xs sm:text-sm font-bold text-gray-500 hover:text-[#1c1c1c] transition-colors cursor-pointer"
              >
                Tutup Ringkasan
              </button>
            </div>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-10 shadow-sm">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 sm:gap-6">
            <p className="text-xs font-extrabold tracking-wider uppercase text-[#1c1c1c] pb-2.5 border-b border-gray-200">
              Data Pemesan
            </p>

            <div className="flex flex-col gap-1.5 sm:gap-2">
              <label htmlFor="nama" className={labelClass}>Nama Lengkap</label>
              <input
                type="text"
                id="nama"
                name="nama"
                value={form.nama}
                onChange={handleChange}
                onBlur={() => handleBlur("nama")}
                placeholder="Contoh: Budi Santoso"
                required
                className={inputClass(errors.nama)}
              />
              {errors.nama && <p className="text-red-600 text-xs font-medium">{errors.nama}</p>}
            </div>

            <div className="flex flex-col gap-1.5 sm:gap-2">
              <label htmlFor="whatsapp" className={labelClass}>Nomor WhatsApp</label>
              <input
                type="tel"
                id="whatsapp"
                name="whatsapp"
                value={form.whatsapp}
                onChange={handleChange}
                onBlur={() => handleBlur("whatsapp")}
                placeholder="Contoh: 081234567890"
                required
                className={inputClass(errors.whatsapp)}
              />
              {errors.whatsapp && <p className="text-red-600 text-xs font-medium">{errors.whatsapp}</p>}
            </div>

            <p className="text-xs font-extrabold tracking-wider uppercase text-[#1c1c1c] pb-2.5 pt-2 border-b border-gray-200">
              Detail Sewa
            </p>

            <div className="flex flex-col gap-1.5 sm:gap-2">
              <label htmlFor="paket" className={labelClass}>Paket</label>
              <select
                id="paket"
                name="paket"
                value={form.paket}
                onChange={handleChange}
                onBlur={() => handleBlur("paket")}
                required
                className={`${inputClass(errors.paket)} h-[50px] sm:h-[54px] cursor-pointer`}
              >
                <option value="">Pilih paket ATV</option>
                {packages.map((pkg) => (
                  <option key={pkg} value={pkg}>
                    {pkg}
                  </option>
                ))}
              </select>
              {errors.paket && <p className="text-red-600 text-xs font-medium">{errors.paket}</p>}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
              <div className="w-full sm:flex-1 min-w-0 flex flex-col gap-1.5 sm:gap-2">
                <label htmlFor="tanggal" className={labelClass}>Tanggal</label>
                <input
                  type="date"
                  id="tanggal"
                  name="tanggal"
                  value={form.tanggal}
                  onChange={handleChange}
                  onBlur={() => handleBlur("tanggal")}
                  required
                  min={minDate || undefined}
                  className={`${inputClass(errors.tanggal)} h-[50px] sm:h-[54px]`}
                />
                {errors.tanggal && <p className="text-red-600 text-xs font-medium">{errors.tanggal}</p>}
              </div>

              <div className="w-full sm:flex-1 min-w-0 flex flex-col gap-1.5 sm:gap-2">
                <label htmlFor="jumlah" className={labelClass}>Jumlah Unit</label>
                <div className="flex items-center justify-between h-[50px] sm:h-[54px] border border-gray-300 rounded-xl px-1.5 bg-white">
                  <button
                    type="button"
                    onClick={() => setQty(qty - 1)}
                    disabled={qty <= 1}
                    aria-label="Kurangi jumlah unit"
                    className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed text-lg font-bold cursor-pointer transition-colors shrink-0"
                  >
                    &minus;
                  </button>
                  <input
                    type="number"
                    id="jumlah"
                    name="jumlah"
                    value={form.jumlah}
                    onChange={handleChange}
                    min="1"
                    max={MAX_UNITS}
                    className="w-16 min-w-0 text-center font-bold text-base outline-none bg-transparent [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                  <button
                    type="button"
                    onClick={() => setQty(qty + 1)}
                    disabled={qty >= MAX_UNITS}
                    aria-label="Tambah jumlah unit"
                    className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed text-lg font-bold cursor-pointer transition-colors shrink-0"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 sm:gap-2">
              <label htmlFor="catatan" className={labelClass}>
                Catatan <span className="font-medium text-gray-400">(opsional)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {notePresets.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => toggleNotePreset(preset)}
                    className="text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded-full px-3.5 py-1.5 text-left transition-colors cursor-pointer"
                  >
                    {preset}
                  </button>
                ))}
              </div>
              <textarea
                id="catatan"
                name="catatan"
                value={form.catatan}
                onChange={handleChange}
                rows={3}
                placeholder="Contoh: Rombongan 6 orang, request dokumentasi foto"
                className={`${inputBase} border-gray-300 focus:border-[#1c1c1c] resize-none`}
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 sm:px-5 sm:py-4">
              <span className="text-xs sm:text-sm text-gray-500 font-semibold">
                Estimasi total (bayar di lokasi)
              </span>
              <strong className={unitPrice ? "text-lg sm:text-xl font-extrabold text-[#1c1c1c]" : "text-xs sm:text-sm font-semibold text-gray-400"}>
                {estimate}
              </strong>
            </div>

            <button
              type="submit"
              disabled={isBlocked}
              className={`w-full flex items-center justify-center gap-2.5 py-4 rounded-xl font-extrabold text-base sm:text-lg transition-colors duration-200 ${
                !isBlocked
                  ? "bg-[#1c1c1c] hover:bg-black text-white cursor-pointer"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {submitted ? (
                <>
                  <svg className="animate-spin w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Menyimpan booking...
                </>
              ) : cooldown > 0 ? (
                <>Silakan tunggu {cooldown} detik...</>
              ) : (
                <>
                  <WhatsAppIcon className="w-5 h-5 fill-current shrink-0" />
                  <span>Kirim Booking via WhatsApp</span>
                </>
              )}
            </button>

            <p className="text-center text-[11px] sm:text-xs text-gray-500">
              Maksimal {MAX_UNITS} unit per hari · Admin kami akan langsung merespon konfirmasi jadwal booking Anda.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
