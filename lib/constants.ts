// ============================================================
// KONTAK, KONFIGURASI BISNIS, & ASET GAMBAR/VIDEO — WISATA MERAPI
// ⚙️  CARA GANTI GAMBAR / VIDEO CLIENT:
//   1. Simpan gambar baru di folder public/images/wisatamerapi/
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
    "Hallo kak, saya ingin menanyakan paket Jeep Lava Tour Merapi dan reservasi jadwal."
  ),

  /** URL website produksi */
  WEBSITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "https://wisatamerapi.id/",

  /** Link Sosial Media Resmi wisatamerapi.id */
  TIKTOK_URL: "https://www.tiktok.com/@wisatamerapi.id",
  INSTAGRAM_URL: "https://www.instagram.com/wisatamerapi.id/",
} as const;

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://wisatamerapi.id"
).replace(/\/$/, "");

export const MAX_UNITS_PER_DAY = 15;
export const MAX_PASSENGERS_PER_JEEP = 4;

export const PACKAGE_OPTIONS = [
  "Paket 1 (Rp 450.000 / Jeep)",
  "Paket 1B (Rp 500.000 / Jeep)",
  "Paket 2 (Rp 550.000 / Jeep)",
  "Paket Sunrise (Rp 600.000 / Jeep)",
  "Paket 3 (Rp 650.000 / Jeep)",
  "Paket 4 (Rp 750.000 / Jeep)",
] as const;

export const DEPARTURE_TIMES = [
  "04:30 WIB (Khusus Sunrise)",
  "06:00 WIB",
  "07:00 WIB",
  "08:00 WIB",
  "09:00 WIB",
  "10:00 WIB",
  "11:00 WIB",
  "13:00 WIB",
  "14:00 WIB",
  "15:00 WIB",
  "16:00 WIB",
] as const;

