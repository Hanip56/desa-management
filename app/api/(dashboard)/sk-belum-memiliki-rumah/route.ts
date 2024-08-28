import { auth } from "@/auth";
import prisma from "@/db/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET ALL Sk-belum-memiliki-rumah
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

    let total_items = await prisma.skBelumMemilikiRumah.count({
      where: {
        namaLengkap: { contains: search as string, mode: "insensitive" },
        ...filter,
      },
    });

    const skBelumMemilikiRumahs = await prisma.skBelumMemilikiRumah.findMany({
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
      data: skBelumMemilikiRumahs,
      page,
      limit,
      total_items,
      total_pages,
    });
  } catch (error) {
    console.log("[GET_ALL_SK-BELUM-MEMILIKI-RUMAH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// CREATE Sk-belum-memiliki-rumah
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
      kampung,
      rt,
      rw,
      keperluan,
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
      !kampung ||
      !rt ||
      !rw ||
      !keperluan
    ) {
      return new NextResponse("Required field is missing", { status: 400 });
    }

    const skBelumMemilikiRumah = await prisma.skBelumMemilikiRumah.create({
      data: {
        namaLengkap,
        nik,
        tanggalLahir,
        jenisKelamin,
        agama,
        pekerjaan,
        statusPerkawinan,
        kewarganegaraan,
        kampung,
        rt,
        rw,
        keperluan,
        userId: session.user.id,
      },
    });

    return NextResponse.json(skBelumMemilikiRumah);
  } catch (error) {
    console.log("[CREATE_SK-BELUM-MEMILIKI-RUMAH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
