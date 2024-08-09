import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "./db/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      authorize: async (credentials) => {
        let user = null;

        if (
          typeof credentials.email !== "string" ||
          typeof credentials.password !== "string"
        ) {
          throw new Error("Required field is missing");
        }

        const { email, password } = credentials;

        const pwHash = await bcrypt.hash(password, 10);
        user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
          throw new Error("User not found.");
        }

        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ user, token }) {
      if (user) {
        token.user = {
          createdAt: user.createdAt,
          role: user.role,
          updatedAt: user.updatedAt,
          username: user.username,
          id: user.id || "",
          email: user.email || "",
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
