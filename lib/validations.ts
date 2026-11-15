/**
 * lib/validations.ts
 * Schema validasi Zod — dipakai di API Route (server-side)
 * Validasi ini tidak bisa dibypass dari browser, berbeda dengan HTML required
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

  paket: z.enum(PACKAGE_OPTIONS, {
    error: "Paket tidak valid",
  }),

  tanggal: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal tidak valid (YYYY-MM-DD)")
    .refine((date) => {
      return date >= getTodayJakartaDateString();
    }, "Tanggal tidak boleh di masa lalu"),

  jumlah: z
    .number()
    .int("Jumlah harus bilangan bulat")
    .min(1, "Minimal 1 unit")
    .max(MAX_UNITS_PER_DAY, `Maksimal ${MAX_UNITS_PER_DAY} unit per hari`),

  catatan: z
    .string()
    .max(300, "Catatan maksimal 300 karakter")
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
