import {
  SkBelumMemilikiRumah,
  SkBelumMenikah,
  SkIjinKeramaian,
  SkIzinBekerja,
  SkPenghasilanOrangTua,
  SkTidakMemilikiPekerjaan,
  SuratKelahiran,
  SuratKematian,
} from "@prisma/client";

export type UserType = {
  id: string;
  username: string;
  nomorWa: string;
  role: "USER" | "ADMIN" | "SUPERADMIN";
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
