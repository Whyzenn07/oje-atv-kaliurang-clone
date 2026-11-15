/**
 * lib/turnstile.ts
 * Verifikasi opsional Cloudflare Turnstile untuk endpoint server-side.
 * Jika TURNSTILE_SECRET_KEY belum dikonfigurasi, verifikasi dilewati (graceful skip)
 * sehingga form tetap bekerja dengan proteksi honeypot & rate limiter.
 */

const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const TURNSTILE_TIMEOUT_MS = 5_000;

export async function verifyTurnstileToken(
  token: string | null | undefined,
  remoteIp: string
): Promise<{ success: boolean; skipped?: boolean; error?: string }> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY?.trim();
  if (!secretKey) {
    return { success: true, skipped: true };
  }

  const trimmedToken = typeof token === "string" ? token.trim() : "";
  if (!trimmedToken) {
    return { success: false, error: "Selesaikan verifikasi keamanan terlebih dahulu." };
  }

  try {
    const formData = new URLSearchParams();
    formData.set("secret", secretKey);
    formData.set("response", trimmedToken);
    if (remoteIp && remoteIp !== "unknown") {
      formData.set("remoteip", remoteIp);
    }

    const res = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
      signal: AbortSignal.timeout(TURNSTILE_TIMEOUT_MS),
    });

    if (!res.ok) {
      return { success: false, error: "Verifikasi keamanan gagal. Silakan coba lagi." };
    }

    const data = (await res.json()) as { success?: boolean; "error-codes"?: string[] };
    if (!data.success) {
      return { success: false, error: "Verifikasi anti-bot gagal. Silakan ulangi verifikasi." };
    }

    return { success: true };
  } catch (err) {
    console.warn("[Turnstile] Verify request error:", err);
    return { success: false, error: "Gagal memverifikasi keamanan. Silakan coba lagi." };
  }
}
