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
    const skDomisiliImigrasi = await prisma.skDomisiliImigrasi.findUnique({
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

    if (!skDomisiliImigrasi) {
      return new NextResponse("Surat keterangan domisili imigrasi not found", {
        status: 400,
      });
    }

    return NextResponse.json({
      ...skDomisiliImigrasi,
      User: undefined,
      user: skDomisiliImigrasi.User,
    });
  } catch (error) {
    console.log("[GET_ONE_SK-DOMISILI-IMIGRASI]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// UPDATE sk-domisili-imigrasi
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const skDomisiliImigrasi = await prisma.skDomisiliImigrasi.findUnique({
      where: { id: params.id },
    });

    if (!skDomisiliImigrasi) {
      return new NextResponse("Surat keterangan domisili imigrasi not found", {
        status: 404,
      });
    }

    // is it own or admin
    if (
      skDomisiliImigrasi.userId !== session.user.id &&
      session.user.role === "USER"
    ) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // if status 'diterima' user cannot edit
    if (
      session.user.role === "USER" &&
      skDomisiliImigrasi.status === "DITERIMA"
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

    const updatedSkDomisiliImigrasi = await prisma.skDomisiliImigrasi.update({
      where: { id: params.id },
      data: body,
    });

    return NextResponse.json(updatedSkDomisiliImigrasi);
  } catch (error) {
    console.log("[UPDATE_SK-DOMISILI-IMIGRASI]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// DELETE sk-domisili-imigrasi
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const skDomisiliImigrasi = await prisma.skDomisiliImigrasi.findUnique({
      where: { id: params.id },
    });

    if (!skDomisiliImigrasi) {
      return new NextResponse("Surat keterangan domisili imigrasi not found", {
        status: 404,
      });
    }

    // is it own or admin
    if (
      skDomisiliImigrasi.userId !== session.user.id &&
      session.user.role === "USER"
    ) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    if (
      skDomisiliImigrasi.status === "DITERIMA" &&
      session.user.role === "USER"
    ) {
      return new NextResponse(
        "You cannot delete sk-domisili-imigrasi with status 'DITERIMA'",
        { status: 400 }
      );
    }

    const deletedSkDomisiliImigrasi = await prisma.skDomisiliImigrasi.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: `Surat keterangan domisili imigrasi with id:${deletedSkDomisiliImigrasi.id} has been deleted.`,
    });
  } catch (error) {
    console.log("[DELETE_SK-DOMISILI-IMIGRASI]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
