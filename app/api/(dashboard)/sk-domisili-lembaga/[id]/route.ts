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
    const skDomisiliLembaga = await prisma.skDomisiliLembaga.findUnique({
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

    if (!skDomisiliLembaga) {
      return new NextResponse("Surat keterangan domisili lembaga not found", {
        status: 400,
      });
    }

    return NextResponse.json({
      ...skDomisiliLembaga,
      User: undefined,
      user: skDomisiliLembaga.User,
    });
  } catch (error) {
    console.log("[GET_ONE_SK-DOMISILI-LEMBAGA]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// UPDATE sk-domisili-lembaga
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const skDomisiliLembaga = await prisma.skDomisiliLembaga.findUnique({
      where: { id: params.id },
    });

    if (!skDomisiliLembaga) {
      return new NextResponse("Surat keterangan domisili lembaga not found", {
        status: 404,
      });
    }

    // is it own or admin
    if (
      skDomisiliLembaga.userId !== session.user.id &&
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

    const updatedSkDomisiliLembaga = await prisma.skDomisiliLembaga.update({
      where: { id: params.id },
      data: body,
    });

    return NextResponse.json(updatedSkDomisiliLembaga);
  } catch (error) {
    console.log("[UPDATE_SK-DOMISILI-LEMBAGA]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// DELETE sk-domisili-lembaga
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const skDomisiliLembaga = await prisma.skDomisiliLembaga.findUnique({
      where: { id: params.id },
    });

    if (!skDomisiliLembaga) {
      return new NextResponse("Surat keterangan domisili lembaga not found", {
        status: 404,
      });
    }

    // is it own or admin
    if (
      skDomisiliLembaga.userId !== session.user.id &&
      session.user.role === "USER"
    ) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    if (
      skDomisiliLembaga.status === "DITERIMA" &&
      session.user.role === "USER"
    ) {
      return new NextResponse(
        "You cannot delete sk-domisili-lembaga with status 'DITERMA'",
        { status: 400 }
      );
    }

    const deletedSkDomisiliLembaga = await prisma.skDomisiliLembaga.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: `Surat keterangan domisili lembaga with id:${deletedSkDomisiliLembaga.id} has been deleted.`,
    });
  } catch (error) {
    console.log("[DELETE_SK-DOMISILI-LEMBAGA]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
