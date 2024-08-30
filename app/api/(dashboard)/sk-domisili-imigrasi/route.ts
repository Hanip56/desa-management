import { auth } from "@/auth";
import prisma from "@/db/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET ALL sk-domisili-imigrasi
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

    let total_items = await prisma.skDomisiliImigrasi.count({
      where: {
        namaLengkap: { contains: search as string, mode: "insensitive" },
        ...filter,
      },
    });

    const skDomisiliImigrasis = await prisma.skDomisiliImigrasi.findMany({
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
      data: skDomisiliImigrasis,
      page,
      limit,
      total_items,
      total_pages,
    });
  } catch (error) {
    console.log("[GET_ALL_SK-DOMISILI-IMIGRASI]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// CREATE sk-domisili-imigrasi
export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const {
      namaLengkap,
      tanggalLahir,
      jenisKelamin,
      agama,
      pekerjaan,
      statusPerkawinan,
      kewarganegaraan,
      alamat,
      keperluan,
    } = await req.json();

    if (
      !namaLengkap ||
      !tanggalLahir ||
      !jenisKelamin ||
      !agama ||
      !pekerjaan ||
      !statusPerkawinan ||
      !kewarganegaraan ||
      !alamat ||
      !keperluan
    ) {
      return new NextResponse("Required field is missing", { status: 400 });
    }

    const skDomisiliImigrasi = await prisma.skDomisiliImigrasi.create({
      data: {
        namaLengkap,
        tanggalLahir,
        jenisKelamin,
        agama,
        pekerjaan,
        statusPerkawinan,
        kewarganegaraan,
        alamat,
        keperluan,
        userId: session.user.id,
      },
    });

    return NextResponse.json(skDomisiliImigrasi);
  } catch (error) {
    console.log("[CREATE_SK-DOMISILI-IMIGRASI]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
