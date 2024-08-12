import { z } from "zod";
import { genderEnum } from ".";

const StatusPerkawinanEnum = [
  "BELUM_KAWIN",
  "KAWIN",
  "CERAI_HIDUP",
  "CERAI_MATI",
] as const;

export const skPenghasilanOrangTuaSchema = z.object({
  namaLengkap: z.string().min(1, {
    message: "Kolom Nama lengkap harus diisi",
  }),
  nik: z.string().min(1, {
    message: "Kolom NIK harus diisi",
  }),
  tanggalLahir: z.date({
    message: "Kolom Tanggal lahir harus diisi",
  }),
  jenisKelamin: z.enum(genderEnum, {
    message: "Kolom Jenis kelamin harus diisi",
  }),
  agama: z.string().min(1, {
    message: "Kolom Agama harus diisi",
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
  penghasilan: z.number().min(1, {
    message: "Kolom Penghasilan harus diisi",
  }),
});
