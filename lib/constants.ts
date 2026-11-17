// ============================================================
// KONTAK, KONFIGURASI BISNIS, & ASET GAMBAR/VIDEO — OJE ATV KALIURANG
// ⚙️  CARA GANTI GAMBAR / VIDEO CLIENT:
//   1. Simpan gambar baru di folder public/images/
//   2. Ubah path di bagian SITE_ASSETS di bawah ini (cukup 1 file ini saja!)
//   3. Untuk link video YouTube, bisa tempel link biasa (watch?v= / youtu.be/)
//      maupun link embed.
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

  /** Link Sosial Media */
  TIKTOK_URL: "https://www.tiktok.com/@oje_atvkaliurang",
  INSTAGRAM_URL: "https://www.instagram.com/oje_atvkaliurang/",
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

/**
 * Konversi otomatis link YouTube biasa (watch?v= / youtu.be / shorts) menjadi embed URL.
 */
export function toYoutubeEmbedUrl(rawUrl: string): string {
  const trimmed = rawUrl.trim();
  if (trimmed.includes("/embed/")) return trimmed;

  const watchMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]{6,})/);
  if (watchMatch) {
    return `https://www.youtube.com/embed/${watchMatch[1]}?autoplay=1`;
  }

  const shortMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{6,})/);
  if (shortMatch) {
    return `https://www.youtube.com/embed/${shortMatch[1]}?autoplay=1`;
  }

  const shortsMatch = trimmed.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{6,})/);
  if (shortsMatch) {
    return `https://www.youtube.com/embed/${shortsMatch[1]}?autoplay=1`;
  }

  return trimmed;
}

