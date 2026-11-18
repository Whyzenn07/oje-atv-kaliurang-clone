/**
 * lib/validations.ts
 * Schema validasi Zod — dipakai di API Route (server-side) untuk 9 field Form Booking Jeep Lava Tour Merapi
 */
import { z } from "zod";
import { MAX_UNITS_PER_DAY, PACKAGE_OPTIONS, getTodayJakartaDateString } from "./constants";

export const BookingSchema = z.object({
  nama: z
    .string()
    .min(2, "Nama minimal 2 karakter")
    .max(100, "Nama maksimal 100 karakter")
    .regex(/^[\p{L}\s\-.]+$/u, "Nama hanya boleh huruf, spasi, titik, dan strip"),

  whatsapp: z
    .string()
    .regex(/^[0-9+\-\s]+$/, "Format nomor WhatsApp tidak valid")
    .transform((val) => val.replace(/[^0-9]/g, ""))
    .refine((digits) => digits.length >= 9, "Nomor WhatsApp minimal 9 digit")
    .refine((digits) => digits.length <= 15, "Nomor WhatsApp maksimal 15 digit")
    .transform((digits) => (digits.startsWith("0") ? `62${digits.slice(1)}` : digits)),

  kotaAsal: z
    .string()
    .trim()
    .min(2, "Kota asal minimal 2 karakter")
    .max(80, "Kota asal maksimal 80 karakter")
    .regex(/^[\p{L}0-9\s\-.,/]+$/u, "Format kota asal tidak valid"),

  paket: z.enum(PACKAGE_OPTIONS, {
    error: "Pilih paket Jeep yang valid",
  }),

  tanggal: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal tidak valid (YYYY-MM-DD)")
    .refine((date) => {
      return date >= getTodayJakartaDateString();
    }, "Tanggal tidak boleh di masa lalu"),

  jam: z
    .string()
    .trim()
    .min(3, "Pilih jam keberangkatan")
    .max(40, "Format jam tidak valid"),

  jumlahPeserta: z
    .number()
    .int("Jumlah peserta harus bilangan bulat")
    .min(1, "Minimal 1 peserta")
    .max(60, "Maksimal 60 peserta per pemesanan"),

  jumlah: z
    .number()
    .int("Jumlah Jeep harus bilangan bulat")
    .min(1, "Minimal 1 unit Jeep")
    .max(MAX_UNITS_PER_DAY, `Maksimal ${MAX_UNITS_PER_DAY} unit Jeep per hari`),

  catatan: z
    .string()
    .max(300, "Tambahan/catatan maksimal 300 karakter")
    .optional()
    .nullable()
    .default(null),

  turnstileToken: z
    .string()
    .max(2048)
    .optional()
    .nullable(),
});

export type BookingInput = z.infer<typeof BookingSchema>;
