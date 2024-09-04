import { auth } from "@/auth";
import prisma from "@/db/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET ALL pendaftaran-pindah-wni
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

    let total_items = await prisma.pendaftaranPindahWni.count({
      where: {
        namaLengkapPemohon: { contains: search as string, mode: "insensitive" },
        ...filter,
      },
    });

    const pendaftaranPindahWnis = await prisma.pendaftaranPindahWni.findMany({
      where: {
        namaLengkapPemohon: { contains: search as string, mode: "insensitive" },
        ...filter,
      },
      include: {
        anggotaPindah: true,
      },
      take: limit,
      skip: (page - 1) * limit,
      orderBy,
    });

    const total_pages = Math.ceil(total_items / limit);

    return NextResponse.json({
      data: pendaftaranPindahWnis,
      page,
      limit,
      total_items,
      total_pages,
    });
  } catch (error) {
    console.log("[GET_ALL_PENDAFTARAN-PINDAH-WNI]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// CREATE pendaftaran-pindah-wni
export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const {
      noKk,
      namaLengkapPemohon,
      nik,
      jenisPermohonan,
      alamatAsal,
      desaAsal,
      kecamatanAsal,
      kabupatenAsal,
      provinsiAsal,
      kodePosAsal,
      alamatTujuan,
      desaTujuan,
      kecamatanTujuan,
      kabupatenTujuan,
      provinsiTujuan,
      kodePosTujuan,
      klasifikasiKepindahan,
      alasanPindah,
      jenisKepindahan,
      anggotaPindah,
    } = await req.json();

    if (
      !noKk ||
      !namaLengkapPemohon ||
      !nik ||
      !jenisPermohonan ||
      !alamatAsal ||
      !desaAsal ||
      !kecamatanAsal ||
      !kabupatenAsal ||
      !provinsiAsal ||
      !kodePosAsal ||
      !alamatTujuan ||
      !desaTujuan ||
      !kecamatanTujuan ||
      !kabupatenTujuan ||
      !provinsiTujuan ||
      !kodePosTujuan ||
      !klasifikasiKepindahan ||
      !alasanPindah ||
      !jenisKepindahan ||
      anggotaPindah?.length < 1
    ) {
      return new NextResponse("Required field is missing", { status: 400 });
    }

    const pendaftaranPindahWni = await prisma.pendaftaranPindahWni.create({
      data: {
        noKk,
        namaLengkapPemohon,
        nik,
        jenisPermohonan,
        alamatAsal,
        kabupatenAsal,
        desaAsal,
        kecamatanAsal,
        provinsiAsal,
        kodePosAsal,
        alamatTujuan,
        desaTujuan,
        kecamatanTujuan,
        kabupatenTujuan,
        provinsiTujuan,
        kodePosTujuan,
        klasifikasiKepindahan,
        alasanPindah,
        jenisKepindahan,
        anggotaPindah: {
          createMany: {
            data: anggotaPindah,
          },
        },
        userId: session.user.id,
      },
      include: {
        anggotaPindah: true,
      },
    });

    return NextResponse.json(pendaftaranPindahWni);
  } catch (error) {
    console.log("[CREATE_PENDAFTARAN-PINDAH-WNI]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
