import { z } from "zod";
import { genderEnum } from ".";

export const suratKematianSchema = z.object({
  namaPemohon: z.string().min(1, {
    message: "Kolom nama harus diisi",
  }),
  jenisKelaminPemohon: z.enum(genderEnum),
  noNikPemohon: z.string().min(1, {
    message: "Kolom No. NIK harus diisi",
  }),
  kampungPemohon: z.string().min(1, {
    message: "Kolom kampung harus diisi",
  }),
  rtPemohon: z.string().min(1, {
    message: "Kolom rt harus diisi",
  }),
  rwPemohon: z.string().min(1, {
    message: "Kolom rw harus diisi",
  }),
  hubunganKeluargaPemohon: z.string().min(1, {
    message: "Kolom Hubungan keluarga harus diisi",
  }),
  namaTerkait: z.string().min(1, {
    message: "Kolom nama harus diisi",
  }),
  jenisKelaminTerkait: z.enum(genderEnum),
  noNikTerkait: z.string().min(1, {
    message: "Kolom No. NIK harus diisi",
  }),
  kampungTerkait: z.string().min(1, {
    message: "Kolom kampung harus diisi",
  }),
  rtTerkait: z.string().min(1, {
    message: "Kolom rt harus diisi",
  }),
  rwTerkait: z.string().min(1, {
    message: "Kolom rw harus diisi",
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
