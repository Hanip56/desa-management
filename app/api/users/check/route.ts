import { auth } from "@/auth";
import prisma from "@/db/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("id");

    console.log("checked");

    if (!userId) {
      return new NextResponse("userId not found", { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    return NextResponse.json({ message: "User exist" }, { status: 200 });
  } catch (error) {
    console.error("[PATCH_USER]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
