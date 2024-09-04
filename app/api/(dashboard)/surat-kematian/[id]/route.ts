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
    const suratKematian = await prisma.suratKematian.findUnique({
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

    if (!suratKematian) {
      return new NextResponse("Surat kematian not found", { status: 400 });
    }

    return NextResponse.json({
      ...suratKematian,
      User: undefined,
      user: suratKematian.User,
    });
  } catch (error) {
    console.log("[GET_ONE_SURAT-KEMATIAN]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// UPDATE Surat-kematian
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const suratKematian = await prisma.suratKematian.findUnique({
      where: { id: params.id },
    });

    if (!suratKematian) {
      return new NextResponse("Surat kematian not found", { status: 404 });
    }

    // is it own or admin
    if (
      suratKematian.userId !== session.user.id &&
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

    const updatedSuratKematian = await prisma.suratKematian.update({
      where: { id: params.id },
      data: body,
    });

    return NextResponse.json(updatedSuratKematian);
  } catch (error) {
    console.log("[UPDATE_SURAT-KEMATIAN]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// DELETE Surat-kematian
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const suratKematian = await prisma.suratKematian.findUnique({
      where: { id: params.id },
    });

    if (!suratKematian) {
      return new NextResponse("Surat kematian not found", { status: 404 });
    }

    // is it own or admin
    if (
      suratKematian.userId !== session.user.id &&
      session.user.role === "USER"
    ) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    if (suratKematian.status === "DITERIMA" && session.user.role === "USER") {
      return new NextResponse(
        "You cannot delete surat kematian with status 'DITERIMA'",
        { status: 400 }
      );
    }

    const deletedSuratKematian = await prisma.suratKematian.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: `Surat kematian with id:${deletedSuratKematian.id} has been deleted.`,
    });
  } catch (error) {
    console.log("[DELETE_SURAT-KEMATIAN]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
