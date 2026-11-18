"use client";

import { useState, useEffect, useRef, useSyncExternalStore } from "react";
import { Check, Copy } from "lucide-react";
import {
  CONTACT,
  DEPARTURE_TIMES,
  MAX_PASSENGERS_PER_JEEP,
  MAX_UNITS_PER_DAY,
  PACKAGE_OPTIONS,
  getPackageUnitPrice,
  getTodayJakartaDateString,
} from "@/lib/constants";
import { WhatsAppIcon } from "@/components/SocialIcons";

const SPAM_COOLDOWN_SEC = 8; // detik jeda setelah submit
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() || "";

const notePresets = [
  "Request dokumentasi foto & drone",
  "Minta jemput di penginapan area Kaliurang",
  "Bertemu langsung di Basecamp",
];

type BookingReceipt = {
  code: string;
  nama: string;
  whatsapp: string;
  kotaAsal: string;
  paket: string;
  tanggal: string;
  jam: string;
  jumlahPeserta: number;
  jumlah: number;
  estimasi: string;
  catatan: string;
};

type AvailabilityInfo = {
  tanggal: string;
  maxUnits: number;
  bookedUnits: number | null;
  remaining: number | null;
};

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          theme?: "light" | "dark" | "auto";
          callback?: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
        }
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
  }
}

const emptySubscribe = () => () => {};

