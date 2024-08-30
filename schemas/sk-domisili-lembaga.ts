import { z } from "zod";

export const skDomisiliLembagaSchema = z.object({
  nama: z.string().min(1, {
    message: "Kolom Nama harus diisi",
  }),
  tempatLahir: z.string().min(1, {
    message: "Kolom Tempat lahir harus diisi",
  }),
  tanggalLahir: z.date({
    message: "Kolom Tanggal lahir harus diisi",
  }),
  jabatan: z.string().min(1, {
    message: "Kolom Jabatan harus diisi",
  }),
  alamat: z.string().min(1, {
    message: "Kolom Alamat harus diisi",
  }),
  namaLembaga: z.string().min(1, {
    message: "Kolom Nama lembaga harus diisi",
  }),
  alamatLembaga: z.string().min(1, {
    message: "Kolom Alamat lembaga harus diisi",
  }),
});
