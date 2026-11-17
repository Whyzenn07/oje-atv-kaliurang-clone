# O.J.E – ATV Kaliurang Merapi

Website profil dan sistem pemesanan online untuk **O.J.E – ATV Kaliurang Merapi | Petualangan Wisata ATV Jogja**, dibangun menggunakan **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4 (Pure Flexbox)**, **Supabase**, **Resend**, dan **Google Sheets Webhook**.

---

## 🌐 Live Demo & Pemesanan Riil

- **Website Utama (Live Production)**: [O.J.E – Atv Kaliurang Merapi | Petualangan Wisata ATV Jogja](https://oje-atv-kaliurang-clone-f2m1.vercel.app/)
- **Langsung ke Form Booking Riil**: [Form Pemesanan ATV Kaliurang (`#booking`)](https://oje-atv-kaliurang-clone-f2m1.vercel.app/#booking)

---

## ✨ Fitur Utama

1. **Sistem Booking End-to-End & Cek Slot Real-Time**:
   - Pengecekan sisa kuota unit harian otomatis (`GET /api/availability?tanggal=YYYY-MM-DD`, maksimal 15 unit/hari).
   - Pembuatan **Kode Booking CSPRNG** (`OJE-MMDD-XXXXX`) beserta tiket ringkasan (resi) yang dapat disalin dan dikirim langsung ke WhatsApp Admin.
   - Penyimpanan data terstruktur ke **Supabase PostgreSQL** (dilengkapi post-insert guard anti-*race condition* kuota harian).
   - Sinkronisasi otomatis non-blocking ke **Google Sheets** (via Apps Script Webhook dengan proteksi *Formula Injection*) dan notifikasi email admin via **Resend**.
2. **Keamanan Berlapis**:
   - Validasi skema server-side ketat menggunakan **Zod** (`lib/validations.ts`).
   - Proteksi anti-bot **Honeypot** + dukungan opsional **Cloudflare Turnstile** (`lib/turnstile.ts`).
   - **IP & Global Rate Limiting** (`lib/ratelimit.ts`) yang dieksekusi setelah validasi agar kesalahan ketik pengguna tidak mengunci kuota IP.
   - Security Headers lengkap (`Content-Security-Policy`, `HSTS`, `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`) di `next.config.ts`.
3. **Desain Responsif Pure Flexbox (Desktop, Android, & iOS)**:
   - Tata letak 100% berbasis Flexbox, bebas *horizontal overflow* maupun *scroll lock* di perangkat mobile.
   - Optimasi gambar menggunakan `next/image` dan variable font `Manrope` & `Montserrat` melalui `next/font/google`.
4. **Konfigurasi Aset Terpusat (`SITE_ASSETS`)**:
   - Seluruh gambar, logo, slide hero, galeri, testimoni, link video YouTube, dan Google Maps terpusat di satu file [`lib/constants.ts`](./lib/constants.ts) untuk memudahkan penggantian aset client.

---

## 🖼️ Cara Mengganti Gambar, Galeri, & Video Client

1. Simpan file gambar baru ke dalam folder `public/images/`.
2. Buka [`lib/constants.ts`](./lib/constants.ts) dan sesuaikan path pada objek `SITE_ASSETS` (logo, `heroSlides`, `profilImage`, `kenapaKamiCards`, `pricing`, `tentangKami`, `testimonials`, `galleryImages`, `location`).
3. Untuk video di bagian **Tentang Kami**, cukup tempelkan link YouTube biasa (`https://www.youtube.com/watch?v=...` atau `https://youtu.be/...`) pada `SITE_ASSETS.tentangKami.videoUrl`.

---

## 🚀 Menjalankan di Lokal

1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Salin konfigurasi environment**:
   ```bash
   cp .env.local.example .env.local
   ```
   Isi variabel di `.env.local` (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `GOOGLE_SHEETS_WEBHOOK_URL`, `GOOGLE_SHEETS_SECRET`, dll.).
3. **Siapkan tabel database Supabase**:
   Jalankan query di [`supabase-schema.sql`](./supabase-schema.sql) pada **Supabase SQL Editor**.
4. **Jalankan development server**:
   ```bash
   npm run dev
   ```
   Buka `http://localhost:3000` di browser.

---

## 🛠️ Perintah Utilitas

- `npm run dev` — Menjalankan server development lokal.
- `npm run build` — Membuat production build Next.js.
- `npm run lint` — Menjalankan pemeriksaan kode ESLint.
- `npm run export` — Mengekspor data booking dari Supabase ke file CSV/Excel (`REPORT_BOOKING_OJE_ATV.csv`).
