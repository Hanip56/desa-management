import { z } from "zod";

export const suratRekomendasiPembelianBbmSchema = z.object({
  nama: z.string().min(1, {
    message: "Kolom Nama harus diisi",
  }),
  nik: z.string().min(1, {
    message: "Kolom NIK harus diisi",
  }),
  alamatUsaha: z.string().min(1, {
    message: "Kolom Alamat usaha harus diisi",
  }),
  konsumenPengguna: z.string().min(1, {
    message: "Kolom Konsumen pengguna harus diisi",
  }),
  jenisUsahaKegiatan: z.string().min(1, {
    message: "Kolom Jenis usaha kegiatan harus diisi",
  }),
  jenisAlat: z.string().min(1, {
    message: "Kolom Jenis alat harus diisi",
  }),
  jumlahAlat: z.number({
    message: "Kolom Jumlah alat harus diisi",
  }),
  fungsiAlat: z.string().min(1, {
    message: "Kolom Fungsi alat harus diisi",
  }),
  jamOperasi: z.string().min(1, {
    message: "Kolom Jam operasi harus diisi",
  }),
  konsumsi: z.string().min(1, {
    message: "Kolom Konsumsi harus diisi",
  }),
});
