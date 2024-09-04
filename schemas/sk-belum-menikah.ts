import { z } from "zod";
import { genderEnum, StatusPerkawinanEnum } from ".";

export const skBelumMenikahSchema = z.object({
  namaLengkap: z.string().min(1, {
    message: "Kolom Nama lengkap harus diisi",
  }),
  nik: z.string().length(16, {
    message: "Kolom NIK tidak valid",
  }),
  tanggalLahir: z.date({
    message: "Kolom Tanggal lahir harus diisi",
  }),
  jenisKelamin: z.enum(genderEnum, {
    message: "Kolom Jenis kelamin harus diisi",
  }),
  agama: z.string().min(1, {
    message: "Kolom Agama diisi",
  }),
  pekerjaan: z.string().min(1, {
    message: "Kolom Pekerjaan harus diisi",
  }),
  statusPerkawinan: z.enum(StatusPerkawinanEnum, {
    message: "Kolom Status perkawinan harus diisi",
  }),
  kewarganegaraan: z.string().min(1, {
    message: "Kolom Kewarganegaraan harus diisi",
  }),
  alamat: z.string().min(1, {
    message: "Kolom Alamat harus diisi",
  }),
});
