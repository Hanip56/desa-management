import { auth } from "@/auth";
import prisma from "@/db/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET ALL surat-rekomendasi-pembelian-bbm
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

    let total_items = await prisma.suratRekomendasiPembelianBbm.count({
      where: {
        nama: { contains: search as string, mode: "insensitive" },
        ...filter,
      },
    });

    const suratRekomendasiPembelianBbms =
      await prisma.suratRekomendasiPembelianBbm.findMany({
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
      data: suratRekomendasiPembelianBbms,
      page,
      limit,
      total_items,
      total_pages,
    });
  } catch (error) {
    console.log("[GET_ALL_SURAT-REKOMENDASI-PEMBELIAN-BBM]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// CREATE surat-rekomendasi-pembelian-bbm
export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const {
      nama,
      nik,
      alamatUsaha,
      konsumenPengguna,
      jenisUsahaKegiatan,
      jenisAlat,
      jumlahAlat,
      fungsiAlat,
      jamOperasi,
      konsumsi,
    } = await req.json();

    if (
      !nama ||
      !nik ||
      !alamatUsaha ||
      !konsumenPengguna ||
      !jenisUsahaKegiatan ||
      !jenisAlat ||
      !jumlahAlat ||
      !fungsiAlat ||
      !jamOperasi ||
      !konsumsi
    ) {
      return new NextResponse("Required field is missing", { status: 400 });
    }

    const suratRekomendasiPembelianBbm =
      await prisma.suratRekomendasiPembelianBbm.create({
        data: {
          nama,
          nik,
          alamatUsaha,
          konsumenPengguna,
          jenisUsahaKegiatan,
          jenisAlat,
          jumlahAlat,
          fungsiAlat,
          jamOperasi,
          konsumsi,
          alokasiVolume: konsumsi,
          userId: session.user.id,
        },
      });

    return NextResponse.json(suratRekomendasiPembelianBbm);
  } catch (error) {
    console.log("[CREATE_SURAT-REKOMENDASI-PEMBELIAN-BBM]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
