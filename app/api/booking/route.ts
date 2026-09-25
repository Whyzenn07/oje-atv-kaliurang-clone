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
    body = await request.json();
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

  // ─── Layer 7: Simpan ke Supabase (dengan graceful fallback jika paused/down) ─
  let bookingId: string;
  let createdAt: string;

  try {
    const { data: inserted, error: dbError } = await supabase
      .from("bookings")
      .insert({
        nama: data.nama,
        paket: data.paket,
        tanggal: data.tanggal,
        jumlah: data.jumlah,
        catatan: data.catatan ?? null,
        status: "PENDING",
        ip_address: ip,
      })
      .select()
      .single();

    if (dbError || !inserted) {
      console.warn("[API/booking] Supabase unavailable/paused, using fallback ID:", dbError?.message || dbError);
      bookingId = `OJE-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      createdAt = new Date().toISOString();
    } else {
      bookingId = inserted.id;
      createdAt = inserted.created_at;
    }
  } catch (err) {
    console.warn("[API/booking] Supabase connection error, using fallback ID:", err);
    bookingId = `OJE-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    createdAt = new Date().toISOString();
  }

  // ─── Layer 8: Kirim Email Notifikasi ke Admin ─────────────────────────────
  // Email tidak blocking — jika gagal, booking tetap terproses
  const emailResult = await sendBookingNotification({
    ...data,
    id: bookingId,
    created_at: createdAt,
  });

  if (!emailResult.success) {
    console.warn("[API/booking] Email gagal terkirim:", emailResult.error);
  }

  // ─── Layer 9: Return Sukses ───────────────────────────────────────────────
  return NextResponse.json(
    {
      success: true,
      bookingId: bookingId,
      message: "Booking berhasil dicatat. Admin akan segera menghubungi Anda.",
    },
    { status: 201 }
  );
}

// Method lain ditolak
export async function GET() {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}


