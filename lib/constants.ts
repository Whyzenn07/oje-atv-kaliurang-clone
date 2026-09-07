// ============================================================
// KONTAK & KONFIGURASI BISNIS — OJE ATV KALIURANG
// Ubah data di sini untuk update semua tautan WA & telpon
// ============================================================

export const CONTACT = {
  /** Nomor WhatsApp penerima booking (format internasional, tanpa +) */
  WA_NUMBER: "6281226983990",

  /** Nomor telepon tampilan di website */
  PHONE_DISPLAY: "081226983990",

  /** Nomor untuk href tel: */
  PHONE_HREF: "081226983990",

  /** Pesan default WA (dari tombol hero/profil/harga) */
  WA_DEFAULT_MSG: encodeURIComponent(
    "Halo, saya ingin menanyakan paket ATV Kaliurang dan memesan tour."
  ),

  /** URL website produksi */
  WEBSITE_URL: "https://ojeatvkaliurang.com/",
} as const;

/** Link WhatsApp cepat dengan pesan default */
export const WA_LINK = `https://wa.me/${CONTACT.WA_NUMBER}?text=${CONTACT.WA_DEFAULT_MSG}`;

/** Link WhatsApp via API (untuk order) dengan pesan spesifik */
export const WA_ORDER_LINK = `https://api.whatsapp.com/send/?phone=${CONTACT.WA_NUMBER}&text=Hallo+${encodeURIComponent(CONTACT.WEBSITE_URL)}+saya+Mau+Order+ATV&type=phone_number&app_absent=0`;
