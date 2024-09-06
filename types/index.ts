import {
  AnggotaPindahWni,
  PendaftaranPindahWni,
  SkBelumMemilikiRumah,
  SkBelumMenikah,
  SkDomisiliImigrasi,
  SkDomisiliLembaga,
  SkDomisiliSementara,
  SkIjinKeramaian,
  SkIzinBekerja,
  SkPenghasilanOrangTua,
  SkTidakMampu,
  SkTidakMemilikiPekerjaan,
  SkUsaha,
  SuratKelahiran,
  SuratKematian,
  SuratRekomendasiPembelianBbm,
} from "@prisma/client";

export type UserType = {
  id: string;
  username: string;
  nomorWa: string;
  role: "USER" | "ADMIN" | "SUPERADMIN";
  ktpUrl?: string;
  kkUrl?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type StatusType = "DIPROSES" | "DITERIMA" | "DITOLAK";

export type SuratKelahiranWithUser = SuratKelahiran & {
  user: UserType;
};

export type SuratKematianWithUser = SuratKematian & {
  user: UserType;
};

export type SkBelumMenikahWithUser = SkBelumMenikah & {
  user: UserType;
};

export type SkIjinKeramaianWithUser = SkIjinKeramaian & {
  user: UserType;
};

export type SkPenghasilanOrangTuaWithUser = SkPenghasilanOrangTua & {
  user: UserType;
};

export type SkIzinBekerjaWithUser = SkIzinBekerja & {
  user: UserType;
};

export type SkBelumMemilikiRumahWithUser = SkBelumMemilikiRumah & {
  user: UserType;
};

export type SkTidakMemilikiPekerjaanWithUser = SkTidakMemilikiPekerjaan & {
  user: UserType;
};

export type SkUsahaWithUser = SkUsaha & {
  user: UserType;
};

export type SkTidakMampuWithUser = SkTidakMampu & {
  user: UserType;
};

export type SkDomisiliSementaraWithUser = SkDomisiliSementara & {
  user: UserType;
};

export type SkDomisiliImigrasiWithUser = SkDomisiliImigrasi & {
  user: UserType;
};

export type SkDomisiliLembagaWithUser = SkDomisiliLembaga & {
  user: UserType;
};

export type PendaftaranPindahWniWithAnggota = PendaftaranPindahWni & {
  anggotaPindah: AnggotaPindahWni[];
};

export type PendaftaranPindahWniWithUser = PendaftaranPindahWni & {
  user: UserType;
  anggotaPindah: AnggotaPindahWni[];
};

export type SuratRekomendasiPembelianBbmWithUser =
  SuratRekomendasiPembelianBbm & {
    user: UserType;
  };
