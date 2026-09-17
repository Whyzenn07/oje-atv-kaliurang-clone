/**
 * app/api/booking/route.ts
 * POST /api/booking — Endpoint penerima booking dari form
 *
 * Alur:
 * 1. Baca & parse body JSON
 * 2. Rate limiting berdasarkan IP
 * 3. Validasi server-side via Zod
 * 4. Sanitasi input
 * 5. Simpan ke Supabase
 * 6. Kirim notifikasi email ke admin
 * 7. Return response ke browser
 */

import { NextRequest, NextResponse } from "next/server";
import { BookingSchema } from "@/lib/validations";
import { supabase } from "@/lib/supabase";
import { sendBookingNotification } from "@/lib/mailer";
import { isRateLimited } from "@/lib/ratelimit";

// Hanya izinkan method POST
export async function POST(request: NextRequest) {
  // ─── Layer 1: Ambil IP untuk rate limiting ───────────────────────────────
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";

  // ─── Layer 2: Rate Limiting ──────────────────────────────────────────────
  if (isRateLimited(ip)) {
    return NextResponse.json(
      {
        success: false,
        error: "Terlalu banyak permintaan. Silakan coba lagi dalam 1 jam.",
      },
      { status: 429 }
    );
  }

  // ─── Layer 3: Parse Body ─────────────────────────────────────────────────
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Format request tidak valid." },
      { status: 400 }
    );
  }

  // ─── Layer 4: Validasi Server-Side (Zod) ─────────────────────────────────
  const parsed = BookingSchema.safeParse(body);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message || "Data tidak valid";
    return NextResponse.json(
      { success: false, error: firstError, details: parsed.error.issues },
      { status: 422 }
    );
  }

  const data = parsed.data;

  // ─── Layer 5: Simpan ke Supabase ─────────────────────────────────────────
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
    console.error("[API/booking] Supabase insert error:", dbError);
    // Jangan bocorkan detail error database ke client
    return NextResponse.json(
      { success: false, error: "Gagal menyimpan booking. Silakan coba lagi." },
      { status: 500 }
    );
  }

  // ─── Layer 6: Kirim Email Notifikasi ke Admin ─────────────────────────────
  // Email tidak blocking — jika gagal, booking tetap tersimpan
  const emailResult = await sendBookingNotification({
    ...data,
    id: inserted.id,
    created_at: inserted.created_at,
  });

  if (!emailResult.success) {
    // Log ke server tapi tetap return sukses ke user
    console.warn("[API/booking] Email gagal terkirim:", emailResult.error);
  }

  // ─── Layer 7: Return Sukses ───────────────────────────────────────────────
  return NextResponse.json(
    {
      success: true,
      bookingId: inserted.id,
      message: "Booking berhasil disimpan. Admin akan segera menghubungi Anda.",
    },
    { status: 201 }
  );
}

// Method lain ditolak
export async function GET() {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}
