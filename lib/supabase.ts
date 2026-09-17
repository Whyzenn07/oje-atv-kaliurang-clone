/**
 * lib/supabase.ts
 * Supabase server-only client — JANGAN import di komponen React (client)
 * Menggunakan SERVICE_ROLE_KEY yang memiliki akses penuh (bypass RLS)
 * Hanya dipakai di API Route / Server Actions
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Lazy singleton — dibuat saat pertama kali dipanggil, bukan saat module load
// Ini agar build tidak gagal meski env vars belum diset
let _client: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (_client) return _client;

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      "[Supabase] SUPABASE_URL atau SUPABASE_SERVICE_ROLE_KEY belum diset. " +
        "Buat file .env.local berdasarkan .env.local.example, " +
        "atau set di dashboard Vercel/Netlify."
    );
  }

  _client = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return _client;
}

// Shorthand alias — tetap lazy
export const supabase = {
  from: (...args: Parameters<SupabaseClient["from"]>) =>
    getSupabaseClient().from(...args),
};

// Type untuk data booking yang masuk dari form
export type BookingInsert = {
  nama: string;
  paket: string;
  tanggal: string;
  jumlah: number;
  catatan: string | null;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  ip_address: string | null;
};

// Type untuk data booking yang sudah ada di database
export type Booking = BookingInsert & {
  id: string;
  created_at: string;
  updated_at: string;
};
