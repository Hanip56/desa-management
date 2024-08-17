import { auth } from "@/auth";
import prisma from "@/db/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET ALL USERS
export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (session.user.role === "USER") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const page = Number(req.nextUrl.searchParams.get("page")) || 1;
    const limit = Number(req.nextUrl.searchParams.get("limit")) || 5;
    const search = req.nextUrl.searchParams.get("search") || "";
    const updatedAt = req.nextUrl.searchParams.get("updatedAt") || "desc";

    let orderBy: Record<string, string> = {};

    if (typeof updatedAt === "string") {
      orderBy = {
        updatedAt,
      };
    }

    let total_items = await prisma.user.count({
      where: {
        id: { contains: search as string, mode: "insensitive" },
      },
    });

    const users = await prisma.user.findMany({
      where: {
        id: { contains: search as string, mode: "insensitive" },
      },
      take: limit,
      skip: (page - 1) * limit,
      orderBy,
    });

    const total_pages = Math.ceil(total_items / limit);

    return NextResponse.json({
      data: users,
      page,
      limit,
      total_items,
      total_pages,
    });
  } catch (error) {
    console.log("[GET_ALL_USERS]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
