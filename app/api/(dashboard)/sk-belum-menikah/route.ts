import { auth } from "@/auth";
import prisma from "@/db/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET ALL Sk-belum-menikah
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

    let total_items = await prisma.skBelumMenikah.count({
      where: {
        namaLengkap: { contains: search as string, mode: "insensitive" },
        ...filter,
      },
    });

    const skBelumMenikahs = await prisma.skBelumMenikah.findMany({
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
      data: skBelumMenikahs,
      page,
      limit,
      total_items,
      total_pages,
    });
  } catch (error) {
    console.log("[GET_ALL_SK-BELUM-MENIKAH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// CREATE Sk-belum-menikah
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
      !rw
    ) {
      return new NextResponse("Required field is missing", { status: 400 });
    }

    const skBelumMenikah = await prisma.skBelumMenikah.create({
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
        userId: session.user.id,
      },
    });

    return NextResponse.json(skBelumMenikah);
  } catch (error) {
    console.log("[CREATE_SK-BELUM-MENIKAH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
