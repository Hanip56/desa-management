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
    const skIzinBekerja = await prisma.skIzinBekerja.findUnique({
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

    if (!skIzinBekerja) {
      return new NextResponse("Surat keterangan izin bekerja not found", {
        status: 400,
      });
    }

    return NextResponse.json({
      ...skIzinBekerja,
      User: undefined,
      user: skIzinBekerja.User,
    });
  } catch (error) {
    console.log("[GET_ONE_SK-IZIN-BEKERJA]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// UPDATE sk-izin-bekerja
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const skIzinBekerja = await prisma.skIzinBekerja.findUnique({
      where: { id: params.id },
    });

    if (!skIzinBekerja) {
      return new NextResponse("Surat keterangan izin bekerja not found", {
        status: 404,
      });
    }

    // is it own or admin
    if (
      skIzinBekerja.userId !== session.user.id &&
      session.user.role === "USER"
    ) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // if status 'diterima' user cannot edit
    if (session.user.role === "USER" && skIzinBekerja.status === "DITERIMA") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const body = await req.json();

    // disabled some field when update
    if (session.user.role === "USER") {
      disabledUpdateField.map((field) => {
        if (body?.[field]) body[field] = undefined;
      });
    }

    const updatedSkIzinBekerja = await prisma.skIzinBekerja.update({
      where: { id: params.id },
      data: body,
    });

    return NextResponse.json(updatedSkIzinBekerja);
  } catch (error) {
    console.log("[UPDATE_SK-IZIN-BEKERJA]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// DELETE sk-izin-bekerja
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const skIzinBekerja = await prisma.skIzinBekerja.findUnique({
      where: { id: params.id },
    });

    if (!skIzinBekerja) {
      return new NextResponse("Surat keterangan izin bekerja not found", {
        status: 404,
      });
    }

    // is it own or admin
    if (
      skIzinBekerja.userId !== session.user.id &&
      session.user.role === "USER"
    ) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    if (skIzinBekerja.status === "DITERIMA" && session.user.role === "USER") {
      return new NextResponse(
        "You cannot delete sk-izin-bekerja with status 'DITERIMA'",
        { status: 400 }
      );
    }

    const deletedSkIzinBekerja = await prisma.skIzinBekerja.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: `Surat keterangan izin bekerja with id:${deletedSkIzinBekerja.id} has been deleted.`,
    });
  } catch (error) {
    console.log("[DELETE_SK-IZIN-BEKERJA]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
