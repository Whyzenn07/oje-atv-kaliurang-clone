import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

const securityHeaders = [
  // Cegah website diembed di iframe oleh pihak lain (anti-clickjacking)
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  // Cegah browser menebak tipe file (anti-MIME sniffing)
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  // Paksa HTTPS di semua request (HSTS)
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // Kontrol info referrer agar tidak bocor ke pihak ketiga
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  // Batasi fitur browser yang bisa diakses (anti-fingerprinting)
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(self), payment=()",
  },
  // Content Security Policy — sumber konten yang diizinkan
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // 'unsafe-eval' hanya aktif di development mode (diperlukan React Turbopack HMR untuk stacktrace)
      isDev
        ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
        : "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https:",
      isDev
        ? "connect-src 'self' https://*.supabase.co ws: wss:"
        : "connect-src 'self' https://*.supabase.co",
      "frame-src https://www.google.com https://maps.google.com https://www.youtube.com", // untuk embed maps & video
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1", "localhost", "192.168.1.215"],

  async headers() {
    return [
      {
        // Terapkan security headers ke semua route
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;

