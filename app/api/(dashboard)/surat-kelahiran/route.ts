import { auth } from "@/auth";
import prisma from "@/db/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET ALL Surat-kelahiran
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

    let total_items = await prisma.suratKelahiran.count({
      where: {
        namaTerkait: { contains: search as string, mode: "insensitive" },
        ...filter,
      },
    });

    const suratKelahirans = await prisma.suratKelahiran.findMany({
      where: {
        namaTerkait: { contains: search as string, mode: "insensitive" },
        ...filter,
      },
      take: limit,
      skip: (page - 1) * limit,
      orderBy: {
        updatedAt: "desc",
      },
    });

    const total_pages = Math.ceil(total_items / limit);

    return NextResponse.json({
      data: suratKelahirans,
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

// CREATE Surat-kelahiran
export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const {
      namaTerkait,
      jenisKelaminTerkait,
      tempatLahirTerkait,
      tanggalLahirTerkait,
      alamatTerkait,
      namaAyah,
      jenisKelaminAyah,
      agamaAyah,
      alamatAyah,
      tempatLahirAyah,
      tanggalLahirAyah,
      namaIbu,
      jenisKelaminIbu,
      agamaIbu,
      alamatIbu,
      tempatLahirIbu,
      tanggalLahirIbu,
    } = await req.json();

    if (
      !namaTerkait ||
      !jenisKelaminTerkait ||
      !tempatLahirTerkait ||
      !tanggalLahirTerkait ||
      !alamatTerkait ||
      !namaAyah ||
      !jenisKelaminAyah ||
      !agamaAyah ||
      !alamatAyah ||
      !tempatLahirAyah ||
      !tanggalLahirAyah ||
      !namaIbu ||
      !jenisKelaminIbu ||
      !agamaIbu ||
      !tempatLahirIbu ||
      !tanggalLahirIbu ||
      !alamatIbu
    ) {
      return new NextResponse("Required field is missing", { status: 400 });
    }

    const suratKelahiran = await prisma.suratKelahiran.create({
      data: {
        namaTerkait,
        jenisKelaminTerkait,
        tempatLahirTerkait,
        tanggalLahirTerkait,
        alamatTerkait,
        namaAyah,
        jenisKelaminAyah,
        agamaAyah,
        alamatAyah,
        tempatLahirAyah,
        tanggalLahirAyah,
        namaIbu,
        jenisKelaminIbu,
        agamaIbu,
        alamatIbu,
        tempatLahirIbu,
        tanggalLahirIbu,
        userId: session.user.id,
      },
    });

    return NextResponse.json(suratKelahiran);
  } catch (error) {
    console.log("[CREATE_SURAT-KELAHIRAN]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
