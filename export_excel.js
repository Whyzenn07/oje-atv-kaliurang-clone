const fs = require("fs");
const path = require("path");

// Baca env dari .env.local
function loadEnv() {
  const envPath = path.join(__dirname, ".env.local");
  if (!fs.existsSync(envPath)) return {};
  const content = fs.readFileSync(envPath, "utf8");
  const env = {};
  content.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const [key, ...vals] = trimmed.split("=");
    if (key && vals.length) env[key.trim()] = vals.join("=").trim();
  });
  return env;
}

async function exportToCSV() {
  const env = loadEnv();
  const supabaseUrl = env.SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceKey =
    env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    console.error("Error: SUPABASE_URL atau SUPABASE_SERVICE_ROLE_KEY tidak ditemukan di .env.local");
    process.exit(1);
  }

  const res = await fetch(
    `${supabaseUrl}/rest/v1/bookings?select=*&order=created_at.desc`,
    {
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
      },
    }
  );

  const data = await res.json();
  console.log("Mengambil", data.length, "data dari Supabase...");

  const headers = [
    "Kode Booking",
    "Nama Customer",
    "Nomor WhatsApp",
    "Paket ATV",
    "Tanggal Sewa",
    "Jumlah Unit",
    "Catatan Khusus",
    "Status",
    "Waktu Masuk",
  ];

  const rows = data.map((item) => {
    let wa = "-";
    let kode = item.id.substring(0, 8).toUpperCase();
    let catatanBersih = item.catatan || "";

    const waMatch = item.catatan?.match(/\[WA:\s*([^\]]+)\]/);
    if (waMatch) wa = waMatch[1].trim();

    const kodeMatch = item.catatan?.match(/\[KODE:\s*([^\]]+)\]/);
    if (kodeMatch) kode = kodeMatch[1].trim();

    catatanBersih = catatanBersih
      .replace(/\[WA:[^\]]+\]/g, "")
      .replace(/\[KODE:[^\]]+\]/g, "")
      .replace(/^[\s\-]+|[\s\-]+$/g, "");

    const dateFormatted = new Date(item.created_at).toLocaleString("id-ID", {
      timeZone: "Asia/Jakarta",
    });

    return [
      kode,
      item.nama,
      wa,
      item.paket,
      item.tanggal,
      item.jumlah,
      catatanBersih || "-",
      item.status,
      dateFormatted,
    ]
      .map((val) => {
        const str = String(val);
        const safeStr = /^[=+\-@\t\r]/.test(str.trimStart()) ? `'${str}` : str;
        return `"${safeStr.replace(/"/g, '""')}"`;
      })
      .join(",");
  });

  // UTF-8 BOM (\uFEFF) agar Microsoft Excel langsung membaca tanda koma dan huruf dengan rapi
  const csvContent = "\uFEFF" + [headers.join(","), ...rows].join("\r\n");

  const outputPath = path.join(__dirname, "REPORT_BOOKING_OJE_ATV.csv");
  fs.writeFileSync(outputPath, csvContent, "utf8");
  console.log("Sukses! File laporan Excel dibuat di:", outputPath);
}

exportToCSV().catch(console.error);
