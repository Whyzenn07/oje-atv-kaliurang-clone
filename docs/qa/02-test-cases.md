# 2. Test Case â€” Form Booking

Dibuat dengan skill `qa-test-case-design`. Aturan: nama 2â€“100 `[a-zA-Z\s\-.]`, paket enum (2), tanggal `YYYY-MM-DD` â‰¥ hari ini, jumlah int 1â€“30, catatan â‰¤300 opsional. Status: belum dieksekusi kecuali ditandai.

Dasar payload valid: `{"nama":"Budi Sugiono","paket":"ATV Single (Rp 300.000 / 2 Jam)","jumlah":1,"tanggal":"<besok>","catatan":null}`

| ID | Skenario Uji | Langkah Pengujian | Data Uji | Ekspektasi Hasil |
|---|---|---|---|---|
| TC-POS-01 | Booking valid Single | POST JSON valid | payload dasar | 201, `success:true`, bookingId UUID, baris di DB status PENDING, email terkirim |
| TC-POS-02 | Paket Boncengan + catatan | POST | paket `ATV Boncengan (Rp 350.000 / 2 Jam)`, catatan "Photographer dan editor" | 201, catatan tersimpan |
| TC-BVA-01 | Nama panjang 1 | POST | nama `A` | 422 "Nama minimal 2 karakter" |
| TC-BVA-02 | Nama panjang 2 | POST | nama `Al` | 201 |
| TC-BVA-03 | Nama panjang 100 | POST | `A` x100 | 201 |
| TC-BVA-04 | Nama panjang 101 | POST | `A` x101 | 422 |
| TC-BVA-05 | Jumlah 0 | POST | jumlah 0 | 422 "Minimal 1 unit" |
| TC-BVA-06 | Jumlah 1 / 30 | POST | 1, 30 | 201 |
| TC-BVA-07 | Jumlah 31 | POST | 31 | 422 "Maksimal 30 unit" |
| TC-BVA-08 | Jumlah desimal | POST | 1.5 | 422 bilangan bulat |
| TC-BVA-09 | Catatan 300 / 301 | POST | `x` x300 / x301 | 201 / 422 |
| TC-BVA-10 | Tanggal hari ini | POST | tanggal lokal hari ini (WIB) | 201; catat jika UTC menolak pada dini hari |
| TC-BVA-11 | Tanggal kemarin | POST | kemarin | 422 "tidak boleh di masa lalu" |
| TC-NEG-01 | Field wajib hilang | POST | `{}` | 422 pesan generik tanpa `details` |
| TC-NEG-02 | Paket tidak valid | POST | paket "Paket 1" | 422 "Paket tidak valid" |
| TC-NEG-03 | Format tanggal salah | POST | `20-11-2026`, `2026-13-45` | 422 |
| TC-NEG-04 | Tipe salah | POST | jumlah `"2"` (string) | 422 |
| TC-NEG-05 | Body array/null | POST | `[]`, `null` | 400 |
| TC-NEG-06 | JSON rusak | POST | `{nama:` | 400 |
| TC-NEG-07 | Content-Type salah | POST dengan `text/plain` | payload dasar | 415 |
| TC-NEG-08 | Method salah | GET, PUT, DELETE | - | 405 |
| TC-NEG-09 | Nama beraksen | POST | `JosÃ© NÃºÃ±ez` | 201 (diperbaiki, terverifikasi) |
| TC-SEC-01 | Karakter khusus di nama | POST | `<script>alert(1)</script>`, `Robert'); DROP TABLE bookings;--` | 422 (regex) |
| TC-SEC-02 | HTML di catatan | POST | `<a href="http://evil.test">klik</a>` | Tampil sebagai teks di email admin (diperbaiki, terverifikasi) |
| TC-SEC-03 | Null byte/unicode/emoji | POST | catatan `%00`, `ðŸ”¥`, newline | Diterima tanpa error 500; tersimpan utuh |
| TC-SEC-04 | Payload besar | POST dengan Content-Length >8192 | 20 KB | 413 |
| TC-SEC-05 | Bypass limit via header | 4 request header `x-forwarded-for` berbeda | IP acak | Di Vercel: tetap dibatasi; lokal: boleh lolos (dokumentasikan) |
| TC-NET-01 | Supabase tidak terjangkau | Set `SUPABASE_URL` salah, POST valid | payload dasar | 201 dengan ID `OJE-...`; peringatan di log; perilaku ini harus disetujui pemilik |
| TC-NET-02 | Resend gagal | API key salah, POST valid | payload dasar | 201; log "Email gagal terkirim" |
| TC-NET-03 | Timeout klien | Putus koneksi saat request | - | Tidak ada baris ganda saat dicoba ulang (dedup email aktif; DB belum idempoten) |
| TC-RACE-01 | Submit ganda cepat | 2 POST identik paralel | payload dasar | Maks 1 email; periksa jumlah baris DB (ekspektasi: 1, kemungkinan 2) |
| TC-RACE-02 | Batas rate limit | 4 POST paralel dari 1 IP | payload dasar | 3 sukses, 1 gagal 429 |
| TC-RACE-03 | Limit global | 31 POST dari IP berbeda | payload berbeda | Request ke-31 â†’ 429 |


