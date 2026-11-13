/**
 * Google Apps Script — Webhook Penerima Booking OJE ATV Kaliurang
 * Tempelkan kode ini di Google Sheets > Extensions > Apps Script.
 *
 * Keamanan:
 * - Set Script Property bernama WEBHOOK_SECRET (atau ganti WEBHOOK_SECRET_FALLBACK di bawah)
 *   dengan string acak minimal 32 karakter yang SAMA persis dengan GOOGLE_SHEETS_SECRET di .env.local / Vercel.
 * - Script menolak request jika secret masih default placeholder atau tidak cocok.
 */

const SHEET_NAME = "Bookings";
const PLACEHOLDER_SECRET = "GANTI_DENGAN_SECRET_ACAK_MIN_32_KARAKTER";

// Opsional jika tidak memakai Script Properties, isi di sini (harus sama dengan GOOGLE_SHEETS_SECRET):
const WEBHOOK_SECRET_FALLBACK = PLACEHOLDER_SECRET;

const HEADERS = [
  "Kode Booking",
  "Nama Customer",
  "Nomor WhatsApp",
  "Paket ATV",
  "Tanggal Sewa",
  "Jumlah Unit",
  "Estimasi Total (Rp)",
  "Catatan Khusus",
  "Status",
  "Waktu Masuk (WIB)",
  "ID Database",
];

function jsonOutput(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON
  );
}

function getExpectedSecret() {
  const fromProps =
    PropertiesService.getScriptProperties().getProperty("WEBHOOK_SECRET");
  return (fromProps || WEBHOOK_SECRET_FALLBACK || "").trim();
}

function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.getSheets()[0];
    if (sheet && sheet.getLastRow() === 0) {
      sheet.setName(SHEET_NAME);
    } else if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
    }
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    const headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
    headerRange.setFontWeight("bold");
    headerRange.setBackground("#1C1C1C");
    headerRange.setFontColor("#FFFFFF");
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function sanitizeCell(value) {
  const str = String(value == null ? "" : value).replace(/[\r\n]+/g, " ").trim();
  if (/^[=+\-@\t\r]/.test(str)) {
    return "'" + str;
  }
  return str;
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(5000);

    if (!e || !e.postData || !e.postData.contents) {
      return jsonOutput({ ok: false, error: "Empty request body" });
    }

    const data = JSON.parse(e.postData.contents);
    const expectedSecret = getExpectedSecret();

    if (!expectedSecret || expectedSecret === PLACEHOLDER_SECRET) {
      return jsonOutput({ ok: false, error: "Webhook secret not configured" });
    }

    if (!data || data.secret !== expectedSecret) {
      return jsonOutput({ ok: false, error: "Unauthorized" });
    }

    const sheet = getOrCreateSheet();
    const bookingCode = sanitizeCell(data.bookingCode || "-");

    // Cek duplikasi sederhana pada 50 baris terakhir berdasarkan Kode Booking
    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      const startRow = Math.max(2, lastRow - 49);
      const recentCodes = sheet
        .getRange(startRow, 1, lastRow - startRow + 1, 1)
        .getValues()
        .flat();
      if (recentCodes.indexOf(bookingCode) !== -1) {
        return jsonOutput({ ok: true, duplicate: true });
      }
    }

    const rowValues = [
      bookingCode,
      sanitizeCell(data.nama || "-"),
      sanitizeCell(data.whatsapp || "-"),
      sanitizeCell(data.paket || "-"),
      sanitizeCell(data.tanggal || "-"),
      Number(data.jumlah) || 1,
      Number(data.estimasiTotal) || 0,
      sanitizeCell(data.catatan || "-"),
      sanitizeCell(data.status || "PENDING"),
      sanitizeCell(data.waktuMasuk || "-"),
      sanitizeCell(data.bookingId || "-"),
    ];

    const targetRow = lastRow + 1;
    const rowRange = sheet.getRange(targetRow, 1, 1, rowValues.length);

    // Format teks untuk kolom WA & Tanggal Sewa agar nol di depan tidak hilang
    sheet.getRange(targetRow, 3).setNumberFormat("@");
    sheet.getRange(targetRow, 5).setNumberFormat("@");
    sheet.getRange(targetRow, 7).setNumberFormat("#,##0");

    rowRange.setValues([rowValues]);

    return jsonOutput({ ok: true, row: targetRow });
  } catch (err) {
    return jsonOutput({
      ok: false,
      error: err && err.message ? err.message : "Internal error",
    });
  } finally {
    lock.releaseLock();
  }
}

