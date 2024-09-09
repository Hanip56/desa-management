import { auth } from "@/auth";
import prisma from "@/db/prisma";
import { NextRequest, NextResponse } from "next/server";

const disabledUpdateField = [
  "id",
  "userId",
  "createdAt",
  "updatedAt",
  "status",
  "pesanDitolak",
  "noSurat",
  "tanggalPembuatan",
];

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const suratRekomendasiPembelianBbm =
      await prisma.suratRekomendasiPembelianBbm.findUnique({
        where: { id: params.id },
        include: {
          User: {
            select: {
              id: true,
              username: true,
              nomorWa: true,
              role: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      });

    if (!suratRekomendasiPembelianBbm) {
      return new NextResponse("Surat rekomendasi pembelian  bbm not found", {
        status: 400,
      });
    }

    return NextResponse.json({
      ...suratRekomendasiPembelianBbm,
      User: undefined,
      user: suratRekomendasiPembelianBbm.User,
    });
  } catch (error) {
    console.log("[GET_ONE_SURAT-REKOMENDASI-PEMBELIAN-BBM]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// UPDATE surat-rekomendasi-pembelian-bbm
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const suratRekomendasiPembelianBbm =
      await prisma.suratRekomendasiPembelianBbm.findUnique({
        where: { id: params.id },
      });

    if (!suratRekomendasiPembelianBbm) {
      return new NextResponse("Surat rekomendasi pembelian  bbm not found", {
        status: 404,
      });
    }

    // is it own or admin
    if (
      suratRekomendasiPembelianBbm.userId !== session.user.id &&
      session.user.role === "USER"
    ) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // if status 'diterima' user cannot edit
    if (
      session.user.role === "USER" &&
      suratRekomendasiPembelianBbm.status === "DITERIMA"
    ) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const body = await req.json();

    // disabled some field when update
    if (session.user.role === "USER") {
      disabledUpdateField.map((field) => {
        if (body?.[field]) body[field] = undefined;
      });
    }

    const updatedSuratRekomendasiPembelianBbm =
      await prisma.suratRekomendasiPembelianBbm.update({
        where: { id: params.id },
        data: body,
      });

    return NextResponse.json(updatedSuratRekomendasiPembelianBbm);
  } catch (error) {
    console.log("[UPDATE_SURAT-REKOMENDASI-PEMBELIAN-BBM]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// DELETE surat-rekomendasi-pembelian-bbm
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const suratRekomendasiPembelianBbm =
      await prisma.suratRekomendasiPembelianBbm.findUnique({
        where: { id: params.id },
      });

    if (!suratRekomendasiPembelianBbm) {
      return new NextResponse("Surat rekomendasi pembelian  bbm not found", {
        status: 404,
      });
    }

    // is it own or admin
    if (
      suratRekomendasiPembelianBbm.userId !== session.user.id &&
      session.user.role === "USER"
    ) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    if (
      suratRekomendasiPembelianBbm.status === "DITERIMA" &&
      session.user.role === "USER"
    ) {
      return new NextResponse(
        "You cannot delete surat-rekomendasi-pembelian-bbm with status 'DITERIMA'",
        { status: 400 }
      );
    }

    const deletedSuratRekomendasiPembelianBbm =
      await prisma.suratRekomendasiPembelianBbm.delete({
        where: { id: params.id },
      });

    return NextResponse.json({
      success: `Surat rekomendasi pembelian  bbm with id:${deletedSuratRekomendasiPembelianBbm.id} has been deleted.`,
    });
  } catch (error) {
    console.log("[DELETE_SURAT-REKOMENDASI-PEMBELIAN-BBM]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
