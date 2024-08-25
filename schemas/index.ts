import { date, z } from "zod";

// FYI: Schema for form, type for anything else

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
    message: "Kolom password harus diisi",
  }),
});

export const daftarSchema = z.object({
  nama: z.string().min(1, {
    message: "Kolom nama harus diisi",
  }),
  nomorWa: z.string().min(1, {
    message: "Kolom nomor WA harus diisi",
  }),
  password: z.string().min(6, {
    message: "Kolom password harus diisi minimal 6 karakter",
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
  kampungTerkait: z.string().min(1, {
    message: "Kolom kampung harus diisi",
  }),
  rtTerkait: z.string().min(1, {
    message: "Kolom rt harus diisi",
  }),
  rwTerkait: z.string().min(1, {
    message: "Kolom rw harus diisi",
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
  kampungAyah: z.string().min(1, {
    message: "Kolom kampung harus diisi",
  }),
  rtAyah: z.string().min(1, {
    message: "Kolom rt harus diisi",
  }),
  rwAyah: z.string().min(1, {
    message: "Kolom rw harus diisi",
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
  kampungIbu: z.string().min(1, {
    message: "Kolom kampung harus diisi",
  }),
  rtIbu: z.string().min(1, {
    message: "Kolom rt harus diisi",
  }),
  rwIbu: z.string().min(1, {
    message: "Kolom rw harus diisi",
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
