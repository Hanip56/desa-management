import { z } from "zod";

export const skTidakMampuSchema = z.object({
  nama: z.string().min(1, {
    message: "Kolom Nama harus diisi",
  }),
  tempatLahir: z.string().min(1, {
    message: "Kolom Tempat lahir harus diisi",
  }),
  tanggalLahir: z.date({
    message: "Kolom Tanggal lahir harus diisi",
  }),
  nik: z.string().min(1, {
    message: "Kolom NIK harus diisi",
  }),
  noKk: z.string().min(1, {
    message: "Kolom No KK harus diisi",
  }),
  pekerjaan: z.string().min(1, {
    message: "Kolom Pekerjaan harus diisi",
  }),
  alamat: z.string().min(1, {
    message: "Kolom Alamat harus diisi",
  }),
  namaOrangTua: z.string().min(1, {
    message: "Kolom Nama harus diisi",
  }),
  tempatLahirOrangTua: z.string().min(1, {
    message: "Kolom Tempat lahir harus diisi",
  }),
  tanggalLahirOrangTua: z.date({
    message: "Kolom Tanggal lahir harus diisi",
  }),
  nikOrangTua: z.string().min(1, {
    message: "Kolom NIK harus diisi",
  }),
  pekerjaanOrangTua: z.string().min(1, {
    message: "Kolom Pekerjaan harus diisi",
  }),
  alamatOrangTua: z.string().min(1, {
    message: "Kolom Alamat harus diisi",
  }),
  keperluan: z.string().min(1, {
    message: "Kolom Keperluan harus diisi",
  }),
});
