import { auth } from "@/auth";
import prisma from "@/db/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET ALL sk-usaha
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

    let total_items = await prisma.skUsaha.count({
      where: {
        namaLengkap: { contains: search as string, mode: "insensitive" },
        ...filter,
      },
    });

    const skUsahas = await prisma.skUsaha.findMany({
      where: {
        namaLengkap: { contains: search as string, mode: "insensitive" },
        ...filter,
      },
      take: limit,
      skip: (page - 1) * limit,
      orderBy,
    });

    const total_pages = Math.ceil(total_items / limit);

    return NextResponse.json({
      data: skUsahas,
      page,
      limit,
      total_items,
      total_pages,
    });
  } catch (error) {
    console.log("[GET_ALL_SK-USAHA]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// CREATE sk-usaha
export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const {
      namaLengkap,
      nik,
      tanggalLahir,
      jenisKelamin,
      agama,
      pekerjaan,
      statusPerkawinan,
      kewarganegaraan,
      alamat,
      namaUsaha,
      alamatUsaha,
    } = await req.json();

    if (
      !namaLengkap ||
      !nik ||
      !tanggalLahir ||
      !jenisKelamin ||
      !agama ||
      !pekerjaan ||
      !statusPerkawinan ||
      !kewarganegaraan ||
      !alamat ||
      !namaUsaha ||
      !alamatUsaha
    ) {
      return new NextResponse("Required field is missing", { status: 400 });
    }

    const skUsaha = await prisma.skUsaha.create({
      data: {
        namaLengkap,
        nik,
        tanggalLahir,
        jenisKelamin,
        agama,
        pekerjaan,
        statusPerkawinan,
        kewarganegaraan,
        alamat,
        namaUsaha,
        alamatUsaha,
        userId: session.user.id,
      },
    });

    return NextResponse.json(skUsaha);
  } catch (error) {
    console.log("[CREATE_SK-USAHA]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
