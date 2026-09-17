/**
 * lib/ratelimit.ts
 * Rate limiting sederhana berbasis in-memory (per Vercel serverless instance)
 * Max 3 booking per IP per jam
 *
 * Catatan: Untuk produksi skala besar, gunakan Redis (Upstash gratis).
 * Untuk UMKM seperti OJE ATV, in-memory sudah lebih dari cukup.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number; // Unix timestamp (ms)
}

// Map IP => {count, resetAt}
const store = new Map<string, RateLimitEntry>();

const MAX_REQUESTS = 3;    // max booking per window
const WINDOW_MS = 60 * 60 * 1000; // 1 jam dalam milidetik

/**
 * Cek apakah IP sudah melebihi batas request
 * @returns true jika rate limited (harus ditolak)
 */
export function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = store.get(ip);

  // IP pertama kali atau window sudah expired — reset
  if (!entry || now > entry.resetAt) {
    store.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false; // tidak diblokir
  }

  // Masih dalam window
  if (entry.count >= MAX_REQUESTS) {
    return true; // diblokir
  }

  // Increment counter
  entry.count++;
  store.set(ip, entry);
  return false; // tidak diblokir
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
