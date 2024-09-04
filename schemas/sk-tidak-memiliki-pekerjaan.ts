import { z } from "zod";
import { genderEnum, StatusPerkawinanEnum } from ".";

export const skTidakMemilikiPekerjaanSchema = z.object({
  nama: z.string().min(1, {
    message: "Kolom Nama harus diisi",
  }),
  nik: z.string().length(16, {
    message: "Kolom NIK tidak valid",
  }),
  noKk: z.string().length(16, {
    message: "Kolom No KK tidak valid",
  }),
  tempatLahir: z.string().min(1, {
    message: "Kolom Tempat lahir harus diisi",
  }),
  tanggalLahir: z.date({
    message: "Kolom Tanggal lahir harus diisi",
  }),
  jenisKelamin: z.enum(genderEnum, {
    message: "Kolom Jenis kelamin harus diisi",
  }),
  statusPerkawinan: z.enum(StatusPerkawinanEnum, {
    message: "Kolom Status perkawinan harus diisi",
  }),
  pekerjaan: z.string().min(1, {
    message: "Kolom Pekerjaan harus diisi",
  }),
  agama: z.string().min(1, {
    message: "Kolom Agama diisi",
  }),
  alamat: z.string().min(1, {
    message: "Kolom Alamat harus diisi",
  }),
});
