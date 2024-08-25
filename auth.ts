import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "./db/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        nomorWa: {
          label: "Nomor WA",
          type: "number",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      authorize: async (credentials) => {
        let user = null;

        const { nomorWa, password } = credentials;

        if (typeof nomorWa !== "string" || typeof password !== "string") {
          throw new Error("Required field is missing");
        }

        user = await prisma.user.findUnique({ where: { nomorWa } });

        if (!user) {
          throw new Error("User tidak ditemukan.");
        }

        const isMatchPassword = await bcrypt.compare(password, user.password);

        if (!isMatchPassword) {
          throw new Error("Credentials tidak valid");
        }

        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ user, token, trigger, session }) {
      if (trigger === "update" && session) {
        if (session?.username) {
          token.user.username = session.username;
        }
        if (session?.nomorWa) {
          token.user.nomorWa = session.nomorWa;
        }

        return token;
      }

      if (user) {
        token.user = {
          createdAt: user.createdAt,
          role: user.role,
          updatedAt: user.updatedAt,
          username: user.username,
          id: user.id || "",
          nomorWa: user.nomorWa || "",
        };
      }

      return { ...token };
    },
    async session({ token, session }) {
      if (token.user) {
        session.user = {
          ...session.user,
          ...token.user,
        };
      }

      return session;
    },
  },
  trustHost: true,
});
