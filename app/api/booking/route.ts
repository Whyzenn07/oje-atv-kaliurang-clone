/**
 * app/api/booking/route.ts
 * POST /api/booking — Endpoint penerima booking dari form
 *
 * Alur:
 * 1. Cek Content-Type harus application/json
 * 2. Cek ukuran body (maks 8 KB — cegah payload bombing)
 * 3. Rate limiting berdasarkan IP (anti-spoof + global flood guard)
 * 4. Parse body JSON
 * 5. Validasi server-side via Zod (tanpa bocorkan detail internal)
 * 6. Simpan ke Supabase (dengan graceful fallback)
 * 7. Kirim notifikasi email ke admin
 * 8. Return response ke browser
 */

import { NextRequest, NextResponse } from "next/server";
import { BookingSchema } from "@/lib/validations";
import { supabase } from "@/lib/supabase";
import { sendBookingNotification } from "@/lib/mailer";
import { isRateLimited, extractTrustedIp, MAX_BODY_BYTES } from "@/lib/ratelimit";

// Hanya izinkan method POST
export async function POST(request: NextRequest) {
  // ─── Layer 1: Enforce Content-Type ───────────────────────────────────────
  // Cegah content-type confusion attack
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return NextResponse.json(
      { success: false, error: "Content-Type tidak valid." },
      { status: 415 }
    );
  }

  // ─── Layer 2: Body Size Guard (maks 8 KB) ────────────────────────────────
  // Cegah payload bombing / memory exhaustion sebelum parsing
  const contentLength = request.headers.get("content-length");
  if (contentLength && parseInt(contentLength, 10) > MAX_BODY_BYTES) {
    return NextResponse.json(
      { success: false, error: "Request terlalu besar." },
      { status: 413 }
    );
  }

  // ─── Layer 3: Ekstrak IP dengan Anti-Spoofing ────────────────────────────
  // Di Vercel: IP asli ada di posisi TERAKHIR x-forwarded-for
  // (Vercel edge yang menambahkan — tidak bisa di-spoof oleh client)
  const isVercel = !!process.env.VERCEL;
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = extractTrustedIp(forwardedFor, isVercel);

  // ─── Layer 4: Rate Limiting (per-IP + global flood guard) ────────────────
  if (isRateLimited(ip)) {
    return NextResponse.json(
      {
        success: false,
        error: "Terlalu banyak permintaan. Silakan coba lagi dalam 1 jam.",
      },
      { status: 429 }
    );
  }

  // ─── Layer 5: Parse Body JSON ─────────────────────────────────────────────
  let body: unknown;
  try {
    // Baca sebagai teks agar ukuran aktual dicek (header Content-Length bisa dihilangkan)
    const raw = await request.text();
    if (Buffer.byteLength(raw, "utf8") > MAX_BODY_BYTES) {
      return NextResponse.json(
        { success: false, error: "Request terlalu besar." },
        { status: 413 }
      );
    }
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json(
      { success: false, error: "Format request tidak valid." },
      { status: 400 }
    );
  }

  // Body harus berupa object (bukan array, null, string, dll)
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return NextResponse.json(
      { success: false, error: "Format request tidak valid." },
      { status: 400 }
    );
  }

  // ─── Layer 6: Validasi Server-Side (Zod) ─────────────────────────────────
  // TIDAK kirim details[] ke client — cegah info disclosure tentang struktur internal
  const parsed = BookingSchema.safeParse(body);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message || "Data tidak valid";
    // Log detail error di server untuk debugging, tapi jangan kirim ke client
    console.warn("[API/booking] Validasi gagal:", parsed.error.issues);
    return NextResponse.json(
      { success: false, error: firstError },
      { status: 422 }
    );
  }

  const data = parsed.data;

  // ─── Layer 7: Cek Kuota Unit per Tanggal (Maks 15 unit/hari) ───────────────
  const MAX_ATV_PER_DAY = 15;
  try {
    const { data: existingBookings, error: quotaErr } = await supabase
      .from("bookings")
      .select("jumlah")
      .eq("tanggal", data.tanggal)
      .neq("status", "CANCELLED");

    if (!quotaErr && existingBookings) {
      const bookedUnits = existingBookings.reduce((sum, item) => sum + (item.jumlah || 0), 0);
      if (bookedUnits + data.jumlah > MAX_ATV_PER_DAY) {
        const remaining = Math.max(0, MAX_ATV_PER_DAY - bookedUnits);
        return NextResponse.json(
          {
            success: false,
            error: remaining > 0
              ? `Slot ATV untuk tanggal tersebut tersisa ${remaining} unit. Silakan kurangi unit atau pilih tanggal lain.`
              : "Mohon maaf, kuota unit ATV untuk tanggal tersebut sudah penuh. Silakan pilih tanggal lain.",
          },
          { status: 409 }
        );
      }
    }
  } catch (err) {
    console.warn("[API/booking] Quota check warning:", err);
  }

  // ─── Layer 8: Simpan ke Supabase (dengan graceful fallback jika paused/down) ─
  let bookingId: string;
  let createdAt: string;

  // Buat kode booking rapi, contoh: OJE-1120-A7K
  const cleanDate = data.tanggal.replace(/-/g, "").slice(4); // MMDD
  const randChars = Math.random().toString(36).substring(2, 5).toUpperCase();
  const humanBookingCode = `OJE-${cleanDate}-${randChars}`;

  // Catat nomor WhatsApp di catatan jika kolom whatsapp belum ada di Supabase
  const combinedCatatan = [
    `[WA: ${data.whatsapp}] [KODE: ${humanBookingCode}]`,
    data.catatan ? data.catatan : null,
  ]
    .filter(Boolean)
    .join(" - ");

  try {
    const { data: inserted, error: dbError } = await supabase
      .from("bookings")
      .insert({
        nama: data.nama,
        paket: data.paket,
        tanggal: data.tanggal,
        jumlah: data.jumlah,
        catatan: combinedCatatan,
        status: "PENDING",
        ip_address: ip,
      })
      .select()
      .single();

    if (dbError || !inserted) {
      console.warn("[API/booking] Supabase unavailable/paused, using fallback ID:", dbError?.message || dbError);
      bookingId = humanBookingCode;
      createdAt = new Date().toISOString();
    } else {
      bookingId = inserted.id;
      createdAt = inserted.created_at;
    }
  } catch (err) {
    console.warn("[API/booking] Supabase connection error, using fallback ID:", err);
    bookingId = humanBookingCode;
    createdAt = new Date().toISOString();
  }

  // ─── Layer 9: Kirim Email Notifikasi ke Admin ─────────────────────────────
  // Email tidak blocking — jika gagal, booking tetap terproses
  const emailResult = await sendBookingNotification({
    ...data,
    id: bookingId,
    created_at: createdAt,
  });

  if (!emailResult.success) {
    console.warn("[API/booking] Email gagal terkirim:", emailResult.error);
  }

  // ─── Layer 10: Return Sukses ──────────────────────────────────────────────
  return NextResponse.json(
    {
      success: true,
      bookingId: bookingId,
      bookingCode: humanBookingCode,
      message: `Booking berhasil dicatat dengan kode ${humanBookingCode}. Admin akan segera menghubungi Anda via WhatsApp.`,
    },
    { status: 201 }
  );
}

// Method lain ditolak
export async function GET() {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}