/** Sanitasi input: hapus karakter berbahaya & batasi panjang */
function sanitize(str: string, maxLen = 200): string {
  return str
    .trim()
    .replace(/[<>"'`\\]/g, "")
    .slice(0, maxLen);
}

export default function BookingForm() {
  const [form, setForm] = useState({
    nama: "",
    whatsapp: "",
    kotaAsal: "",
    paket: "",
    tanggal: "",
    jam: "08:00 WIB",
    jumlahPeserta: "4",
    jumlah: "1",
    catatan: "",
  });
  const [websiteHoneypot, setWebsiteHoneypot] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const minDate = useSyncExternalStore(
    emptySubscribe,
    getTodayJakartaDateString,
    () => ""
  );
  const [submitted, setSubmitted] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [apiError, setApiError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<BookingReceipt | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [lastWaUrl, setLastWaUrl] = useState<string | null>(null);

  // Real-time slot availability state
  const [availability, setAvailability] = useState<AvailabilityInfo | null>(null);
  const [loadingTanggal, setLoadingTanggal] = useState<string | null>(null);
  const isDateReady =
    /^\d{4}-\d{2}-\d{2}$/.test(form.tanggal) && (!minDate || form.tanggal >= minDate);
  const availabilityLoading = isDateReady && loadingTanggal === form.tanggal;

  // Optional Cloudflare Turnstile state
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileContainerRef = useRef<HTMLDivElement | null>(null);
  const turnstileWidgetIdRef = useRef<string | null>(null);

  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Parse unit Jeep & peserta count safely
  const parsedJumlahRaw = Number(form.jumlah);
  const isJumlahValidInt =
    form.jumlah.trim() !== "" &&
    Number.isInteger(parsedJumlahRaw) &&
    parsedJumlahRaw >= 1 &&
    parsedJumlahRaw <= MAX_UNITS_PER_DAY;
  const qty = Math.min(Math.max(parseInt(form.jumlah, 10) || 1, 1), MAX_UNITS_PER_DAY);

  const parsedPesertaRaw = Number(form.jumlahPeserta);
  const isPesertaValidInt =
    form.jumlahPeserta.trim() !== "" &&
    Number.isInteger(parsedPesertaRaw) &&
    parsedPesertaRaw >= 1 &&
    parsedPesertaRaw <= 60;
  const pesertaQty = Math.min(Math.max(parseInt(form.jumlahPeserta, 10) || 1, 1), 60);
  const minRequiredJeeps = Math.ceil(pesertaQty / MAX_PASSENGERS_PER_JEEP);

  const remainingSlots =
    availability && availability.tanggal === form.tanggal ? availability.remaining : null;

  // Inline validation for all 9 fields
  const errors: Record<string, string> = {};
  if (touched.nama && !form.nama.trim()) errors.nama = "Nama wajib diisi";
  else if (touched.nama && form.nama.trim().length < 2) errors.nama = "Nama minimal 2 karakter";
  else if (touched.nama && !/^[\p{L}\s\-.]+$/u.test(form.nama.trim()))
    errors.nama = "Nama hanya boleh huruf, spasi, titik, dan strip";

  if (touched.whatsapp && !form.whatsapp.trim()) errors.whatsapp = "Nomor WhatsApp wajib diisi";
  else if (touched.whatsapp && !/^[0-9+\-\s]+$/.test(form.whatsapp.trim()))
    errors.whatsapp = "Format nomor WhatsApp tidak valid";
  else if (touched.whatsapp && form.whatsapp.replace(/[^0-9]/g, "").length < 9)
    errors.whatsapp = "Nomor WhatsApp minimal 9 digit";
  else if (touched.whatsapp && form.whatsapp.replace(/[^0-9]/g, "").length > 15)
    errors.whatsapp = "Nomor WhatsApp maksimal 15 digit";

  if (touched.kotaAsal && !form.kotaAsal.trim()) errors.kotaAsal = "Kota asal wajib diisi";
  else if (touched.kotaAsal && form.kotaAsal.trim().length < 2)
    errors.kotaAsal = "Kota asal minimal 2 karakter";

  if (touched.paket && !form.paket) errors.paket = "Pilih paket Jeep terlebih dahulu";

  if (touched.tanggal && !form.tanggal) errors.tanggal = "Pilih tanggal tour";
  else if (touched.tanggal && minDate && form.tanggal < minDate)
    errors.tanggal = "Tanggal tidak boleh di masa lalu";

  if (touched.jam && !form.jam.trim()) errors.jam = "Pilih jam keberangkatan";

  if (!isPesertaValidInt) {
    errors.jumlahPeserta = "Jumlah peserta harus antara 1 sampai 60 orang";
  }

  if (!isJumlahValidInt) {
    errors.jumlah = `Jumlah Jeep harus antara 1 sampai ${MAX_UNITS_PER_DAY} unit`;
  } else if (remainingSlots === 0) {
    errors.jumlah = "Kuota Jeep tanggal ini sudah penuh (0 unit tersisa)";
  } else if (remainingSlots !== null && qty > remainingSlots) {
    errors.jumlah = `Sisa slot Jeep tanggal ini hanya ${remainingSlots} unit`;
  }

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  useEffect(() => {
    return () => {
      if (cooldownRef.current) clearInterval(cooldownRef.current);
    };
  }, []);

  // Terima pilihan paket otomatis dari section harga (#harga)
  useEffect(() => {
    const onSelectPkg = (e: Event) => {
      const pkg = (e as CustomEvent<string>).detail;
      if (
        typeof pkg === "string" &&
        (PACKAGE_OPTIONS as readonly string[]).includes(pkg)
      ) {
        setForm((prev) => ({
          ...prev,
          paket: pkg,
          jam: pkg.includes("Sunrise") ? "04:30 WIB (Khusus Sunrise)" : prev.jam,
        }));
        setTouched((prev) => ({ ...prev, paket: false }));
      }
    };
    window.addEventListener("oje:select-package", onSelectPkg);
    return () => window.removeEventListener("oje:select-package", onSelectPkg);
  }, []);

  // Cek slot ketersediaan real-time saat tanggal dipilih
  useEffect(() => {
    const selectedDate = form.tanggal;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(selectedDate) || (minDate && selectedDate < minDate)) {
      return;
    }

    const controller = new AbortController();

    fetch(`/api/availability?tanggal=${encodeURIComponent(selectedDate)}`, {
      signal: controller.signal,
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json?.success) {
          setAvailability({
            tanggal: json.tanggal,
            maxUnits: json.maxUnits ?? MAX_UNITS_PER_DAY,
            bookedUnits: json.bookedUnits ?? null,
            remaining: json.remaining ?? null,
          });
        }
      })
      .catch((err) => {
        if (err?.name !== "AbortError") {
          setAvailability(null);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoadingTanggal((prev) => (prev === selectedDate ? null : prev));
        }
      });

    return () => controller.abort();
  }, [form.tanggal, minDate]);

  // Mount Cloudflare Turnstile jika NEXT_PUBLIC_TURNSTILE_SITE_KEY dikonfigurasi
  useEffect(() => {
    if (!TURNSTILE_SITE_KEY || !turnstileContainerRef.current) return;

    let cancelled = false;
    const renderWidget = () => {
      if (cancelled || !turnstileContainerRef.current || !window.turnstile) return;
      if (turnstileWidgetIdRef.current) return;

      turnstileWidgetIdRef.current = window.turnstile.render(
        turnstileContainerRef.current,
        {
          sitekey: TURNSTILE_SITE_KEY,
          theme: "light",
          callback: (token: string) => setTurnstileToken(token),
          "expired-callback": () => setTurnstileToken(null),
          "error-callback": () => setTurnstileToken(null),
        }
      );
    };

    if (window.turnstile) {
      renderWidget();
    } else {
      const existingScript = document.querySelector<HTMLScriptElement>(
        'script[data-turnstile="true"]'
      );
      if (existingScript) {
        existingScript.addEventListener("load", renderWidget);
      } else {
        const script = document.createElement("script");
        script.src =
          "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
        script.async = true;
        script.defer = true;
        script.dataset.turnstile = "true";
        script.addEventListener("load", renderWidget);
        document.head.appendChild(script);
      }
    }

    return () => {
      cancelled = true;
      if (turnstileWidgetIdRef.current && window.turnstile) {
        window.turnstile.remove(turnstileWidgetIdRef.current);
        turnstileWidgetIdRef.current = null;
      }
    };
  }, []);

  const resetTurnstile = () => {
    if (TURNSTILE_SITE_KEY && turnstileWidgetIdRef.current && window.turnstile) {
      window.turnstile.reset(turnstileWidgetIdRef.current);
      setTurnstileToken(null);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    if (name === "tanggal") {
      if (/^\d{4}-\d{2}-\d{2}$/.test(value) && (!minDate || value >= minDate)) {
        setLoadingTanggal(value);
      } else {
        setLoadingTanggal(null);
      }
    }
    if (name === "paket" && value.includes("Sunrise")) {
      setForm((prev) => ({ ...prev, paket: value, jam: "04:30 WIB (Khusus Sunrise)" }));
      return;
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const formatWAMessage = (bookingCode?: string, totalEstimasi?: string) => {
    const safeName = sanitize(form.nama, 100);
    const safeWA = sanitize(form.whatsapp, 20);
    const safeKota = sanitize(form.kotaAsal, 80);
    const safePaket = sanitize(form.paket, 100);
    const safeJam = sanitize(form.jam, 40);
    const safeCatatan = sanitize(form.catatan, 300);

    const lines = [
      "🚙 *FORM BOOKING JEEP LAVA TOUR MERAPI*",
      "---------------------------------",
      bookingCode ? `🆔 *Kode Booking*: ${bookingCode}` : null,
      `👤 *Nama*: ${safeName}`,
      `📅 *Tanggal*: ${form.tanggal}`,
      `⏰ *Jam*: ${safeJam}`,
      `🎯 *Paket Jeep*: ${safePaket}`,
      `🚙 *Jumlah Jeep*: ${qty} Jeep`,
      `👥 *Jumlah Peserta*: ${pesertaQty} orang`,
      `📱 *Nomor WhatsApp*: ${safeWA}`,
      `🏙️ *Kota Asal*: ${safeKota}`,
      totalEstimasi ? `💰 *Estimasi Total*: ${totalEstimasi}` : null,
      safeCatatan ? `📝 *Tambahan*: ${safeCatatan}` : null,
      "---------------------------------",
      "Hallo kak, saya sudah mengisi Form Booking di website Wisata Merapi. Mohon konfirmasi ketersediaan jadwal & info meeting point/penjemputan. Terima kasih! 🙏",
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
    if (!form.nama || !form.whatsapp || !form.kotaAsal || !form.paket || !form.tanggal || !form.jam) return;
    if (cooldown > 0 || remainingSlots === 0) return;
    if (TURNSTILE_SITE_KEY && !turnstileToken) {
      setApiError("Harap selesaikan verifikasi keamanan terlebih dahulu.");
      return;
    }

    setSubmitted(true);
    setApiError(null);
    setReceipt(null);
    setCopiedCode(false);

    const safeName = sanitize(form.nama, 100);
    const safeWA = sanitize(form.whatsapp, 20);
    const safeKota = sanitize(form.kotaAsal, 80);
    const safeJam = sanitize(form.jam, 40);
    const safeCatatan = form.catatan ? sanitize(form.catatan, 300) : "";
    const selectedPrice = getPackageUnitPrice(form.paket);
    const totalEstimasi = selectedPrice
      ? `Rp ${(selectedPrice * qty).toLocaleString("id-ID")}`
      : "-";

    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama: safeName,
          whatsapp: safeWA,
          kotaAsal: safeKota,
          paket: form.paket,
          tanggal: form.tanggal,
          jam: safeJam,
          jumlahPeserta: pesertaQty,
          jumlah: qty,
          catatan: safeCatatan || null,
          website: websiteHoneypot,
          turnstileToken: turnstileToken || undefined,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setApiError(result.error || "Terjadi kesalahan. Silakan coba lagi.");
        resetTurnstile();
        setSubmitted(false);
        return;
      }

      const bookingCode = result.bookingCode
        ? `#${result.bookingCode}`
        : result.bookingId
        ? `#${result.bookingId.substring(0, 8).toUpperCase()}`
        : "#TERCATAT";
      const text = encodeURIComponent(formatWAMessage(bookingCode, totalEstimasi));
      const waUrl = `https://wa.me/${CONTACT.WA_NUMBER}?text=${text}`;

      setLastWaUrl(waUrl);
      setReceipt({
        code: bookingCode,
        nama: safeName,
        whatsapp: safeWA,
        kotaAsal: safeKota,
        paket: form.paket,
        tanggal: form.tanggal,
        jam: safeJam,
        jumlahPeserta: pesertaQty,
        jumlah: qty,
        estimasi: totalEstimasi,
        catatan: safeCatatan,
      });

      if (remainingSlots !== null) {
        setAvailability((prev) =>
          prev
            ? {
                ...prev,
                remaining: Math.max(0, (prev.remaining ?? 0) - qty),
                bookedUnits: (prev.bookedUnits ?? 0) + qty,
              }
            : null
        );
      }

      setForm({
        nama: "",
        whatsapp: "",
        kotaAsal: "",
        paket: "",
        tanggal: "",
        jam: "08:00 WIB",
        jumlahPeserta: "4",
        jumlah: "1",
        catatan: "",
      });
      setTouched({});
      resetTurnstile();

      setTimeout(() => {
        try {
          window.open(waUrl, "_blank");
        } catch {
          // Tombol manual tersedia di kartu resi
        }
      }, 500);

      startCooldown();
    } catch (err) {
      console.error("[BookingForm] Network error:", err);
      setApiError("Tidak dapat terhubung ke server. Periksa koneksi internet Anda.");
      resetTurnstile();
    } finally {
      setSubmitted(false);
    }
  };

  const handleCopyCode = async () => {
    if (!receipt?.code) return;
    try {
      await navigator.clipboard.writeText(receipt.code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {}
  };

  const toggleNotePreset = (note: string) => {
    setForm((prev) => {
      const current = prev.catatan.trim();
      if (!current) return { ...prev, catatan: note };
      if (current.includes(note)) return prev;
      return { ...prev, catatan: `${current}, ${note}` };
    });
  };

  const isValid =
    form.nama.trim() &&
    form.whatsapp.trim() &&
    form.kotaAsal.trim() &&
    form.paket &&
    form.tanggal &&
    form.jam.trim();
  const hasErrors = Object.keys(errors).length > 0;
  const turnstileMissing = Boolean(TURNSTILE_SITE_KEY && !turnstileToken);
  const isBlocked = !isValid || hasErrors || submitted || cooldown > 0 || turnstileMissing;

  const inputBase =
    "w-full min-w-0 bg-white border text-[#1c1c1c] placeholder-gray-400 rounded-xl px-4 py-3 sm:py-3.5 outline-none transition-colors duration-200 text-base focus:ring-2 focus:ring-[#1c1c1c]/10";
  const inputClass = (err?: string) =>
    `${inputBase} ${err ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-[#1c1c1c]"}`;
  const labelClass = "block text-xs sm:text-sm font-bold text-[#1c1c1c]";

  const unitPrice = getPackageUnitPrice(form.paket);
  const estimate = unitPrice
    ? `Rp ${(unitPrice * qty).toLocaleString("id-ID")}`
    : "Pilih paket Jeep terlebih dahulu";
  const maxSelectableQty =
    remainingSlots !== null && remainingSlots > 0
      ? Math.min(MAX_UNITS_PER_DAY, remainingSlots)
      : MAX_UNITS_PER_DAY;

  const setQty = (n: number) =>
    setForm((prev) => ({
      ...prev,
      jumlah: String(Math.min(Math.max(n, 1), maxSelectableQty)),
    }));

  const setPeserta = (n: number) => {
    const clampedPeserta = Math.min(Math.max(n, 1), 60);
    const suggestedJeeps = Math.min(
      Math.ceil(clampedPeserta / MAX_PASSENGERS_PER_JEEP),
      maxSelectableQty
    );
    setForm((prev) => ({
      ...prev,
      jumlahPeserta: String(clampedPeserta),
      jumlah: String(Math.max(parseInt(prev.jumlah, 10) || 1, suggestedJeeps)),
    }));
  };

  return (
    <section id="booking" className="py-12 sm:py-24 bg-[#f5f5f5] border-b border-gray-200 text-[#1c1c1c] overflow-x-clip">
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 flex flex-col gap-6 sm:gap-8">
        {/* Section Header */}
        <div className="flex flex-col items-start sm:items-center text-left sm:text-center gap-2 sm:gap-3">
          <span className="text-xs font-extrabold tracking-[0.16em] uppercase text-[#b51b41]">
            Form Reservasi Online
          </span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-[#1c1c1c]">
            Form Booking Jeep Merapi
          </h2>
          <p className="text-gray-500 text-xs sm:text-base max-w-xl leading-relaxed">
            Lengkapi data pemesanan Anda. 1 Jeep berkapasitas maksimal 4 penumpang (+1 balita). Kode booking dan estimasi biaya dibuat otomatis sebelum lanjut ke WhatsApp.
          </p>
        </div>

        {/* Error Feedback */}
        {apiError && (
          <div role="alert" className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center">
            <p className="text-red-700 text-sm font-medium">{apiError}</p>
          </div>
        )}

        {/* Booking Receipt Card (Ticket) */}
        {receipt && (
          <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-8 shadow-sm flex flex-col gap-5">
            <div className="flex flex-col items-center text-center gap-2 pb-4 border-b border-dashed border-gray-300">
              <span className="text-xs font-extrabold tracking-widest uppercase text-green-700">
                Booking Tercatat
              </span>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1c1c1c] tracking-tight break-all">
                  {receipt.code}
                </h3>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  aria-label="Salin kode booking"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 text-xs font-bold text-gray-700 transition-colors cursor-pointer"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-600" />
                      <span className="text-green-700">Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs sm:text-sm text-gray-500">
                Tunjukkan kode ini kepada admin/driver saat tiba di Basecamp Wisata Merapi
              </p>
            </div>

            <dl className="flex flex-col gap-2.5 text-sm">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <dt className="text-gray-500 shrink-0">Nama Pemesan</dt>
                <dd className="font-semibold text-[#1c1c1c] sm:text-right break-words min-w-0">{receipt.nama}</dd>
              </div>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <dt className="text-gray-500 shrink-0">Nomor WhatsApp</dt>
                <dd className="font-semibold text-[#1c1c1c] sm:text-right break-words min-w-0">{receipt.whatsapp}</dd>
              </div>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <dt className="text-gray-500 shrink-0">Kota Asal</dt>
                <dd className="font-semibold text-[#1c1c1c] sm:text-right break-words min-w-0">{receipt.kotaAsal}</dd>
              </div>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <dt className="text-gray-500 shrink-0">Paket Jeep</dt>
                <dd className="font-semibold text-[#1c1c1c] sm:text-right break-words min-w-0">{receipt.paket}</dd>
              </div>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <dt className="text-gray-500 shrink-0">Tanggal &amp; Jam</dt>
                <dd className="font-semibold text-[#1c1c1c] sm:text-right">
                  {receipt.tanggal} · {receipt.jam}
                </dd>
              </div>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <dt className="text-gray-500 shrink-0">Jumlah Jeep &amp; Peserta</dt>
                <dd className="font-semibold text-[#1c1c1c] sm:text-right">
                  {receipt.jumlah} Jeep ({receipt.jumlahPeserta} peserta)
                </dd>
              </div>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <dt className="text-gray-500 shrink-0">Estimasi Total</dt>
                <dd className="font-extrabold text-[#1c1c1c] sm:text-right">{receipt.estimasi}</dd>
              </div>
              {receipt.catatan && (
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <dt className="text-gray-500 shrink-0">Tambahan</dt>
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
                  <span>Kirim di WhatsApp</span>
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

        {/* Form Card (9 Fields wisatamerapi.id) */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-10 shadow-sm">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 sm:gap-6 relative">
            {/* Honeypot field tersembunyi untuk menjebak bot */}
            <div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden opacity-0 pointer-events-none">
              <label htmlFor="website_hp">Website</label>
              <input
                type="text"
                id="website_hp"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={websiteHoneypot}
                onChange={(e) => setWebsiteHoneypot(e.target.value)}
              />
            </div>

            <p className="text-xs font-extrabold tracking-wider uppercase text-[#1c1c1c] pb-2.5 border-b border-gray-200">
              1. Data Pemesan
            </p>

            {/* Field 1: Nama */}
            <div className="flex flex-col gap-1.5 sm:gap-2">
              <label htmlFor="nama" className={labelClass}>Nama</label>
              <input
                type="text"
                id="nama"
                name="nama"
                value={form.nama}
                onChange={handleChange}
                onBlur={() => handleBlur("nama")}
                placeholder="Tuliskan nama Anda.."
                required
                className={inputClass(errors.nama)}
              />
              {errors.nama && <p className="text-red-600 text-xs font-medium">{errors.nama}</p>}
            </div>

            {/* Field 2 & 3: Nomor WhatsApp & Kota Asal */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
              <div className="w-full sm:flex-1 min-w-0 flex flex-col gap-1.5 sm:gap-2">
                <label htmlFor="whatsapp" className={labelClass}>Nomor Whatsapp</label>
                <input
                  type="tel"
                  id="whatsapp"
                  name="whatsapp"
                  value={form.whatsapp}
                  onChange={handleChange}
                  onBlur={() => handleBlur("whatsapp")}
                  placeholder="misal : 081226983990"
                  required
                  className={inputClass(errors.whatsapp)}
                />
                {errors.whatsapp && <p className="text-red-600 text-xs font-medium">{errors.whatsapp}</p>}
              </div>

              <div className="w-full sm:flex-1 min-w-0 flex flex-col gap-1.5 sm:gap-2">
                <label htmlFor="kotaAsal" className={labelClass}>Kota Asal</label>
                <input
                  type="text"
                  id="kotaAsal"
                  name="kotaAsal"
                  value={form.kotaAsal}
                  onChange={handleChange}
                  onBlur={() => handleBlur("kotaAsal")}
                  placeholder="Kota asal Anda.."
                  required
                  className={inputClass(errors.kotaAsal)}
                />
                {errors.kotaAsal && <p className="text-red-600 text-xs font-medium">{errors.kotaAsal}</p>}
              </div>
            </div>

            <p className="text-xs font-extrabold tracking-wider uppercase text-[#1c1c1c] pb-2.5 pt-2 border-b border-gray-200">
              2. Detail Paket &amp; Jadwal Jeep
            </p>

            {/* Field 4: Paket Jeep */}
            <div className="flex flex-col gap-1.5 sm:gap-2">
              <label htmlFor="paket" className={labelClass}>Paket Jeep</label>
              <select
                id="paket"
                name="paket"
                value={form.paket}
                onChange={handleChange}
                onBlur={() => handleBlur("paket")}
                required
                className={`${inputClass(errors.paket)} h-[50px] sm:h-[54px] cursor-pointer`}
              >
                <option value="">Pilih Paket..</option>
                {PACKAGE_OPTIONS.map((pkg) => (
                  <option key={pkg} value={pkg}>
                    {pkg}
                  </option>
                ))}
              </select>
              {errors.paket && <p className="text-red-600 text-xs font-medium">{errors.paket}</p>}
            </div>

            {/* Field 5 & 6: Tanggal & Jam */}
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

                {/* Real-time slot availability badge */}
                {availabilityLoading && (
                  <p className="text-xs text-gray-500 font-medium">
                    Mengecek sisa unit Jeep tersedia...
                  </p>
                )}
                {!availabilityLoading &&
                  availability &&
                  availability.tanggal === form.tanggal &&
                  availability.remaining !== null && (
                    <p
                      className={`text-xs font-semibold ${
                        availability.remaining === 0
                          ? "text-red-600"
                          : availability.remaining <= 4
                          ? "text-amber-600"
                          : "text-emerald-700"
                      }`}
                    >
                      {availability.remaining === 0
                        ? "Kuota Jeep penuh (0 unit tersisa). Silakan pilih tanggal lain."
                        : `Tersedia ${availability.remaining} dari ${availability.maxUnits} unit Jeep untuk tanggal ini`}
                    </p>
                  )}
              </div>

              <div className="w-full sm:flex-1 min-w-0 flex flex-col gap-1.5 sm:gap-2">
                <label htmlFor="jam" className={labelClass}>Jam</label>
                <select
                  id="jam"
                  name="jam"
                  value={form.jam}
                  onChange={handleChange}
                  onBlur={() => handleBlur("jam")}
                  required
                  className={`${inputClass(errors.jam)} h-[50px] sm:h-[54px] cursor-pointer`}
                >
                  {DEPARTURE_TIMES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                {errors.jam && <p className="text-red-600 text-xs font-medium">{errors.jam}</p>}
              </div>
            </div>

            {/* Field 7 & 8: Jumlah Peserta & Jumlah Jeep */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
              <div className="w-full sm:flex-1 min-w-0 flex flex-col gap-1.5 sm:gap-2">
                <label htmlFor="jumlahPeserta" className={labelClass}>
                  Jumlah peserta <span className="font-normal text-gray-400">(orang)</span>
                </label>
                <div
                  className={`flex items-center justify-between h-[50px] sm:h-[54px] border rounded-xl px-1.5 bg-white ${
                    errors.jumlahPeserta ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setPeserta(pesertaQty - 1)}
                    disabled={pesertaQty <= 1}
                    aria-label="Kurangi jumlah peserta"
                    className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed text-lg font-bold cursor-pointer transition-colors shrink-0"
                  >
                    &minus;
                  </button>
                  <input
                    type="number"
                    id="jumlahPeserta"
                    name="jumlahPeserta"
                    value={form.jumlahPeserta}
                    onChange={handleChange}
                    onBlur={() => setPeserta(parseInt(form.jumlahPeserta, 10) || 1)}
                    min="1"
                    max="60"
                    placeholder="misal : 10 orang"
                    className="w-20 min-w-0 text-center font-bold text-base outline-none bg-transparent [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                  <button
                    type="button"
                    onClick={() => setPeserta(pesertaQty + 1)}
                    disabled={pesertaQty >= 60}
                    aria-label="Tambah jumlah peserta"
                    className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed text-lg font-bold cursor-pointer transition-colors shrink-0"
                  >
                    +
                  </button>
                </div>
                {errors.jumlahPeserta && (
                  <p className="text-red-600 text-xs font-medium">{errors.jumlahPeserta}</p>
                )}
              </div>

              <div className="w-full sm:flex-1 min-w-0 flex flex-col gap-1.5 sm:gap-2">
                <label htmlFor="jumlah" className={labelClass}>
                  Jumlah Jeep <span className="font-normal text-gray-400">(1 Jeep max 4 penumpang)</span>
                </label>
                <div
                  className={`flex items-center justify-between h-[50px] sm:h-[54px] border rounded-xl px-1.5 bg-white ${
                    errors.jumlah ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setQty(qty - 1)}
                    disabled={qty <= 1}
                    aria-label="Kurangi jumlah Jeep"
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
                    onBlur={() => setQty(parseInt(form.jumlah, 10) || 1)}
                    min="1"
                    max={maxSelectableQty}
                    className="w-16 min-w-0 text-center font-bold text-base outline-none bg-transparent [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                  <button
                    type="button"
                    onClick={() => setQty(qty + 1)}
                    disabled={qty >= maxSelectableQty || remainingSlots === 0}
                    aria-label="Tambah jumlah Jeep"
                    className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed text-lg font-bold cursor-pointer transition-colors shrink-0"
                  >
                    +
                  </button>
                </div>
                {qty < minRequiredJeeps && !errors.jumlah && (
                  <p className="text-amber-700 text-xs font-medium">
                    Info: Untuk {pesertaQty} peserta disarankan minimal {minRequiredJeeps} unit Jeep.
                  </p>
                )}
                {errors.jumlah && <p className="text-red-600 text-xs font-medium">{errors.jumlah}</p>}
              </div>
            </div>

            {/* Field 9: Tambahan */}
            <div className="flex flex-col gap-1.5 sm:gap-2">
              <label htmlFor="catatan" className={labelClass}>
                Tambahan <span className="font-medium text-gray-400">(opsional)</span>
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
                placeholder="misal : dokumentasi foto & drone"
                className={`${inputBase} border-gray-300 focus:border-[#1c1c1c] resize-none`}
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 sm:px-5 sm:py-4">
              <span className="text-xs sm:text-sm text-gray-500 font-semibold">
                Estimasi total ({qty} Jeep · bayar di lokasi)
              </span>
              <strong className={unitPrice ? "text-lg sm:text-xl font-extrabold text-[#1c1c1c]" : "text-xs sm:text-sm font-semibold text-gray-400"}>
                {estimate}
              </strong>
            </div>

            {TURNSTILE_SITE_KEY && (
              <div className="flex justify-center">
                <div ref={turnstileContainerRef} />
              </div>
            )}

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
                  <span>Kirim di Whatsapp</span>
                </>
              )}
            </button>

            <p className="text-center text-[11px] sm:text-xs text-gray-500">
              1 Jeep maksimal 4 penumpang (+1 balita) · Admin Wisata Merapi akan langsung merespons konfirmasi jadwal Anda.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
