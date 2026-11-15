// ============================================================
// KONTAK & KONFIGURASI BISNIS — OJE ATV KALIURANG
// ⚙️  CARA GANTI NOMOR:
//   1. Buat file .env.local di root project
//   2. Tambahkan: NEXT_PUBLIC_WA_NUMBER=628XXXXXXXXXX
//   3. Di Vercel/Netlify: set Environment Variable yang sama
//   4. Jangan edit hardcode di sini jika sudah pakai env var
// ============================================================

export const CONTACT = {
  /** Nomor WhatsApp penerima booking (format internasional, tanpa +) */
  WA_NUMBER: process.env.NEXT_PUBLIC_WA_NUMBER || "6281226983990",

  /** Nomor telepon tampilan di website */
  PHONE_DISPLAY: process.env.NEXT_PUBLIC_PHONE_DISPLAY || "081226983990",

  /** Nomor untuk href tel: */
  PHONE_HREF: process.env.NEXT_PUBLIC_PHONE_HREF || "081226983990",

  /** Pesan default WA (dari tombol hero/profil/harga) */
  WA_DEFAULT_MSG: encodeURIComponent(
    "Halo, saya ingin menanyakan paket ATV Kaliurang dan memesan tour."
  ),

  /** URL website produksi */
  WEBSITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "https://ojeatvkaliurang.com/",
} as const;

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://ojeatvkaliurang.com"
).replace(/\/$/, "");

export const MAX_UNITS_PER_DAY = 15;

export const PACKAGE_OPTIONS = [
  "ATV Single (Rp 300.000 / 2 Jam)",
  "ATV Boncengan (Rp 350.000 / 2 Jam)",
] as const;

export function getPackageUnitPrice(paket: string): number {
  if (paket.includes("350.000")) return 350_000;
  if (paket.includes("300.000")) return 300_000;
  return 0;
}

export function getTodayJakartaDateString(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" });
}

/** Link WhatsApp cepat dengan pesan default */
export const WA_LINK = `https://wa.me/${CONTACT.WA_NUMBER}?text=${CONTACT.WA_DEFAULT_MSG}`;

/** Link WhatsApp via API (untuk order) dengan pesan spesifik */
export const WA_ORDER_LINK = `https://api.whatsapp.com/send/?phone=${CONTACT.WA_NUMBER}&text=Hallo+${encodeURIComponent(CONTACT.WEBSITE_URL)}+saya+Mau+Order+ATV&type=phone_number&app_absent=0`;
