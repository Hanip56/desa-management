import { auth } from "@/auth";
import prisma from "@/db/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET ALL Surat-kematian
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

    let total_items = await prisma.suratKematian.count({
      where: {
        namaTerkait: { contains: search as string, mode: "insensitive" },
        ...filter,
      },
    });

    const suratKematians = await prisma.suratKematian.findMany({
      where: {
        namaTerkait: { contains: search as string, mode: "insensitive" },
        ...filter,
      },
      take: limit,
      skip: (page - 1) * limit,
      orderBy,
    });

    const total_pages = Math.ceil(total_items / limit);

    return NextResponse.json({
      data: suratKematians,
      page,
      limit,
      total_items,
      total_pages,
    });
  } catch (error) {
    console.log("[GET_ALL_SURAT-KELAHIRAN]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// CREATE Surat-kematian
export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const {
      namaPemohon,
      jenisKelaminPemohon,
      noNikPemohon,
      alamatPemohon,
      hubunganKeluargaPemohon,
      namaTerkait,
      jenisKelaminTerkait,
      noNikTerkait,
      alamatTerkait,
      tanggal,
      penyebab,
      tempat,
    } = await req.json();

    if (
      !namaPemohon ||
      !jenisKelaminPemohon ||
      !noNikPemohon ||
      !alamatPemohon ||
      !hubunganKeluargaPemohon ||
      !namaTerkait ||
      !jenisKelaminTerkait ||
      !noNikTerkait ||
      !alamatTerkait ||
      !tanggal ||
      !penyebab ||
      !tempat
    ) {
      return new NextResponse("Required field is missing", { status: 400 });
    }

    const suratKematian = await prisma.suratKematian.create({
      data: {
        namaPemohon,
        jenisKelaminPemohon,
        noNikPemohon,
        alamatPemohon,
        hubunganKeluargaPemohon,
        namaTerkait,
        jenisKelaminTerkait,
        noNikTerkait,
        alamatTerkait,
        tanggal,
        penyebab,
        tempat,
        userId: session.user.id,
      },
    });

    return NextResponse.json(suratKematian);
  } catch (error) {
    console.log("[CREATE_SURAT-KELAHIRAN]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
