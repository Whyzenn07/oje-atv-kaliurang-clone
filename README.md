# Wisata Merapi – Lava Tour Jeep Merapi Yogyakarta

Website profil dan sistem reservasi online untuk **Wisata Merapi – Lava Tour Jeep Merapi Yogyakarta**, menggabungkan konten resmi `wisatamerapi.id` (6 Paket Jeep Lava Tour, 12 Galeri Destinasi, 9 Field Form Booking, dan FAQ) dengan desain **Pure Flexbox** modern berbasis **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, **Supabase**, **Resend**, dan **Google Sheets Webhook**.

---

## 🌐 Live Demo & Pemesanan Riil

- **Website Utama (Live Production)**: [Wisata Merapi – Lava Tour Jeep Merapi Yogyakarta](https://oje-atv-kaliurang-clone-f2m1.vercel.app/)
- **Langsung ke Form Booking Riil**: [Form Booking Jeep Merapi (`#booking`)](https://oje-atv-kaliurang-clone-f2m1.vercel.app/#booking)

---

## ✨ Fitur Utama

1. **6 Paket Jeep Lava Tour Merapi (`#harga`)**:
   - **Paket 1** (`Rp 450.000 / Jeep`), **Paket 1B** (`Rp 500.000 / Jeep`), **Paket 2** (`Rp 550.000 / Jeep`), **Paket Sunrise** (`Rp 600.000 / Jeep`), **Paket 3** (`Rp 650.000 / Jeep`), dan **Paket 4** (`Rp 750.000 / Jeep`).
   - Klik tombol paket otomatis mengisi pilihan paket & jam keberangkatan di form `#booking`.
2. **Form Booking 9 Field + Cek Slot Real-Time**:
   - Mencakup 9 field lengkap: `Nama`, `Nomor WhatsApp`, `Kota Asal`, `Paket Jeep`, `Tanggal`, `Jam`, `Jumlah Peserta`, `Jumlah Jeep`, dan `Tambahan`.
   - Otomatis menghitung rekomendasi minimal unit Jeep (`1 Jeep maks. 4 penumpang`) dan **Estimasi Total Biaya**.
   - Pengecekan sisa kuota unit harian otomatis (`GET /api/availability?tanggal=YYYY-MM-DD`, maksimal 15 unit/hari).
   - Pembuatan **Kode Booking CSPRNG** (`WM-MMDD-XXXXX`) beserta tiket ringkasan (resi) yang dapat disalin dan dikirim langsung ke WhatsApp Admin.
   - Penyimpanan 9 field ke **kolom terpisah** di **Supabase PostgreSQL** (`supabase-schema.sql`) dan **Google Sheets** (`docs/google-apps-script-booking.gs`), ditambah notifikasi email via **Resend**.
3. **Keamanan Berlapis**:
   - Validasi skema server-side ketat menggunakan **Zod** (`lib/validations.ts`).
   - Proteksi anti-bot **Honeypot** + dukungan opsional **Cloudflare Turnstile** (`lib/turnstile.ts`).
   - **IP & Global Rate Limiting** (`lib/ratelimit.ts`) setelah validasi.
   - Security Headers lengkap (`Content-Security-Policy`, `HSTS`, `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`) di `next.config.ts`.
4. **Konfigurasi Aset Terpusat (`SITE_ASSETS`)**:
   - Seluruh gambar, logo, slide hero, 6 paket Jeep, galeri destinasi, testimoni, link video YouTube, dan Google Maps terpusat di satu file [`lib/constants.ts`](./lib/constants.ts).

---

## 📊 Struktur Kolom Database Supabase & Google Sheets (14 Kolom Terpisah)

| No | Kolom Google Sheets / CSV | Kolom Tabel `public.bookings` Supabase |
| :--- | :--- | :--- |
| 1 | `Kode Booking` | `booking_code` |
| 2 | `Nama Customer` | `nama` |
| 3 | `Nomor WhatsApp` | `whatsapp` |
| 4 | `Kota Asal` | `kota_asal` |
| 5 | `Paket Jeep` | `paket` |
| 6 | `Tanggal Tour` | `tanggal` |
| 7 | `Jam Keberangkatan` | `jam` |
| 8 | `Jumlah Jeep` | `jumlah` |
| 9 | `Jumlah Peserta` | `jumlah_peserta` |
| 10 | `Estimasi Total (Rp)` | `estimasi_total` |
| 11 | `Tambahan / Catatan` | `catatan` |
| 12 | `Status` | `status` |
| 13 | `Waktu Masuk (WIB)` | `created_at` |
| 14 | `ID Database` | `id` |

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
3. **Siapkan / Migrasi Tabel Supabase & Google Apps Script**:
   - Jalankan query di [`supabase-schema.sql`](./supabase-schema.sql) pada **Supabase SQL Editor**.
   - Salin isi [`docs/google-apps-script-booking.gs`](./docs/google-apps-script-booking.gs) ke **Google Sheets > Extensions > Apps Script** lalu **Deploy > Manage deployments > New version**.
4. **Jalankan development server**:
   ```bash
   npm run dev
   ```
