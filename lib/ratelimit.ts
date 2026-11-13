/**
 * lib/ratelimit.ts
 * Rate limiting berlapis dengan perlindungan IP spoofing
 *
 * Lapisan perlindungan:
 * 1. Per-IP rate limit (maks 3 booking/jam per IP)
 * 2. Global rate limit (maks 30 booking/jam total — cegah distributed flood)
 * 3. Body size guard (maks 8KB — konstanta dipakai di route.ts)
 * 4. Anti-IP-spoofing: di Vercel, ambil IP asli dari posisi TERAKHIR
 *    x-forwarded-for (Vercel edge yang menambahkan, tidak bisa di-spoof client)
 */

interface RateLimitEntry {
  count: number;
  resetAt: number; // Unix timestamp (ms)
}

// Map IP => {count, resetAt}
const store = new Map<string, RateLimitEntry>();

// Global counter — cegah distributed flood dari banyak IP berbeda
let globalCount = 0;
let globalResetAt = Date.now() + 60 * 60 * 1000;

const MAX_REQUESTS_PER_IP = 3;    // maks booking per IP per jam
const MAX_REQUESTS_GLOBAL  = 60;  // maks booking total per jam (anti-DDoS, cukup longgar agar pelanggan sah tidak terkunci)
const CLEANUP_THRESHOLD = 500;    // bersihkan store jika entry melebihi ini
const WINDOW_MS = 60 * 60 * 1000; // 1 jam dalam milidetik

/** Ukuran body maksimum yang diizinkan (8 KB) — dipakai di route.ts */
export const MAX_BODY_BYTES = 8 * 1024;

/**
 * Ekstrak IP terpercaya dari header.
 * Di Vercel: IP asli ada di posisi TERAKHIR x-forwarded-for
 *            (Vercel edge yang menambahkan, tidak bisa di-spoof oleh client).
 * Di non-Vercel/lokal: ambil posisi pertama sebagai best-effort.
 */
export function extractTrustedIp(
  forwardedFor: string | null,
  isVercel: boolean
): string {
  if (!forwardedFor) return "unknown";

  const ips = forwardedFor.split(",").map((s) => s.trim()).filter(Boolean);
  if (ips.length === 0) return "unknown";

  if (isVercel) {
    // Posisi terakhir = IP yang ditambahkan Vercel edge — tidak bisa dipalsukan
    return ips[ips.length - 1];
  }

  // Local / non-Vercel: ambil pertama (bisa di-spoof, tapi fine untuk dev)
  return ips[0];
}

/**
 * Cek apakah IP sudah melebihi batas request.
 * @returns true jika rate limited (harus ditolak)
 */
export function isRateLimited(ip: string): boolean {
  const now = Date.now();

  if (store.size > CLEANUP_THRESHOLD) cleanupRateLimitStore();

  // ─── Cek global flood limit dulu ────────────────────────────────────────
  if (now > globalResetAt) {
    globalCount = 0;
    globalResetAt = now + WINDOW_MS;
  }
  if (globalCount >= MAX_REQUESTS_GLOBAL) {
    return true; // distributed flood terdeteksi
  }

  // ─── Cek per-IP limit ────────────────────────────────────────────────────
  const entry = store.get(ip);

  if (!entry || now > entry.resetAt) {
    store.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    globalCount++;
    return false;
  }

  if (entry.count >= MAX_REQUESTS_PER_IP) {
    return true;
  }

  entry.count++;
  store.set(ip, entry);
  globalCount++;
  return false;
}

/**
 * Bersihkan entry yang sudah expired dari store
 * Dipanggil opsional untuk mencegah memory leak di lingkungan long-running
 */
export function cleanupRateLimitStore(): void {
  const now = Date.now();
  for (const [ip, entry] of store.entries()) {
    if (now > entry.resetAt) {
      store.delete(ip);
    }
  }
}
