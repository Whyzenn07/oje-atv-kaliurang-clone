# 1. Test Plan — Form Booking OJE ATV (`POST /api/booking`)

Dibuat dengan skill `qa-test-plan`. Sumber spesifikasi: diturunkan dari `lib/validations.ts`, `app/api/booking/route.ts`, `lib/ratelimit.ts`, `lib/mailer.ts`.

## Ringkasan & Ruang Lingkup
- Aktor: pengunjung anonim. Input: nama, paket, tanggal, jumlah, catatan. Output: baris di Supabase `bookings` + email ke admin (Resend) + respons JSON.
- In-scope: validasi server, rate limit, penyimpanan DB, email, header keamanan.
- Out-of-scope: UI visual, tombol WhatsApp, performa beban tinggi.

## Skenario Fungsional
**Positif**
- Booking valid paket Single dan Boncengan → 201, baris tersimpan, email terkirim.
- Catatan kosong/null diterima.
- Jumlah 1 dan 30 diterima.

**Negatif**
- Content-Type bukan JSON → 415. Body bukan object (array/null/string) → 400. JSON rusak → 400.
- Nama <2 atau >100, berisi angka/simbol → 422.
- Paket di luar enum → 422. Tanggal lampau atau format salah → 422.
- Jumlah 0, 31, desimal, string → 422. Catatan >300 → 422.
- Method GET → 405.

## Edge Case
- Tanggal "hari ini" (zona waktu UTC vs WIB menggeser batas).
- Nama dengan spasi ganda, hanya spasi, huruf beraksen (é, ñ) yang ditolak regex padahal nama sah.
- Submit ganda cepat (dedup email vs 2 baris DB).
- Request bersamaan pada batas rate limit (3 per IP).
- Supabase down → fallback ID `OJE-...`, data tidak tersimpan tetapi respons sukses.
- Resend gagal/limit → booking tetap sukses.
- Header `Content-Length` dihilangkan/dipalsukan (chunked) untuk melewati batas 8 KB.
- Cold start serverless mereset rate limit in-memory.

## Risiko Keamanan (OWASP)
| Risiko | OWASP | Skenario | Dampak | Cara Uji |
|---|---|---|---|---|
| HTML injection di email admin | A03 Injection | `catatan` berisi `<a href>`/`<img>` masuk ke template email tanpa escape | Phishing ke admin | Kirim catatan HTML, periksa email |
| Bypass rate limit | A04 Insecure Design | IP palsu via `x-forwarded-for` (non-Vercel), cold start | Flood booking/email | Kirim >3 request dengan IP berbeda |
| Lockout pelanggan sah | A04 | Satu penyerang menghabiskan 30 slot global/jam | DoS bisnis | Kirim 30 request dari beberapa IP |
| Spam data (tanpa CAPTCHA) | A04 | Bot membuat booking palsu | Data sampah, kuota email | Skrip POST berulang |
| Kebocoran secret | A02/A05 | Secret di repo/log | Akses DB | Grep repo, cek `.gitignore` |
| Header keamanan kurang | A05 | CSP `unsafe-inline`, `img-src https:` | XSS lebih mudah | Periksa respons header |
| Error verbose | A09 | Pesan internal bocor | Info disclosure | Kirim payload rusak |

## Prioritas & Kriteria Lulus
Tinggi: validasi server, HTML injection email, lockout global. Sedang: edge case tanggal/zona waktu, fallback Supabase. Rendah: kosmetik pesan.
Lulus bila semua kasus tinggi sesuai ekspektasi dan tidak ada temuan Kritis/Tinggi terbuka.

## Asumsi
Spesifikasi diturunkan dari kode. Belum ada CAPTCHA/auth karena form publik.

