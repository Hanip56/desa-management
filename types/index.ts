import { SuratKelahiran, SuratKematian } from "@prisma/client";

export type UserType = {
  id: string;
  username: string;
  email: string;
  role: "USER" | "ADMIN" | "SUPERADMIN";
  createdAt: Date;
  updatedAt: Date;
};

export type SuratKelahiranWithUser = SuratKelahiran & {
  user: UserType;
};

export type SuratKematianWithUser = SuratKematian & {
  user: UserType;
};
