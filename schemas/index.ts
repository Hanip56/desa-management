import { date, z } from "zod";

// FYI: Schema for form, type for anything else

export const StatusPerkawinanEnum = [
  "BELUM_KAWIN",
  "KAWIN",
  "CERAI_HIDUP",
  "CERAI_MATI",
] as const;

export const genderEnum = ["L", "P"] as const;

export type UserType = {
  id: string;
  username: string;
  nomorWa: string;
  role: "USER" | "ADMIN" | "SUPERADMIN";
  createdAt: string;
  updatedAt: string;
};

export const masukSchema = z.object({
  nomorWa: z.string().min(1, {
    message: "Kolom nomor WA harus diisi",
  }),
  password: z.string().min(1, {
    message: "Kolom kata sandi harus diisi",
  }),
});

export const daftarSchema = z.object({
  nama: z.string().min(1, {
    message: "Kolom nama harus diisi",
  }),
  nomorWa: z.string().regex(/^(\+62|62|0)8[1-9][0-9]{6,10}$/, {
    message: "Kolom nomor WA tidak valid",
  }),
  password: z.string().min(6, {
    message: "Kolom kata sandi harus diisi minimal 6 karakter",
  }),
  passwordConfirmation: z.string().min(1, {
    message: "Kolom konfirmasi kata sandi harus diisi",
  }),
});

export const suratKelahiranSchema = z.object({
  namaTerkait: z.string().min(1, {
    message: "Kolom nama harus diisi",
  }),
  jenisKelaminTerkait: z.enum(genderEnum),
  tempatLahirTerkait: z.string().min(1, {
    message: "Kolom tempat lahir harus diisi",
  }),
  tanggalLahirTerkait: z.date({
    message: "Kolom tanggal lahir harus diisi",
  }),
  alamatTerkait: z.string().min(1, {
    message: "Kolom Alamat harus diisi",
  }),
  namaAyah: z.string().min(1, {
    message: "Kolom nama harus diisi",
  }),
  jenisKelaminAyah: z.enum(genderEnum),
  tempatLahirAyah: z.string().min(1, {
    message: "Kolom tempat lahir harus diisi",
  }),
  tanggalLahirAyah: z.date({
    message: "Kolom tanggal lahir harus diisi",
  }),
  agamaAyah: z.string().min(1, {
    message: "Kolom agama harus diisi",
  }),
  alamatAyah: z.string().min(1, {
    message: "Kolom Alamat harus diisi",
  }),
  namaIbu: z.string().min(1, {
    message: "Kolom nama harus diisi",
  }),
  jenisKelaminIbu: z.enum(genderEnum),
  tempatLahirIbu: z.string().min(1, {
    message: "Kolom tempat lahir harus diisi",
  }),
  tanggalLahirIbu: z.date({
    message: "Kolom tanggal lahir harus diisi",
  }),
  agamaIbu: z.string().min(1, {
    message: "Kolom agama harus diisi",
  }),
  alamatIbu: z.string().min(1, {
    message: "Kolom Alamat harus diisi",
  }),
  status: z.enum(["DIPROSES", "DITERIMA", "DITOLAK"]).default("DIPROSES"),
  pesanDitolak: z.string().optional(),
  noSurat: z.string().optional(),
  tanggalPembuatan: z.string().optional(),
});

// omit becaus form schema and database is different
export type SuratKelahiranType = Omit<
  z.infer<typeof suratKelahiranSchema>,
  "tanggalLahirTerkait" | "tanggalLahirAyah" | "tanggalLahirIbu"
> & {
  id: string;
  tanggalLahirTerkait: string;
  tanggalLahirAyah: string;
  tanggalLahirIbu: string;
  createdAt: string;
  updatedAt: string;
};

export type SuratKelahiranDetailType = SuratKelahiranType & {
  user: UserType;
};
