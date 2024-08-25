import prisma from "@/db/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { username, nomorWa, password } = await req.json();

    if (!username || !nomorWa || !password) {
      return new NextResponse(
        "Required field is missing; *username *nomorWa *password",
        { status: 400 }
      );
    }

    console.log({ nomorWa });

    const userExist = await prisma.user.findUnique({
      where: { nomorWa: nomorWa },
    });

    if (userExist) {
      return new NextResponse("Nomor WA sudah digunakan", { status: 400 });
    }

    const hashPass = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        nomorWa,
        password: hashPass,
      },
    });

    return NextResponse.json({ ...user, password: undefined });
  } catch (error) {
    console.log("[REGISTER_USER]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
