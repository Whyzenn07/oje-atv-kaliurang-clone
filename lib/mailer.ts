/**
 * lib/mailer.ts
 * Kirim email notifikasi ke admin via Resend
 * Resend adalah layanan email transaksional gratis (100 email/hari)
 */
import { Resend } from "resend";
import type { BookingInput } from "./validations";

// Lazy — Resend hanya diinisialisasi saat fungsi dipanggil, bukan saat build
let _resend: Resend | null = null;
function getResend(): Resend {
  if (_resend) return _resend;
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("[Mailer] RESEND_API_KEY belum diset di environment variables.");
  _resend = new Resend(key);
  return _resend;
}

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@ojeatvkaliurang.com";
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "booking@ojeatvkaliurang.com";


/**
 * Kirim notifikasi email ke admin setelah booking baru masuk
 */
export async function sendBookingNotification(
  booking: BookingInput & { id: string; created_at: string }
): Promise<{ success: boolean; error?: string }> {
  const tanggalFormatted = new Date(booking.tanggal).toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const createdFormatted = new Date(booking.created_at).toLocaleString("id-ID", {
    timeZone: "Asia/Jakarta",
  });

  const html = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
    .container { max-width: 580px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #1c1c1c 0%, #b51b41 100%); color: white; padding: 28px 32px; }
    .header h1 { margin: 0; font-size: 20px; font-weight: 800; }
    .header p { margin: 6px 0 0; opacity: 0.8; font-size: 13px; }
    .badge { display: inline-block; background: rgba(255,255,255,0.2); border-radius: 20px; padding: 4px 12px; font-size: 12px; margin-top: 8px; }
    .body { padding: 28px 32px; }
    .field { margin-bottom: 16px; border-bottom: 1px solid #f0f0f0; padding-bottom: 16px; }
    .field:last-of-type { border-bottom: none; }
    .label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #888; margin-bottom: 4px; }
    .value { font-size: 16px; font-weight: 600; color: #1c1c1c; }
    .status { display: inline-block; background: #fef3cd; color: #856404; border-radius: 20px; padding: 4px 14px; font-size: 12px; font-weight: 700; }
    .footer { background: #f9f9f9; padding: 20px 32px; border-top: 1px solid #eee; }
    .footer p { margin: 0; font-size: 12px; color: #999; }
    .wa-button { display: block; margin: 20px auto 0; background: #25D366; color: white; text-decoration: none; padding: 14px 28px; border-radius: 30px; font-weight: 700; font-size: 14px; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>&#x1F3CD;&#xFE0F; Booking Baru Masuk!</h1>
      <p>OJE ATV Kaliurang — Sistem Booking Otomatis</p>
      <span class="badge">&#x1F4CB; ID: ${booking.id.substring(0, 8).toUpperCase()}</span>
    </div>
    <div class="body">
      <div class="field">
        <div class="label">&#x1F464; Nama Customer</div>
        <div class="value">${booking.nama}</div>
      </div>
      <div class="field">
        <div class="label">&#x1F3AF; Paket Dipilih</div>
        <div class="value">${booking.paket}</div>
      </div>
      <div class="field">
        <div class="label">&#x1F4C5; Tanggal Sewa</div>
        <div class="value">${tanggalFormatted}</div>
      </div>
      <div class="field">
        <div class="label">&#x1F522; Jumlah Unit</div>
        <div class="value">${booking.jumlah} unit</div>
      </div>
      ${booking.catatan ? `
      <div class="field">
        <div class="label">&#x1F4DD; Catatan / Request</div>
        <div class="value">${booking.catatan}</div>
      </div>
      ` : ""}
      <div class="field">
        <div class="label">Status</div>
        <span class="status">&#x23F3; PENDING — Menunggu Konfirmasi</span>
      </div>
      <div class="field">
        <div class="label">Waktu Booking Masuk</div>
        <div class="value" style="font-size:14px">${createdFormatted} WIB</div>
      </div>
      <a href="https://supabase.com/dashboard" class="wa-button">
        Lihat Semua Booking di Supabase &#x2192;
      </a>
    </div>
    <div class="footer">
      <p>Email ini dikirim otomatis oleh sistem booking OJE ATV Kaliurang.</p>
      <p>Jangan balas email ini langsung — hubungi customer via WhatsApp.</p>
    </div>
  </div>
</body>
</html>
  `;

  try {
    const { error } = await getResend().emails.send({
      from: `OJE ATV Booking <${FROM_EMAIL}>`,
      to: [ADMIN_EMAIL],
      subject: `[BOOKING BARU] ${booking.nama} — ${tanggalFormatted} — ${booking.paket}`,
      html,
    });

    if (error) {
      console.error("[Mailer] Gagal kirim email:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error("[Mailer] Exception:", err);
    return { success: false, error: "Unexpected error saat kirim email" };
  }
}
