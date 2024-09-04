import { z } from "zod";

export const skIjinKeramaianSchema = z.object({
  nama: z.string().min(1, {
    message: "Kolom Nama harus diisi",
  }),
  nik: z.string().length(16, {
    message: "Kolom NIK tidak valid",
  }),
  tempatLahir: z.string().min(1, {
    message: "Kolom Tempat lahir harus diisi",
  }),
  tanggalLahir: z.date({
    message: "Kolom Tanggal lahir harus diisi",
  }),
  alamat: z.string().min(1, {
    message: "Kolom Alamat harus diisi",
  }),
  waktu: z.date({
    message: "Kolom Waktu harus diisi",
  }),
  maksud: z.string().min(1, {
    message: "Kolom Maksud harus diisi",
  }),
  acara: z.string().min(1, {
    message: "Kolom Acara harus diisi",
  }),
});
