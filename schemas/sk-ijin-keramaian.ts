import { z } from "zod";

export const skIjinKeramaianSchema = z.object({
  nama: z.string().min(1, {
    message: "Kolom Nama harus diisi",
  }),
  nik: z.string().min(1, {
    message: "Kolom NIK harus diisi",
  }),
  tempatLahir: z.string().min(1, {
    message: "Kolom Tempat lahir harus diisi",
  }),
  tanggalLahir: z.date({
    message: "Kolom Tanggal lahir harus diisi",
  }),
  kampung: z.string().min(1, {
    message: "Kolom Kampung harus diisi",
  }),
  rt: z.string().min(1, {
    message: "Kolom RT harus diisi",
  }),
  rw: z.string().min(1, {
    message: "Kolom RW harus diisi",
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
