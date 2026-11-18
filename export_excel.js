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

function getUnitPrice(paket) {
  const str = String(paket || "");
  if (str.includes("750.000")) return 750000;
  if (str.includes("650.000")) return 650000;
  if (str.includes("600.000")) return 600000;
  if (str.includes("550.000")) return 550000;
  if (str.includes("500.000")) return 500000;
  if (str.includes("450.000")) return 450000;
  if (str.includes("350.000")) return 350000;
  return 300000;
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
    "Kota Asal",
    "Paket Jeep",
    "Tanggal Tour",
    "Jam Keberangkatan",
    "Jumlah Jeep",
    "Jumlah Peserta",
    "Estimasi Total (Rp)",
    "Tambahan / Catatan",
    "Status",
    "Waktu Masuk",
  ];

  const rows = data.map((item) => {
    let wa = item.whatsapp || "-";
    let kode = item.booking_code || item.id.substring(0, 8).toUpperCase();
    let kotaAsal = item.kota_asal || "-";
    let jam = item.jam || "-";
    let jumlahPeserta = item.jumlah_peserta || "-";
    let catatanBersih = item.catatan || "";

    if (wa === "-") {
      const waMatch = item.catatan?.match(/\[WA:\s*([^\]]+)\]/);
      if (waMatch) wa = waMatch[1].trim();
    }

    if (!item.booking_code) {
      const kodeMatch = item.catatan?.match(/\[KODE:\s*([^\]]+)\]/);
      if (kodeMatch) kode = kodeMatch[1].trim();
    }

    if (kotaAsal === "-") {
      const kotaMatch = item.catatan?.match(/\[KOTA:\s*([^\]]+)\]/);
      if (kotaMatch) kotaAsal = kotaMatch[1].trim();
    }

    if (jam === "-") {
      const jamMatch = item.catatan?.match(/\[JAM:\s*([^\]]+)\]/);
      if (jamMatch) jam = jamMatch[1].trim();
    }

    if (jumlahPeserta === "-") {
      const pesertaMatch = item.catatan?.match(/\[PESERTA:\s*([^\]]+)\]/);
      if (pesertaMatch) jumlahPeserta = pesertaMatch[1].replace(/org/i, "").trim();
    }

    const unitPrice = getUnitPrice(item.paket);
    const estimasi = item.estimasi_total ?? unitPrice * (Number(item.jumlah) || 1);

    catatanBersih = catatanBersih
      .replace(/\[WA:[^\]]+\]/g, "")
      .replace(/\[KODE:[^\]]+\]/g, "")
      .replace(/\[JAM:[^\]]+\]/g, "")
      .replace(/\[PESERTA:[^\]]+\]/g, "")
      .replace(/\[KOTA:[^\]]+\]/g, "")
      .replace(/^[\s\-]+|[\s\-]+$/g, "");

    const dateFormatted = new Date(item.created_at).toLocaleString("id-ID", {
      timeZone: "Asia/Jakarta",
    });

    return [
      kode,
      item.nama,
      wa,
      kotaAsal,
      item.paket,
      item.tanggal,
      jam,
      item.jumlah,
      jumlahPeserta,
      estimasi,
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

  const outputPath = path.join(__dirname, "REPORT_BOOKING_WISATA_MERAPI.csv");
  fs.writeFileSync(outputPath, csvContent, "utf8");
  console.log("Sukses! File laporan Excel dibuat di:", outputPath);
}

exportToCSV().catch(console.error);
