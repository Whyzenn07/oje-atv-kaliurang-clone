# 3. Secure Code Review â€” Endpoint Booking

Dibuat dengan skill `secure-code-review`. File ditinjau: `app/api/booking/route.ts`, `lib/ratelimit.ts`, `lib/mailer.ts`, `lib/validations.ts`, `supabase-schema.sql`. Hanya membaca; kode tidak diubah.

## Status Perbaikan (commit 2081f90)`n- DIPERBAIKI: HTML injection email, memory leak rate limit, batas body 8 KB (dicek dari isi aktual), dedup email (kunci kini mencakup paket + jumlah).`n- DIPERBAIKI SEBAGIAN: lockout global (limit dinaikkan 30 ke 60/jam); penutupan penuh butuh CAPTCHA.`n- TERBUKA: fallback sukses saat Supabase down, rate limit in-memory per instance.`n`n## Temuan

### [Sedang] HTML injection di email admin via `catatan`
- Lokasi: `lib/mailer.ts` baris ~146 (`${booking.catatan}`) dan subject baris ~174.
- Mengapa rentan: `catatan` hanya dibatasi panjang oleh Zod (`lib/validations.ts`), tidak di-escape sebelum disisipkan ke template HTML email. Penyerang bisa menyisipkan tautan atau gambar palsu.
- Dampak: phishing terhadap admin; tampilan email rusak.
- Perbaikan:
```ts
const esc = (s: string) => s.replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]!));
// <div class="value">${esc(booking.catatan)}</div>
```
Bersihkan juga newline di subject. Nama dan paket aman karena dibatasi regex dan enum.

### [Sedang] Lockout pelanggan sah oleh counter global
- Lokasi: `lib/ratelimit.ts` (`MAX_REQUESTS_GLOBAL = 30`).
- Penyerang dengan beberapa IP bisa menghabiskan 30 slot per jam, sehingga semua pelanggan sah menerima 429.
- Perbaikan: tambah CAPTCHA (Cloudflare Turnstile) atau honeypot, dan simpan limit di store bersama (Upstash Redis) agar tidak reset saat cold start.

### [Rendah] Memory leak potensial pada store rate limit
- `cleanupRateLimitStore()` diekspor tetapi tidak dipanggil di mana pun, sehingga `Map` tumbuh per IP unik selama instance hidup.
- Perbaikan: panggil cleanup di awal `isRateLimited` bila `store.size` melebihi ambang.

### [Rendah] Batas ukuran body bergantung pada header Content-Length
- Lokasi: `route.ts` Layer 2. Request chunked tanpa header melewati pengecekan.
- Perbaikan: baca `await request.text()`, cek `.length`, lalu `JSON.parse`.

### [Rendah] Booking duplikat tidak idempoten, email dedup menyembunyikan booking sah
- `mailer.ts`: dedup nama+tanggal selama 5 menit memblokir email, tetapi baris DB tetap dibuat. Admin bisa tidak diberi tahu soal booking kedua yang berbeda paket/jumlah.
- Perbaikan: sertakan paket dan jumlah di dedupe key; pertimbangkan unique constraint atau idempotency key.

### [Info] Fallback saat Supabase down mengembalikan sukses
- `route.ts` baris ~115â€“125: data tidak tersimpan tetapi respons 201; pelanggan mengira booking tercatat. Email tetap menjadi satu-satunya jejak. Pastikan ini disengaja dan admin memantau email.

### [Info] Rate limit in-memory per instance serverless
- Tidak konsisten antar instance dan reset saat cold start. Akurat hanya sebagai penghalang dasar.

## Sudah Aman
- Query Supabase lewat client terparameter (tanpa SQL string) dan RLS menolak akses publik.
- Validasi server Zod, tanpa `details` ke client.
- Secret hanya di env server; `.env*` di-ignore Git.
- `extractTrustedIp` memakai IP terakhir pada Vercel.
- Security header (HSTS, nosniff, Referrer-Policy, CSP) terpasang.


