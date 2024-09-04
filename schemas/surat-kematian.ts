import { z } from "zod";
import { genderEnum } from ".";

export const suratKematianSchema = z.object({
  namaPemohon: z.string().min(1, {
    message: "Kolom nama harus diisi",
  }),
  jenisKelaminPemohon: z.enum(genderEnum),
  noNikPemohon: z.string().length(16, {
    message: "Kolom No. NIK tidak valid",
  }),
  alamatPemohon: z.string().min(1, {
    message: "Kolom Alamat harus diisi",
  }),
  hubunganKeluargaPemohon: z.string().min(1, {
    message: "Kolom Hubungan keluarga harus diisi",
  }),
  namaTerkait: z.string().min(1, {
    message: "Kolom nama harus diisi",
  }),
  jenisKelaminTerkait: z.enum(genderEnum),
  noNikTerkait: z.string().length(16, {
    message: "Kolom No. NIK tidak valid",
  }),
  alamatTerkait: z.string().min(1, {
    message: "Kolom Alamat harus diisi",
  }),
  tanggal: z.date({
    message: "Kolom tanggal harus diisi",
  }),
  penyebab: z.string().min(1, {
    message: "Kolom penyebab harus diisi",
  }),
  tempat: z.string().min(1, {
    message: "Kolom tempat harus diisi",
  }),
  status: z.enum(["DIPROSES", "DITERIMA", "DITOLAK"]).default("DIPROSES"),
});
