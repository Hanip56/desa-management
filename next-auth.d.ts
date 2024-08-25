import NextAuth, { type DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
  id: string;
  username: string;
  nomorWa: string;
  role: "USER" | "ADMIN" | "SUPERADMIN";
  createdAt: Date;
  updatedAt: Date;
};

declare module "next-auth" {
  interface Session {
    error?: "RefreshAccessTokenError";
    user: ExtendedUser;
  }

  interface User {
    id: string;
    username: string;
    nomorWa: string;
    role: "USER" | "ADMIN" | "SUPERADMIN";
    createdAt: Date;
    updatedAt: Date;
  }
}

import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    user: {
      id: string;
      username: string;
      nomorWa: string;
      role: "USER" | "ADMIN" | "SUPERADMIN";
      createdAt: Date;
      updatedAt: Date;
    };
  }
}
