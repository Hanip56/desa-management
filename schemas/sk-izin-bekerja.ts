import { z } from "zod";
import { genderEnum } from ".";
import { DateRange } from "react-day-picker";

export const skIzinBekerjaSchema = z.object({
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
  bagian: z.string().min(1, {
    message: "Kolom Bagian harus diisi",
  }),
  nomorId: z.string().min(1, {
    message: "Kolom Nomor ID harus diisi",
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
  tempatKerja: z.string().min(1, {
    message: "Kolom Tempat kerja harus diisi",
  }),
  alasan: z.string().min(1, {
    message: "Kolom Alasan harus diisi",
  }),
  waktuIzin: z.object({
    from: z.date(),
    to: z.date().optional(),
  }),
});
