/**
 * lib/validations.ts
 * Schema validasi Zod — dipakai di API Route (server-side)
 * Validasi ini tidak bisa dibypass dari browser, berbeda dengan HTML required
 */
import { z } from "zod";

const VALID_PACKAGES = [
  "ATV Single (Rp 300.000 / 2 Jam)",
  "ATV Boncengan (Rp 350.000 / 2 Jam)",
] as const;

export const BookingSchema = z.object({
  nama: z
    .string()
    .min(2, "Nama minimal 2 karakter")
    .max(100, "Nama maksimal 100 karakter")
    .regex(/^[a-zA-Z\s\-.]+$/, "Nama hanya boleh huruf, spasi, titik, dan strip"),

  paket: z.enum(VALID_PACKAGES, {
    error: "Paket tidak valid",
  }),

  tanggal: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal tidak valid (YYYY-MM-DD)")
    .refine((date) => {
      const picked = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return picked >= today;
    }, "Tanggal tidak boleh di masa lalu"),

  jumlah: z
    .number()
    .int("Jumlah harus bilangan bulat")
    .min(1, "Minimal 1 unit")
    .max(30, "Maksimal 30 unit"),

  catatan: z
    .string()
    .max(300, "Catatan maksimal 300 karakter")
    .optional()
    .nullable()
    .default(null),
});

export type BookingInput = z.infer<typeof BookingSchema>;
