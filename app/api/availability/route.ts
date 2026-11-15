/**
 * app/api/availability/route.ts
 * GET /api/availability?tanggal=YYYY-MM-DD
 * Mengecek sisa slot ATV per hari secara real-time sebelum user submit form.
 * Jika Supabase belum dikonfigurasi/paused, mengembalikan fallback agar form tetap bisa dipakai.
 */
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { MAX_UNITS_PER_DAY, getTodayJakartaDateString } from "@/lib/constants";

export async function GET(request: NextRequest) {
  const tanggal = request.nextUrl.searchParams.get("tanggal")?.trim() || "";

  if (!/^\d{4}-\d{2}-\d{2}$/.test(tanggal)) {
    return NextResponse.json(
      { success: false, error: "Format tanggal tidak valid (YYYY-MM-DD)." },
      { status: 400, headers: { "Cache-Control": "no-store" } }
    );
  }

  const todayJakarta = getTodayJakartaDateString();
  if (tanggal < todayJakarta) {
    return NextResponse.json(
      { success: false, error: "Tanggal tidak boleh di masa lalu." },
      { status: 400, headers: { "Cache-Control": "no-store" } }
    );
  }

  try {
    const { data, error } = await supabase
      .from("bookings")
      .select("jumlah")
      .eq("tanggal", tanggal)
      .neq("status", "CANCELLED");

    if (error || !data) {
      return NextResponse.json(
        {
          success: true,
          tanggal,
          maxUnits: MAX_UNITS_PER_DAY,
          bookedUnits: null,
          remaining: null,
          source: "fallback",
        },
        { status: 200, headers: { "Cache-Control": "no-store" } }
      );
    }

    const bookedUnits = data.reduce((sum, item) => sum + (item.jumlah || 0), 0);
    const remaining = Math.max(0, MAX_UNITS_PER_DAY - bookedUnits);

    return NextResponse.json(
      {
        success: true,
        tanggal,
        maxUnits: MAX_UNITS_PER_DAY,
        bookedUnits,
        remaining,
        source: "supabase",
      },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    console.warn("[API/availability] Availability check warning:", err);
    return NextResponse.json(
      {
        success: true,
        tanggal,
        maxUnits: MAX_UNITS_PER_DAY,
        bookedUnits: null,
        remaining: null,
        source: "fallback",
      },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  }
}