export function getPackageUnitPrice(paket: string): number {
  if (paket.includes("750.000")) return 750_000;
  if (paket.includes("650.000")) return 650_000;
  if (paket.includes("600.000")) return 600_000;
  if (paket.includes("550.000")) return 550_000;
  if (paket.includes("500.000")) return 500_000;
  if (paket.includes("450.000")) return 450_000;
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
// DETAIL 6 PAKET JEEP LAVA TOUR MERAPI (wisatamerapi.id)
// ============================================================
export const JEEP_PACKAGES = [
  {
    id: "paket-1",
    name: "Paket 1",
    selectValue: "Paket 1 (Rp 450.000 / Jeep)",
    priceLabel: "Rp 450.000",
    price: 450_000,
    duration: "±1,5 – 2 Jam",
    schedule: "Bebas pilih jam (06.00 – 16.30 WIB)",
    capacity: "1 Jeep maks. 4 penumpang (+1 balita)",
    image: "/images/wisatamerapi/paket-1.jpg",
    routes: [
      "Museum Sisa Hartaku",
      "Batu Alien",
      "Bunker Kaliadem / Trek Kali Kuning",
      "Alternatif: The Lost World Park",
    ],
    includes: [
      "Unit Jeep 4x4 (Maks. 4 Penumpang)",
      "Tiket Masuk Destinasi",
      "Driver Sekaligus Pemandu",
      "Asuransi Resmi",
    ],
  },
  {
    id: "paket-1b",
    name: "Paket 1B",
    selectValue: "Paket 1B (Rp 500.000 / Jeep)",
    priceLabel: "Rp 500.000",
    price: 500_000,
    duration: "±1,5 – 2 Jam",
    schedule: "Bebas pilih jam (06.00 – 16.30 WIB)",
    capacity: "1 Jeep maks. 4 penumpang (+1 balita)",
    image: "/images/wisatamerapi/paket-1b.jpg",
    routes: [
      "Petilasan Mbah Maridjan",
      "Bunker Kaliadem",
      "Batu Alien & Trek Kali Kuning",
      "Alternatif: Tebing Gendol / Lost World Park",
    ],
    includes: [
      "Unit Jeep 4x4 (Maks. 4 Penumpang)",
      "Tiket Masuk Destinasi",
      "Driver Sekaligus Pemandu",
      "Asuransi Resmi",
    ],
  },
  {
    id: "paket-2",
    name: "Paket 2",
    selectValue: "Paket 2 (Rp 550.000 / Jeep)",
    priceLabel: "Rp 550.000",
    price: 550_000,
    duration: "±2 Jam",
    schedule: "Bebas pilih jam (06.00 – 16.30 WIB)",
    capacity: "1 Jeep maks. 4 penumpang (+1 balita)",
    image: "/images/wisatamerapi/paket-2.jpg",
    badge: "Populer",
    routes: [
      "Museum Sisa Hartaku & Batu Alien",
      "Bunker Kaliadem & Petilasan Mbah Maridjan",
      "Manuver Air Kali Kuning",
      "Alternatif: Tebing Gendol & Lost World Park",
    ],
    includes: [
      "Unit Jeep 4x4 (Maks. 4 Penumpang)",
      "Tiket Masuk Destinasi",
      "Driver Sekaligus Pemandu",
      "Asuransi Resmi",
    ],
  },
  {
    id: "paket-sunrise",
    name: "Paket Sunrise",
    selectValue: "Paket Sunrise (Rp 600.000 / Jeep)",
    priceLabel: "Rp 600.000",
    price: 600_000,
    duration: "±3 Jam",
    schedule: "Start 04.30 – Finish ±07.30 WIB",
    capacity: "1 Jeep maks. 4 penumpang (+1 balita)",
    image: "/images/wisatamerapi/paket-sunrise.jpg",
    badge: "Favorit Sunrise",
    routes: [
      "Spot Sunrise Bunker Kaliadem",
      "Batu Alien & Museum Sisa Hartaku",
      "Manuver Air Kali Kuning",
      "Alternatif: Tebing Gendol & Lost World Park",
    ],
    includes: [
      "Unit Jeep 4x4 (Maks. 4 Penumpang)",
      "Tiket Masuk Destinasi",
      "Driver Sekaligus Pemandu",
      "Asuransi Resmi",
    ],
  },
  {
    id: "paket-3",
    name: "Paket 3",
    selectValue: "Paket 3 (Rp 650.000 / Jeep)",
    priceLabel: "Rp 650.000",
    price: 650_000,
    duration: "±2,5 Jam",
    schedule: "Bebas pilih jam (06.00 – 16.30 WIB)",
    capacity: "1 Jeep maks. 4 penumpang (+1 balita)",
    image: "/images/wisatamerapi/paket-3.jpg",
    routes: [
      "Museum Sisa Hartaku & Batu Alien",
      "Bunker Kaliadem & Petilasan Mbah Maridjan",
      "Tebing Gendol & Manuver Kali Kuning",
      "Alternatif: The Lost World Park",
    ],
    includes: [
      "Unit Jeep 4x4 (Maks. 4 Penumpang)",
      "Tiket Masuk Destinasi",
      "Driver Sekaligus Pemandu",
      "Asuransi Resmi",
    ],
  },
  {
    id: "paket-4",
    name: "Paket 4 (Long Trip)",
    selectValue: "Paket 4 (Rp 750.000 / Jeep)",
    priceLabel: "Rp 750.000",
    price: 750_000,
    duration: "±3 Jam",
    schedule: "Bebas pilih jam (06.00 – 16.00 WIB)",
    capacity: "1 Jeep maks. 4 penumpang (+1 balita)",
    image: "/images/wisatamerapi/paket-4.jpg",
    badge: "Terlengkap",
    routes: [
      "Eksplorasi Penuh Seluruh Spot Lava Tour",
      "Petilasan Mbah Maridjan, Bunker Kaliadem, Tebing Gendol",
      "Museum Sisa Hartaku, Batu Alien & Kali Kuning",
      "Alternatif: The Lost World Park",
    ],
    includes: [
      "Unit Jeep 4x4 (Maks. 4 Penumpang)",
      "Tiket Masuk Destinasi",
      "Driver Sekaligus Pemandu",
      "Asuransi Resmi",
    ],
  },
] as const;

// ============================================================
// PUSAT PENGATURAN SELURUH GAMBAR, GALERI, & VIDEO WEBSITE
// ============================================================
export const SITE_ASSETS = {
  /** 1. Logo Website (Navbar, Footer, Favicon, Manifest) */
  logo: "/images/wisatamerapi/logo.png",

  /** 2. Gambar Preview Share WhatsApp / OpenGraph */
  ogImage: "/images/wisatamerapi/hero-1.jpg",

  /** 3. Slide Hero Utama (3 Slide Jeep Lava Tour Merapi) */
  heroSlides: [
    {
      image: "/images/wisatamerapi/hero-1.jpg",
      subtitle: "Selamat Datang Di Wisata Merapi",
      title: "LAVA TOUR MERAPI",
      description:
        "Layanan wisata edukasi dan adventure berkeliling kawasan Gunung Merapi bekas aliran lahar dingin erupsi 2010 menggunakan mobil Jeep 4x4.",
    },
    {
      image: "/images/wisatamerapi/hero-2.jpg",
      subtitle: "Sensasi Offroad & Air",
      title: "TREK KALI KUNING",
      description:
        "Nikmati serunya bermanuver melintasi sungai berbatu dan lintasan offroad lereng Merapi dengan kapasitas 1 Jeep hingga 4 penumpang.",
    },
    {
      image: "/images/wisatamerapi/hero-3.jpg",
      subtitle: "Panorama Terbaik Merapi",
      title: "SUNRISE & BUNKER",
      description:
        "Abadikan momen matahari terbit di Bunker Kaliadem, Petilasan Mbah Maridjan, dan Batu Alien bersama driver berpengalaman.",
    },
  ],

  /** 4. Foto Bagian Profil (#profil) */
  profilImage: "/images/wisatamerapi/dest-bunker-kaliadem.jpg",

  /** 5. Ikon & Konten 4 Kartu Keunggulan (Mengapa Pilih Kami? - wisatamerapi.id) */
  kenapaKamiCards: [
    {
      icon: "/images/wisatamerapi/icon-vehicle.png",
      title: "Kendaraan Layak Dan Aman",
      desc: "Armada Jeep 4x4 selalu melewati pengecekan rutin agar prima dan aman melintasi medan lahar dingin Gunung Merapi.",
    },
    {
      icon: "/images/wisatamerapi/icon-price.png",
      title: "Harga Terjangkau",
      desc: "Pilihan paket transparan mulai Rp 450.000 per Jeep (maksimal 4 penumpang + 1 balita) sudah termasuk tiket destinasi.",
    },
    {
      icon: "/images/wisatamerapi/icon-support.png",
      title: "Customer Services 24 Jam",
      desc: "Layanan konsultasi rute, penjemputan area Kaliurang, dan reservasi online siap melayani Anda setiap hari.",
    },
    {
      icon: "/images/wisatamerapi/icon-shield.png",
      title: "Asuransi",
      desc: "Setiap paket perjalanan sudah dilengkapi asuransi resmi serta driver ramah yang sekaligus berperan sebagai pemandu.",
    },
  ],

  /** 6. Background Banner Bagian Statistik */
  statsBgImage: "/images/wisatamerapi/dest-tebing-gendol.jpg",

  /** 7. Gambar Bagian Paket Harga (#harga) */
  pricing: {
    bannerImage: "/images/wisatamerapi/hero-2.jpg",
    mainImage: "/images/wisatamerapi/hero-1.jpg",
  },

  /** 8. Bagian Tentang Kami (Thumbnail & Link Video YouTube) */
  tentangKami: {
    videoThumbnail: "/images/wisatamerapi/dest-kali-kuning.jpg",
    videoUrl: "https://www.youtube.com/embed/JZ4l4VcAPq4?autoplay=1",
  },

  /** 9. Daftar Testimoni & Foto Avatar Pelanggan */
  testimonials: [
    {
      text: "Seru banget naik Jeep Lava Tour Merapi bareng keluarga! Driver ramah, sabar bantu foto-foto di Bunker Kaliadem dan Batu Alien.",
      name: "Pujiastuti",
      role: "Wisatawan Keluarga",
      avatar: "/images/wisatamerapi/dest-bunker-kaliadem.jpg",
    },
    {
      text: "Ambil Paket Sunrise jam 04.30 pagi pemandangannya luar biasa. Dijemput langsung di penginapan area Kaliurang, pelayanannya mantap!",
      name: "Andrew",
      role: "Manager",
      avatar: "/images/wisatamerapi/hero-3.jpg",
    },
    {
      text: "Pertama kali coba Lava Tour Merapi paket 3, harganya terjangkau karena patungan berempat satu Jeep. Manuver air di Kali Kuning paling seru!",
      name: "Alina Ja",
      role: "PNS",
      avatar: "/images/wisatamerapi/dest-kali-kuning.jpg",
    },
    {
      text: "Rombongan kantor 5 Jeep terkoordinasi rapi. Unit Jeep bersih, aman, dan penjelasan sejarah erupsi Merapi 2010 dari driver sangat edukatif.",
      name: "Bambang Wijaya",
      role: "Traveler",
      avatar: "/images/wisatamerapi/galeri-9.jpg",
    },
    {
      text: "Sudah include tiket masuk destinasi dan asuransi jadi nggak ribet bayar satu-satu di lokasi. Sangat direkomendasikan!",
      name: "Rizky Pratama",
      role: "Karyawan Swasta",
      avatar: "/images/wisatamerapi/galeri-10.jpg",
    },
  ],

  /** 10. Daftar Foto Galeri & Destinasi Lava Tour Merapi (#gallery) */
  galleryImages: [
    { src: "/images/wisatamerapi/dest-mbah-maridjan.jpg", alt: "Petilasan Mbah Maridjan" },
    { src: "/images/wisatamerapi/dest-bunker-kaliadem.jpg", alt: "Bunker Kaliadem Merapi" },
    { src: "/images/wisatamerapi/dest-tebing-gendol.jpg", alt: "Tebing Gendol Merapi" },
    { src: "/images/wisatamerapi/dest-batu-alien.jpg", alt: "Wisata Batu Alien" },
    { src: "/images/wisatamerapi/dest-lost-world-park.jpg", alt: "The Lost World Park" },
    { src: "/images/wisatamerapi/dest-museum-sisa-hartaku.jpg", alt: "Museum Sisa Hartaku" },
    { src: "/images/wisatamerapi/dest-kali-kuning.jpg", alt: "Manuver Air Kali Kuning" },
    { src: "/images/wisatamerapi/hero-1.jpg", alt: "Armada Jeep Lava Tour Merapi" },
    { src: "/images/wisatamerapi/galeri-8.jpg", alt: "Konvoi Jeep Wisata Merapi" },
    { src: "/images/wisatamerapi/galeri-9.jpg", alt: "Petualangan Offroad Lereng Merapi" },
    { src: "/images/wisatamerapi/galeri-10.jpg", alt: "Spot Foto Jeep Merapi" },
    { src: "/images/wisatamerapi/galeri-11.jpg", alt: "Eksplorasi Jalur Lahar Merapi" },
  ],

  /** 11. Bagian Lokasi & Google Maps (#lokasi) */
  location: {
    bannerImage: "/images/wisatamerapi/dest-tebing-gendol.jpg",
    mapsShareUrl: "https://maps.app.goo.gl/q4Kcr7RGfrGbpnJR7",
    mapsEmbedUrl:
      "https://maps.google.com/maps?q=-7.59972,110.42861+(Basecamp+Wisata+Lava+Tour+Merapi+Kaliurang)&hl=id&z=15&output=embed",
  },
} as const;

/** Link WhatsApp cepat dengan pesan default */
export const WA_LINK = `https://wa.me/${CONTACT.WA_NUMBER}?text=${CONTACT.WA_DEFAULT_MSG}`;

/** Link WhatsApp via API (untuk order) dengan pesan spesifik */
export const WA_ORDER_LINK = `https://api.whatsapp.com/send/?phone=${CONTACT.WA_NUMBER}&text=Hallo%20kak%2C%20saya%20ingin%20reservasi%20Jeep%20Lava%20Tour%20Merapi&type=phone_number&app_absent=0`;
