/**
 * lib/sheets.ts
 * Sinkronisasi non-blocking booking baru ke Google Sheets via Google Apps Script Webhook.
 *
 * Keamanan:
 * - Server-only (jangan import di komponen client)
 * - Validasi ketat URL HTTPS script.google.com (cegah SSRF)
 * - Secret diverifikasi di Apps Script via body JSON
 * - Sanitasi Spreadsheet Formula Injection (=, +, -, @, tab, CR)
 * - Timeout 5 detik agar tidak menghambat response booking customer
 */
import type { BookingInput } from "./validations";

export type SheetBookingPayload = BookingInput & {
  bookingId: string;
  bookingCode: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  created_at: string;
};

const SHEET_TIMEOUT_MS = 5_000;

/**
 * Cegah Spreadsheet/Excel Formula Injection pada sel teks bebas.
 * Jika diawali karakter formula (=, +, -, @, tab, CR), awali dengan apostrof (').
 */
export function sanitizeSheetCell(value: string): string {
  const normalized = value.replace(/[\r\n]+/g, " ").trim();
  if (/^[=+\-@\t\r]/.test(normalized)) {
    return `'${normalized}`;
  }
  return normalized;
}

function getPackageUnitPrice(paket: string): number {
  return paket.includes("350.000") ? 350_000 : 300_000;
}

function validateWebhookUrl(rawUrl: string): URL | null {
  try {
    const parsed = new URL(rawUrl);
    if (parsed.protocol !== "https:") return null;
    if (parsed.hostname !== "script.google.com") return null;
    if (!parsed.pathname.startsWith("/macros/")) return null;
    return parsed;
  } catch {
    return null;
  }
}

/**
 * Kirim data booking ke Google Sheets (non-blocking — jika gagal atau belum dikonfigurasi,
 * booking di Supabase tetap berhasil).
 */
export async function appendBookingToGoogleSheets(
  booking: SheetBookingPayload
): Promise<{ success: boolean; skipped?: boolean; error?: string }> {
  const rawWebhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL?.trim();
  const webhookSecret = process.env.GOOGLE_SHEETS_SECRET?.trim();

  if (!rawWebhookUrl || !webhookSecret) {
    return { success: true, skipped: true };
  }

  const webhookUrl = validateWebhookUrl(rawWebhookUrl);
  if (!webhookUrl) {
    console.warn("[Sheets] GOOGLE_SHEETS_WEBHOOK_URL tidak valid (harus https://script.google.com/macros/...).");
    return { success: false, error: "Invalid webhook URL" };
  }

  const createdFormatted = new Date(booking.created_at).toLocaleString("id-ID", {
    timeZone: "Asia/Jakarta",
  });

  const estimasiTotal = getPackageUnitPrice(booking.paket) * booking.jumlah;

  const payload = {
    secret: webhookSecret,
    bookingCode: sanitizeSheetCell(booking.bookingCode),
    nama: sanitizeSheetCell(booking.nama),
    whatsapp: sanitizeSheetCell(booking.whatsapp),
    paket: sanitizeSheetCell(booking.paket),
    tanggal: sanitizeSheetCell(booking.tanggal),
    jumlah: booking.jumlah,
    estimasiTotal,
    catatan: sanitizeSheetCell(booking.catatan || "-"),
    status: booking.status,
    waktuMasuk: sanitizeSheetCell(createdFormatted),
    bookingId: sanitizeSheetCell(booking.bookingId),
  };

  try {
    const response = await fetch(webhookUrl.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      redirect: "follow",
      signal: AbortSignal.timeout(SHEET_TIMEOUT_MS),
    });

    const text = await response.text();
    let parsedBody: { ok?: boolean; error?: string } | null = null;
    try {
      parsedBody = JSON.parse(text) as { ok?: boolean; error?: string };
    } catch {
      parsedBody = null;
    }

    if (!response.ok || (parsedBody && parsedBody.ok === false)) {
      const reason = parsedBody?.error || `HTTP ${response.status}`;
      console.warn("[Sheets] Gagal kirim ke Google Sheets:", reason);
      return { success: false, error: reason };
    }

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.warn("[Sheets] Error koneksi Google Sheets:", message);
    return { success: false, error: message };
  }
}

