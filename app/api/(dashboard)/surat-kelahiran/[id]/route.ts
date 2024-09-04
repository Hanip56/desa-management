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
    const suratKelahiran = await prisma.suratKelahiran.findUnique({
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

    if (!suratKelahiran) {
      return new NextResponse("Surat kelahiran not found", { status: 400 });
    }

    return NextResponse.json({
      ...suratKelahiran,
      User: undefined,
      user: suratKelahiran.User,
    });
  } catch (error) {
    console.log("[GET_ONE_SURAT-KELAHIRAN]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// UPDATE Surat-kelahiran
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const suratKelahiran = await prisma.suratKelahiran.findUnique({
      where: { id: params.id },
    });

    if (!suratKelahiran) {
      return new NextResponse("Surat kelahiran not found", { status: 404 });
    }

    // is it own or admin
    if (
      suratKelahiran.userId !== session.user.id &&
      session.user.role === "USER"
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

    const updatedSuratKelahiran = await prisma.suratKelahiran.update({
      where: { id: params.id },
      data: body,
    });

    return NextResponse.json(updatedSuratKelahiran);
  } catch (error) {
    console.log("[UPDATE_SURAT-KELAHIRAN]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// DELETE Surat-kelahiran
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const suratKelahiran = await prisma.suratKelahiran.findUnique({
      where: { id: params.id },
    });

    if (!suratKelahiran) {
      return new NextResponse("Surat kelahiran not found", { status: 404 });
    }

    // is it own or admin
    if (
      suratKelahiran.userId !== session.user.id &&
      session.user.role === "USER"
    ) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    if (suratKelahiran.status === "DITERIMA" && session.user.role === "USER") {
      return new NextResponse(
        "You cannot delete surat kelahiran with status 'DITERIMA'",
        { status: 400 }
      );
    }

    const deletedSuratKelahiran = await prisma.suratKelahiran.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: `Surat kelahiran with id:${deletedSuratKelahiran.id} has been deleted.`,
    });
  } catch (error) {
    console.log("[DELETE_SURAT-KELAHIRAN]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