// ============================================================
// PUSAT PENGATURAN SELURUH GAMBAR, GALERI, & VIDEO WEBSITE
// ============================================================
export const SITE_ASSETS = {
  /** 1. Logo Website (Navbar, Footer, Favicon, Manifest) */
  logo: "/images/logos.png",

  /** 2. Gambar Preview Share WhatsApp / OpenGraph */
  ogImage: "/images/ATV-KALIURANG-1.jpeg",

  /** 3. Slide Hero Utama (3 Slide) */
  heroSlides: [
    {
      image: "/images/ATV-KALIURANG-1.jpeg",
      subtitle: "Selamat Datang Di OJE",
      title: "ATV KALIURANG",
      description:
        "Jelajahi Hutan, Sungai menggunakan ATV Kaliurang bersama keluarga, teman, atau orang terkasih Anda.",
    },
    {
      image: "/images/ATV-KALIURANG-2.jpeg",
      subtitle: "Petualangan Seru & Menantang",
      title: "TREK HUTAN & AIR",
      description:
        "Sensasi memacu adrenalin melintasi sungai berbatu dan jalur offroad alami lereng Gunung Merapi.",
    },
    {
      image: "/images/ATV-KALIURANG-5.jpeg",
      subtitle: "Pengalaman Tak Terlupakan",
      title: "WISATA MERAPI",
      description:
        "Abadikan momen petualangan terhebat Anda dengan fasilitas lengkap, aman, dan pemandu berpengalaman.",
    },
  ],

  /** 4. Foto Bagian Profil (#profil) */
  profilImage: "/images/atv-kaliurang-merapi-10.jpeg",

  /** 5. Ikon & Konten 3 Kartu Keunggulan (Kenapa Kami) */
  kenapaKamiCards: [
    {
      icon: "/images/Web-designing-service-icon.png",
      title: "Keselamatan",
      desc: "Pemandu kami terlatih dalam pertolongan pertama dan keselamatan serta profesional yang berpengalaman.",
    },
    {
      icon: "/images/Web-developement-services-icon.png",
      title: "Reservasi 24 Jam",
      desc: "Layanan pemesanan online tersedia 24 jam setiap hari (operasional trek 07:00 – 17:00 WIB), sehingga Anda dapat memesan kapan saja.",
    },
    {
      icon: "/images/UI-UX-design-services-icon.png",
      title: "Fasilitas",
      desc: "Kami memiliki fasilitas, peralatan, dan layanan terbaik sebelum, selama, dan setelah petualangan Anda.",
    },
  ],

  /** 6. Background Banner Bagian Statistik */
  statsBgImage: "/images/atv-kaliurang-merapi-4.jpeg",

  /** 7. Gambar Bagian Paket Harga (#harga) */
  pricing: {
    bannerImage: "/images/atv-kaliurang-merapi-4.jpeg",
    mainImage: "/images/atv-kaliurang-merapi-1.jpeg",
  },

  /** 8. Bagian Tentang Kami (Thumbnail & Link Video YouTube) */
  tentangKami: {
    videoThumbnail: "/images/ATV-KALIURANG-3.jpeg",
    videoUrl: "https://www.youtube.com/embed/JZ4l4VcAPq4?autoplay=1",
  },

  /** 9. Daftar Testimoni & Foto Avatar Pelanggan */
  testimonials: [
    {
      text: "ATV KALIURANG adalah tambahan yang bagus untuk kegiatan musim panas keluarga kami.",
      name: "Pujiatsuti",
      role: "Toro",
      avatar: "/images/atv-kaliurang-merapi-12.jpeg",
    },
    {
      text: "Tur ATV sangat mengagumkan! Saya dan keluarga saya menikmati setiap momen perjalanan kami. Kami ingin mengucapkan terima kasih atas pelayanan Anda yang luar biasa",
      name: "Andrew",
      role: "Manager",
      avatar: "/images/ATV-KALIURANG-3.jpeg",
    },
    {
      text: "Ini adalah pertama kalinya saya memesan aktivitas ATV. Harganya masuk akal.",
      name: "Alina Ja",
      role: "Pns",
      avatar: "/images/atv-kaliurang-merapi-6.jpeg",
    },
    {
      text: "Pemandu ramah, sabar dan sangat berpengalaman. Jalur airnya seru banget dan dokumentasi fotonya mantap!",
      name: "Bambang Wijaya",
      role: "Traveler",
      avatar: "/images/atv-kaliurang-merapi-1.jpeg",
    },
    {
      text: "Pengalaman terbaik berlibur ke Kaliurang bareng rekan kantor. Unit ATV-nya prima dan terawat!",
      name: "Rizky Pratama",
      role: "Karyawan Swasta",
      avatar: "/images/atv-kaliurang-merapi-2.jpeg",
    },
  ],

  /** 10. Daftar Foto Galeri (#gallery) — bisa ditambah/dikurangi sesuai kebutuhan client */
  galleryImages: [
    { src: "/images/atv-kaliurang-merapi-1.jpeg", alt: "ATV Kaliurang Merapi 1" },
    { src: "/images/atv-kaliurang-merapi-2.jpeg", alt: "ATV Kaliurang Merapi 2" },
    { src: "/images/atv-kaliurang-merapi-3.jpeg", alt: "ATV Kaliurang Merapi 3" },
    { src: "/images/atv-kaliurang-merapi-4.jpeg", alt: "ATV Kaliurang Merapi 4" },
    { src: "/images/atv-kaliurang-merapi-5.jpeg", alt: "ATV Kaliurang Merapi 5" },
    { src: "/images/atv-kaliurang-merapi-6.jpeg", alt: "ATV Kaliurang Merapi 6" },
    { src: "/images/atv-kaliurang-merapi-7.jpeg", alt: "ATV Kaliurang Merapi 7" },
    { src: "/images/atv-kaliurang-merapi-9.jpeg", alt: "ATV Kaliurang Merapi 9" },
    { src: "/images/atv-kaliurang-merapi-10.jpeg", alt: "ATV Kaliurang Merapi 10" },
    { src: "/images/atv-kaliurang-merapi-11.jpeg", alt: "ATV Kaliurang Merapi 11" },
    { src: "/images/atv-kaliurang-merapi-12.jpeg", alt: "ATV Kaliurang Merapi 12" },
    { src: "/images/ATV-KALIURANG-6.jpeg", alt: "ATV Kaliurang Merapi Group" },
  ],

  /** 11. Bagian Lokasi & Google Maps (#lokasi) */
  location: {
    bannerImage: "/images/atv-kaliurang-merapi-5.jpeg",
    mapsShareUrl: "https://maps.app.goo.gl/q4Kcr7RGfrGbpnJR7",
    mapsEmbedUrl:
      "https://maps.google.com/maps?q=-7.59972,110.42861+(OJE+ATV+Kaliurang)&hl=id&z=16&output=embed",
  },
} as const;

/** Link WhatsApp cepat dengan pesan default */
export const WA_LINK = `https://wa.me/${CONTACT.WA_NUMBER}?text=${CONTACT.WA_DEFAULT_MSG}`;

/** Link WhatsApp via API (untuk order) dengan pesan spesifik */
export const WA_ORDER_LINK = `https://api.whatsapp.com/send/?phone=${CONTACT.WA_NUMBER}&text=Hallo+${encodeURIComponent(CONTACT.WEBSITE_URL)}+saya+Mau+Order+ATV&type=phone_number&app_absent=0`;
