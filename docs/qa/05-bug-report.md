# 5. Laporan Bug

Dibuat dengan skill `qa-bug-report`, dari temuan review kode (tanpa eksploitasi nyata).

# [BUG-001] Catatan booking disisipkan tanpa escape ke email HTML admin
- Severity: Sedang
- Prioritas: P1
- Lingkungan: kode di `main` (commit `0c2a1ec`), Next.js 16.3.4, Resend

## Langkah Reproduksi
1. Kirim `POST /api/booking` dengan JSON valid dan `catatan` = `<a href="http://contoh.test">Klik untuk konfirmasi</a>`.
2. Buka email notifikasi `[BOOKING BARU]` di inbox admin.
3. Perhatikan bagian "Catatan".

## Hasil Aktual
Belum dieksekusi di inbox nyata. Dari kode, `lib/mailer.ts` menyisipkan `${booking.catatan}` langsung ke HTML, sehingga tautan diperkirakan tampil sebagai elemen yang bisa diklik.

## Hasil yang Diharapkan
Catatan tampil sebagai teks biasa; karakter `< > & " '` di-escape.

## Analisis Dampak
- Pengguna/bisnis: admin bisa tertipu tautan phishing yang tampak berasal dari sistem sendiri.
- Keamanan: HTML injection (OWASP A03), tidak mencapai eksekusi skrip karena klien email memblokir JavaScript.
- Frekuensi: bisa dipicu siapa pun yang mengirim form (dibatasi 3 request per IP per jam).

## Bukti
`lib/mailer.ts` baris ~146; `lib/validations.ts` hanya `max(300)` untuk `catatan`.

## Dugaan Penyebab
Template literal tanpa fungsi escape. Perbaikan ada di `03-secure-code-review.md`.

---

# [BUG-002] Pelanggan sah bisa terkena 429 karena limit global dihabiskan
- Severity: Sedang
- Prioritas: P2
- Langkah: kirim 30 booking valid dari IP berbeda dalam satu jam, lalu coba booking dari IP lain.
- Aktual (dari kode): request ke-31 ditolak 429 untuk semua orang hingga window reset.
- Diharapkan: pelanggan sah tetap dapat memesan; penyalahgunaan dibatasi tanpa mengunci semua orang.
- Dampak: kehilangan pesanan selama serangan.

# [BUG-003] Nama beraksen ditolak validasi
- Severity: Rendah
- Prioritas: P3
- Langkah: kirim `nama` = `José`.
- Aktual (dari regex `^[a-zA-Z\s\-.]+$`): 422.
- Diharapkan: nama sah diterima (gunakan `\p{L}` dengan flag `u`).
- Dampak: pelanggan bernama beraksen tidak bisa memesan.

