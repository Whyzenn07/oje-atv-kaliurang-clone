-- ============================================================
-- SUPABASE DATABASE SCHEMA — OJE ATV KALIURANG
-- Jalankan script ini di Supabase SQL Editor:
-- Dashboard > SQL Editor > New query > Paste > Run
-- ============================================================

-- 1. Buat tabel bookings
CREATE TABLE IF NOT EXISTS public.bookings (
  id          UUID          DEFAULT gen_random_uuid() PRIMARY KEY,
  nama        VARCHAR(100)  NOT NULL,
  paket       VARCHAR(100)  NOT NULL,
  tanggal     DATE          NOT NULL,
  jumlah      INTEGER       NOT NULL CHECK (jumlah >= 1 AND jumlah <= 30),
  catatan     TEXT,
  status      VARCHAR(20)   NOT NULL DEFAULT 'PENDING'
                            CHECK (status IN ('PENDING', 'CONFIRMED', 'CANCELLED')),
  ip_address  VARCHAR(45),
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- 2. Aktifkan Row Level Security (firewall di level database)
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- 3. Policies: tidak ada akses publik sama sekali
--    Hanya service role (API Route) yang bisa baca dan tulis

-- Tolak semua SELECT dari user biasa / anon
CREATE POLICY "deny_public_select" ON public.bookings
  FOR SELECT USING (false);

-- Tolak semua INSERT dari user biasa / anon
CREATE POLICY "deny_public_insert" ON public.bookings
  FOR INSERT WITH CHECK (false);

-- Tolak semua UPDATE dari user biasa / anon
CREATE POLICY "deny_public_update" ON public.bookings
  FOR UPDATE USING (false);

-- Tolak semua DELETE dari user biasa / anon
CREATE POLICY "deny_public_delete" ON public.bookings
  FOR DELETE USING (false);

-- 4. Index untuk query cepat berdasarkan tanggal dan status
CREATE INDEX idx_bookings_tanggal  ON public.bookings (tanggal);
CREATE INDEX idx_bookings_status   ON public.bookings (status);
CREATE INDEX idx_bookings_created  ON public.bookings (created_at DESC);

-- 5. Trigger untuk auto-update kolom updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- QUERY BERGUNA UNTUK ADMIN (jalankan di Supabase SQL Editor)
-- ============================================================

-- Lihat semua booking pending:
-- SELECT * FROM bookings WHERE status = 'PENDING' ORDER BY tanggal ASC;

-- Lihat booking minggu ini:
-- SELECT * FROM bookings
-- WHERE tanggal BETWEEN CURRENT_DATE AND CURRENT_DATE + 7
-- ORDER BY tanggal ASC;

-- Rekap per bulan:
-- SELECT DATE_TRUNC('month', tanggal) AS bulan,
--        COUNT(*) AS total_booking,
--        SUM(jumlah) AS total_unit
-- FROM bookings
-- WHERE status != 'CANCELLED'
-- GROUP BY 1 ORDER BY 1 DESC;

-- Update status booking:
-- UPDATE bookings SET status = 'CONFIRMED' WHERE id = '<UUID>';
