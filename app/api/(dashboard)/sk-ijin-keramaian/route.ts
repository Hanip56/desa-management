import { auth } from "@/auth";
import prisma from "@/db/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET ALL Sk-ijin-keramaian
export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const page = Number(req.nextUrl.searchParams.get("page")) || 1;
    const limit = Number(req.nextUrl.searchParams.get("limit")) || 5;
    const search = req.nextUrl.searchParams.get("search") || "";
    const status = req.nextUrl.searchParams.get("status") || "";
    const updatedAt = req.nextUrl.searchParams.get("updatedAt") || "desc";

    let orderBy: Record<string, string> = {};

    if (typeof updatedAt === "string") {
      orderBy = {
        updatedAt,
      };
    }

    let filter: any =
      session.user.role === "USER"
        ? {
            userId: session.user.id,
          }
        : {};

    if (status) {
      filter = {
        ...filter,
        status: status as string,
      };
    }

    let total_items = await prisma.skIjinKeramaian.count({
      where: {
        nama: { contains: search as string, mode: "insensitive" },
        ...filter,
      },
    });

    const skIjinKeramaians = await prisma.skIjinKeramaian.findMany({
      where: {
        nama: { contains: search as string, mode: "insensitive" },
        ...filter,
      },
      take: limit,
      skip: (page - 1) * limit,
      orderBy,
    });

    const total_pages = Math.ceil(total_items / limit);

    return NextResponse.json({
      data: skIjinKeramaians,
      page,
      limit,
      total_items,
      total_pages,
    });
  } catch (error) {
    console.log("[GET_ALL_SK-IJIN-KERAMAIAN]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// CREATE Sk-ijin-keramaian
export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const {
      nama,
      nik,
      tempatLahir,
      tanggalLahir,
      alamat,
      waktu,
      maksud,
      acara,
    } = await req.json();

    if (
      !nama ||
      !nik ||
      !tempatLahir ||
      !tanggalLahir ||
      !alamat ||
      !maksud ||
      !waktu ||
      !acara
    ) {
      return new NextResponse("Required field is missing", { status: 400 });
    }

    const skIjinKeramaian = await prisma.skIjinKeramaian.create({
      data: {
        nama,
        nik,
        tempatLahir,
        tanggalLahir,
        alamat,
        waktu,
        maksud,
        acara,
        userId: session.user.id,
      },
    });

    return NextResponse.json(skIjinKeramaian);
  } catch (error) {
    console.log("[CREATE_SK-IJIN-KERAMAIAN]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
