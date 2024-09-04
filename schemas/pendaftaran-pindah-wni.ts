import { z } from "zod";

export const AnggotaPindahSchema = z.object({
  namaLengkap: z.string().min(1, {
    message: "Kolom Nama lengkap harus diisi",
  }),
  nik: z.string().length(16, {
    message: "Kolom NIK tidak valid",
  }),
  masaBerlakuKtp: z.date({
    message: "Kolom Masa berlaku KTP harus diisi",
  }),
  shdk: z.string().min(1, {
    message: "Kolom SHDK harus diisi",
  }),
});

export const pendaftaranPindahWniSchema = z.object({
  namaLengkapPemohon: z.string().min(1, {
    message: "Kolom Nama lengkap pemohon harus diisi",
  }),
  nik: z.string().length(16, {
    message: "Kolom NIK tidak valid",
  }),
  noKk: z.string().length(16, {
    message: "Kolom No KK tidak valid",
  }),
  jenisPermohonan: z.string().min(1, {
    message: "Kolom Jenis permohonan harus diisi",
  }),
  alamatAsal: z.string().min(1, {
    message: "Kolom Alamat asal harus diisi",
  }),
  desaAsal: z.string().min(1, {
    message: "Kolom Desa asal harus diisi",
  }),
  kecamatanAsal: z.string().min(1, {
    message: "Kolom Kecamatan asal harus diisi",
  }),
  kabupatenAsal: z.string().min(1, {
    message: "Kolom Kabupaten asal harus diisi",
  }),
  provinsiAsal: z.string().min(1, {
    message: "Kolom Provinsi asal harus diisi",
  }),
  kodePosAsal: z.string().min(1, {
    message: "Kolom Kode pos asal harus diisi",
  }),
  alamatTujuan: z.string().min(1, {
    message: "Kolom Alamat tujuan harus diisi",
  }),
  desaTujuan: z.string().min(1, {
    message: "Kolom Desa tujuan harus diisi",
  }),
  kecamatanTujuan: z.string().min(1, {
    message: "Kolom Kecamatan tujuan harus diisi",
  }),
  kabupatenTujuan: z.string().min(1, {
    message: "Kolom Kabupaten tujuan harus diisi",
  }),
  provinsiTujuan: z.string().min(1, {
    message: "Kolom Provinsi tujuan harus diisi",
  }),
  kodePosTujuan: z.string().min(1, {
    message: "Kolom Kode pos tujuan harus diisi",
  }),
  klasifikasiKepindahan: z.string().min(1, {
    message: "Kolom Klasifikasi kepindahan harus diisi",
  }),
  alasanPindah: z.string().min(1, {
    message: "Kolom No KK tidak valid",
  }),
  jenisKepindahan: z.string().min(1, {
    message: "Kolom Jenis kepindahan harus diisi",
  }),
  anggotaPindah: z
    .array(AnggotaPindahSchema)
    .min(1, "Setidaknya harus memiliki 1 anggota pindah"),
});
