-- ============================================================
-- SUPABASE DATABASE SCHEMA — WISATA LAVA TOUR MERAPI
-- Jalankan script ini di Supabase SQL Editor:
-- Dashboard > SQL Editor > New query > Paste > Run
-- ============================================================

-- 1. Buat tabel bookings (lengkap dengan 9 field Form Booking + metadata)
CREATE TABLE IF NOT EXISTS public.bookings (
  id              UUID          DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_code    VARCHAR(32),
  nama            VARCHAR(100)  NOT NULL,
  whatsapp        VARCHAR(20),
  kota_asal       VARCHAR(80),
  paket           VARCHAR(100)  NOT NULL,
  tanggal         DATE          NOT NULL,
  jam             VARCHAR(40),
  jumlah          INTEGER       NOT NULL CHECK (jumlah >= 1 AND jumlah <= 15),
  jumlah_peserta  INTEGER       CHECK (jumlah_peserta >= 1 AND jumlah_peserta <= 60),
  estimasi_total  INTEGER,
  catatan         TEXT,
  status          VARCHAR(20)   NOT NULL DEFAULT 'PENDING'
                                CHECK (status IN ('PENDING', 'CONFIRMED', 'CANCELLED')),
  ip_address      VARCHAR(45),
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Migrasi aman (idempotent) untuk tabel bookings yang sudah ada sebelumnya
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS booking_code   VARCHAR(32);
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS whatsapp       VARCHAR(20);
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS kota_asal      VARCHAR(80);
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS jam            VARCHAR(40);
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS jumlah_peserta INTEGER;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS estimasi_total INTEGER;

-- 2. Aktifkan Row Level Security (firewall di level database)
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- 3. Policies: tidak ada akses publik sama sekali
--    Hanya service role (API Route) yang bisa baca dan tulis
DROP POLICY IF EXISTS "deny_public_select" ON public.bookings;
CREATE POLICY "deny_public_select" ON public.bookings
  FOR SELECT USING (false);

DROP POLICY IF EXISTS "deny_public_insert" ON public.bookings;
CREATE POLICY "deny_public_insert" ON public.bookings
  FOR INSERT WITH CHECK (false);

DROP POLICY IF EXISTS "deny_public_update" ON public.bookings;
CREATE POLICY "deny_public_update" ON public.bookings
  FOR UPDATE USING (false);

DROP POLICY IF EXISTS "deny_public_delete" ON public.bookings;
CREATE POLICY "deny_public_delete" ON public.bookings
  FOR DELETE USING (false);

-- 4. Index untuk query cepat berdasarkan tanggal, status, dan kode booking
CREATE INDEX IF NOT EXISTS idx_bookings_tanggal       ON public.bookings (tanggal);
CREATE INDEX IF NOT EXISTS idx_bookings_status        ON public.bookings (status);
CREATE INDEX IF NOT EXISTS idx_bookings_created       ON public.bookings (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_booking_code  ON public.bookings (booking_code);

-- 5. Trigger untuk auto-update kolom updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_bookings_updated_at ON public.bookings;
CREATE TRIGGER trg_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- QUERY BERGUNA UNTUK ADMIN (jalankan di Supabase SQL Editor)
-- ============================================================

-- Lihat semua booking lengkap dengan kolom terpisah:
-- SELECT booking_code, nama, whatsapp, kota_asal, paket, tanggal, jam,
--        jumlah AS jumlah_jeep, jumlah_peserta, estimasi_total, catatan, status, created_at
-- FROM public.bookings
-- ORDER BY created_at DESC;
